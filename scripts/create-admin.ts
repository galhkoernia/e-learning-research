import { loadEnvFile } from "node:process";
import { createClient } from "@supabase/supabase-js";
import { getPrisma } from "../src/server/db/prisma.ts";
try { loadEnvFile(".env"); } catch { /* Shell may already supply environment. */ }
try { loadEnvFile(".env.local"); } catch { /* Optional local configuration. */ }
async function main() {
 const { ADMIN_EMAIL: email, ADMIN_PASSWORD: password, NEXT_PUBLIC_SUPABASE_URL: url, SUPABASE_SERVICE_ROLE_KEY: key, DATABASE_URL: database } = process.env;
 if (!email || !password || !url || !key || !database) throw new Error("Missing configuration");
 const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
 // An existing account may appear beyond the first page.
 let userId: string | undefined;
 for (let page = 1; ; page++) {
  const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 100 });
  if (error) throw new Error("User lookup failed");
  userId = data.users.find(user => user.email?.toLowerCase() === email.trim().toLowerCase())?.id;
  if (userId || data.users.length < 100) break;
 }
 if (!userId) {
  const { data, error } = await supabase.auth.admin.createUser({ email: email.trim(), password, email_confirm: true });
  if (error || !data.user) throw new Error("User creation failed");
  userId = data.user.id;
 }
 const prisma = getPrisma();
 try {
  await prisma.profile.upsert({ where: { id: userId }, create: { id: userId, email: email.trim().toLowerCase(), role: "ADMIN" }, update: { role: "ADMIN" } });
 } finally { await prisma.$disconnect(); }
 console.log("Admin profile is ready.");
}
main().catch(() => { console.error("Admin bootstrap failed. Check required environment, Supabase access, and migrations."); process.exitCode = 1; });
