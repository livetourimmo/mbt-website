"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Segment } from "@/lib/segment";
import { SEGMENT_META, resolveSegmentFromPath } from "@/lib/segment";
import LogoMark from "@/components/logo-mark";

export default function SiteHeader({ segment: initialSegment }: { segment: Segment }) {
  const pathname = usePathname();
  const segment = resolveSegmentFromPath(pathname, initialSegment);
  const meta = SEGMENT_META[segment];

  const doors = [
    { key: "consulting" as const, label: "Consulting" },
    { key: "coaching" as const, label: "Coaching" },
  ];

  return (
    <header className="border-b border-hairline">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-6 md:flex-row md:items-center md:justify-between md:px-10">
        <Link
          href="/"
          className="flex items-center gap-3 font-display text-[15px] font-semibold tracking-tight text-ink"
        >
          <LogoMark size={30} />
          {meta.brand}
        </Link>

        <nav className="flex flex-wrap items-center gap-x-7 gap-y-2 text-[14px] text-ink-soft">
          {doors.map((door) => (
            <Link
              key={door.key}
              href={`/${door.key}`}
              aria-current={segment === door.key ? "page" : undefined}
              className={
                segment === door.key
                  ? "text-ink"
                  : "hover:text-ink"
              }
            >
              {door.label}
            </Link>
          ))}
          <Link href="/lebendige-fuehrung" className="hover:text-ink">
            Lebendige Führung
          </Link>
          <Link href="/ueber-mich" className="hover:text-ink">
            Über mich
          </Link>
          <Link
            href="/kennenlerngespraech"
            className="rounded-full border border-hairline px-4 py-2 text-ink hover:border-accent hover:text-accent"
          >
            Kennenlerngespräch
          </Link>
        </nav>
      </div>
    </header>
  );
}
