"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Segment } from "@/lib/segment";
import { SEGMENT_META, resolveSegmentFromPath } from "@/lib/segment";
import LogoMark from "@/components/logo-mark";
import CtaButton from "@/components/cta-button";

const NAV_LINKS = [
  { href: "/consulting", label: "Consulting" },
  { href: "/coaching", label: "Coaching" },
  { href: "/lebendige-fuehrung", label: "Lebendige Führung" },
  { href: "/ueber-mich", label: "Über mich" },
];

export default function SiteHeader({ segment: initialSegment }: { segment: Segment }) {
  const pathname = usePathname();
  const segment = resolveSegmentFromPath(pathname, initialSegment);
  const meta = SEGMENT_META[segment];

  return (
    <header className="sticky top-0 z-50 border-b border-hairline bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-6 md:flex-row md:items-center md:justify-between md:px-10">
        <Link
          href="/"
          className="group flex items-center gap-3 font-display text-[15px] font-semibold tracking-tight text-ink"
        >
          <LogoMark
            size={30}
            className="transition-transform duration-500 ease-out group-hover:rotate-45"
          />
          {meta.brand}
        </Link>

        <nav className="flex flex-wrap items-center gap-x-7 gap-y-2 text-[14px] text-ink-soft">
          {NAV_LINKS.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`relative py-1 transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:h-px after:bg-accent after:transition-all after:duration-300 ${
                  active
                    ? "text-ink after:w-full"
                    : "hover:text-ink after:w-0 hover:after:w-full"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <CtaButton href="/kennenlerngespraech" variant="outline">
            Kennenlerngespräch
          </CtaButton>
        </nav>
      </div>
    </header>
  );
}
