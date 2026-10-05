import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur">
      <Container>
        <nav className="flex h-18 items-center justify-between">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-slate-900"
          >
            E-Learning
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#about"
              className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-600"
            >
              Tentang
            </a>

            <a
              href="#learning"
              className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-600"
            >
              Pembelajaran
            </a>

            <a
              href="#process"
              className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-600"
            >
              Proses
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button>Mulai Belajar</Button>
            </Link>
          </div>
        </nav>
      </Container>
    </header>
  );
}