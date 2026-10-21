import Link from "next/link";
import { Button } from "@/features/admin/components/Button";
import { DataTable, type Column } from "@/features/admin/components/DataTable";
import { PageHeader } from "@/features/admin/components/PageHeader";
import { Panel } from "@/features/admin/components/Panel";
import { StatusBadge } from "@/features/admin/components/StatusBadge";
import {
  DeleteQuestion,
  QuestionForm,
} from "@/features/admin/components/QuestionForm";
import {
  ASSESSMENTS,
  ASSESSMENT_LABELS,
  type QuestionSearch,
} from "@/features/admin/question-validation";
import { getAdminQuestions } from "@/server/questions";

export const metadata = { title: "Questions" };

const filterClass =
  "min-h-11 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm";

export default async function QuestionsPage({
  searchParams,
}: {
  searchParams: Promise<QuestionSearch>;
}) {
  const { questions, total, courses, materials, page, filters } =
    await getAdminQuestions(await searchParams);
  type Row = (typeof questions)[number];
  const columns: Column<Row>[] = [
    { header: "No.", cell: (q) => q.position, className: "w-16" },
    {
      header: "Question",
      cell: (q) => (
        <div>
          <p className="whitespace-pre-wrap text-slate-900">{q.text}</p>
          <p className="mt-1 text-xs text-slate-500">{q.course.title}</p>
          <details className="mt-2">
            <summary className="cursor-pointer text-xs text-blue-700">
              Answer options ({q.options.length})
            </summary>
            <ol className="mt-2 list-[upper-alpha] space-y-1 pl-5">
              {q.options.map((option) => (
                <li key={option.id} className="whitespace-pre-wrap">
                  {option.label}
                  {option.isCorrect && (
                    <span className="ml-2 font-medium text-emerald-700">
                      (Correct)
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </details>
        </div>
      ),
      className: "min-w-72",
    },
    {
      header: "Type",
      cell: (q) => (q.type === "TRUE_FALSE" ? "True/False" : "Multiple choice"),
    },
    {
      header: "Related material",
      cell: (q) =>
        q.material
          ? `${q.material.number}. ${q.material.title}`
          : "All materials in course",
    },
    {
      header: "Status",
      cell: (q) => (
        <StatusBadge
          status={q.status === "PUBLISHED" ? "Published" : "Draft"}
        />
      ),
    },
    {
      header: "Actions",
      cell: (q) => (
        <div className="space-y-2">
          <QuestionForm courses={courses} materials={materials} value={q} />
          <DeleteQuestion id={q.id} />
        </div>
      ),
      className: "min-w-56",
    },
  ];
  const pageHref = (target: number) => {
    const query = new URLSearchParams({ page: String(target) });
    for (const [key, value] of Object.entries(filters))
      if (value) query.set(key, value);
    return `/admin/questions?${query}`;
  };
  return (
    <>
      <PageHeader
        title="Questions"
        description="Manage questions for the pre-test, quizzes, and post-test."
        action={
          courses.length ? (
            <QuestionForm courses={courses} materials={materials} />
          ) : undefined
        }
      />
      {!courses.length && (
        <p className="mb-4 text-sm text-slate-600">
          No courses available. Configure a course before adding questions.
        </p>
      )}
      <form method="get" className="mb-6 flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1 text-sm">
          Assessment
          <select
            name="assessment"
            defaultValue={filters.assessment ?? ""}
            className={filterClass}
          >
            <option value="">All assessments</option>
            {ASSESSMENTS.map((assessment) => (
              <option key={assessment} value={assessment}>
                {ASSESSMENT_LABELS[assessment]}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Course
          <select
            name="courseId"
            defaultValue={filters.courseId ?? ""}
            className={filterClass}
          >
            <option value="">All courses</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Material
          <select
            name="materialId"
            defaultValue={filters.materialId ?? ""}
            className={filterClass}
          >
            <option value="">All materials</option>
            {materials.map((material) => (
              <option key={material.id} value={material.id}>
                {
                  courses.find((course) => course.id === material.courseId)
                    ?.title
                }{" "}
                / {material.number}. {material.title}
              </option>
            ))}
          </select>
        </label>
        <Button type="submit" variant="primary">
          Filter
        </Button>
        <Link href="/admin/questions" className="py-2 text-sm text-blue-700">
          Reset
        </Link>
      </form>
      <div className="space-y-6">
        {ASSESSMENTS.filter(
          (assessment) =>
            !filters.assessment || assessment === filters.assessment,
        ).map((assessment) => {
          const rows = questions.filter(
            (question) => question.assessment === assessment,
          );
          return (
            <Panel
              key={assessment}
              title={`${ASSESSMENT_LABELS[assessment]} (${rows.length} on this page)`}
            >
              <DataTable
                columns={columns}
                rows={rows}
                getRowKey={(question) => question.id}
                emptyMessage="No questions on this page. Add a question or adjust the filters."
              />
            </Panel>
          );
        })}
      </div>
      <nav
        aria-label="Question pagination"
        className="mt-6 flex items-center gap-4 text-sm text-blue-700"
      >
        {page > 1 && <Link href={pageHref(page - 1)}>Previous</Link>}
        <span className="text-slate-600">
          Page {page} · {total} questions
        </span>
        {page * 20 < total && <Link href={pageHref(page + 1)}>Next</Link>}
      </nav>
    </>
  );
}
