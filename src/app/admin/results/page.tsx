import { Button } from "@/features/admin/components/Button";
import { DataTable, type Column } from "@/features/admin/components/DataTable";
import { PageHeader } from "@/features/admin/components/PageHeader";
import { Panel } from "@/features/admin/components/Panel";
import { StatCard } from "@/features/admin/components/StatCard";
import { StatusBadge } from "@/features/admin/components/StatusBadge";
import { getGain, getResultSummary, participants } from "@/features/admin/data";
import type { Participant } from "@/features/admin/types";

export const metadata = { title: "Results" };

const score = (value: number | null) => (value === null ? "—" : String(value));
const format = (value: number | null) => (value === null ? "—" : value.toFixed(1));

const columns: Column<Participant>[] = [
  {
    header: "Participant",
    cell: (p) => (
      <div>
        <p className="font-medium text-slate-900">{p.id}</p>
        <p className="text-xs text-slate-500">{p.name}</p>
      </div>
    ),
  },
  { header: "Pre-Test", cell: (p) => score(p.preTest) },
  { header: "Post-Test", cell: (p) => score(p.postTest) },
  {
    header: "Gain",
    cell: (p) => {
      const gain = getGain(p);
      return gain === null ? "—" : <span className="font-medium text-emerald-700">{gain > 0 ? `+${gain}` : gain}</span>;
    },
  },
  { header: "Completion", cell: (p) => `${p.progress}%` },
  { header: "Status", cell: (p) => <StatusBadge status={p.status} /> },
];

export default function ResultsPage() {
  const summary = getResultSummary();

  return (
    <>
      <PageHeader
        title="Results"
        description="Compare pre-test and post-test scores across participants."
        action={<Button variant="primary">Export Data</Button>}
      />
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Average Pre-Test" value={format(summary.avgPreTest)} />
        <StatCard label="Average Post-Test" value={format(summary.avgPostTest)} />
        <StatCard label="Completion Rate" value={`${summary.completionRate}%`} hint={`${summary.completed} of ${summary.total} participants`} />
      </div>
      <Panel title="Participant results">
        <DataTable columns={columns} rows={participants} getRowKey={(p) => p.id} />
      </Panel>
      <p className="mt-3 text-xs text-slate-500">
        Averages include only participants with a recorded score. Gain is shown once both tests are submitted.
      </p>
    </>
  );
}