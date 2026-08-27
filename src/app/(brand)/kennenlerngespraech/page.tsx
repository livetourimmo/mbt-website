import type { Metadata } from "next";
import { getSegment } from "@/lib/get-segment.server";
import ContactForm from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Kennenlerngespräch",
  description: "Vereinbare ein unverbindliches Kennenlerngespräch.",
};

export default async function KennenlerngespraechPage() {
  const segment = await getSegment();

  return (
    <section className="mx-auto max-w-lg px-6 py-24 text-center md:px-10 md:py-32">
      <h1 className="font-display text-[2rem] font-semibold text-ink md:text-[2.5rem]">
        Kennenlerngespräch
      </h1>
      <p className="mt-6 text-[17px] leading-relaxed text-ink-soft">
        Schreib mir eine kurze Nachricht — ich melde mich, um einen Termin für
        ein unverbindliches Gespräch zu finden.
      </p>
      <ContactForm
        segment={segment}
        tone={segment === "coaching" ? "accent" : "ink"}
        className="mt-8 text-left"
      />
    </section>
  );
}
