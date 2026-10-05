import Link from "next/link";
import { Container } from "@/components/ui/Container";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <Container>
        <div className="flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/"
              className="font-bold text-slate-900"
            >
              E-Learning
            </Link>

            <p className="mt-2 text-sm text-slate-500">
              Platform pembelajaran berbasis visual dan evaluasi terarah.
            </p>
          </div>

          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} E-Learning. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}