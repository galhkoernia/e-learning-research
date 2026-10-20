import "server-only";
import { requireAdmin, requireProfile } from "./auth/session";
import { getPrisma } from "./db/prisma";
import { redirect } from "next/navigation";
import { getHomePathForRole } from "./auth/redirects";
import { identifier } from "../features/admin/content-validation";
import { participantFilters, type ParticipantSearch } from "../features/reporting/validation";

const participantSelect = { id: true, fullName: true, email: true, createdAt: true } as const;

export async function getDashboardSummary() {
  await requireAdmin();
  const db = getPrisma();
  const [participants, courses, materials, publishedMaterials, videos, publishedVideos, questions, publishedQuestions, recentParticipants] = await Promise.all([
    db.profile.count({ where: { role: "STUDENT" } }), db.course.count(),
    db.material.count(), db.material.count({ where: { status: "PUBLISHED" } }),
    db.video.count(), db.video.count({ where: { status: "PUBLISHED" } }),
    db.question.count(), db.question.count({ where: { status: "PUBLISHED" } }),
    db.profile.findMany({ where: { role: "STUDENT" }, select: participantSelect, orderBy: [{ createdAt: "desc" }, { id: "asc" }], take: 5 }),
  ]);
  return { participants, courses, materials, publishedMaterials, videos, publishedVideos, questions, publishedQuestions, recentParticipants };
}

export async function getParticipants(search: ParticipantSearch) {
  await requireAdmin();
  const { page, q } = participantFilters(search);
  const where = {
    role: "STUDENT" as const,
    ...(q ? { OR: [
      { fullName: { contains: q, mode: "insensitive" as const } },
      { email: { contains: q, mode: "insensitive" as const } },
    ] } : {}),
  };
  const db = getPrisma();
  const [participants, total] = await Promise.all([
    db.profile.findMany({ where, select: participantSelect, orderBy: [{ createdAt: "desc" }, { id: "asc" }], skip: (page - 1) * 20, take: 20 }),
    db.profile.count({ where }),
  ]);
  return { participants, total, page, q };
}

export async function getParticipant(id: string) {
  await requireAdmin();
  const form = new FormData();
  form.set("id", id);
  const participantId = identifier(form, "id");
  return getPrisma().profile.findFirst({ where: { id: participantId, role: "STUDENT" }, select: participantSelect });
}

export async function getStudentReportingIdentity() {
  const profile = await requireProfile();
  if (profile.role !== "STUDENT") redirect(getHomePathForRole(profile.role));
  // No user ID is accepted from the client. Assessment persistence is not present yet.
  return { id: profile.id };
}
