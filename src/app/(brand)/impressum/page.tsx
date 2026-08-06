import type { Metadata } from "next";
import { SEGMENT_META } from "@/lib/segment";
import { getSegment } from "@/lib/get-segment.server";

export const metadata: Metadata = {
  title: "Impressum",
};

export default async function ImpressumPage() {
  const segment = await getSegment();
  const meta = SEGMENT_META[segment];

  return (
    <section className="mx-auto max-w-2xl px-6 py-24 md:px-10 md:py-32">
      <h1 className="font-display text-[2rem] font-semibold text-ink">
        Impressum
      </h1>
      <div className="mt-8 space-y-2 text-[16px] leading-relaxed text-ink-soft">
        <p>Markus Tappolet</p>
        <p>{meta.brand}</p>
        <p>{meta.domain}</p>
        <p>
          <a href={`mailto:${meta.email}`} className="hover:text-ink">
            {meta.email}
          </a>
        </p>
      </div>
      <p className="mt-10 text-[14px] text-ink-soft italic">
        Platzhalter — vollständige Angaben (Adresse, Handelsregister) werden
        noch ergänzt.
      </p>
    </section>
  );
}
