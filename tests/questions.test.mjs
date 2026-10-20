import assert from 'node:assert/strict';
import { test, beforeEach } from 'node:test';
import { registerHooks } from 'node:module';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

const courseId = '00000000-0000-4000-8000-000000000001';
const questionId = '00000000-0000-4000-8000-000000000002';
const materialId = '00000000-0000-4000-8000-000000000003';
const optionId = '00000000-0000-4000-8000-000000000004';
const foreignId = '00000000-0000-4000-8000-000000000005';
const fixture = { calls: [] };
globalThis.questionFixture = fixture;
const model = name => new Proxy({}, { get: (_, method) => async args => {
  fixture.calls.push({ name, method, args, inTransaction: fixture.inTransaction });
  if (fixture.failure) throw fixture.failure;
  if (method === 'findMany') return [];
  if (method === 'count') return 0;
  if (method === 'findUnique') {
    if (fixture.missing === name) return null;
    if (name === 'material') return { courseId: fixture.materialCourse ?? courseId };
    if (name === 'question') return { id: questionId, options: [{ id: optionId }] };
    return { id: courseId };
  }
  return { id: questionId, ...args?.data };
} });
const db = {
  course: model('course'), material: model('material'), question: model('question'), questionOption: model('questionOption'),
  $transaction: async (work, options) => {
    fixture.calls.push({ transaction: options });
    fixture.inTransaction = true;
    try { return await work(db); } finally { fixture.inTransaction = false; }
  },
};
fixture.db = db;
const mocks = {
  'server-only': '',
  'next/navigation': `export function unstable_rethrow(error) { if (error.message?.startsWith('redirect:')) throw error; }`,
  'next/cache': `export function revalidatePath(path) { globalThis.questionFixture.calls.push({ revalidate: path }); }`,
  './auth/session': `export async function requireAdmin() { if (globalThis.questionFixture.role !== 'ADMIN') throw new Error('redirect:/login'); }`,
  './db/prisma': `export function getPrisma() { return globalThis.questionFixture.db; }`,
};
registerHooks({
  resolve(specifier, context, next) {
    if (Object.hasOwn(mocks, specifier)) return { url: 'mock:' + specifier, shortCircuit: true };
    if (specifier === '@/server/questions') return { url: new URL('../src/server/questions.ts', import.meta.url).href, shortCircuit: true };
    for (const file of ['content-validation', 'question-validation']) {
      if (specifier.endsWith(file)) return { url: new URL(`../src/features/admin/${file}.ts`, import.meta.url).href, shortCircuit: true };
    }
    return next(specifier, context);
  },
  load(url, context, next) {
    if (url.startsWith('mock:')) return { format: 'module', source: mocks[url.slice(5)], shortCircuit: true };
    if (url.endsWith('.ts') && url.includes('/src/')) return {
      format: 'module', source: ts.transpileModule(readFileSync(new URL(url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText, shortCircuit: true,
    };
    return next(url, context);
  },
});
const { questionInput, questionFilters, MIN_MC_OPTIONS, MAX_MC_OPTIONS, TRUE_FALSE_LABELS } = await import('../src/features/admin/question-validation.ts');
const { getAdminQuestions, getAdminQuestion, saveQuestion, deleteQuestion, questionError } = await import('../src/server/questions.ts');
const { questionAction } = await import('../src/features/admin/question-actions.ts');
const choices = count => Array.from({ length: count }, (_, index) => ({ label: `Option ${index + 1}`, isCorrect: index === 0 }));
function form(values = {}, options = choices(4)) {
  const result = new FormData();
  for (const [key, value] of Object.entries({ courseId, materialId: '', assessment: 'PRE_TEST', position: '1', text: 'What is a hydraulic pump?', type: 'MULTIPLE_CHOICE', status: 'DRAFT', options: JSON.stringify(options), ...values })) result.set(key, value);
  return result;
}
beforeEach(() => Object.assign(fixture, { role: 'ADMIN', calls: [], missing: null, failure: null, materialCourse: null, inTransaction: false }));

test('shared option limits and Indonesian True/False labels match requirements', () => {
  assert.equal(MIN_MC_OPTIONS, 3); assert.equal(MAX_MC_OPTIONS, 4);
  assert.deepEqual(TRUE_FALSE_LABELS, ['Benar', 'Salah']);
  for (const count of [3, 4]) assert.equal(questionInput(form({}, choices(count))).options.length, count);
  const tf = [{ label: 'Benar', isCorrect: false }, { label: 'Salah', isCorrect: true }];
  assert.equal(questionInput(form({ type: 'TRUE_FALSE' }, tf)).options[1].isCorrect, true);
});

test('MC rejects fewer than 3 or more than 4 options', async () => {
  for (const count of [0, 1, 2, 5]) await assert.rejects(saveQuestion(form({}, choices(count))), /3 or 4/);
  assert.equal(fixture.calls.length, 0);
});

test('True/False requires exactly Benar and Salah in order', () => {
  for (const options of [choices(3), choices(1), choices(2), [{label:'Salah',isCorrect:true},{label:'Benar',isCorrect:false}], [{label:'True',isCorrect:true},{label:'False',isCorrect:false}]]) {
    assert.throws(() => questionInput(form({ type: 'TRUE_FALSE' }, options)), /True\/False/);
  }
});

test('every format requires exactly one correct answer, even in draft', async () => {
  for (const [type, base] of [['MULTIPLE_CHOICE', choices(3)], ['TRUE_FALSE', TRUE_FALSE_LABELS.map(label => ({label,isCorrect:false}))]]) {
    for (const options of [base.map(option => ({...option,isCorrect:false})), base.map(option => ({...option,isCorrect:true}))]) {
      await assert.rejects(saveQuestion(form({type}, options)), /exactly one/);
    }
  }
  assert.equal(fixture.calls.length, 0);
});

test('invalid text, fields, identifiers and positions are rejected before queries', async () => {
  for (const values of [{text:' '},{position:'0'},{position:'1.5'},{position:'2147483648'},{type:'ESSAY'},{assessment:'QUIZ_3'},{status:'UNKNOWN'},{courseId:'invalid'},{materialId:'invalid'},{id:'invalid'},{options:'not json'}]) {
    await assert.rejects(saveQuestion(form(values)));
  }
  for (const options of [choices(3).map(option=>({...option,label:''})), choices(3).map(option=>({...option,label:'same'})), [{...choices(3)[0],isCorrect:'true'},...choices(3).slice(1)], [{...choices(3)[0],questionId:foreignId},...choices(3).slice(1)]]) {
    await assert.rejects(saveQuestion(form({},options)));
  }
  assert.equal(fixture.calls.length, 0);
});

test('question payload only returns allowed fields and trims text', () => {
  const input = questionInput(form({ text:'  Question text  ', updatedAt:'forged', role:'ADMIN', score:'100' }));
  assert.equal(input.text,'Question text');
  assert.equal(input.updatedAt,undefined); assert.equal(input.role,undefined); assert.equal(input.score,undefined);
});

test('create writes the question and ordered options in a serializable transaction', async () => {
  await saveQuestion(form({materialId}));
  const create = fixture.calls.find(call=>call.method==='create');
  assert.equal(create.name,'question'); assert.equal(create.inTransaction,true);
  assert.deepEqual(create.args.data.options.create.map(option=>option.position),[1,2,3,4]);
  assert.equal(create.args.data.options.create.filter(option=>option.isCorrect).length,1);
  assert.deepEqual(fixture.calls.find(call=>call.transaction).transaction,{isolationLevel:'Serializable'});
});

test('update scopes option replacement to the parent and preserves remaining option IDs', async () => {
  const options = choices(3); options[0].id=optionId;
  await saveQuestion(form({id:questionId},options));
  const deletion = fixture.calls.find(call=>call.name==='questionOption');
  const update = fixture.calls.find(call=>call.method==='update');
  assert.deepEqual(deletion.args.where,{questionId}); assert.equal(deletion.inTransaction,true);
  assert.equal(update.inTransaction,true); assert.deepEqual(update.args.where,{id:questionId});
  assert.equal(update.args.data.options.create[0].id,optionId);
  assert.deepEqual(update.args.data.options.create.map(option=>option.position),[1,2,3]);
});

test('foreign, duplicate or reused option identifiers cannot be written', async () => {
  const foreign = choices(3); foreign[0].id=foreignId;
  await assert.rejects(saveQuestion(form({id:questionId},foreign)),/does not belong/);
  assert.ok(!fixture.calls.some(call=>['create','update','deleteMany'].includes(call.method)));
  fixture.calls=[];
  const duplicate = choices(3); duplicate[0].id=optionId; duplicate[1].id=optionId.toUpperCase();
  await assert.rejects(saveQuestion(form({id:questionId},duplicate)),/Duplicate/);
  await assert.rejects(saveQuestion(form({},foreign)),/cannot reuse/);
  assert.equal(fixture.calls.length,0);
});

test('course/material ownership and record existence are checked before writes', async () => {
  fixture.missing='course'; await assert.rejects(saveQuestion(form()),/Course does not exist/);
  fixture.missing='material'; await assert.rejects(saveQuestion(form({materialId})),/from the question's course/);
  fixture.missing=null; fixture.materialCourse=foreignId;
  await assert.rejects(saveQuestion(form({materialId})),/from the question's course/);
  fixture.missing='question'; await assert.rejects(saveQuestion(form({id:questionId})),/no longer exists/);
  assert.ok(!fixture.calls.some(call=>['create','update','deleteMany'].includes(call.method)));
});

test('delete targets only the requested question; invalid IDs never query', async () => {
  await deleteQuestion(form({id:questionId}));
  assert.deepEqual(fixture.calls[0].args,{where:{id:questionId}});
  fixture.calls=[];
  await assert.rejects(deleteQuestion(form({id:'invalid'})));
  assert.equal(fixture.calls.length,0);
});

test('list pagination and count share filters and load ordered option detail', async () => {
  const result=await getAdminQuestions({page:'2',assessment:'QUIZ_1',courseId,materialId});
  assert.deepEqual(result.questions,[]); assert.equal(result.total,0);
  const query=fixture.calls.find(call=>call.name==='question' && call.method==='findMany').args;
  const count=fixture.calls.find(call=>call.name==='question' && call.method==='count').args;
  assert.deepEqual(query.where,count.where); assert.deepEqual(query.where,{assessment:'QUIZ_1',courseId,materialId});
  assert.equal(query.skip,20); assert.equal(query.take,20);
  assert.deepEqual(query.select.options.orderBy,{position:'asc'});
  assert.equal(query.select.options.select.isCorrect,true);
  await getAdminQuestion(questionId);
  assert.equal(fixture.calls.at(-1).args.where.id,questionId);
});

test('invalid filters and detail identifiers are rejected before query', async () => {
  for (const search of [{page:'-1'},{page:'1.5'},{page:'Infinity'},{assessment:'OTHER'},{courseId:'invalid'},{materialId:['invalid']}]) {
    await assert.rejects(getAdminQuestions(search));
  }
  await assert.rejects(getAdminQuestion('invalid'));
  assert.equal(fixture.calls.length,0);
  assert.equal(questionFilters({}).page,1);
});

for (const role of [null,'STUDENT']) test(`${role ?? 'anonymous'} cannot read answer keys or mutate questions`, async () => {
  fixture.role=role;
  await assert.rejects(getAdminQuestions({}),/redirect/);
  await assert.rejects(getAdminQuestion(questionId),/redirect/);
  for (const operation of ['save','delete']) await assert.rejects(questionAction(operation,{},form({id:questionId})),/redirect/);
  assert.equal(fixture.calls.length,0);
});

test('actions return safe database errors and revalidate only after success', async () => {
  fixture.failure=new Error('private database password');
  const failed=await questionAction('save',{},form());
  assert.equal(failed.error,'Unable to save question changes. Please try again.');
  assert.ok(!fixture.calls.some(call=>call.revalidate));
  fixture.failure=null; fixture.calls=[];
  assert.ok((await questionAction('save',{},form())).success);
  assert.deepEqual(fixture.calls.filter(call=>call.revalidate).map(call=>call.revalidate),['/admin/questions','/admin/materials']);
  fixture.calls=[];
  assert.ok((await questionAction('delete',{},form({id:questionId}))).success);
  assert.deepEqual(await questionAction('unknown',{},form()),{error:'Invalid operation.'});
  for (const code of ['P2002','P2025','P2003','P2034']) assert.ok(!questionError({code}).includes(code));
});
