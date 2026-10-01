import Image from "next/image";
import type { Metadata } from "next";
import { getSegment } from "@/lib/get-segment.server";
import { SEGMENT_META } from "@/lib/segment";
import ContactForm from "@/components/contact-form";
import SplitWords from "@/components/split-words";

export const metadata: Metadata = {
  title: "Kennenlerngespräch",
  description: "Vereinbare ein unverbindliches Kennenlerngespräch.",
  alternates: { canonical: "/kennenlerngespraech" },
};

const vorteile = [
  "Kostenlos und unverbindlich",
  "Rund 20 Minuten, telefonisch oder vor Ort",
  "Vertraulich",
] as const;

export default async function KennenlerngespraechPage() {
  const segment = await getSegment();
  const meta = SEGMENT_META[segment];
  const tone = segment === "coaching" ? "accent" : "ink";

  return (
    <section
      className="border-t border-hairline"
      style={{ background: meta.tint }}
    >
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-12 md:gap-10 md:px-10 md:py-24 lg:py-28">
        <div className="img-reveal relative aspect-[4/5] overflow-hidden rounded-3xl md:aspect-auto md:col-span-5">
          <Image
            src="/images/portrait-polo.jpg"
            alt="Porträt von Markus Tappolet"
            fill
            sizes="(min-width: 768px) 40vw, 100vw"
            className="object-cover object-[50%_25%]"
          />
        </div>

        <div className="md:col-span-7">
          <p className="hero-kicker text-[15px] text-ink-soft">Kennenlerngespräch</p>
          <h1 className="hero-title mt-3 font-display text-[2.25rem] leading-[1.08] font-semibold tracking-tight text-ink md:text-[3rem]">
            <SplitWords text="Lass uns herausfinden, ob wir zueinander passen." />
          </h1>
          <p className="hero-lede mt-5 max-w-lg text-[17px] leading-relaxed text-ink-soft">
            Schreib mir eine kurze Nachricht — ich melde mich, um gemeinsam
            mit dir einen Termin für ein unverbindliches Gespräch zu finden.
          </p>

          <ul className="hero-lede mt-6 space-y-2">
            {vorteile.map((v) => (
              <li
                key={v}
                className="flex items-center gap-2 text-[14px] text-ink-soft"
              >
                <span aria-hidden className="text-accent">
                  —
                </span>
                {v}
              </li>
            ))}
          </ul>

          <div className="hero-lede mt-8 rounded-3xl border border-hairline bg-paper p-6 shadow-[0_24px_60px_-32px_rgba(31,44,87,0.3)] md:p-8">
            <ContactForm segment={segment} tone={tone} />
            <p className="mt-4 text-[13px] text-ink-soft">
              Ich melde mich innerhalb von 2 Werktagen bei dir, um einen
              Termin zu finden.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
