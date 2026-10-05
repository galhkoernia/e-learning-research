import { Container } from "@/components/ui/Container";

export function AboutLearning() {
  return (
    <section id="about" className="bg-slate-50 py-24">
      <Container>
        <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              About Learning
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Pembelajaran tidak berhenti pada membaca materi.
            </h2>
          </div>

          <div className="space-y-5 text-lg leading-8 text-slate-600">
            <p>
              Platform ini dirancang untuk memberikan pengalaman belajar
              yang mengikuti tahapan pemahaman peserta, mulai dari
              mengetahui kemampuan awal hingga mengevaluasi hasil
              pembelajaran.
            </p>

            <p>
              Materi, visualisasi, video, dan evaluasi ditempatkan dalam
              satu alur sehingga peserta dapat memahami konsep secara
              bertahap dan terukur.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}