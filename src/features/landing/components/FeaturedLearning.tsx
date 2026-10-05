import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { learningData } from "../data";

export function FeaturedLearning() {
  const { course, materials } = learningData;

  return (
    <section id="learning" className="bg-white py-24">
      <Container>
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Featured Learning
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Materi pembelajaran pilihan
            </h2>
          </div>

          <Badge>{course.category}</Badge>
        </div>

        <Card className="mt-12 overflow-hidden">
          <div className="grid lg:grid-cols-[0.8fr_1.2fr]">
            <div className="bg-blue-600 p-8 text-white sm:p-10">
              <Badge className="bg-white/15 text-white">
                {course.level}
              </Badge>

              <h3 className="mt-6 text-3xl font-bold">
                {course.title}
              </h3>

              <p className="mt-4 leading-7 text-blue-50">
                {course.description}
              </p>

              <div className="mt-8 h-px bg-white/20" />

              <p className="mt-5 text-sm text-blue-100">
                {materials.length} materi pembelajaran tersedia
              </p>
            </div>

            <div className="p-8 sm:p-10">
              <div className="space-y-5">
                {materials.map((material) => (
                  <div
                    key={material.id}
                    className="flex gap-5 border-b border-slate-100 pb-5 last:border-0 last:pb-0"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-sm font-bold text-blue-600">
                      {material.number}
                    </div>

                    <div>
                      <h4 className="font-semibold text-slate-900">
                        {material.title}
                      </h4>

                      <p className="mt-1 text-sm leading-6 text-slate-500">
                        {material.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </Container>
    </section>
  );
}