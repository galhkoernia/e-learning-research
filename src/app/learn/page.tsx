import { getLearningCourses } from "@/server/content";
import { logoutAction } from "@/features/auth/actions";
import Link from "next/link";

export default async function LearnPage() {
  const courses = await getLearningCourses();
  return <main className="mx-auto max-w-3xl px-6 py-12">
    <h1 className="text-2xl font-semibold">Learning materials</h1>
    <nav aria-label="Learning" className="mt-4 flex gap-4 text-sm text-blue-700"><Link href="/learn/progress">Progress</Link><Link href="/learn/results">Results</Link></nav>
    {!courses.length && <p className="mt-6 text-slate-600">No courses available yet.</p>}
    {courses.map(course => <section key={course.id} className="mt-8">
      <h2 className="text-xl font-semibold">{course.title}</h2>
      {course.description && <p className="mt-2 whitespace-pre-wrap text-slate-600">{course.description}</p>}
      {!course.materials.length && <p className="mt-4 text-slate-600">No published materials available yet.</p>}
      <div className="mt-4 space-y-4">{course.materials.map(material => <article key={material.id} className="rounded-xl border border-slate-200 bg-white p-5">
        <h3 className="font-semibold">{material.number}. {material.title}</h3>
        <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-600">{material.description || "Content is not available yet."}</p>
      </article>)}</div>
    </section>)}
    <form action={logoutAction} className="mt-8"><button type="submit" className="text-blue-600">Sign out</button></form>
  </main>;
}
