import "server-only";
export type AppRole = "ADMIN" | "STUDENT";
export function getHomePathForRole(role: AppRole) { return role === "ADMIN" ? "/admin" : "/learn"; }
export function sanitizeNextPath(value: unknown, role: AppRole): string | null {
 if (typeof value !== "string" || value.length > 2048) return null;
 let path: string;
 try { path = decodeURIComponent(value); } catch { return null; }
 if (!path.startsWith("/") || path.startsWith("//") || /[\\\x00-\x20]/.test(path) || /[a-z][a-z0-9+.-]*:/i.test(path)) return null;
 const home = getHomePathForRole(role);
 const pathname = new URL(path, "https://local.invalid").pathname;
 if (pathname === "/admin/login") return null;
 return pathname === home || pathname.startsWith(home + "/") ? path : null;
}
