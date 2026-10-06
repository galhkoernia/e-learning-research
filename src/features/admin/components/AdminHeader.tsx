import { logoutAction } from "@/features/auth/actions";
import { Button } from "./Button";
import { AdminNavigation } from "./AdminNavigation";
export function AdminHeader() {
 return <AdminNavigation accountAction={<form action={logoutAction}><Button type="submit" className="w-full">Sign out</Button></form>} />;
}
