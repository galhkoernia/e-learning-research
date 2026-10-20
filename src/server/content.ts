import "server-only";
import { redirect } from "next/navigation";
import { requireAdmin, requireProfile } from "./auth/session";
import { getHomePathForRole } from "./auth/redirects";
import { getPrisma } from "./db/prisma";
import { ContentError, identifier, materialInput, videoInput } from "../features/admin/content-validation";

const materialSelect = {
  id: true, courseId: true, number: true, title: true, description: true, status: true,
  course: { select: { title: true } },
  video: { select: { id: true } }, _count: { select: { questions: true } },
} as const;

export async function getAdminMaterials(page: number) {
  await requireAdmin();
  const db = getPrisma();
  const [materials, total, courses] = await Promise.all([
    db.material.findMany({ select: materialSelect, orderBy: [{ courseId: "asc" }, { number: "asc" }], skip: (page - 1) * 20, take: 20 }),
    db.material.count(),
    db.course.findMany({ select: { id: true, title: true }, orderBy: [{ createdAt: "asc" }, { id: "asc" }] }),
  ]);
  return { materials, total, courses };
}

export async function getAdminVideos(page: number) {
  await requireAdmin();
  const db = getPrisma();
  const [videos, total, materials] = await Promise.all([
    db.video.findMany({ select: { id: true, materialId: true, title: true, storagePath: true, durationSeconds: true, status: true,
      material: { select: { number: true, title: true, course: { select: { title: true } } } } },
      orderBy: [{ material: { courseId: "asc" } }, { material: { number: "asc" } }], skip: (page - 1) * 20, take: 20 }),
    db.video.count(),
    db.material.findMany({ select: { id: true, number: true, title: true, course: { select: { title: true } }, video: { select: { id: true } } }, orderBy: [{ courseId: "asc" }, { number: "asc" }] }),
  ]);
  return { videos, total, materials };
}

export async function getLearningCourses() {
  const profile = await requireProfile();
  if (profile.role !== "STUDENT") redirect(getHomePathForRole(profile.role));
  // There is no enrollment model yet: all students can read published materials.
  return getPrisma().course.findMany({
    select: { id: true, title: true, description: true, materials: {
      where: { status: "PUBLISHED" }, orderBy: { number: "asc" },
      select: { id: true, number: true, title: true, description: true },
    } }, orderBy: [{ createdAt: "asc" }, { id: "asc" }],
  });
}

export async function mutateContent(kind: "material" | "video", operation: "save" | "delete", form: FormData) {
  await requireAdmin();
  const id = operation === "delete" || form.get("id") ? identifier(form, "id") : null;
  const db = getPrisma();
  if (operation === "delete") {
    if (kind === "video") {
      await db.video.delete({ where: { id: id! } });
    } else {
      await db.$transaction(async tx => {
        // Lock the parent before checking children so concurrent FK inserts cannot be cascaded away.
        const rows = await tx.$queryRaw<{ id: string }[]>`SELECT id FROM materials WHERE id = ${id}::uuid FOR UPDATE`;
        if (!rows.length) throw new ContentError("Material no longer exists.");
        const [videos, questions] = await Promise.all([
          tx.video.count({ where: { materialId: id! } }), tx.question.count({ where: { materialId: id! } }),
        ]);
        if (videos || questions) throw new ContentError("Remove the related video and unlink questions before deleting this material.");
        await tx.material.delete({ where: { id: id! } });
      });
    }
    return;
  }
  if (kind === "material") {
    const data = materialInput(form);
    await db.$transaction(async tx => {
      if (!await tx.course.findUnique({ where: { id: data.courseId }, select: { id: true } })) throw new ContentError("Course does not exist.");
      if (id) {
        const current = await tx.material.findUnique({ where: { id }, select: { courseId: true } });
        if (!current) throw new ContentError("Material no longer exists.");
        if (current.courseId !== data.courseId) throw new ContentError("An existing material cannot be moved to another course.");
        await tx.material.update({ where: { id }, data });
      } else await tx.material.create({ data });
    });
  } else {
    const data = videoInput(form);
    await db.$transaction(async tx => {
      if (!await tx.material.findUnique({ where: { id: data.materialId }, select: { id: true } })) throw new ContentError("Material does not exist.");
      if (id) await tx.video.update({ where: { id }, data });
      else await tx.video.create({ data });
    });
  }
}

export function contentError(error: unknown) {
  if (error instanceof ContentError) return error.message;
  const code = typeof error === "object" && error !== null && "code" in error ? error.code : null;
  if (code === "P2002") return "That material order or video assignment is already in use.";
  if (code === "P2025") return "The record no longer exists. Refresh and try again.";
  if (code === "P2003" || code === "P2034") return "Related data changed. Refresh and try again.";
  return "Unable to save changes. Please try again.";
}
