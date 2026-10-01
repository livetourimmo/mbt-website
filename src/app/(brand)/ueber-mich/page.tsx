import Image from "next/image";
import type { Metadata } from "next";
import SectionText from "@/components/section-text";
import SectionImage from "@/components/section-image";
import Reveal from "@/components/reveal";
import ScrollQuote from "@/components/scroll-quote";
import SplitWords from "@/components/split-words";

export const metadata: Metadata = {
  title: "Über mich",
  description:
    "Markus Tappolet — Coach und Unternehmensentwickler. Die Fragen, die Unternehmen heute beschäftigen, begleiten ihn seit vielen Jahren.",
  alternates: {
    canonical: "https://mbt-consulting.ch/ueber-mich",
  },
};

export default function UeberMichPage() {
  return (
    <>
      {/* Einstieg */}
      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-12 md:items-center md:gap-8 md:px-10 md:py-24">
        <div className="md:col-span-5">
          <p className="hero-kicker text-[17px] text-ink-soft">Über mich</p>
          <h1 className="hero-title mt-4 font-display text-[2.1rem] leading-[1.12] font-semibold tracking-tight text-ink md:text-[2.75rem]">
            <SplitWords text="Die Fragen, die Unternehmen heute beschäftigen, begleiten mich seit vielen Jahren." />
          </h1>
          <div className="hero-lede mt-6 max-w-lg space-y-4 text-[17px] leading-relaxed text-ink-soft">
            <p>
              Wie übernehmen Menschen Verantwortung? Was lässt sie über sich
              hinauswachsen? Weshalb entfalten gute Ideen manchmal eine
              starke Wirkung, während sie an einem anderen Ort versanden?
            </p>
            <p>
              Diesen Fragen bin ich in Entwicklung, Projektleitung,
              Verbesserungsprozessen und Innovationsmanagement immer wieder
              begegnet. Ich habe erlebt, wie viel möglich wird, wenn
              Menschen Vertrauen und echten Gestaltungsspielraum erhalten.
              Und ich habe gesehen, wie Strukturen, Vorgaben und gelebte
              Führungsmuster ihre Wirksamkeit begrenzen können.
            </p>
          </div>
        </div>
        <div className="img-reveal relative aspect-[4/5] overflow-hidden rounded-3xl md:col-span-7">
          <Image
            src="/images/markus-portrait.jpg"
            alt="Porträt von Markus Tappolet"
            fill
            sizes="(min-width: 768px) 58vw, 100vw"
            className="object-cover object-top"
          />
        </div>
      </section>

      {/* Fragen, die mich nicht mehr losliessen */}
      <SectionText heading="Fragen, die mich nicht mehr losliessen">
        <p>
          Mein beruflicher Weg begann in der Technik. Als Maschinenzeichner,
          Entwickler und Projektleiter faszinierte mich die Frage, wie aus
          einer Idee etwas entsteht, das in der Wirklichkeit funktioniert.
        </p>
        <p>
          Besonders geprägt haben mich jene Projekte, in denen ich selbst
          gestalten und Verantwortung übernehmen durfte. Ich erlebte, welche
          Energie freigesetzt wird, wenn ein Mensch seine Fähigkeiten
          einbringen und die Wirkung seines Handelns unmittelbar erfahren
          kann.
        </p>
        <p>
          Gleichzeitig begegnete mir immer wieder die andere Seite. Gute
          Ideen waren vorhanden, Menschen wollten etwas bewegen und
          geeignete Methoden waren bekannt. Dennoch blieb die erhoffte
          Entwicklung aus. Verbesserungen verloren an Kraft. Entscheidungen
          wanderten nach oben. Vorgaben nahmen zu und die Verbindung zur
          Umsetzung wurde schwächer.
        </p>
        <ScrollQuote>
          Mit der Zeit wurde mir klar: Methoden allein verändern noch kein
          Unternehmen. Entscheidend sind die Bedingungen, unter denen
          Menschen handeln.
        </ScrollQuote>
      </SectionText>

      {/* Aus verschiedenen Perspektiven entstand ein Ganzes */}
      <SectionText
        heading="Aus verschiedenen Perspektiven entstand ein Ganzes"
        tint="var(--color-neutral-tint)"
      >
        <p>
          Das Innovationsmanagement öffnete mir den Blick auf Organisationen
          als zusammenhängende Systeme. Ich lernte, Probleme aus
          unterschiedlichen Perspektiven zu betrachten und hinter einer
          sichtbaren Schwierigkeit nach den tieferen Zusammenhängen zu
          suchen.
        </p>
        <p>Doch etwas Wesentliches blieb damit noch unberührt.</p>
        <p>
          Meine persönliche Entwicklung führte diese Suche an einen anderen
          Ort. Zu mir selbst.
        </p>
        <p>
          Ich begann zu verstehen, wie sehr innere Bilder und vertraute
          Muster unser Handeln prägen. Auch dann, wenn wir uns längst etwas
          anderes vorgenommen haben.
        </p>
        <p>
          In der Ausbildung zum Potenzialentfaltungscoach bei Gerald Hüther
          fügte sich vieles zusammen, was ich über Jahre beobachtet und
          erfahren hatte: Menschen entwickeln sich aus sich selbst heraus.
          Führung kann diese Entwicklung ermöglichen, indem sie Orientierung
          gibt, Vertrauen wachsen lässt und Räume gestaltet, in denen
          Menschen ihre eigene Wirksamkeit erfahren.
        </p>
        <ScrollQuote>
          Daraus ist mein Verständnis von Lebendiger Führung entstanden.
        </ScrollQuote>
      </SectionText>

      {/* Zusammenarbeit beginnt für mich mit Hochachtung */}
      <SectionText heading="Zusammenarbeit beginnt für mich mit Hochachtung">
        <p>
          Ich habe grosse Hochachtung vor Menschen, die bereit sind, sich
          selbst ehrlich zu begegnen. Menschen, die ihre eigenen Muster
          erkennen, sie benennen können und sich weiterentwickeln möchten.
        </p>
        <p>
          Wenn ich diese Bereitschaft bei einer Führungspersönlichkeit
          spüre, entsteht für mich die Grundlage einer Zusammenarbeit auf
          Augenhöhe. Besonders dann, wenn ihr auch die Entwicklung anderer
          Menschen am Herzen liegt.
        </p>
        <p>
          Ich bringe meine Erfahrungen, mein Wissen und meine Wahrnehmung
          ein. Ich höre zu, verbinde unterschiedliche Perspektiven und
          stelle Fragen, durch die neue Klarheit entstehen kann. Die
          tragfähigen Antworten entwickeln wir aus deiner Situation, deinem
          Unternehmen und dem, was bereits vorhanden ist.
        </p>
        <p>
          Dabei darf auch zur Sprache kommen, was zunächst unbequem
          erscheint. Entwicklung braucht einen Raum, in dem Menschen offen
          denken können, ohne ihre Stärke oder Autorität zu verlieren.
        </p>
      </SectionText>

      {/* Wenn Wirkung spürbar wird, entstehen magische Momente */}
      <section
        className="border-t border-hairline"
        style={{ background: "var(--color-neutral-tint)" }}
      >
        <Reveal className="mx-auto grid max-w-7xl gap-6 px-6 py-20 md:grid-cols-12 md:gap-10 md:px-10 md:py-28">
          <h2 className="font-display text-[1.6rem] leading-[1.15] font-semibold text-ink md:col-span-4 md:text-[2rem]">
            Wenn Wirkung spürbar wird, entstehen magische Momente
          </h2>
          <div className="max-w-3xl space-y-5 text-[17px] leading-relaxed text-ink-soft md:col-span-7 md:col-start-6">
            <p>
              Die ersten Zeichen einer Entwicklung zeigen sich oft leise.
              Gespräche verändern sich. Entscheidungen werden leichter.
              Menschen bringen sich ein und beginnen, Verantwortung aus
              eigener Überzeugung zu übernehmen.
            </p>
            <p>
              Dann beginnen die Augen der Menschen zu leuchten. Sie erleben,
              dass ihr eigenes Handeln etwas bewirkt.
            </p>
            <p>
              Solche Momente durfte ich selbst erfahren. Sie tragen meine
              Motivation und zeigen früh, dass etwas zu greifen beginnt.
            </p>
            <p>
              Für mich gehört auch der wirtschaftliche Erfolg dazu. Wo
              Menschen klarer entscheiden, ihre Fähigkeiten einbringen und
              Verantwortung übernehmen, gewinnt das Unternehmen an Kraft.
              Entwicklung bewährt sich in der täglichen Zusammenarbeit, in
              wirksameren Strukturen und schliesslich auch im Ergebnis.
            </p>
            <ScrollQuote>
              So wird aus einer guten Absicht eine tragfähige Wirklichkeit.
            </ScrollQuote>
            <blockquote className="mt-2 border-l-2 border-accent pl-5 text-[16px] leading-relaxed text-ink italic">
              «Markus kommt nicht mit vorgefertigten Antworten oder stülpt
              seine Lösungen über. Durch seine gezielten Fragen und seine
              wertschätzende Art hilft er mir, eigene Lösungen zu entwickeln
              und die richtigen Schlüsse für mich und mein Umfeld zu
              ziehen.»
              <footer className="mt-3 text-[14px] not-italic text-ink-soft">
                Michael Kummer, Geschäftsführer Wibilea AG
              </footer>
            </blockquote>
          </div>
        </Reveal>
      </section>

      {/* Das Bild, das mich trägt */}
      <SectionImage
        heading="Das Bild, das mich trägt"
        imageSide="right"
        media={
          <Image
            src="/images/bank-sitzend.png"
            alt="Markus Tappolet sitzt auf einer Bank unter einem grossen Baum."
            width={1240}
            height={772}
            className="h-full w-full object-cover"
          />
        }
      >
        <p>
          Ich möchte dazu beitragen, dass Unternehmen mehr und mehr zu Orten
          werden, an denen Menschen mit Begeisterung wirken und abends
          erfüllt nach Hause gehen.
        </p>
      </SectionImage>
    </>
  );
}
