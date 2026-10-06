export function ProgressBar({ percent, label }: { percent: number; label: string }) {
  const clamped = Math.min(100, Math.max(0, percent));
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={clamped}
      className="h-2 w-full overflow-hidden rounded-full bg-slate-100"
    >
      <div className="h-full rounded-full bg-blue-600" style={{ width: `${clamped}%` }} />
    </div>
  );
}

interface ProgressCardProps {
  label: string;
  valueLabel: string;
  percent: number;
}

export function ProgressCard({ label, valueLabel, percent }: ProgressCardProps) {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 text-sm">
        <span className="font-medium text-slate-700">{label}</span>
        <span className="text-slate-500">{valueLabel}</span>
      </div>
      <ProgressBar percent={percent} label={label} />
    </div>
  );
}
