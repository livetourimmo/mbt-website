"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Segment } from "@/lib/segment";
import { SEGMENT_META, resolveSegmentFromPath } from "@/lib/segment";
import LogoMark from "@/components/logo-mark";
import CtaButton from "@/components/cta-button";

export default function SiteHeader({ segment: initialSegment }: { segment: Segment }) {
  const pathname = usePathname();
  const segment = resolveSegmentFromPath(pathname, initialSegment);
  const meta = SEGMENT_META[segment];

  const doors = [
    { key: "consulting" as const, label: "Consulting" },
    { key: "coaching" as const, label: "Coaching" },
  ];

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
          {doors.map((door) => (
            <Link
              key={door.key}
              href={`/${door.key}`}
              aria-current={segment === door.key ? "page" : undefined}
              className={`relative py-1 transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:h-px after:bg-accent after:transition-all after:duration-300 ${
                segment === door.key
                  ? "text-ink after:w-full"
                  : "hover:text-ink after:w-0 hover:after:w-full"
              }`}
            >
              {door.label}
            </Link>
          ))}
          <Link
            href="/lebendige-fuehrung"
            className="relative py-1 transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-accent after:transition-all after:duration-300 hover:text-ink hover:after:w-full"
          >
            Lebendige Führung
          </Link>
          <Link
            href="/ueber-mich"
            className="relative py-1 transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-accent after:transition-all after:duration-300 hover:text-ink hover:after:w-full"
          >
            Über mich
          </Link>
          <CtaButton href="/kennenlerngespraech" variant="outline">
            Kennenlerngespräch
          </CtaButton>
        </nav>
      </div>
    </header>
  );
}
