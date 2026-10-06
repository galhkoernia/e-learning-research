export default function AdminLoading() {
  return <div role="status" aria-label="Loading administration" className="space-y-6">
    <p className="text-sm text-slate-500">Loading administration…</p>
    <div aria-hidden="true" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {[0, 1, 2, 3].map(item => <div key={item} className="h-32 rounded-xl border border-slate-200 bg-white p-5"><div className="h-3 w-24 rounded bg-slate-100" /><div className="mt-4 h-8 w-16 rounded bg-slate-100" /></div>)}
    </div>
    <div aria-hidden="true" className="h-64 rounded-xl border border-slate-200 bg-white" />
  </div>;
}
