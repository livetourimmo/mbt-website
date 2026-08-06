import type { Metadata } from "next";
import { SEGMENT_META } from "@/lib/segment";
import { getSegment } from "@/lib/get-segment.server";

export const metadata: Metadata = {
  title: "Kennenlerngespräch",
  description: "Vereinbare ein unverbindliches Kennenlerngespräch.",
};

export default async function KennenlerngespraechPage() {
  const segment = await getSegment();
  const meta = SEGMENT_META[segment];

  return (
    <section className="mx-auto max-w-2xl px-6 py-24 text-center md:px-10 md:py-32">
      <h1 className="font-display text-[2rem] font-semibold text-ink md:text-[2.5rem]">
        Kennenlerngespräch
      </h1>
      <p className="mt-6 text-[17px] leading-relaxed text-ink-soft">
        Schreib mir eine kurze Nachricht — ich melde mich, um einen Termin für
        ein unverbindliches Gespräch zu finden.
      </p>
      <a
        href={`mailto:${meta.email}`}
        className="mt-8 inline-block rounded-full bg-ink px-8 py-3 text-[15px] font-medium text-paper hover:bg-accent-dark"
      >
        {meta.email}
      </a>
    </section>
  );
}
