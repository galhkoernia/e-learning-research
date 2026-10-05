"use server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/server/auth/session";
import { getHomePathForRole, sanitizeNextPath } from "@/server/auth/redirects";
export async function loginAction(_previous: { error: string }, form: FormData) {
 const failure = { error: "Email or password is incorrect." };
 const email = form.get("email"), password = form.get("password");
 if (typeof email !== "string" || typeof password !== "string" || !email.trim() || email.length > 254 || !password || password.length > 1024 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return failure;
 let destination: string;
 try {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
  if (error || !data.user) return failure;
  const profile = await getProfile(data.user.id);
  if (!profile) { await supabase.auth.signOut({ scope: "local" }); return failure; }
  destination = sanitizeNextPath(form.get("next"), profile.role) ?? getHomePathForRole(profile.role);
 } catch { return failure; }
 redirect(destination);
}
export async function logoutAction() {
 const supabase = await createClient();
 const { error } = await supabase.auth.signOut();
 if (error) await supabase.auth.signOut({ scope: "local" });
 redirect("/login");
}
