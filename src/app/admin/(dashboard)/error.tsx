"use client";
import { Button } from "@/features/admin/components/Button";
export default function AdminError({ reset }: { reset: () => void }) {
  return <section role="alert" className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
    <h2 className="text-lg font-semibold text-slate-900">Unable to load this page</h2>
    <p className="mb-5 mt-2 text-sm text-slate-600">Please try again. If the issue continues, return to the dashboard.</p>
    <Button variant="primary" onClick={reset}>Try again</Button>
  </section>;
}
