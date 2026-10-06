import { DataTable, type Column } from "@/features/admin/components/DataTable";
import { Panel } from "@/features/admin/components/Panel";
import { PageHeader } from "@/features/admin/components/PageHeader";
import { ProgressBar, ProgressCard } from "@/features/admin/components/ProgressCard";
import { StatCard } from "@/features/admin/components/StatCard";
import { StatusBadge } from "@/features/admin/components/StatusBadge";
import { getResultSummary, participants, recentActivity } from "@/features/admin/data";
import type { Participant } from "@/features/admin/types";

export const metadata = { title: "Dashboard" };

const progressColumns: Column<Participant>[] = [
  {
    header: "Participant",
    cell: (p) => (
      <div>
        <p className="font-medium text-slate-900">{p.name}</p>
        <p className="text-xs text-slate-500">{p.id} · {p.currentStep}</p>
      </div>
    ),
  },
  {
    header: "Progress",
    cell: (p) => (
      <div className="flex min-w-36 items-center gap-3">
        <ProgressBar percent={p.progress} label={`${p.name} progress`} />
        <span className="w-9 text-xs text-slate-500">{p.progress}%</span>
      </div>
    ),
  },
  { header: "Status", cell: (p) => <StatusBadge status={p.status} /> },
];

const format = (value: number | null) => (value === null ? "—" : value.toFixed(1));

export default function AdminDashboardPage() {
  const summary = getResultSummary();

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" description="Monitor learning content, participant progress, and research outcomes." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Participants" value={String(summary.total)} hint="Registered in this course" />
        <StatCard label="Completed Learning" value={String(summary.completed)} hint={`${summary.completionRate}% of participants`} />
        <StatCard label="Average Pre-Test Score" value={format(summary.avgPreTest)} hint="Out of 100" />
        <StatCard label="Average Post-Test Score" value={format(summary.avgPostTest)} hint="Out of 100" />
      </div>

      <div className="grid min-w-0 gap-6 xl:grid-cols-3">
        <Panel title="Learning progress" className="xl:col-span-2">
          <DataTable columns={progressColumns} rows={participants} getRowKey={(p) => p.id} />
        </Panel>

        <Panel title="Recent activity">
          <ul className="divide-y divide-slate-100">
            {recentActivity.map((item) => (
              <li key={item.id} className="px-5 py-3 text-sm">
                <p className="text-slate-700">
                  <span className="font-medium text-slate-900">{item.participantId}</span> {item.action}
                </p>
                <p className="text-xs text-slate-500">{item.time}</p>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <Panel title="Assessment overview">
        <div className="grid gap-6 p-5 md:grid-cols-3">
          <ProgressCard label="Pre-Test Average" valueLabel={`${format(summary.avgPreTest)} / 100`} percent={summary.avgPreTest ?? 0} />
          <ProgressCard label="Post-Test Average" valueLabel={`${format(summary.avgPostTest)} / 100`} percent={summary.avgPostTest ?? 0} />
          <ProgressCard label="Completion Rate" valueLabel={`${summary.completionRate}% (${summary.completed} of ${summary.total})`} percent={summary.completionRate} />
        </div>
      </Panel>
    </div>
  );
}
