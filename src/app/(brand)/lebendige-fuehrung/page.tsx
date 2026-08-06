import Link from "next/link";
import type { Metadata } from "next";
import { getSegment } from "@/lib/get-segment.server";
import SectionText from "@/components/section-text";
import SectionImage from "@/components/section-image";
import MediaPlaceholder from "@/components/media-placeholder";
import RhythmWheel from "@/components/rhythm-wheel";

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

export default async function LebendigeFuehrungPage() {
  const segment = await getSegment();
  const einladung =
    segment === "coaching"
      ? "Möchtest du erfahren, wie das in deiner Führung aussehen kann?"
      : "Möchtest du erfahren, wie das in deinem Unternehmen aussehen kann?";

  return (
    <>
      {/* Video-Platzhalter — vollbild, Seitenanfang */}
      <section className="relative flex h-[88vh] min-h-[560px] w-full flex-col items-center justify-center gap-8 border-b border-hairline bg-neutral-tint px-6 text-center">
        <div>
          <p className="text-[17px] text-ink-soft">Lebendige Führung</p>
          <h1 className="mt-3 font-display text-[2.25rem] leading-[1.1] font-semibold text-ink md:text-[3.25rem]">
            Verantwortung wirkungsvoll übergeben
          </h1>
        </div>
        <MediaPlaceholder
          kind="video"
          label="Video folgt: Einstiegsfilm"
          aspect="aspect-video"
          className="w-full max-w-3xl"
        />
      </section>

      {/* Einordnung */}
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
        <p className="font-display text-[19px] font-medium text-ink">
          Was braucht ein Mensch, damit er Verantwortung übernimmt und im
          Sinne des Ganzen eigene Entscheidungen treffen kann?
        </p>
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

      {/* Drei Bedingungen */}
      <section className="border-t border-hairline bg-neutral-tint">
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">
          <div className="grid gap-6 md:grid-cols-12 md:gap-10">
            <h2 className="font-display text-[1.6rem] leading-[1.15] font-semibold text-ink md:col-span-4 md:text-[2rem]">
              Drei Bedingungen, unter denen Verantwortung wachsen kann
            </h2>
            <p className="max-w-2xl text-[17px] leading-relaxed text-ink-soft md:col-span-7 md:col-start-6">
              Drei Bedingungen haben dieses Wachstum getragen. Dieselben drei
              wirken, wo Menschen in Verantwortung hineinwachsen.
            </p>
          </div>

          <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
            {bedingungen.map((b) => (
              <div
                key={b.titel}
                className="border-t-2 border-accent pt-6 transition-transform duration-300 ease-out hover:-translate-y-1"
              >
                <h3 className="font-display text-[1.25rem] font-semibold text-ink">
                  {b.titel}
                </h3>
                <p className="mt-4 text-[15px] leading-relaxed text-ink-soft italic">
                  {b.bild}
                </p>
                <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
                  {b.fuehrung}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-16 max-w-3xl font-display text-[19px] font-medium text-ink">
            So wächst die Fähigkeit eines Menschen, eigene Entscheidungen im
            Sinne des Ganzen zu treffen. Und mit ihm entwickelt sich die
            Lernfähigkeit des Unternehmens.
          </p>
        </div>
      </section>

      {/* Animations-Platzhalter */}
      <section className="border-t border-hairline">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-20">
          <MediaPlaceholder
            kind="animation"
            label="Animation folgt: Aus einem Organigramm wird eine lebendige, pulsierende Struktur"
            aspect="aspect-video"
          />
        </div>
      </section>

      {/* Wie lebendige Führung wachsen kann */}
      <SectionImage
        heading="Wie lebendige Führung wachsen kann"
        imageSide="left"
        tint="var(--color-neutral-tint)"
        media={<RhythmWheel className="max-w-md p-4 md:p-8" />}
      >
        <p>
          In der Natur beginnt Wachstum im Kleinen. Eine einzelne Zelle
          trägt bereits die Fähigkeit in sich, sich zu entwickeln. Sie
          braucht Orientierung, Raum und eine Umgebung, die auf das
          Entstehende reagiert.
        </p>
        <p>
          Auch im Unternehmen beginnt Entwicklung an einem konkreten Ort.
          Ein Mensch oder ein Team erhält die Möglichkeit, ein Anliegen nach
          eigenen Vorstellungen und im Sinne des Ganzen umzusetzen.
        </p>
        <p>
          Im eigenen Handeln entsteht Erfahrung. Menschen erleben, was ihre
          Entscheidung bewirkt, wo sie trägt und wo etwas fehlt. Wird diese
          Erfahrung gemeinsam betrachtet, entwickelt sich daraus die
          Fähigkeit, den nächsten Schritt bewusster zu wählen: ausprobieren,
          Resonanz erleben, innehalten, reflektieren, entscheiden — und
          wieder von vorn.
        </p>
        <p>
          Was sich dabei bewährt, wird weiterentwickelt. Was noch nicht
          trägt, wird angepasst. Mit jedem Durchgang wächst die
          Entscheidungsfähigkeit der Menschen und die Lernfähigkeit des
          Unternehmens.
        </p>
      </SectionImage>

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
        <p className="font-display text-[19px] font-medium text-ink">
          Lebendige Führung entsteht, wo Menschen innerhalb einer
          gemeinsamen Orientierung handeln, Wirkung erleben und bewusst
          daraus lernen.
        </p>
      </SectionText>

      {/* Video-Platzhalter — vollbild, Seitenschluss + Einladung */}
      <section className="relative flex h-[88vh] min-h-[560px] w-full flex-col items-center justify-center gap-8 border-t border-hairline bg-neutral-tint px-6 text-center">
        <MediaPlaceholder
          kind="video"
          label="Video folgt: Schlussfilm"
          aspect="aspect-video"
          className="w-full max-w-3xl"
        />
        <div>
          <h2 className="font-display text-[1.75rem] font-semibold text-ink md:text-[2rem]">
            {einladung}
          </h2>
          <p className="mt-3 text-[17px] text-ink-soft">Dann lass uns reden.</p>
          <Link
            href="/kennenlerngespraech"
            className="mt-6 inline-block rounded-full bg-ink px-8 py-3 text-[15px] font-medium text-paper transition-all duration-200 ease-out hover:-translate-y-1.5 hover:bg-accent-dark hover:shadow-xl"
          >
            Kennenlerngespräch vereinbaren
          </Link>
        </div>
      </section>
    </>
  );
}
