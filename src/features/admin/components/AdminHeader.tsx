import { logoutAction } from "@/features/auth/actions";
import { Button } from "./Button";
export function AdminHeader() {
 return <header className="mb-6 flex justify-end"><form action={logoutAction}><Button type="submit">Sign out</Button></form></header>;
}
