import type { Metadata } from "next";
import { SEGMENT_META } from "@/lib/segment";
import { getSegment } from "@/lib/get-segment.server";

export const metadata: Metadata = {
  title: "Impressum",
  alternates: { canonical: "/impressum" },
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
        <p>MBT-Consulting Tappolet</p>
        <p>Einzelfirma, Inhaber: Markus Tappolet</p>
        <p>Seestrasse 40</p>
        <p>8330 Pfäffikon ZH</p>
        <p>Schweiz</p>
        <p>
          <a href={`mailto:${meta.email}`} className="hover:text-ink">
            {meta.email}
          </a>
        </p>
        <p>
          <a href="tel:+41774000107" className="hover:text-ink">
            +41 77 400 01 07
          </a>
        </p>
      </div>

      <h2 className="mt-10 font-display text-[1.25rem] font-semibold text-ink">
        Handelsregister
      </h2>
      <div className="mt-4 space-y-2 text-[16px] leading-relaxed text-ink-soft">
        <p>Handelsregisteramt des Kantons Zürich</p>
        <p>UID: CHE-473.774.364</p>
      </div>

      <h2 className="mt-10 font-display text-[1.25rem] font-semibold text-ink">
        Verantwortlich für den Inhalt
      </h2>
      <p className="mt-4 text-[16px] leading-relaxed text-ink-soft">
        Markus Tappolet, {meta.domain}
      </p>
    </section>
  );
}
