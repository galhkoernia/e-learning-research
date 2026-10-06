import { loadEnvFile } from "node:process";
import { createClient } from "@supabase/supabase-js";
import { getPrisma } from "../src/server/db/prisma.ts";
// Use the same local precedence as Next.js and the migration configuration.
for (const file of [".env.local", ".env"]) {
 try { loadEnvFile(file); }
 catch (error) {
  if (!(error instanceof Error && "code" in error && error.code === "ENOENT")) throw error;
 }
}
let stage = "configuration";
async function main() {
 const { ADMIN_EMAIL: email, ADMIN_PASSWORD: password, NEXT_PUBLIC_SUPABASE_URL: url, DATABASE_URL: database } = process.env;
 const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
 if (!email || !password || !url || !key || !database) throw new Error("Missing configuration");
 const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
 // An existing account may appear beyond the first page.
 let userId: string | undefined;
 stage = "auth-user-lookup";
 for (let page = 1; ; page++) {
  const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 100 });
  if (error) throw error;
  userId = data.users.find(user => user.email?.toLowerCase() === email.trim().toLowerCase())?.id;
  if (userId || data.users.length < 100) break;
 }
 if (process.argv.includes("--check")) {
  console.log(userId ? "Configured admin exists in Supabase Auth." : "Configured admin does not exist in Supabase Auth.");
  return;
 }
 if (!userId) {
  stage = "auth-user-creation";
  const { data, error } = await supabase.auth.admin.createUser({ email: email.trim(), password, email_confirm: true });
  if (error) throw error;
  if (!data.user) throw new Error("User creation failed");
  userId = data.user.id;
 }
 const prisma = getPrisma();
 stage = "admin-profile-upsert";
 try {
  await prisma.profile.upsert({ where: { id: userId }, create: { id: userId, email: email.trim().toLowerCase(), role: "ADMIN" }, update: { role: "ADMIN" } });
 } finally { await prisma.$disconnect(); }
 console.log("Admin profile is ready.");
}
main().catch((error: unknown) => {
 const code = error && typeof error === "object" && "code" in error && typeof error.code === "string" && /^[A-Za-z0-9_]+$/.test(error.code) ? error.code : undefined;
 const status = error && typeof error === "object" && "status" in error && typeof error.status === "number" ? error.status : undefined;
 // Error messages can contain account details; print only stage and safe identifiers.
 console.error("Admin bootstrap failed.", { stage, code, status });
 process.exitCode = 1;
});
