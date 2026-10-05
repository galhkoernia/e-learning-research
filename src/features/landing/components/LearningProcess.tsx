import { Container } from "@/components/ui/Container";
import { learningData } from "../data";

export function LearningProcess() {
  return (
    <section id="process" className="bg-slate-50 py-24">
      <Container>
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Learning Process
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Satu alur dari pengukuran awal hingga evaluasi akhir.
          </h2>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-5">
          {learningData.process.map((step) => (
            <div
              key={step.number}
              className="relative rounded-2xl border border-slate-200 bg-white p-6"
            >
              <span className="text-sm font-bold text-blue-600">
                {step.number}
              </span>

              <h3 className="mt-5 font-semibold text-slate-900">
                {step.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}