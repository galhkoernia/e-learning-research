import { PageHeader } from "@/features/admin/components/PageHeader";
import { Panel } from "@/features/admin/components/Panel";
import { StatusBadge } from "@/features/admin/components/StatusBadge";
import {
  ContentForm,
  DeleteContent,
} from "@/features/admin/components/ContentForm";
import { MaterialFields } from "@/features/admin/components/ContentFields";
import {
  ContentPagination,
  contentPage,
} from "@/features/admin/components/ContentPagination";
import { getAdminMaterials } from "@/server/content";

export const metadata = { title: "Materials" };

export default async function MaterialsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const page = contentPage((await searchParams).page);
  const { materials, total, courses } = await getAdminMaterials(page);
  return (
    <>
      <PageHeader
        title="Materials"
        description="Manage learning materials by course and order."
        action={
          courses.length > 0 ? (
            <ContentForm kind="material">
              <MaterialFields courses={courses} />
            </ContentForm>
          ) : undefined
        }
      />
      {!courses.length && (
        <p className="mb-4 text-sm text-slate-600">
          No courses available. Configure a course before adding materials.
        </p>
      )}
      <div className="space-y-4">
        {!materials.length && (
          <Panel>
            <p className="p-5 text-sm text-slate-600">
              No materials on this page.
            </p>
          </Panel>
        )}
        {materials.map((m) => (
          <Panel key={m.id}>
            <div className="flex flex-col gap-4 p-5 md:flex-row">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-lg font-semibold text-blue-700">
                {m.number}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-base font-semibold text-slate-900">
                    {m.title}
                  </h2>
                  <StatusBadge
                    status={m.status === "PUBLISHED" ? "Published" : "Draft"}
                  />
                </div>
                <p className="mt-1 text-xs text-slate-500">{m.course.title}</p>
                <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">
                  {m.description || "No description available."}
                </p>
                <p className="mt-3 text-xs text-slate-500">
                  Video: {m.video ? "Available" : "Not added"} ·{" "}
                  {m._count.questions} questions
                </p>
                <div className="mt-4 space-y-3">
                  <ContentForm kind="material" id={m.id}>
                    <MaterialFields courses={courses} value={m} />
                  </ContentForm>
                  <DeleteContent kind="material" id={m.id} />
                </div>
              </div>
            </div>
          </Panel>
        ))}
      </div>
      <ContentPagination page={page} total={total} path="/admin/materials" />
    </>
  );
}
