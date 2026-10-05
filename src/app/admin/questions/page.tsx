import { Button } from "@/features/admin/components/Button";
import { DataTable, type Column } from "@/features/admin/components/DataTable";
import { PageHeader } from "@/features/admin/components/PageHeader";
import { Panel } from "@/features/admin/components/Panel";
import { StatusBadge } from "@/features/admin/components/StatusBadge";
import { ASSESSMENT_ORDER, questions } from "@/features/admin/data";
import type { Question } from "@/features/admin/types";

export const metadata = { title: "Questions" };

const columns: Column<Question>[] = [
  { header: "No.", cell: (q) => q.number, className: "w-16" },
  { header: "Question", cell: (q) => <span className="text-slate-900">{q.text}</span>, className: "min-w-72" },
  { header: "Type", cell: (q) => q.type },
  { header: "Related material", cell: (q) => q.relatedMaterial },
  { header: "Status", cell: (q) => <StatusBadge status={q.status} /> },
  {
    header: "Actions",
    cell: () => (
      <div className="flex gap-2">
        <Button size="sm">Edit</Button>
        <Button size="sm" variant="danger">Delete</Button>
      </div>
    ),
  },
];

export default function QuestionsPage() {
  return (
    <>
      <PageHeader
        title="Questions"
        description="Manage questions for the pre-test, quizzes, and post-test."
        action={<Button variant="primary">Add Question</Button>}
      />
      <div className="space-y-6">
        {ASSESSMENT_ORDER.map((assessment) => {
          const rows = questions.filter((q) => q.assessment === assessment);
          return (
            <Panel key={assessment} title={`${assessment} (${rows.length})`}>
              <DataTable columns={columns} rows={rows} getRowKey={(q) => q.id} emptyMessage="No questions yet. Add the first one." />
            </Panel>
          );
        })}
      </div>
    </>
  );
}