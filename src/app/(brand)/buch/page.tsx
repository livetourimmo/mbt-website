import Image from "next/image";
import type { Metadata } from "next";
import SectionText from "@/components/section-text";
import SectionImage from "@/components/section-image";
import ScrollQuote from "@/components/scroll-quote";
import SplitWords from "@/components/split-words";
import Reveal from "@/components/reveal";
import CtaButton from "@/components/cta-button";
import BookFeedbackForm from "@/components/book-feedback-form";
import BookPreview from "@/components/book-preview";

export const metadata: Metadata = {
  title: "Buch «Lebendige Führung»",
  description:
    "Lebendige Führung von Markus Tappolet: Eine Erzählung aus dem Schweizer Unternehmensalltag über die Kräfte, die in jeder Firma im Hintergrund wirken, und wie Führung ihnen bewusst eine Richtung geben kann.",
  alternates: {
    canonical: "https://mbt-consulting.ch/buch",
  },
};

const gedanken = [
  "Bergbauern im Wallis",
  "Die Zünfte",
  "Ameisen und Bäume",
  "Hirnforschung",
  "Wege aus der Praxis",
];

export default function BuchPage() {
  return (
    <div className="register-organic">
      {/* Einstieg: Titel links, Buch rechts. Die Mockups haben weissen Grund,
          mix-blend-multiply legt sie nahtlos auf die Seitenfarbe. */}
      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-12 md:items-center md:gap-8 md:px-10 md:py-24">
        <div className="md:col-span-6">
          <p className="hero-kicker text-[17px] text-ink-soft">Das Buch von Markus Tappolet</p>
          <h1 className="hero-title mt-4 text-[3rem] leading-[1] text-ink md:text-[5rem]">
            <SplitWords text="Lebendige Führung" />
          </h1>
          <p className="hero-lede mt-8 max-w-md font-display text-[20px] leading-snug font-medium text-ink md:text-[23px]">
            Wie werden Unternehmen zu Orten, an denen Menschen mit Begeisterung
            wirken?
          </p>
        </div>
        <div className="img-reveal relative mx-auto aspect-[1600/1846] w-full max-w-md bg-paper md:col-span-6 md:max-w-none">
          <BookPreview />
        </div>
      </section>

      <SectionText heading="Worum es geht">
        <p>
          Susanne, HR-Leiterin der Hunziker Maschinenbau AG, nimmt diese
          Frage von einer Hochtour mit in den Betrieb. Mit ihr entdeckst du
          die Kräfte, die in jeder Firma im Hintergrund am Werk sind, und wie
          Führung ihnen bewusst eine Richtung geben kann.
        </p>
        <p>
          Eine Erzählung aus dem Schweizer Unternehmensalltag, verbunden mit
          Erkenntnissen aus Hirnforschung, Geschichte und Natur und mit Wegen
          aus der Praxis.
        </p>
        <ScrollQuote>
          Für alle, die Führung gestalten und am nächsten Morgen damit
          beginnen möchten.
        </ScrollQuote>
      </SectionText>

      <SectionImage
        heading="Was das Buch sichtbar macht"
        imageSide="left"
        media={
          <div className="bg-paper">
            <Image
              src="/images/buch/buch-stapel.jpg"
              alt="Drei Exemplare von «Lebendige Führung» liegen schräg aufeinander, der Buchrücken mit dem Titel ist gut lesbar."
              width={2000}
              height={1500}
              sizes="(min-width: 768px) 58vw, 100vw"
              className="h-auto w-full mix-blend-multiply"
            />
          </div>
        }
      >
        <p>
          In jedem Unternehmen wirkt mehr als das, was im Organigramm steht.
          Gewachsene Gewohnheiten, alte Prägungen, unausgesprochene Bilder
          davon, wie man hier zusammenarbeitet. Diese Kräfte bleiben meist im
          Hintergrund. Und doch entscheiden sie mit, ob eine gute Idee Wurzeln
          schlägt, ob Verantwortung geteilt wird und ob Menschen am Abend
          erfüllt nach Hause gehen.
        </p>
        <p>
          Lebendige Führung macht diese Kräfte sichtbar. Susanne beobachtet ein
          Jahr lang, wie sie in ihrer Firma wirken: in den Sitzungen der
          Geschäftsleitung, an der Lean-Tafel in der Fertigung, in den
          Gesprächen mit Aaron, dem Inhaber. Sie stellt Fragen, hört zu und
          schafft Raum.
        </p>
        <ScrollQuote>
          Nach und nach zeigt sich, wie viel in Bewegung kommt, wenn Muster
          erkannt und Werte benannt werden und Verantwortung auf mehreren
          Schultern ruht.
        </ScrollQuote>
      </SectionImage>

      {/* Gedanken zur Führung: die Themen zwischen den Kapiteln */}
      <section
        className="border-t border-hairline"
        style={{ background: "var(--color-neutral-tint)" }}
      >
        <Reveal className="mx-auto grid max-w-7xl gap-6 px-6 py-20 md:grid-cols-12 md:gap-10 md:px-10 md:py-28">
          <h2 className="text-[1.9rem] leading-[1.1] text-ink md:col-span-4 md:text-[2.6rem]">
            Gedanken zur Führung
          </h2>
          <div className="max-w-3xl space-y-8 text-[17px] leading-relaxed text-ink-soft md:col-span-7 md:col-start-6">
            <p>
              Zwischen den Kapiteln ordnen «Gedanken zur Führung», was in der
              Geschichte geschieht. Sie führen zu Bergbauern im Wallis und zu
              den Zünften, zu Ameisen und Bäumen, zur Hirnforschung und zu
              Wegen aus der Praxis.
            </p>
            {/* Dieselben Themen wie im Satz davor, nur als Bild: für Screenreader ausgeblendet */}
            <ul aria-hidden className="border-t border-ink/15">
              {gedanken.map((thema, i) => (
                <li
                  key={thema}
                  className="flex items-baseline gap-6 border-b border-ink/15 py-4"
                >
                  <span className="w-6 text-[13px] text-accent tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-display text-[19px] text-ink md:text-[21px]">
                    {thema}
                  </span>
                </li>
              ))}
            </ul>
            <ScrollQuote>
              So entsteht ein Bild davon, wie Führung den verborgenen Kräften
              eine Richtung geben kann, ruhig, bewusst und aus dem Unternehmen
              selbst heraus.
            </ScrollQuote>
          </div>
        </Reveal>
      </section>

      {/* Abschluss: Einladung von der Buchrückseite */}
      <section className="border-t border-hairline">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 md:grid-cols-12 md:items-center md:gap-12 md:px-10 md:py-28">
          <Reveal className="relative mx-auto aspect-[1600/1548] w-full max-w-sm bg-paper md:col-span-5 md:max-w-none">
            <Image
              src="/images/buch/buch-liegend.jpg"
              alt="Das Buch «Lebendige Führung» liegt schräg, der Umschlag mit dem Mann auf der Herbstwiese und der Buchrücken mit dem Titel sind zu sehen."
              fill
              sizes="(min-width: 768px) 40vw, 100vw"
              className="object-contain mix-blend-multiply"
            />
          </Reveal>
          <Reveal className="md:col-span-6 md:col-start-7">
            <h2 className="text-[2.1rem] leading-[1.1] text-ink md:text-[3rem]">
              Ich lade dich ein, mit Susanne aufzubrechen.
            </h2>
            <p className="mt-5 text-[17px] text-ink-soft">Markus</p>
            <div className="mt-10">
              <CtaButton href="/lebendige-fuehrung" tone="accent">
                Lebendige Führung kennenlernen
              </CtaButton>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Feedback von Leserinnen und Lesern */}
      <section
        id="feedback"
        className="border-t border-hairline"
        style={{ background: "var(--color-neutral-tint)" }}
      >
        <Reveal className="mx-auto grid max-w-7xl gap-8 px-6 py-20 md:grid-cols-12 md:gap-10 md:px-10 md:py-28">
          <div className="md:col-span-4">
            <h2 className="text-[1.9rem] leading-[1.1] text-ink md:text-[2.6rem]">
              Dein Feedback zum Buch
            </h2>
            <p className="mt-5 max-w-sm text-[17px] leading-relaxed text-ink-soft">
              Hast du «Lebendige Führung» gelesen? Ich freue mich zu hören, was
              dich angesprochen hat, was dich zum Nachdenken gebracht hat oder
              was dir gefehlt hat.
            </p>
          </div>
          <BookFeedbackForm className="max-w-2xl md:col-span-7 md:col-start-6" />
        </Reveal>
      </section>
    </div>
  );
}
