import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { learningData } from "../data";

export function Benefits() {
  return (
    <section className="bg-white py-24">
      <Container>
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Why This Platform
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Dirancang untuk membantu proses belajar menjadi lebih terarah.
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {learningData.benefits.map((benefit, index) => (
            <Card
              key={benefit.title}
              className="p-7 transition-shadow duration-200 hover:shadow-lg hover:shadow-slate-100"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 font-bold text-blue-600">
                0{index + 1}
              </div>

              <h3 className="mt-6 text-xl font-semibold text-slate-900">
                {benefit.title}
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                {benefit.description}
              </p>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}