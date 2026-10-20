import assert from 'node:assert/strict';
import { test } from 'node:test';
import { registerHooks } from 'node:module';
import { readFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import ts from 'typescript';

// Explicit opt-in: never use the application's DATABASE_URL as a test database.
test('PostgreSQL content CRUD, constraints, validation and reread (rolled back)', {
  skip: !process.env.CONTENT_TEST_DATABASE_URL,
}, async () => {
  process.env.DATABASE_URL = process.env.CONTENT_TEST_DATABASE_URL;
  globalThis.contentIntegrationRole = 'ADMIN';
  const mocks = {
    'server-only': '',
    'next/navigation': `export function redirect(path) { throw new Error('redirect:' + path); }`,
    './auth/session': `export async function requireAdmin() { if (globalThis.contentIntegrationRole !== 'ADMIN') throw new Error('Forbidden'); } export async function requireProfile() { return {role:globalThis.contentIntegrationRole}; }`,
    './auth/redirects': `export function getHomePathForRole() { return '/admin'; }`,
    './db/prisma': `export function getPrisma() { return globalThis.contentIntegrationDb; }`,
  };
  registerHooks({
    resolve(specifier, context, next) {
      if (Object.hasOwn(mocks, specifier)) return {url:'mock:'+specifier,shortCircuit:true};
      if (specifier.endsWith('content-validation')) return {url:new URL('../src/features/admin/content-validation.ts',import.meta.url).href,shortCircuit:true};
      return next(specifier,context);
    },
    load(url,context,next) {
      if (url.startsWith('mock:')) return {format:'module',source:mocks[url.slice(5)],shortCircuit:true};
      if (url.endsWith('.ts') && url.includes('/src/')) return {format:'module',source:ts.transpileModule(readFileSync(new URL(url),'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText,shortCircuit:true};
      return next(url,context);
    },
  });
  const {getPrisma} = await import('../src/server/db/prisma.ts');
  const {mutateContent,getLearningCourses} = await import('../src/server/content.ts');
  const db = getPrisma();
  const rollback = new Error('ROLLBACK_CONTENT_TEST');
  const courseId = randomUUID();
  function form(values = {}) {
    const data = new FormData();
    for (const [key,value] of Object.entries({courseId,number:'1',title:'Integration material',description:'Readable content',status:'PUBLISHED',storagePath:'',durationSeconds:'',...values})) data.set(key,value);
    return data;
  }
  try {
    await assert.rejects(db.$transaction(async tx => {
      // Keep service transactions inside this outer rollback-only transaction.
      globalThis.contentIntegrationDb = new Proxy(tx,{get(target,key) {
        return key === '$transaction' ? async work => work(tx) : target[key];
      }});
      await tx.course.create({data:{id:courseId,title:'Content integration test'}});
      await mutateContent('material','save',form());
      let material = await tx.material.findUniqueOrThrow({where:{courseId_number:{courseId,number:1}}});
      await mutateContent('material','save',form({id:material.id,title:'Updated material'}));
      material = await tx.material.findUniqueOrThrow({where:{id:material.id}});
      assert.equal(material.title,'Updated material');
      const videoForm = form({materialId:material.id,title:'Video metadata',durationSeconds:'60'});
      await mutateContent('video','save',videoForm);
      const video = await tx.video.findUniqueOrThrow({where:{materialId:material.id}});
      await assert.rejects(mutateContent('material','delete',form({id:material.id})),/related video/);
      videoForm.set('id',video.id); videoForm.set('title','Updated video');
      await mutateContent('video','save',videoForm);
      assert.equal((await tx.video.findUniqueOrThrow({where:{id:video.id}})).title,'Updated video');
      await assert.rejects(mutateContent('material','save',form({title:''})));
      assert.equal(await tx.material.count({where:{courseId}}),1);
      globalThis.contentIntegrationRole = 'STUDENT';
      await assert.rejects(mutateContent('material','save',form()),/Forbidden/);
      assert.ok((await getLearningCourses()).find(course=>course.id===courseId).materials.some(row=>row.title==='Updated material'));
      globalThis.contentIntegrationRole = 'ADMIN';
      await mutateContent('video','delete',form({id:video.id}));
      assert.equal(await tx.video.count({where:{materialId:material.id}}),0);
      await mutateContent('material','delete',form({id:material.id}));
      assert.equal(await tx.material.count({where:{courseId}}),0);
      throw rollback;
    },{timeout:30000}),error=>error===rollback);
    assert.equal(await db.course.count({where:{id:courseId}}),0);
  } finally { await db.$disconnect(); }
});
