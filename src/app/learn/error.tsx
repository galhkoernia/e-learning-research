"use client";

export default function LearnError({ reset }: { reset: () => void }) {
  return <main className="mx-auto max-w-3xl px-6 py-12" role="alert">
    <h1 className="text-xl font-semibold">Unable to load learning materials</h1>
    <p className="mt-2 text-slate-600">Please try again.</p>
    <button onClick={reset} className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white">Try again</button>
  </main>;
}
