import Link from "next/link";
import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";

import { Container } from "@/components/ui/Container";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <Container>
        <div className="flex flex-col gap-8 py-10 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <Link
              href="/"
              className="text-lg font-bold tracking-tight text-slate-900"
            >
              E-Learning
            </Link>

            <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
              Platform pembelajaran berbasis visual dan evaluasi terarah.
            </p>

            <p className="mt-4 text-xs text-slate-400">
              Designed & Developed by{" "}
              <a
                href="https://www.galhkoernia.my.id/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-slate-700 transition-colors hover:text-slate-950 hover:underline"
              >
                galhkoernia
              </a>
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:items-end">
            
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/galhkoernia"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="text-slate-400 transition-all hover:-translate-y-0.5 hover:text-slate-900"
              >
                <FaGithub className="h-5 w-5" />
              </a>

              <a
                href="https://www.linkedin.com/in/galuh-kurnia-pratama-a25b9b325"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-slate-400 transition-all hover:-translate-y-0.5 hover:text-slate-900"
              >
                <FaLinkedin className="h-5 w-5" />
              </a>

              <a
                href="https://www.instagram.com/galhkoernia_/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-slate-400 transition-all hover:-translate-y-0.5 hover:text-slate-900"
              >
                <FaInstagram className="h-5 w-5" />
              </a>
            </div>

            <p className="text-xs text-slate-400">
              © {new Date().getFullYear()} E-Learning. All rights reserved.
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}