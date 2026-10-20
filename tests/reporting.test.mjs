import assert from 'node:assert/strict';
import { test } from 'node:test';
import { registerHooks } from 'node:module';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

const fixture = { role: 'ADMIN', id: '00000000-0000-4000-8000-000000000001', calls: [] };
globalThis.reportingFixture = fixture;
const model = name => ({
  count: async args => { fixture.calls.push({name,method:'count',args}); return 0; },
  findMany: async args => { fixture.calls.push({name,method:'findMany',args}); return []; },
  findFirst: async args => { fixture.calls.push({name,method:'findFirst',args}); return null; },
});
fixture.db = Object.fromEntries(['profile','course','material','video','question'].map(name=>[name,model(name)]));
const mocks = {
  'server-only':'',
  './auth/session':`export async function requireAdmin() { if(globalThis.reportingFixture.role!=='ADMIN') throw new Error('redirect:denied'); } export async function requireProfile() { const f=globalThis.reportingFixture; if(!f.role) throw new Error('redirect:login'); return {id:f.id,role:f.role}; }`,
  './db/prisma':`export function getPrisma(){return globalThis.reportingFixture.db;}`,
  './auth/redirects':`export function getHomePathForRole(){return '/admin';}`,
  'next/navigation':`export function redirect(path){throw new Error('redirect:'+path);} export function unstable_rethrow(error){if(error.message.startsWith('redirect:')) throw error;}`,
};
registerHooks({
  resolve(specifier,context,next) {
    if(Object.hasOwn(mocks,specifier)) return {url:'mock:'+specifier,shortCircuit:true};
    if(specifier.startsWith('@/')) return {url:new URL('../src/'+specifier.slice(2)+'.ts',import.meta.url).href,shortCircuit:true};
    if(specifier.startsWith('.') && !specifier.endsWith('.mjs') && !specifier.endsWith('.ts')) return {url:new URL(specifier+'.ts',context.parentURL).href,shortCircuit:true};
    return next(specifier,context);
  },
  load(url,context,next) {
    if(url.startsWith('mock:')) return {format:'module',source:mocks[url.slice(5)],shortCircuit:true};
    if(url.endsWith('.ts') && url.includes('/src/')) return {format:'module',source:ts.transpileModule(readFileSync(new URL(url),'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText,shortCircuit:true};
    return next(url,context);
  },
});
const {participantFilters}=await import('../src/features/reporting/validation.ts');
const {csvCell,csvDocument}=await import('../src/features/reporting/csv.ts');
const {getDashboardSummary,getParticipants,getParticipant,getStudentReportingIdentity}=await import('../src/server/reporting.ts');
const {GET}=await import('../src/app/admin/(dashboard)/participants/export/route.ts');

test('participant filters validate search and database pagination',()=>{
  assert.deepEqual(participantFilters({q:'  Student  ',page:'2'}),{q:'Student',page:2});
  for(const search of [{page:'0'},{page:'1.5'},{page:'100001'},{q:'a'.repeat(101)},{q:'\n'}, {q:['one','two']}]) assert.throws(()=>participantFilters(search));
});

test('CSV preserves absent values, escaping and prevents spreadsheet formulas',()=>{
  for(const value of ['=1+1',' +SUM(A1)','-1','@test','\tvalue','\rvalue','\nvalue']) assert.ok(csvCell(value).startsWith('"\''));
  assert.equal(csvCell(null),'""'); assert.equal(csvCell('a,"b"'),'"a,""b"""');
  assert.equal(csvDocument(['Name'],[['Peserta, satu']]),'\uFEFF"Name"\r\n"Peserta, satu"\r\n');
});

test('dashboard uses database aggregation and only a bounded recent profile query',async()=>{
  fixture.role='ADMIN'; fixture.calls=[];
  const summary=await getDashboardSummary();
  assert.equal(summary.participants,0);
  assert.equal(fixture.calls.filter(call=>call.method==='count').length,8);
  const recent=fixture.calls.find(call=>call.method==='findMany');
  assert.equal(recent.args.take,5); assert.deepEqual(recent.args.where,{role:'STUDENT'});
});

test('participants and CSV share a bounded server search without sensitive fields',async()=>{
  fixture.role='ADMIN'; fixture.calls=[];
  await getParticipants({q:'Student',page:'2'});
  const [list,count]=fixture.calls;
  assert.equal(list.args.skip,20); assert.equal(list.args.take,20);
  assert.deepEqual(list.args.where,count.args.where); assert.equal(list.args.where.role,'STUDENT');
  assert.deepEqual(Object.keys(list.args.select),['id','fullName','email','createdAt']);
  fixture.calls=[];
  const response=await GET(new Request('http://localhost/admin/participants/export?q=Student&page=2'));
  assert.equal(response.status,200); assert.match(response.headers.get('content-type'),/text\/csv/);
  assert.equal(fixture.calls[0].args.skip,20); assert.equal(fixture.calls[0].args.take,20);
  assert.equal(response.headers.get('cache-control'),'private, no-store');
});

test('admin reporting and export deny anonymous and STUDENT before database access',async()=>{
  for(const role of [null,'STUDENT']) {
    fixture.role=role; fixture.calls=[];
    await assert.rejects(getDashboardSummary(),/redirect/);
    await assert.rejects(getParticipants({}),/redirect/);
    await assert.rejects(getParticipant(fixture.id),/redirect/);
    await assert.rejects(GET(new Request('http://localhost/admin/participants/export')),/redirect/);
    assert.equal(fixture.calls.length,0);
  }
});

test('student reporting identity comes only from session; ADMIN is rejected',async()=>{
  fixture.role='STUDENT';
  assert.deepEqual(await getStudentReportingIdentity(),{id:fixture.id});
  fixture.role='ADMIN'; await assert.rejects(getStudentReportingIdentity(),/redirect/);
  fixture.role=null; await assert.rejects(getStudentReportingIdentity(),/redirect/);
});
