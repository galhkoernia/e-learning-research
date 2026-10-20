import assert from 'node:assert/strict';
import { test, beforeEach } from 'node:test';
import { registerHooks } from 'node:module';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

const fixture = { role: 'ADMIN', calls: [], related: false, courses: [], materials: [], videos: [] };
globalThis.contentFixture = fixture;
const model = name => new Proxy({}, { get: (_, method) => async args => {
  fixture.calls.push({ name, method, args });
  if (fixture.fail) throw new Error('private database connection details');
  if (method === 'findMany') return fixture[name + 's'] ?? [];
  if (method === 'count') return fixture.related === name ? 1 : 0;
  if (method === 'findUnique') return fixture.missing ? null : { id: 'exists', courseId: courseId };
  return { id: 'saved', ...args?.data };
} });
const db = { course: model('course'), material: model('material'), video: model('video'), question: model('question'),
  $transaction: async work => work(db), $queryRaw: async () => [{ id: 'exists' }] };
fixture.db = db;
const mocks = {
  'server-only': '',
  'next/navigation': `export function redirect(path) { throw new Error('redirect:' + path); } export function unstable_rethrow(error) { if (error.message?.startsWith('redirect:')) throw error; }`,
  'next/cache': `export function revalidatePath(path) { globalThis.contentFixture.calls.push({revalidate: path}); }`,
  './auth/session': `export async function requireAdmin() { const f = globalThis.contentFixture; if (f.role !== 'ADMIN') throw new Error('redirect:/login'); } export async function requireProfile() { const role = globalThis.contentFixture.role; if (!role) throw new Error('redirect:/login'); return { role }; }`,
  './auth/redirects': `export function getHomePathForRole() { return '/admin'; }`,
  './db/prisma': `export function getPrisma() { return globalThis.contentFixture.db; }`,
};
registerHooks({
  resolve(specifier, context, next) {
    if (Object.hasOwn(mocks, specifier)) return { url: 'mock:' + specifier, shortCircuit: true };
    if (specifier === '@/server/content') return { url: new URL('../src/server/content.ts', import.meta.url).href, shortCircuit: true };
    if (specifier.endsWith('content-validation')) return { url: new URL('../src/features/admin/content-validation.ts', import.meta.url).href, shortCircuit: true };
    return next(specifier, context);
  },
  load(url, context, next) {
    if (url.startsWith('mock:')) return { format: 'module', source: mocks[url.slice(5)], shortCircuit: true };
    if (url.endsWith('.ts') && url.includes('/src/')) return { format: 'module', source: ts.transpileModule(readFileSync(new URL(url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText, shortCircuit: true };
    return next(url, context);
  },
});
const { mutateContent, getAdminMaterials, getAdminVideos, getLearningCourses, contentError } = await import('../src/server/content.ts');
const { contentAction } = await import('../src/features/admin/content-actions.ts');
const courseId = '00000000-0000-4000-8000-000000000001';
const id = '00000000-0000-4000-8000-000000000002';
function form(values = {}) {
  const data = new FormData();
  for (const [key, value] of Object.entries({ courseId, materialId: id, title: 'Hydraulics', number: '1', description: 'Read this', status: 'PUBLISHED', storagePath: '', durationSeconds: '', ...values })) data.set(key, value);
  return data;
}
beforeEach(() => { Object.assign(fixture, { role: 'ADMIN', calls: [], related: false, missing: false, fail: false, courses: [], materials: [], videos: [] }); });

test('admin list reads ordered, paginated materials and video metadata', async () => {
  await getAdminMaterials(2); await getAdminVideos(1);
  const reads = fixture.calls.filter(call => call.method === 'findMany');
  assert.equal(reads.find(call => call.name === 'material').args.skip, 20);
  assert.deepEqual(reads.find(call => call.name === 'material').args.orderBy, [{courseId:'asc'},{number:'asc'}]);
  assert.ok(reads.find(call => call.name === 'video').args.select.material);
});
for (const kind of ['material', 'video']) {
  test(`${kind} create, update and delete use the database layer`, async () => {
    await mutateContent(kind, 'save', form());
    await mutateContent(kind, 'save', form({ id, title: 'Updated' }));
    await mutateContent(kind, 'delete', form({ id }));
    const writes = fixture.calls.filter(call => call.name === kind && ['create','update','delete'].includes(call.method));
    assert.deepEqual(writes.map(call => call.method), ['create','update','delete']);
    assert.equal(writes[1].args.data.title, 'Updated');
  });
  test(`${kind} validation failures never write`, async () => {
    for (const values of [{title:''}, {status:'INVALID'}, kind === 'material' ? {number:'0'} : {storagePath:'https://private.example/file'}]) {
      await assert.rejects(mutateContent(kind, 'save', form(values)));
    }
    assert.equal(fixture.calls.length, 0);
  });
  for (const role of [null, 'STUDENT']) test(`${role ?? 'anonymous'} cannot mutate ${kind}`, async () => {
    fixture.role = role;
    for (const operation of ['save', 'delete']) await assert.rejects(contentAction(kind, operation, {}, form({id})), /redirect/);
    assert.equal(fixture.calls.length, 0);
  });
}
test('material delete refuses related data without deleting', async () => {
  fixture.related = 'video';
  await assert.rejects(mutateContent('material', 'delete', form({ id })), /related video/);
  assert.ok(!fixture.calls.some(call => call.method === 'delete'));
});
test('material delete also refuses related questions', async () => {
  fixture.related = 'question';
  await assert.rejects(mutateContent('material', 'delete', form({ id })), /unlink questions/);
  assert.ok(!fixture.calls.some(call => call.method === 'delete'));
});
test('malformed identifiers, durations and storage references are rejected before writes', async () => {
  for (const values of [{id:'invalid'}, {materialId:'invalid'}, {durationSeconds:'-1'}, {durationSeconds:'1.5'}, {storagePath:'../private/file'}, {storagePath:'/private/file'}]) {
    await assert.rejects(mutateContent('video', 'save', form(values)));
  }
  assert.equal(fixture.calls.length, 0);
});
test('missing relations fail and material cannot move course', async () => {
  fixture.missing = true;
  await assert.rejects(mutateContent('material', 'save', form()), /Course does not exist/);
  await assert.rejects(mutateContent('video', 'save', form()), /Material does not exist/);
  fixture.missing = false;
  await assert.rejects(mutateContent('material', 'save', form({id, courseId:id})), /cannot be moved/);
});
test('student reads only published material fields, no keys or storage paths', async () => {
  fixture.role = 'STUDENT';
  assert.deepEqual(await getLearningCourses(), []);
  const query = fixture.calls[0].args;
  assert.deepEqual(query.select.materials.where, {status:'PUBLISHED'});
  assert.deepEqual(Object.keys(query.select.materials.select), ['id','number','title','description']);
  await assert.rejects(getAdminMaterials(1), /redirect/);
  await assert.rejects(getAdminVideos(1), /redirect/);
});
test('anonymous and admin do not enter student read boundary', async () => {
  fixture.role = null;
  await assert.rejects(getLearningCourses(), /redirect/);
  fixture.role = 'ADMIN';
  await assert.rejects(getLearningCourses(), /redirect/);
  assert.equal(fixture.calls.length, 0);
});
test('actions return safe errors and invalidate all affected views after success', async () => {
  fixture.fail = true;
  assert.deepEqual(await contentAction('material','save',{},form()), {error:'Unable to save changes. Please try again.'});
  fixture.fail = false;
  assert.deepEqual(await contentAction('material','save',{},form()), {success:'Saved successfully.'});
  assert.deepEqual(fixture.calls.filter(call => call.revalidate).map(call => call.revalidate), ['/admin/materials','/admin/videos','/learn']);
  assert.match(contentError({code:'P2002'}), /already in use/);
  assert.match(contentError({code:'P2025'}), /no longer exists/);
});
