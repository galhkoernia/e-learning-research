export function AssessmentAvailability({ title = "Assessment reporting unavailable" }: { title?: string }) {
  return <section className="rounded-xl border border-slate-200 bg-white p-5">
    <h2 className="text-base font-semibold text-slate-900">{title}</h2>
    <p className="mt-2 text-sm text-slate-600">Assessment results and completion tracking are not available yet. Scores, learning progress, and course completion cannot be displayed.</p>
  </section>;
}
