import type { Metadata } from "next";
import { getSegment } from "@/lib/get-segment.server";
import SectionText from "@/components/section-text";
import FilmClip from "@/components/film-clip";
import CtaButton from "@/components/cta-button";
import ScrollScrub from "@/components/scroll-scrub";
import OrganismMorph from "@/components/organism-morph";
import GrowthMedia from "@/components/growth-media";
import RhythmMedia from "@/components/rhythm-media";
import ScrollQuote from "@/components/scroll-quote";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Lebendige Führung",
    description:
      "Verantwortung wirkungsvoll übergeben: Saatgut, Boden und Pflege — die drei Bedingungen, unter denen Verantwortung wachsen kann.",
    alternates: {
      canonical: "https://mbt-consulting.ch/lebendige-fuehrung",
    },
  };
}

const bedingungen = [
  {
    titel: "Das Saatgut",
    bild:
      "In der DNA des Samenkorns ist die Richtung bereits angelegt. Die Pflanze trägt in sich, was aus ihr werden will, und wächst dem Licht entgegen.",
    fuehrung:
      "In der Führung ist das Saatgut die innere Orientierung: Sinn, Werte, eine Richtung, die im Alltag spürbar ist. Wer weiss, wofür das Unternehmen steht, kann handeln, ohne bei jedem Schritt nachzufragen. Aus innerer Klarheit entsteht äussere Wirkung.",
  },
  {
    titel: "Der Boden",
    bild:
      "Der Boden gibt Halt und Nahrung zugleich. Die Pflanze wurzelt darin und zieht heraus, was sie zum Wachsen braucht.",
    fuehrung:
      "In der Führung ist der Boden der echte Entscheidungsraum: eine Aufgabe, die trägt, ein klarer Rahmen, die Einladung, eigenständig zu handeln. Verantwortung wächst, wo Menschen schrittweise mehr davon übernehmen dürfen und dabei Unterstützung finden.",
  },
  {
    titel: "Die Pflege",
    bild:
      "Der Gärtner beobachtet, giesst, wo es trocken ist, und lässt das Übrige geschehen. Aus dem Gewachsenen entstehen neue Samen.",
    fuehrung:
      "In der Führung ist die Pflege das aufmerksame Begleiten: hinschauen, was entsteht, aus der Wirkung lernen, daraus den nächsten Schritt wählen. Jede Erfahrung vertieft die Orientierung. So schliesst sich der Kreis: Aus der Pflege entsteht das Saatgut des nächsten Schritts.",
  },
];

const rhythmus = [
  {
    titel: "Ausprobieren",
    text: "Ein Schritt wird gewagt, ohne dass die Wirkung schon feststeht. Aus der Bereitschaft, etwas auszuprobieren, entsteht die erste Erfahrung.",
  },
  {
    titel: "Resonanz erleben",
    text: "Das Handeln trifft auf die Wirklichkeit. Reaktionen, Ergebnisse und Rückmeldungen zeigen, was die Entscheidung tatsächlich bewirkt hat.",
  },
  {
    titel: "Innehalten",
    text: "Bevor sofort weitergemacht wird, entsteht ein bewusster Moment des Anhaltens. Erst im Innehalten wird sichtbar, was wirklich geschehen ist.",
  },
  {
    titel: "Reflektieren",
    text: "Die gemachte Erfahrung wird betrachtet und eingeordnet: Was hat getragen, was hat gefehlt? Aus dieser Klarheit wächst Verständnis.",
  },
  {
    titel: "Entscheiden",
    text: "Aus dem Verstandenen wird der nächste Schritt gewählt — bewusster als zuvor. Damit schliesst sich der Kreis, und ein neues Ausprobieren beginnt.",
  },
];

export default async function LebendigeFuehrungPage() {
  const segment = await getSegment();
  const einladung =
    segment === "coaching"
      ? "Möchtest du erfahren, wie das in deiner Führung aussehen kann?"
      : "Möchtest du erfahren, wie das in deinem Unternehmen aussehen kann?";

  return (
    <div className="register-organic">
      {/* Einstiegsfilm: endet im Buch, danach geht es direkt zum ersten Abschnitt */}
      <section className="relative w-full">
        <h1 className="sr-only">Lebendige Führung: Verantwortung wirkungsvoll übergeben</h1>
        <FilmClip
          name="film-anfang"
          label="Markus Tappolet geht über eine Wiese, setzt sich unter einen Baum und öffnet ein Buch."
          scrollToId="einordnung"
        />
      </section>

      {/* Einordnung */}
      <div id="einordnung" />
      <SectionText heading="Wo übertragen wir Verantwortung?">
        <p>
          Wo übertragen wir Verantwortung in guter Absicht und gehen davon
          aus, dass sie damit auch übernommen wird? Häufig erwarten wir
          dabei, dass jemand eigenständig handelt und dennoch so
          entscheidet, wie wir es selbst für richtig halten. Bleibt die
          erhoffte Wirkung aus, zweifeln wir schnell an der Bereitschaft des
          Menschen, statt das zugrunde liegende Führungsmuster zu
          hinterfragen.
        </p>
        <ScrollQuote>
          Was braucht ein Mensch, damit er Verantwortung übernimmt und im
          Sinne des Ganzen eigene Entscheidungen treffen kann?
        </ScrollQuote>
        <p>
          Lebendige Führung geht davon aus, dass ein Mensch in Verantwortung
          hineinwachsen darf. Die Fähigkeit dazu trägt er bereits in sich.
          Damit sie sich entwickeln kann, braucht es Bedingungen, die ihm
          Orientierung geben, eigene Erfahrungen ermöglichen und ihn aus
          deren Wirkung lernen lassen.
        </p>
        <p>
          Ein Blick auf die Natur macht diese Bedingungen sichtbar. Auch
          eine Pflanze trägt ihre Entwicklungsfähigkeit bereits in sich. Was
          daraus entsteht, hängt vom Saatgut, vom Boden und von der Pflege
          ab. Der Gärtner kann ihr Wachstum weder anordnen noch vollständig
          vorhersehen. Doch er kann aufmerksam jene Bedingungen gestalten,
          unter denen sie sich aus eigener Kraft entwickelt.
        </p>
      </SectionText>

      {/* Drei Bedingungen — beim Scrollen gepinnt & durchgescrubbt */}
      <section className="border-t border-hairline bg-neutral-tint">
        <div className="mx-auto max-w-7xl px-6 pt-20 md:px-10 md:pt-28">
          <div className="grid gap-6 md:grid-cols-12 md:gap-10">
            <h2 className="font-display text-[1.6rem] leading-[1.15] font-semibold text-ink md:col-span-4 md:text-[2rem]">
              Drei Bedingungen, unter denen Verantwortung wachsen kann
            </h2>
            <p className="max-w-2xl text-[17px] leading-relaxed text-ink-soft md:col-span-7 md:col-start-6">
              Drei Bedingungen haben dieses Wachstum getragen. Dieselben drei
              wirken, wo Menschen in Verantwortung hineinwachsen.
            </p>
          </div>
        </div>

        <ScrollScrub
          stages={bedingungen.map((b) => ({
            key: b.titel,
            title: b.titel,
            paragraphs: [
              { text: b.bild, emphasis: true },
              { text: b.fuehrung },
            ],
          }))}
          media={<GrowthMedia />}
        />

        <div className="mx-auto max-w-7xl px-6 pb-20 md:px-10 md:pb-28">
          <p className="max-w-3xl font-display text-[19px] font-medium text-ink">
            So wächst die Fähigkeit eines Menschen, eigene Entscheidungen im
            Sinne des Ganzen zu treffen. Und mit ihm entwickelt sich die
            Lernfähigkeit des Unternehmens.
          </p>
        </div>
      </section>

      {/* Vom Organigramm zur lebendigen Struktur — scroll-gekoppelte Morph-Animation */}
      <section className="border-t border-hairline">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-20">
          <OrganismMorph className="w-full" />
        </div>
      </section>

      {/* Wie lebendige Führung wachsen kann */}
      <SectionText heading="Wie lebendige Führung wachsen kann" tint="var(--color-neutral-tint)">
        <p>
          In der Natur beginnt Wachstum im Kleinen. Eine einzelne Zelle
          trägt bereits die Fähigkeit in sich, sich zu entwickeln. Sie
          braucht Orientierung, Raum und eine Umgebung, die auf das
          Entstehende reagiert.
        </p>
        <p>
          Auch im Unternehmen beginnt Entwicklung an einem konkreten Ort.
          Ein Mensch oder ein Team erhält die Möglichkeit, ein Anliegen nach
          eigenen Vorstellungen und im Sinne des Ganzen umzusetzen. Im
          eigenen Handeln entsteht Erfahrung — und daraus ein
          wiederkehrender Rhythmus:
        </p>
      </SectionText>

      {/* Die fünf Bewegungen des Rhythmus — beim Scrollen gepinnt & durchgescrubbt */}
      <section className="border-t border-hairline bg-neutral-tint">
        <div className="mx-auto max-w-7xl px-6 pt-20 md:px-10 md:pt-28">
          <div className="grid gap-6 md:grid-cols-12 md:gap-10">
            <h2 className="font-display text-[1.6rem] leading-[1.15] font-semibold text-ink md:col-span-4 md:text-[2rem]">
              Die fünf Bewegungen des Rhythmus
            </h2>
            <p className="max-w-2xl text-[17px] leading-relaxed text-ink-soft md:col-span-7 md:col-start-6">
              Ausprobieren, Resonanz erleben, Innehalten, Reflektieren,
              Entscheiden — und wieder von vorn.
            </p>
          </div>
        </div>

        <ScrollScrub
          stages={rhythmus.map((r) => ({
            key: r.titel,
            title: r.titel,
            paragraphs: [{ text: r.text }],
          }))}
          media={<RhythmMedia />}
        />

        <div className="mx-auto max-w-7xl px-6 pb-20 md:px-10 md:pb-28">
          <p className="max-w-3xl text-[17px] leading-relaxed text-ink-soft">
            Was sich dabei bewährt, wird weiterentwickelt. Was noch nicht
            trägt, wird angepasst. Mit jedem Durchgang wächst die
            Entscheidungsfähigkeit der Menschen und die Lernfähigkeit des
            Unternehmens.
          </p>
        </div>
      </section>

      {/* Entwicklung aufmerksam begleiten */}
      <SectionText heading="Entwicklung aufmerksam begleiten">
        <p>
          Solche Prozesse verlaufen selten geradlinig. Unterschiedliche
          Interessen werden sichtbar, alte Muster wirken weiter und manche
          Entscheidung berührt mehr, als zunächst erkennbar war.
        </p>
        <p>
          Ich begleite Unternehmen dabei, jene Orte zu erkennen, an denen
          Entwicklung möglich wird. Gemeinsam klären wir, welche
          Orientierung Menschen für eigenständiges Handeln brauchen, wo
          echte Entscheidungsräume entstehen können und wie aus den
          gemachten Erfahrungen gemeinsames Lernen wird.
        </p>
        <p>
          Dazu führe ich Gespräche, begleite schwierige Entscheidungen und
          unterstütze dabei, Konflikte und unterschiedliche Interessen zu
          klären. In Workshops arbeiten wir an Identität, Werten und Vision.
          Nicht als Leitbild für die Wand, sondern als innere Orientierung
          für das tägliche Handeln.
        </p>
        <ScrollQuote>
          Lebendige Führung entsteht, wo Menschen innerhalb einer
          gemeinsamen Orientierung handeln, Wirkung erleben und bewusst
          daraus lernen.
        </ScrollQuote>
      </SectionText>

      {/* Schlussfilm + Einladung */}
      <section className="relative w-full border-t border-hairline bg-neutral-tint text-center">
        <FilmClip
          name="film-ende"
          label="Markus Tappolet liest unter dem Baum, steht auf und blickt mit dem Buch unter dem Arm über die Landschaft."
          className="w-full"
        />
        <div className="px-6 py-20 md:py-28">
          <h2 className="font-display text-[1.75rem] font-semibold text-ink md:text-[2rem]">
            {einladung}
          </h2>
          <p className="mt-3 text-[17px] text-ink-soft">Dann lass uns reden.</p>
          <CtaButton
            href="/kennenlerngespraech"
            tone={segment === "coaching" ? "accent" : "ink"}
            className="mt-6"
          >
            Kennenlerngespräch vereinbaren
          </CtaButton>
        </div>
      </section>
    </div>
  );
}
