"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Segment } from "@/lib/segment";
import { SEGMENT_META, resolveSegmentFromPath } from "@/lib/segment";
import LogoMark from "@/components/logo-mark";
import CtaButton from "@/components/cta-button";

// Seiten mit eigenem Abschluss bekommen kein zusätzliches CTA-Band.
const NO_CTA_BAND = ["/kennenlerngespraech", "/lebendige-fuehrung"];

const NAV = [
  {
    title: "Angebot",
    links: [
      { href: "/consulting", label: "Consulting" },
      { href: "/coaching", label: "Coaching" },
      { href: "/lebendige-fuehrung", label: "Lebendige Führung" },
      { href: "/kennenlerngespraech", label: "Kennenlerngespräch" },
    ],
  },
  {
    title: "Mehr",
    links: [
      { href: "/ueber-mich", label: "Über mich" },
      { href: "/blog", label: "Blog" },
      { href: "/impressum", label: "Impressum" },
      { href: "/datenschutz", label: "Datenschutz" },
    ],
  },
];

export default function SiteFooter({ segment: initialSegment }: { segment: Segment }) {
  const pathname = usePathname();
  const segment = resolveSegmentFromPath(pathname, initialSegment);
  const meta = SEGMENT_META[segment];
  const showCta = !NO_CTA_BAND.some((p) => pathname.startsWith(p));

  return (
    <footer className="bg-ink text-paper">
      {showCta && (
        <div className="relative overflow-hidden border-b border-paper/10">
          {/* sanfter Farbverlauf im Markenton */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              background:
                "radial-gradient(60% 120% at 85% 0%, rgba(92,51,105,0.55), transparent 70%)",
            }}
          />
          <div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-6 py-20 md:flex-row md:items-end md:justify-between md:px-10 md:py-24">
            <div className="max-w-2xl">
              <p className="text-[13px] font-medium tracking-[0.18em] text-paper/60 uppercase">
                Kennenlerngespräch
              </p>
              <h2 className="mt-4 font-display text-[2rem] leading-[1.1] font-semibold tracking-tight md:text-[3rem]">
                Lass uns herausfinden, ob wir zueinander passen.
              </h2>
              <p className="mt-5 text-[17px] leading-relaxed text-paper/75">
                Kostenlos und unverbindlich, rund 20 Minuten, telefonisch oder vor Ort.
              </p>
            </div>
            <CtaButton href="/kennenlerngespraech" tone="accent" className="shrink-0 self-start md:self-auto">
              Termin vereinbaren <span aria-hidden>→</span>
            </CtaButton>
          </div>
        </div>
      )}

      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-12 md:px-10">
        <div className="md:col-span-5">
          <Link href="/" className="inline-flex items-center gap-3 font-display text-[17px] font-semibold">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-paper">
              <LogoMark size={24} />
            </span>
            {meta.brand}
          </Link>
          <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-paper/65">
            Markus Tappolet begleitet Unternehmen und Führungspersönlichkeiten
            auf dem Weg zu Lebendiger Führung.
          </p>
          <address className="mt-6 space-y-1 text-[15px] leading-relaxed text-paper/80 not-italic">
            <p>Seestrasse 40, 8330 Pfäffikon ZH</p>
            <p>
              <a href="tel:+41774000107" className="transition-colors hover:text-paper">
                +41 77 400 01 07
              </a>
            </p>
            <p>
              <a href={`mailto:${meta.email}`} className="transition-colors hover:text-paper">
                {meta.email}
              </a>
            </p>
          </address>
        </div>

        {NAV.map((col) => (
          <nav key={col.title} aria-label={col.title} className="md:col-span-3 md:col-start-auto">
            <p className="text-[12px] font-medium tracking-[0.18em] text-paper/50 uppercase">
              {col.title}
            </p>
            <ul className="mt-4 space-y-2.5 text-[15px]">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-paper/80 transition-colors hover:text-paper"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-paper/10">
        <p className="mx-auto max-w-7xl px-6 py-6 text-[13px] text-paper/50 md:px-10">
          © {new Date().getFullYear()} {meta.brand}, Markus Tappolet · {meta.domain}
        </p>
      </div>
    </footer>
  );
}
