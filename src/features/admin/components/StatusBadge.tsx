import type { BadgeStatus } from "../types";

const TONES: Record<BadgeStatus, string> = {
  Published: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  Completed: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  "In progress": "bg-blue-50 text-blue-700 ring-blue-600/20",
  Draft: "bg-amber-50 text-amber-700 ring-amber-600/20",
  "Not started": "bg-slate-100 text-slate-600 ring-slate-500/20",
};

export function StatusBadge({ status }: { status: BadgeStatus }) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${TONES[status]}`}
    >
      {status}
    </span>
  );
}