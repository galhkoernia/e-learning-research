import { Button } from "@/features/admin/components/Button";
import { PageHeader } from "@/features/admin/components/PageHeader";
import { Panel } from "@/features/admin/components/Panel";
import { StatusBadge } from "@/features/admin/components/StatusBadge";
import { materials, videos } from "@/features/admin/data";

export const metadata = { title: "Videos" };

export default function VideosPage() {
  return (
    <>
      <PageHeader
        title="Videos"
        description="Manage the video that accompanies each material."
        action={<Button variant="primary">Add Video</Button>}
      />
      <div className="grid gap-6 md:grid-cols-2">
        {videos.map((v) => {
          const material = materials.find((m) => m.number === v.materialNumber);
          return (
            <Panel key={v.id} className="overflow-hidden">
              {/* Placeholder until Supabase Storage thumbnails exist. */}
              <div className="relative flex aspect-video items-center justify-center bg-blue-100">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-blue-700 shadow">
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
                <span className="absolute bottom-2 right-2 rounded bg-slate-900/80 px-1.5 py-0.5 text-xs text-white">
                  {v.duration}
                </span>
              </div>
              <div className="space-y-3 p-5">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-base font-semibold text-slate-900">{v.title}</h2>
                  <StatusBadge status={v.status} />
                </div>
                <p className="text-sm text-slate-600">
                  Material {v.materialNumber}: {material?.title}
                </p>
                <p className="text-xs text-slate-500">Updated {v.updatedAt} by {v.updatedBy}</p>
                <div className="flex gap-2 pt-1">
                  <Button size="sm">Preview</Button>
                  <Button size="sm">Edit</Button>
                  <Button size="sm" variant="danger">Delete</Button>
                </div>
              </div>
            </Panel>
          );
        })}
      </div>
    </>
  );
}