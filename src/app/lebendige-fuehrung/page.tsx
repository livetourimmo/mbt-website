import type { Metadata } from "next";
import { Container, CTAButton } from "@/components/ui";
import BookPages from "@/components/book-pages";
import BreathLine from "@/components/breath-line";
import SeedMotif from "@/components/seed-motif";
import SectionMark from "@/components/section-mark";
import ImagePlate from "@/components/image-plate";

export const metadata: Metadata = {
  title: "Lebendige Führung",
  description:
    "Verantwortung wirkungsvoll übergeben. Lebendige Führung ist der gemeinsame Kern von MBT-Consulting und MBT-Coaching — eine Führung, die wächst statt gebaut wird.",
};

export default function LebendigeFuehrungPage() {
  return (
    <div className="bg-paper">
      {/* Hero — bildgeführt, asymmetrisch */}
      <section
        className="relative"
        style={{
          background:
            "radial-gradient(120% 100% at 15% 0%, var(--color-neutral-tint) 0%, var(--color-paper) 62%)",
        }}
      >
        <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
          <div className="flex flex-col justify-center px-6 pt-24 pb-16 sm:px-8 lg:pt-32 lg:pb-24 lg:pl-16 xl:pl-24">
            <span className="animate-rise block font-serif text-lg italic text-ink-soft/70">
              I
            </span>
            <h1
              className="animate-rise mt-5 max-w-xl font-serif text-[clamp(2.6rem,5.4vw,4.4rem)] italic leading-[1.06] text-ink"
              style={{ animationDelay: "0.1s" }}
            >
              Verantwortung wirkungsvoll übergeben
            </h1>
            <p
              className="animate-rise mt-8 max-w-md text-lg leading-relaxed text-ink-soft"
              style={{ animationDelay: "0.22s" }}
            >
              Wo übertragen wir Verantwortung in guter Absicht und gehen davon aus, dass sie
              damit auch übernommen wird? Häufig erwarten wir, dass jemand eigenständig
              handelt und dennoch so entscheidet, wie wir es selbst für richtig halten.
            </p>
          </div>
          <ImagePlate
            tone="warm"
            caption="Markus Tappolet — Porträtfoto folgt"
            className="min-h-[340px] lg:min-h-[680px]"
          />
        </div>
      </section>

      {/* Intro — ausbrechende Frage */}
      <section className="py-28 lg:py-36">
        <Container>
          <SectionMark index={2} />
          <p className="mt-6 max-w-3xl font-display text-[clamp(1.9rem,4vw,3.1rem)] font-medium leading-[1.14] text-ink lg:-ml-16 xl:-ml-24">
            Was braucht ein Mensch, damit er Verantwortung übernimmt und im Sinne des Ganzen
            eigene Entscheidungen treffen kann?
          </p>

          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:ml-auto lg:max-w-2xl">
            <p className="text-[17px] leading-relaxed text-ink-soft">
              Lebendige Führung geht davon aus, dass ein Mensch in Verantwortung
              hineinwachsen darf. Die Fähigkeit dazu trägt er bereits in sich. Damit sie sich
              entwickeln kann, braucht es Bedingungen, die ihm Orientierung geben.
            </p>
            <p className="text-[17px] leading-relaxed text-ink-soft">
              Ein Blick auf die Natur macht diese Bedingungen sichtbar. Was daraus entsteht,
              hängt vom Saatgut, vom Boden und von der Pflege ab. Der Gärtner kann das
              Wachstum weder anordnen noch vollständig vorhersehen — doch er kann jene
              Bedingungen gestalten, unter denen es aus eigener Kraft geschieht.
            </p>
          </div>
        </Container>
      </section>

      {/* Drei Bedingungen — das Buch */}
      <section className="pb-28 lg:pb-36">
        <Container>
          <SectionMark index={3} />
          <h2 className="mt-4 max-w-xl font-serif text-3xl italic leading-tight text-ink sm:text-4xl">
            Saatgut, Boden, Pflege
          </h2>
          <p className="mt-5 max-w-lg text-[17px] leading-relaxed text-ink-soft">
            Dieselben drei Bedingungen, die das Wachstum einer Pflanze tragen, wirken auch,
            wo Menschen in Verantwortung hineinwachsen.
          </p>
        </Container>

        <div className="mt-16 bg-neutral-tint py-20">
          <Container>
            <BookPages />
          </Container>
        </div>
      </section>

      {/* Führungsrhythmus — die Atemlinie */}
      <section className="border-t border-hairline py-28 lg:py-36">
        <Container>
          <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <SectionMark index={4} />
              <h2 className="mt-4 font-serif text-3xl italic leading-tight text-ink sm:text-4xl">
                Der Führungsrhythmus
              </h2>
              <p className="mt-5 text-[17px] leading-relaxed text-ink-soft">
                Der Gärtner beobachtet, giesst, wo es trocken ist, und lässt das Übrige
                geschehen. In der Führung ist die Pflege das aufmerksame Begleiten:
                hinschauen, was entsteht, aus der Wirkung lernen, daraus den nächsten
                Schritt wählen.
              </p>
            </div>
            <BreathLine />
          </div>
        </Container>
      </section>

      {/* Wachsen + Rolle — bildgeführt */}
      <section className="border-t border-hairline">
        <div className="grid lg:grid-cols-[0.85fr_1.15fr]">
          <ImagePlate
            tone="cool"
            caption="Markus Tappolet im Gespräch — Foto folgt"
            className="min-h-[320px] lg:min-h-full"
          />
          <div className="flex flex-col gap-16 px-6 py-20 sm:px-8 lg:px-16 lg:py-24 xl:px-20">
            <div>
              <SectionMark index={5} />
              <h2 className="mt-4 font-serif text-2xl italic leading-tight text-ink sm:text-3xl">
                Wie es wachsen kann
              </h2>
              <div className="mt-5 space-y-4 text-[17px] leading-relaxed text-ink-soft">
                <p>
                  In der Natur beginnt Wachstum im Kleinen. Auch im Unternehmen beginnt
                  Entwicklung an einem konkreten Ort: Ein Mensch oder ein Team erhält die
                  Möglichkeit, ein Anliegen im Sinne des Ganzen umzusetzen — mit einer
                  Aufgabe, deren Wirkung tatsächlich spürbar wird.
                </p>
                <p className="font-display text-base font-medium text-ink">
                  Mit jedem Durchgang wächst die Entscheidungsfähigkeit der Menschen und die
                  Lernfähigkeit des Unternehmens.
                </p>
              </div>
            </div>

            <div className="border-t border-hairline pt-14">
              <SectionMark index={6} />
              <h2 className="mt-4 font-serif text-2xl italic leading-tight text-ink sm:text-3xl">
                Entwicklung aufmerksam begleiten
              </h2>
              <p className="mt-5 text-[17px] leading-relaxed text-ink-soft">
                Ich begleite Unternehmen dabei, jene Orte zu erkennen, an denen Entwicklung
                möglich wird. Gemeinsam klären wir, welche Orientierung Menschen für
                eigenständiges Handeln brauchen, und wie aus gemachten Erfahrungen
                gemeinsames Lernen wird — in Gesprächen, in schwierigen Entscheidungen, in
                Workshops zu Identität, Werten und Vision.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-ink text-paper">
        <SeedMotif className="pointer-events-none absolute -left-10 -bottom-10 h-[380px] w-auto opacity-[0.06]" />
        <Container className="relative py-28 text-center sm:py-32">
          <span className="block font-serif text-lg italic text-paper/45">VII</span>
          <p className="mx-auto mt-6 max-w-2xl font-serif text-[clamp(1.7rem,3.6vw,2.75rem)] italic leading-snug">
            Möchtest Du erfahren, wie das in Deinem Unternehmen aussehen kann?
          </p>
          <p className="mt-4 text-paper/70">Dann lass uns reden.</p>
          <div className="mt-10">
            <CTAButton href="/kontakt" variant="on-dark">
              Kennenlerngespräch vereinbaren
            </CTAButton>
          </div>
        </Container>
      </section>
    </div>
  );
}
