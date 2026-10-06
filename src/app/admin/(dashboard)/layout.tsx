import { requireAdmin } from "@/server/auth/session";
import { AdminHeader } from "@/features/admin/components/AdminHeader";
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
 // Layouts persist on navigation; every admin data function/action must also requireAdmin.
 await requireAdmin();
 return <div className="min-h-dvh bg-slate-50">
  <a href="#admin-content" className="sr-only z-50 rounded-lg bg-white p-3 text-blue-700 focus:not-sr-only focus:fixed focus:left-4 focus:top-4">Skip to content</a>
  <AdminHeader />
  <div className="min-w-0 lg:pl-60"><main id="admin-content" className="mx-auto w-full max-w-7xl min-w-0 px-4 py-6 sm:px-6 sm:py-8 xl:px-8" tabIndex={-1}>{children}</main></div>
 </div>;
}
