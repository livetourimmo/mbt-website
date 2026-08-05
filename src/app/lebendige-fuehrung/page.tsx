import type { Metadata } from "next";
import { Container, CTAButton, Eyebrow } from "@/components/ui";
import Reveal from "@/components/reveal";
import BookPages from "@/components/book-pages";
import GrowthCycle from "@/components/growth-cycle";
import SeedMotif from "@/components/seed-motif";

export const metadata: Metadata = {
  title: "Lebendige Führung",
  description:
    "Verantwortung wirkungsvoll übergeben. Lebendige Führung ist der gemeinsame Kern von MBT-Consulting und MBT-Coaching — eine Führung, die wächst statt gebaut wird.",
};

export default function LebendigeFuehrungPage() {
  return (
    <div className="bg-neutral-tint">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <SeedMotif className="pointer-events-none absolute -right-6 top-16 h-[420px] w-auto opacity-[0.08] sm:-right-2" />
        <Container className="relative py-24 sm:py-32">
          <Reveal>
            <Eyebrow>Der gemeinsame Kern</Eyebrow>
            <h1 className="mt-5 max-w-3xl font-serif text-4xl italic leading-[1.15] text-ink sm:text-5xl lg:text-6xl">
              Verantwortung wirkungsvoll übergeben
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink-soft sm:text-xl">
              Wo übertragen wir Verantwortung in guter Absicht und gehen davon aus, dass sie
              damit auch übernommen wird? Häufig erwarten wir, dass jemand eigenständig handelt
              und dennoch so entscheidet, wie wir es selbst für richtig halten. Bleibt die
              erhoffte Wirkung aus, zweifeln wir schnell an der Bereitschaft des Menschen —
              statt das zugrunde liegende Führungsmuster zu hinterfragen.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Intro — Gärtner-Metapher */}
      <section className="border-t border-hairline bg-paper">
        <Container className="py-24 sm:py-28">
          <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
            <Reveal>
              <p className="font-display text-2xl font-medium leading-snug text-ink sm:text-3xl">
                Was braucht ein Mensch, damit er Verantwortung übernimmt und im Sinne des
                Ganzen eigene Entscheidungen treffen kann?
              </p>
            </Reveal>
            <Reveal delay={100}>
              <div className="space-y-5 text-[17px] leading-relaxed text-ink-soft">
                <p>
                  Lebendige Führung geht davon aus, dass ein Mensch in Verantwortung
                  hineinwachsen darf. Die Fähigkeit dazu trägt er bereits in sich. Damit sie
                  sich entwickeln kann, braucht es Bedingungen, die ihm Orientierung geben,
                  eigene Erfahrungen ermöglichen und ihn aus deren Wirkung lernen lassen.
                </p>
                <p>
                  Ein Blick auf die Natur macht diese Bedingungen sichtbar. Auch eine Pflanze
                  trägt ihre Entwicklungsfähigkeit bereits in sich. Was daraus entsteht, hängt
                  vom Saatgut, vom Boden und von der Pflege ab. Der Gärtner kann ihr Wachstum
                  weder anordnen noch vollständig vorhersehen — doch er kann aufmerksam jene
                  Bedingungen gestalten, unter denen sie sich aus eigener Kraft entwickelt.
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Drei Bedingungen — Buch-Seiten */}
      <section className="border-t border-hairline bg-neutral-tint">
        <Container className="py-24 sm:py-28">
          <Reveal>
            <Eyebrow>Drei Bedingungen</Eyebrow>
            <h2 className="mt-4 max-w-xl font-serif text-3xl italic leading-tight text-ink sm:text-4xl">
              Saatgut, Boden, Pflege
            </h2>
            <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-ink-soft">
              Dieselben drei Bedingungen, die das Wachstum einer Pflanze tragen, wirken auch,
              wo Menschen in Verantwortung hineinwachsen. Blättere durch die drei Bewegungen
              des Gärtners.
            </p>
          </Reveal>
          <Reveal delay={150} className="mt-14">
            <BookPages />
          </Reveal>
        </Container>
      </section>

      {/* Führungsrhythmus */}
      <section className="border-t border-hairline bg-paper">
        <Container className="py-24 sm:py-28">
          <Reveal>
            <Eyebrow>Die Pflege</Eyebrow>
            <h2 className="mt-4 max-w-xl font-serif text-3xl italic leading-tight text-ink sm:text-4xl">
              Der Führungsrhythmus
            </h2>
            <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-ink-soft">
              Der Gärtner beobachtet, giesst, wo es trocken ist, und lässt das Übrige
              geschehen. Aus dem Gewachsenen entstehen neue Samen. In der Führung ist die
              Pflege das aufmerksame Begleiten: hinschauen, was entsteht, aus der Wirkung
              lernen, daraus den nächsten Schritt wählen. So schliesst sich der Kreis — aus
              der Pflege entsteht das Saatgut des nächsten Schritts.
            </p>
          </Reveal>
          <Reveal delay={150} className="mt-16">
            <GrowthCycle />
          </Reveal>
        </Container>
      </section>

      {/* Wie es wachsen kann */}
      <section className="border-t border-hairline bg-neutral-tint">
        <Container className="py-24 sm:py-28">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <Reveal>
              <Eyebrow>Im Kleinen beginnen</Eyebrow>
              <h2 className="mt-4 font-serif text-3xl italic leading-tight text-ink sm:text-4xl">
                Wie es wachsen kann
              </h2>
            </Reveal>
            <Reveal delay={100}>
              <div className="space-y-5 text-[17px] leading-relaxed text-ink-soft">
                <p>
                  In der Natur beginnt Wachstum im Kleinen. Auch im Unternehmen beginnt
                  Entwicklung an einem konkreten Ort: Ein Mensch oder ein Team erhält die
                  Möglichkeit, ein Anliegen nach eigenen Vorstellungen und im Sinne des Ganzen
                  umzusetzen — nicht als Übung, sondern mit einer Aufgabe, deren Wirkung
                  tatsächlich spürbar wird.
                </p>
                <p>
                  Was sich dabei bewährt, wird weiterentwickelt. Was noch nicht trägt, wird
                  angepasst. So entsteht Veränderung nicht durch einen fertigen Plan, sondern
                  durch eine Folge bewusst gestalteter Erfahrungen.
                </p>
                <p className="font-display text-lg font-medium text-ink">
                  Mit jedem Durchgang wächst die Entscheidungsfähigkeit der Menschen und die
                  Lernfähigkeit des Unternehmens.
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Entwicklung aufmerksam begleiten */}
      <section className="border-t border-hairline bg-paper">
        <Container className="py-24 sm:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <Reveal>
              <Eyebrow>Meine Rolle</Eyebrow>
              <h2 className="mt-4 font-serif text-3xl italic leading-tight text-ink sm:text-4xl">
                Entwicklung aufmerksam begleiten
              </h2>
            </Reveal>
            <Reveal delay={100}>
              <div className="mt-8 space-y-5 text-left text-[17px] leading-relaxed text-ink-soft sm:text-center">
                <p>
                  Solche Prozesse verlaufen selten geradlinig. Unterschiedliche Interessen
                  werden sichtbar, alte Muster wirken weiter, und manche Entscheidung berührt
                  mehr, als zunächst erkennbar war.
                </p>
                <p>
                  Ich begleite Unternehmen dabei, jene Orte zu erkennen, an denen Entwicklung
                  möglich wird. Gemeinsam klären wir, welche Orientierung Menschen für
                  eigenständiges Handeln brauchen, wo echte Entscheidungsräume entstehen
                  können und wie aus den gemachten Erfahrungen gemeinsames Lernen wird. Dazu
                  führe ich Gespräche, begleite schwierige Entscheidungen und arbeite in
                  Workshops an Identität, Werten und Vision — nicht als Leitbild für die Wand,
                  sondern als innere Orientierung für das tägliche Handeln.
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-ink text-paper">
        <SeedMotif className="pointer-events-none absolute -left-10 -bottom-10 h-[380px] w-auto opacity-[0.06]" />
        <Container className="relative py-24 text-center sm:py-28">
          <Reveal>
            <p className="font-serif text-2xl italic leading-snug sm:text-3xl">
              Möchtest Du erfahren, wie das in Deinem Unternehmen aussehen kann?
            </p>
            <p className="mt-3 text-paper/70">Dann lass uns reden.</p>
            <div className="mt-10">
              <CTAButton href="/kontakt" variant="on-dark">
                Kennenlerngespräch vereinbaren
              </CTAButton>
            </div>
          </Reveal>
        </Container>
      </section>
    </div>
  );
}
