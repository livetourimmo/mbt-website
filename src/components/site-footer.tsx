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
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 text-[13px] text-ink-soft md:flex-row md:items-center md:justify-between md:px-10">
        <p className="flex items-center gap-3">
          <LogoMark size={18} />
          {meta.brand} · Markus Tappolet · {meta.domain}
        </p>
        <nav className="flex gap-6">
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
    </footer>
  );
}
