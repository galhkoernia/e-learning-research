import { loadEnvFile } from 'node:process';
for (const file of ['.env.local', '.env']) { try { loadEnvFile(file); } catch {} }
const origin = 'http://localhost:3100';
const jar = new Map();
function decode(value) { return value.replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>'); }
async function request(path, options = {}) {
 const response = await fetch(origin + path, { ...options, redirect: 'manual', headers: { Origin: origin, Cookie: [...jar].map(([k,v]) => k+'='+v).join('; '), ...options.headers } });
 for (const cookie of response.headers.getSetCookie()) { const pair = cookie.split(';')[0]; const index = pair.indexOf('='); const name=pair.slice(0,index),value=pair.slice(index+1); if (value) jar.set(name,value); else jar.delete(name); }
 return response;
}
function form(html, email, password) {
 const body = new FormData();
 for (const tag of html.match(/<input\b[^>]*>/g) ?? []) {
  const name=tag.match(/name="([^"]*)"/)?.[1],value=tag.match(/value="([^"]*)"/)?.[1] ?? '';
  if(name?.startsWith('$ACTION')) body.append(decode(name),decode(value));
 }
 if(email !== undefined) { body.set('email',email); body.set('password',password); }
 return body;
}
try {
 let response=await request('/admin'); console.log('Signed-out admin:', response.status, response.headers.get('location'));
 for (const [label,email,password] of [['wrong-password',process.env.ADMIN_EMAIL,'deliberately-wrong-password'],['unknown-email','auth-check-'+Date.now()+'@example.invalid','deliberately-wrong-password']]) {
  const html=await (await request('/login')).text(); response=await request('/login',{method:'POST',body:form(html,email,password)});
  console.log(label, response.status, (await response.text()).includes('Email or password is incorrect.'));
 }
 const html=await (await request('/login')).text(); response=await request('/login',{method:'POST',body:form(html,process.env.ADMIN_EMAIL,process.env.ADMIN_PASSWORD)});
 console.log('Valid login:',response.status,response.headers.get('location'),'authCookiePresent:',jar.size>0);
 for (const path of ['/admin','/admin/results','/admin','/login']) { response=await request(path);console.log('Authenticated',path,response.status,response.headers.get('location')); }
 response=await request('/admin'); const dashboard=await response.text();
 response=await request('/admin',{method:'POST',body:form(dashboard)});console.log('Logout:',response.status,response.headers.get('location'));
 response=await request('/admin');console.log('After logout:',response.status,response.headers.get('location'));
} catch(error) {console.log('HTTP check failed:',error.name);process.exitCode=1;}
