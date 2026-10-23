import Link from "next/link";
import type { Metadata } from "next";
import LogoMark from "@/components/logo-mark";

export const metadata: Metadata = {
  title: "Seite nicht gefunden",
};

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-neutral-tint px-6 py-24 text-center">
      <LogoMark size={48} />
      <p className="mt-8 text-[15px] text-ink-soft">Fehler 404</p>
      <h1 className="mt-3 max-w-xl font-display text-[2.25rem] leading-[1.1] font-semibold tracking-tight text-ink md:text-[3rem]">
        Diese Seite gibt es nicht.
      </h1>
      <p className="mt-5 max-w-md text-[17px] leading-relaxed text-ink-soft">
        Vielleicht hat sich die Adresse geändert. Von hier aus geht es
        weiter:
      </p>
      <nav className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-3 text-[15px] font-medium">
        <Link href="/" className="text-accent hover:text-accent-dark">
          Zur Startseite →
        </Link>
        <Link href="/lebendige-fuehrung" className="text-accent hover:text-accent-dark">
          Lebendige Führung →
        </Link>
        <Link href="/blog" className="text-accent hover:text-accent-dark">
          Blog →
        </Link>
      </nav>
    </main>
  );
}
