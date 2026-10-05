import { redirect } from "next/navigation";
import { requireProfile } from "@/server/auth/session";
import { getHomePathForRole } from "@/server/auth/redirects";
import { logoutAction } from "@/features/auth/actions";
export default async function LearnPage() {
 const profile = await requireProfile();
 if (profile.role !== "STUDENT") redirect(getHomePathForRole(profile.role));
 return <main className="mx-auto max-w-3xl px-6 py-12"><h1 className="text-2xl font-semibold">Learning area coming soon</h1><form action={logoutAction} className="mt-6"><button type="submit" className="text-blue-600">Sign out</button></form></main>;
}
