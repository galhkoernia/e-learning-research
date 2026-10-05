import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { learningData } from "../data";

export function Hero() {
  const { course } = learningData;

  return (
    <section className="overflow-hidden bg-linear-to-b from-blue-50 to-white">
      <Container>
        <div className="grid min-h-170 items-center gap-16 py-20 lg:grid-cols-2 lg:py-24">
          <div>
            <Badge>Platform Pembelajaran</Badge>

            <h1 className="mt-6 max-w-3xl text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Belajar konsep teknis dengan cara yang lebih
              <span className="text-blue-600"> terstruktur.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Platform pembelajaran yang menggabungkan materi,
              visualisasi, video, dan evaluasi untuk membantu
              peserta memahami konsep secara bertahap.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/login">
                <Button className="px-6 py-3.5">
                  Mulai Belajar
                </Button>
              </Link>

              <a href="#learning">
                <Button variant="secondary" className="px-6 py-3.5">
                  Lihat Materi
                </Button>
              </a>
            </div>

            <div className="mt-10 flex flex-wrap gap-8 border-t border-slate-200 pt-8">
              <div>
                <p className="text-2xl font-bold text-slate-900">5</p>
                <p className="mt-1 text-sm text-slate-500">
                  Tahap Pembelajaran
                </p>
              </div>

              <div>
                <p className="text-2xl font-bold text-slate-900">Visual</p>
                <p className="mt-1 text-sm text-slate-500">
                  Pendekatan Pembelajaran
                </p>
              </div>

              <div>
                <p className="text-2xl font-bold text-slate-900">
                  Terarah
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Sistem Evaluasi
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative mx-auto max-w-xl">
              <div className="aspect-4/3 overflow-hidden rounded-3xl border border-blue-100 bg-white p-5 shadow-xl shadow-blue-100/50">
                <div className="flex h-full flex-col rounded-2xl bg-slate-50 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                        Featured Learning
                      </p>

                      <h2 className="mt-2 text-2xl font-bold text-slate-900">
                        {course.title}
                      </h2>
                    </div>

                    <Badge>{course.level}</Badge>
                  </div>

                  <div className="mt-8 flex-1 rounded-2xl border border-slate-200 bg-white p-6">
                    <div className="flex h-full items-center justify-center">
                      <div className="w-full max-w-sm">
                        <div className="h-3 rounded-full bg-blue-100" />
                        <div className="mt-3 h-3 w-4/5 rounded-full bg-blue-100" />
                        <div className="mt-8 grid grid-cols-3 gap-3">
                          <div className="h-24 rounded-xl bg-blue-50" />
                          <div className="h-24 rounded-xl bg-blue-100" />
                          <div className="h-24 rounded-xl bg-blue-50" />
                        </div>
                        <div className="mt-5 h-28 rounded-xl bg-slate-100" />
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-sm text-slate-500">
                      {course.category}
                    </span>

                    <span className="text-sm font-semibold text-blue-600">
                      Learning Preview
                    </span>
                  </div>
                </div>
              </div>

              <div className="absolute -right-5 -top-5 hidden rounded-2xl border border-blue-100 bg-white px-5 py-4 shadow-lg sm:block">
                <p className="text-xs text-slate-500">
                  Learning Method
                </p>
                <p className="mt-1 font-semibold text-slate-900">
                  Structured
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}