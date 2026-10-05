import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getPrisma } from "@/server/db/prisma";
import { getHomePathForRole } from "./redirects";
export async function getCurrentUser() {
 try { const supabase = await createClient(); const { data, error } = await supabase.auth.getUser(); return error ? null : data.user; }
 catch { return null; }
}
export async function requireUser() {
 const user = await getCurrentUser();
 if (!user) redirect("/login");
 return user;
}
export async function getProfile(userId: string) {
 try { return await getPrisma().profile.findUnique({ where: { id: userId }, select: { id: true, role: true } }); }
 catch { return null; }
}
export async function requireProfile() {
 const user = await requireUser();
 const profile = await getProfile(user.id);
 // Cookie deletion needs a Server Action or Route Handler.
 if (!profile) redirect("/auth/invalid-profile");
 return profile;
}
export async function requireAdmin() {
 const profile = await requireProfile();
 if (profile.role !== "ADMIN") redirect(getHomePathForRole(profile.role));
 return profile;
}
