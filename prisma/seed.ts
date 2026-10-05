import { getPrisma } from "../src/server/db/prisma.ts";
const prisma = getPrisma();
// Stable bootstrap identity prevents duplicates without constraining future titles.
const courseId = "00000000-0000-4000-8000-000000000001";
try {
 await prisma.$transaction(async (tx) => {
  await tx.course.upsert({ where: { id: courseId }, create: { id: courseId, title: "Dasar Sistem Hidrolik" }, update: {} });
  for (const [number, title] of [[1, "Prinsip Kerja dan Komponen Sistem Hidrolik"], [2, "Penerapan Sistem Hidrolik pada Mesin"]] as const) {
   await tx.material.upsert({ where: { courseId_number: { courseId, number } }, create: { courseId, number, title, status: "DRAFT" }, update: {} });
  }
 });
 console.log("Course and materials seeded.");
} catch { console.error("Seed failed. Check database configuration and migrations."); process.exitCode = 1; }
finally { await prisma.$disconnect(); }
