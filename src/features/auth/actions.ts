"use server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/server/auth/session";
import { getHomePathForRole, sanitizeNextPath } from "@/server/auth/redirects";
export async function loginAction(_previous: { error: string }, form: FormData) {
 const failure = { error: "Email or password is incorrect." };
 const email = form.get("email"), password = form.get("password");
 if (typeof email !== "string" || typeof password !== "string" || !email.trim() || email.length > 254 || !password || password.length > 1024 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
  if (process.env.NODE_ENV === "development") console.warn("[auth] Login input rejected.");
  return failure;
 }
 let destination: string;
 let stage = "client-configuration";
 try {
  const supabase = await createClient();
  stage = "password-authentication";
  const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
  if (error || !data.user) {
   if (process.env.NODE_ENV === "development") console.warn("[auth] Supabase sign-in rejected.", { code: error?.code, status: error?.status });
   return failure;
  }
  stage = "profile-lookup";
  const profile = await getProfile(data.user.id);
  if (!profile) {
   if (process.env.NODE_ENV === "development") console.warn("[auth] Profile unavailable; signing out.");
   await supabase.auth.signOut({ scope: "local" });
   return failure;
  }
  destination = sanitizeNextPath(form.get("next"), profile.role) ?? getHomePathForRole(profile.role);
 } catch (error: unknown) {
  if (process.env.NODE_ENV === "development") console.warn("[auth] Login failed before redirect.", {
   stage,
   type: error instanceof Error ? error.name : "UnknownError",
  });
  return failure;
 }
 redirect(destination);
}
export async function logoutAction() {
 const supabase = await createClient();
 const { error } = await supabase.auth.signOut();
 if (error) await supabase.auth.signOut({ scope: "local" });
 redirect("/login");
}
