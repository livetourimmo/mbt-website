import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Datenschutz",
};

export default function DatenschutzPage() {
  return (
    <section className="mx-auto max-w-2xl px-6 py-24 md:px-10 md:py-32">
      <h1 className="font-display text-[2rem] font-semibold text-ink">
        Datenschutz
      </h1>
      <p className="mt-8 text-[16px] leading-relaxed text-ink-soft italic">
        Platzhalter — die Datenschutzerklärung wird noch ergänzt.
      </p>
    </section>
  );
}
