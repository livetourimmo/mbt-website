"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Segment } from "@/lib/segment";
import { SEGMENT_META, resolveSegmentFromPath } from "@/lib/segment";
import LogoMark from "@/components/logo-mark";

export default function SiteFooter({ segment: initialSegment }: { segment: Segment }) {
  const pathname = usePathname();
  const segment = resolveSegmentFromPath(pathname, initialSegment);
  const meta = SEGMENT_META[segment];

  return (
    <footer className="border-t border-hairline">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-10 text-[13px] text-ink-soft md:flex-row md:items-start md:justify-between md:px-10">
        <p className="flex items-center gap-3">
          <LogoMark size={18} />
          {meta.brand}, Markus Tappolet, {meta.domain}
        </p>

        <div className="flex flex-col gap-6 sm:flex-row sm:gap-12">
          <div>
            <p className="text-[11px] font-medium tracking-wide text-ink-soft/60 uppercase">
              Angebot
            </p>
            <nav className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5">
              <Link href="/consulting" className="hover:text-ink">
                Consulting
              </Link>
              <Link href="/coaching" className="hover:text-ink">
                Coaching
              </Link>
              <Link href="/kennenlerngespraech" className="hover:text-ink">
                Kennenlerngespräch
              </Link>
            </nav>
          </div>

          <div>
            <p className="text-[11px] font-medium tracking-wide text-ink-soft/60 uppercase">
              Rechtliches
            </p>
            <nav className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5">
              <Link href="/ueber-mich" className="hover:text-ink">
                Über mich
              </Link>
              <Link href="/impressum" className="hover:text-ink">
                Impressum
              </Link>
              <Link href="/datenschutz" className="hover:text-ink">
                Datenschutz
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
