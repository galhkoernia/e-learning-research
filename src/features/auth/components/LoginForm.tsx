"use client";
import { useActionState } from "react";
import { loginAction } from "../actions";
import { Button } from "@/features/admin/components/Button";
const INPUT_CLASS = "mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20";
export function LoginForm({ next, initialError }: { next: string; initialError: string }) {
 const [state, action, pending] = useActionState(loginAction, { error: initialError });
 return <form action={action} className="space-y-4" noValidate>
  <input type="hidden" name="next" value={next} />
  <div><label htmlFor="email" className="text-sm font-medium text-slate-700">Email</label><input id="email" name="email" type="email" autoComplete="username" maxLength={254} required className={INPUT_CLASS} /></div>
  <div><label htmlFor="password" className="text-sm font-medium text-slate-700">Password</label><input id="password" name="password" type="password" autoComplete="current-password" maxLength={1024} required className={INPUT_CLASS} /></div>
  {state.error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>}
  <Button type="submit" variant="primary" className="w-full" disabled={pending}>{pending ? "Signing in..." : "Sign in"}</Button>
 </form>;
}
