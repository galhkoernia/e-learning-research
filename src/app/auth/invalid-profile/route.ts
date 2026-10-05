import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
export async function GET(request: NextRequest) {
 const supabase = await createClient();
 await supabase.auth.signOut({ scope: "local" });
 const response = NextResponse.redirect(new URL("/login?error=authentication", request.url));
 response.headers.set("Cache-Control", "private, no-store");
 return response;
}
