import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export function CTA() {
  return (
    <section className="bg-white py-24">
      <Container>
        <div className="overflow-hidden rounded-3xl bg-blue-600 px-7 py-14 text-center sm:px-12">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-100">
            Start Learning
          </p>

          <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Mulai proses pembelajaran Anda sekarang.
          </h2>

          <p className="mx-auto mt-5 max-w-xl leading-7 text-blue-100">
            Ikuti pembelajaran secara bertahap, pahami materi,
            dan ukur perkembangan pemahaman Anda.
          </p>

          <div className="mt-8">
            <Link href="/login">
              <Button
                className="
                  border-white!
                  bg-white!
                  text-blue-700!
                  shadow-sm
                  hover:bg-blue-50!
                  hover:text-blue-800!
                "
              >
                Mulai Belajar
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}