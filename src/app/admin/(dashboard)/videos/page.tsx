import { Button } from "@/features/admin/components/Button";
import { PageHeader } from "@/features/admin/components/PageHeader";
import { Panel } from "@/features/admin/components/Panel";
import { StatusBadge } from "@/features/admin/components/StatusBadge";
import {
  ContentForm,
  DeleteContent,
} from "@/features/admin/components/ContentForm";
import { VideoFields } from "@/features/admin/components/ContentFields";
import {
  ContentPagination,
  contentPage,
} from "@/features/admin/components/ContentPagination";
import { getAdminVideos } from "@/server/content";

export const metadata = { title: "Videos" };

export default async function VideosPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const page = contentPage((await searchParams).page);
  const { videos, total, materials } = await getAdminVideos(page);
  return (
    <>
      <PageHeader
        title="Videos"
        description="Manage the video metadata that accompanies each material."
        action={
          materials.some((m) => !m.video) ? (
            <ContentForm kind="video">
              <VideoFields materials={materials} />
            </ContentForm>
          ) : undefined
        }
      />
      <p className="mb-4 text-sm text-slate-600">
        Upload and preview are unavailable until private Storage is integrated.
        One video per material.
      </p>
      {!materials.some((m) => !m.video) && (
        <p className="mb-4 text-sm text-slate-600">
          Add a material without a video before creating more video metadata.
        </p>
      )}
      {!videos.length && (
        <Panel>
          <p className="p-5 text-sm text-slate-600">
            No video metadata on this page.
          </p>
        </Panel>
      )}
      <div className="grid gap-6 md:grid-cols-2">
        {videos.map((v) => (
          <Panel key={v.id} className="overflow-hidden">
            <div className="flex aspect-video items-center justify-center bg-blue-100 text-sm text-blue-700">
              Preview unavailable
            </div>
            <div className="space-y-3 p-5">
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-base font-semibold text-slate-900">
                  {v.title}
                </h2>
                <StatusBadge
                  status={v.status === "PUBLISHED" ? "Published" : "Draft"}
                />
              </div>
              <p className="text-sm text-slate-600">
                {v.material.course.title} / Material {v.material.number}:{" "}
                {v.material.title}
              </p>
              <p className="text-xs text-slate-500">
                Duration:{" "}
                {v.durationSeconds === null
                  ? "Not specified"
                  : `${v.durationSeconds} seconds`}
              </p>
              <Button size="sm" disabled>
                Preview (Storage pending)
              </Button>
              <ContentForm kind="video" id={v.id}>
                <VideoFields materials={materials} value={v} />
              </ContentForm>
              <DeleteContent kind="video" id={v.id} />
            </div>
          </Panel>
        ))}
      </div>
      <ContentPagination page={page} total={total} path="/admin/videos" />
    </>
  );
}
