import "server-only";
import { requireAdmin } from "./auth/session";
import { getPrisma } from "./db/prisma";
import { ContentError, identifier } from "../features/admin/content-validation";
import {
  questionFilters,
  questionInput,
  type QuestionSearch,
} from "../features/admin/question-validation";

const questionSelect = {
  id: true,
  courseId: true,
  materialId: true,
  assessment: true,
  position: true,
  text: true,
  type: true,
  status: true,
  course: { select: { title: true } },
  material: { select: { title: true, number: true } },
  options: {
    select: { id: true, position: true, label: true, isCorrect: true },
    orderBy: { position: "asc" },
  },
} as const;

export async function getAdminQuestions(search: QuestionSearch) {
  await requireAdmin();
  const { page, ...where } = questionFilters(search);
  const db = getPrisma();
  const [questions, total, courses, materials] = await Promise.all([
    db.question.findMany({
      where,
      select: questionSelect,
      orderBy: [
        { courseId: "asc" },
        { assessment: "asc" },
        { position: "asc" },
      ],
      skip: (page - 1) * 20,
      take: 20,
    }),
    db.question.count({ where }),
    db.course.findMany({
      select: { id: true, title: true },
      orderBy: [{ createdAt: "asc" }, { id: "asc" }],
    }),
    db.material.findMany({
      select: { id: true, courseId: true, number: true, title: true },
      orderBy: [{ courseId: "asc" }, { number: "asc" }],
    }),
  ]);
  return { questions, total, courses, materials, page, filters: where };
}

export async function getAdminQuestion(id: string) {
  await requireAdmin();
  const form = new FormData();
  form.set("id", id);
  return getPrisma().question.findUnique({
    where: { id: identifier(form, "id") },
    select: questionSelect,
  });
}

export async function saveQuestion(form: FormData) {
  await requireAdmin();
  const id = form.has("id") ? identifier(form, "id") : null;
  const { options, ...data } = questionInput(form);
  if (!id && options.some((option) => option.id))
    throw new ContentError(
      "New questions cannot reuse existing option identifiers.",
    );
  await getPrisma().$transaction(
    async (tx) => {
      if (
        !(await tx.course.findUnique({
          where: { id: data.courseId },
          select: { id: true },
        }))
      )
        throw new ContentError("Course does not exist.");
      if (data.materialId) {
        const material = await tx.material.findUnique({
          where: { id: data.materialId },
          select: { courseId: true },
        });
        if (!material || material.courseId !== data.courseId)
          throw new ContentError(
            "Select a material from the question's course.",
          );
      }
      if (id) {
        const current = await tx.question.findUnique({
          where: { id },
          select: { options: { select: { id: true } } },
        });
        if (!current) throw new ContentError("Question no longer exists.");
        const ownedIds = new Set(current.options.map((option) => option.id));
        if (options.some((option) => option.id && !ownedIds.has(option.id)))
          throw new ContentError(
            "An answer option does not belong to this question.",
          );
        // Replace the submitted option set atomically, preserving IDs that remain in the form.
        // Deleting first also avoids unique-position collisions when an option is removed.
        await tx.questionOption.deleteMany({ where: { questionId: id } });
        await tx.question.update({
          where: { id },
          data: {
            ...data,
            options: {
              create: options.map((option, index) => ({
                ...option,
                position: index + 1,
              })),
            },
          },
        });
      } else {
        await tx.question.create({
          data: {
            ...data,
            options: {
              create: options.map((option, index) => ({
                ...option,
                position: index + 1,
              })),
            },
          },
        });
      }
    },
    { isolationLevel: "Serializable" },
  );
}

export async function deleteQuestion(form: FormData) {
  await requireAdmin();
  const id = identifier(form, "id");
  // The current schema only cascades owned options; there are no attempts or submitted answers.
  await getPrisma().question.delete({ where: { id } });
}

export function questionError(error: unknown) {
  if (error instanceof ContentError) return error.message;
  const code =
    typeof error === "object" && error !== null && "code" in error
      ? error.code
      : null;
  if (code === "P2002")
    return "That question order is already in use for this course and assessment.";
  if (code === "P2025")
    return "Question no longer exists. Refresh and try again.";
  if (code === "P2003")
    return "Related data changed or prevents deletion. Refresh and try again.";
  if (code === "P2034")
    return "This question was changed concurrently. Refresh and try again.";
  return "Unable to save question changes. Please try again.";
}
