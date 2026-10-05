import { requireAdmin } from "@/server/auth/session";
import { AdminHeader } from "@/features/admin/components/AdminHeader";
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
 // Layouts persist on navigation; every admin data function/action must also requireAdmin.
 await requireAdmin();
 return <><AdminHeader />{children}</>;
}
