import { redirect } from "next/navigation";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { getCurrentUser, getProfile } from "@/server/auth/session";
import { getHomePathForRole } from "@/server/auth/redirects";
export const metadata = { title: "Sign in" };
export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string; error?: string }> }) {
 const params = await searchParams;
 const user = await getCurrentUser();
 if (user) {
  const profile = await getProfile(user.id);
  if (!profile) redirect("/auth/invalid-profile");
  redirect(getHomePathForRole(profile.role));
 }
 return <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10"><div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"><div className="mb-6 flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-sm font-semibold text-white">H</div><div className="leading-tight"><h1 className="text-lg font-semibold text-slate-900">Sign in</h1><p className="text-sm text-slate-500">Dasar Sistem Hidrolik</p></div></div><LoginForm next={params.next ?? ""} initialError={params.error ? "Email or password is incorrect." : ""} /></div></main>;
}
