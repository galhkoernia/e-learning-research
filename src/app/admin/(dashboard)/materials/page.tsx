import { Button } from "@/features/admin/components/Button";
import { PageHeader } from "@/features/admin/components/PageHeader";
import { Panel } from "@/features/admin/components/Panel";
import { StatusBadge } from "@/features/admin/components/StatusBadge";
import { getQuestionCount, materials } from "@/features/admin/data";

export const metadata = { title: "Materials" };

export default function MaterialsPage() {
  return (
    <>
      <PageHeader
        title="Materials"
        description="Manage the learning materials in Dasar Sistem Hidrolik."
        action={<Button variant="primary">Tambah Materi</Button>}
      />
      <div className="space-y-4">
        {materials.map((m) => (
          <Panel key={m.id}>
            <div className="flex flex-col gap-4 p-5 md:flex-row md:items-center">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-lg font-semibold text-blue-700">
                {m.number}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-base font-semibold text-slate-900">{m.title}</h2>
                  <StatusBadge status={m.status} />
                </div>
                <p className="mt-1 text-sm text-slate-600">{m.description}</p>
                <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-xs text-slate-500">
                  <div className="flex gap-1">
                    <dt>Video:</dt>
                    <dd className="font-medium text-slate-700">{m.hasVideo ? "Available" : "Not added"}</dd>
                  </div>
                  <div className="flex gap-1">
                    <dt>{m.quiz}:</dt>
                    <dd className="font-medium text-slate-700">{getQuestionCount(m.quiz)} questions</dd>
                  </div>
                </dl>
              </div>
              <div className="flex gap-2">
                <Button size="sm">View</Button>
                <Button size="sm">Edit</Button>
                <Button size="sm" variant="danger">Delete</Button>
              </div>
            </div>
          </Panel>
        ))}
      </div>
    </>
  );
}