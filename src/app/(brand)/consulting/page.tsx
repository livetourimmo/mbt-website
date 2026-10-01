import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import SectionImage from "@/components/section-image";
import HeroFull from "@/components/hero-full";
import OfferSection, { type Angebot } from "@/components/offer-section";
import ContactForm from "@/components/contact-form";
import ScrollGif from "@/components/scroll-gif";
import ScrollQuote from "@/components/scroll-quote";
import BigQuote from "@/components/big-quote";
import Testimonial from "@/components/testimonial";

const consultingAngebote: readonly Angebot[] = [
  {
    titel: "Unternehmensidentität entwickeln",
    beschreibung:
      "Wenn Menschen wissen, wofür ihr Unternehmen steht und wohin es sich entwickeln will, können sie selbstständiger entscheiden und Verantwortung übernehmen.",
    details: [
      "Einstieg mit einem Workshop",
      "Schrittweise im Unternehmensalltag vertiefen",
    ],
    mehr: {
      text: [
        "Eine gelebte Identität gibt Orientierung, wo Vorgaben an ihre Grenzen kommen. Gemeinsam mit der Geschäftsleitung klären wir, wofür euer Unternehmen steht, welche Werte im Alltag tatsächlich tragen und wohin es sich entwickeln will.",
        "Daraus entsteht kein Leitbild für die Wand, sondern eine innere Orientierung, an der sich Menschen im täglichen Handeln ausrichten können. So werden Entscheidungen leichter und Verantwortung wird breiter übernommen.",
      ],
      ablauf: [
        "Vorgespräch: Ausgangslage, Anliegen und Rahmen klären",
        "Workshop mit der Geschäftsleitung: Identität, Werte und Richtung herausarbeiten",
        "Übersetzung in den Alltag: Wo zeigt sich die Identität in Entscheidungen und Abläufen?",
        "Begleitung über mehrere Monate, um das Erarbeitete schrittweise zu vertiefen",
      ],
    },
  },
  {
    titel: "Persönliche Begleitung",
    beschreibung:
      "Für CEOs, die ihr Unternehmen weiterentwickeln und dabei Klarheit und Überblick bewahren möchten.",
    details: [
      "Regelmässiger Austausch auf Augenhöhe",
      "An aktuellen Unternehmensfragen ausgerichtet",
    ],
    mehr: {
      text: [
        "Als CEO trägst du die Verantwortung für das Ganze und bist dabei oft allein mit den grossen Fragen. In der persönlichen Begleitung schaffen wir einen Raum, in dem du offen denken, Entscheidungen durchspielen und Abstand vom Tagesgeschäft gewinnen kannst.",
        "Ich bringe meine Erfahrung aus Entwicklung, Projektleitung und Innovationsmanagement ein, stelle Fragen und verbinde Perspektiven. Die Antworten entwickeln wir aus deiner Situation und dem, was in deinem Unternehmen bereits vorhanden ist.",
      ],
      ablauf: [
        "Kennenlerngespräch: Passt die Zusammenarbeit?",
        "Regelmässige Gespräche, zum Beispiel einmal im Monat",
        "Kurzfristige Unterstützung bei anstehenden Entscheidungen",
        "Gemeinsamer Rückblick: Was hat sich bewegt, was steht als Nächstes an?",
      ],
    },
  },
  {
    titel: "Führungskräfteentwicklung",
    beschreibung:
      "Für Unternehmen, die ihre Führungskräfte gezielt weiterentwickeln und Verantwortung breiter im Unternehmen verankern möchten.",
    details: [
      "Praxisnahe Workshops",
      "Modular und der Unternehmensidentität ausgerichtet",
    ],
    mehr: {
      text: [
        "Führungskräfte prägen, ob Verantwortung im Unternehmen wachsen kann. In praxisnahen Workshops reflektieren sie ihre eigene Führung, erkennen vertraute Muster und erproben neue Wege, Orientierung zu geben und Entscheidungsräume zu öffnen.",
        "Die Module richten sich an der Identität eures Unternehmens aus und greifen konkrete Situationen aus dem Alltag der Teilnehmenden auf. Zwischen den Modulen wird das Gelernte direkt angewendet.",
      ],
      ablauf: [
        "Abstimmung mit der Geschäftsleitung: Ziele, Teilnehmende und Schwerpunkte",
        "Mehrere halbtägige Module, verteilt über einige Monate",
        "Umsetzung im Alltag zwischen den Modulen",
        "Abschluss mit Rückblick und Ausblick auf die weitere Entwicklung",
      ],
    },
  },
];

export const metadata: Metadata = {
  title: "Consulting für Unternehmensführungen",
  description:
    "Wie wird ein Unternehmen zukunftsfähig? Ich begleite CEOs und Geschäftsleitungen dabei, Räume zu schaffen, in denen Menschen Verantwortung übernehmen.",
  alternates: { canonical: "/" },
};

export default function ConsultingPage() {
  return (
    <>
      {/* Hero — vollbild */}
      <HeroFull
        kicker="Consulting für Unternehmensführungen"
        headline="Wie wird ein Unternehmen zukunftsfähig?"
        lede="Unternehmen sind Orte, in denen Menschen mit Begeisterung wirken und abends erfüllt nach Hause gehen."
        tone="ink"
        media={
          <Image
            src="/images/consulting-hero.jpg"
            alt="Markus Tappolet steht im Anzug unter einem grossen Baum und blickt über die Landschaft zu den Bergen."
            fill
            priority
            sizes="100vw"
            className="object-cover object-[74%_12%]"
          />
        }
      />

      {/* Der aktuelle Alltag */}
      <SectionImage
        heading="Der aktuelle Alltag"
        imageSide="left"
        media={
          <Image
            src="/images/alltag-consulting.png"
            alt="Ein voll beschriebenes Whiteboard und ein Besprechungstisch voller Unterlagen — Sinnbild für Entscheidungsstau."
            width={1338}
            height={753}
            className="h-full w-full object-cover"
          />
        }
      >
        <p>
          Überlastet. Unklar. Blockiert. Entscheidungslos. In vielen
          Unternehmen entsteht ein Gefühl von Trägheit und
          Entscheidungslosigkeit. Viele geben ihr Bestes. Meetings reihen
          sich aneinander, bis die Kalender voll sind. Für das Wesentliche
          bleibt immer weniger Zeit.
        </p>
        <p>
          Projekte stagnieren in Abstimmungsschleifen. Verantwortung und
          Entscheidungen werden weitergegeben. So entsteht bei
          Führungskräften ein paradoxes Gefühl: Es geschieht viel, aber es
          kommt wenig in Bewegung.
        </p>
        <ScrollQuote>
          Die entscheidende Frage ist, warum so viel Aufwand so wenig
          Bewegung erzeugt.
        </ScrollQuote>
      </SectionImage>

      {/* Alte Strukturen */}
      <SectionImage
        heading="Alte Strukturen"
        imageSide="right"
        tint="var(--color-neutral-tint)"
        media={
          <ScrollGif
            src="/gifs/informationskette.gif"
            alt="Eine hierarchische Befehlskette bricht auseinander, während Informationen in alle Richtungen fluten."
          />
        }
      >
        <p className="text-[19px] leading-snug text-ink">
          Befehlsketten halten der Dynamik nicht mehr stand.
        </p>
        <p>
          Schon die ersten industriellen Revolutionen brachten eine
          Erhöhung der Geschwindigkeit. Durch den Eintritt ins digitale
          Zeitalter sieht man, wie sich alles exponentiell beschleunigt.
          Informationen fluten die Gesellschaft. Ausgangslagen verändern
          sich, bevor Entscheidungen getroffen werden können.
        </p>
        <p>
          Bis hierhin haben hierarchische Systeme Sicherheit und
          Orientierung gegeben. Zentral getroffene Entscheidungen sind über
          stabile Befehlsketten nach aussen getragen worden. Jeder wusste,
          was zu tun ist, ohne sich grosse Gedanken darüber zu machen.
        </p>
        <ScrollQuote>
          Funktioniert dieses System auch in einer komplexen, gleichzeitigen
          und volatilen Welt?
        </ScrollQuote>
      </SectionImage>

      {/* Ein anderes Denken */}
      <SectionImage
        heading="Ein anderes Denken"
        imageSide="left"
        media={
          <ScrollGif
            src="/gifs/ein-anderes-denken-consulting.gif"
            alt="Ein Mensch verlässt eine mechanische, zahnradgetriebene Welt und tritt in ein Licht voller neuer Möglichkeiten."
          />
        }
      >
        <p className="text-[19px] leading-snug text-ink">
          Probleme, die aus einer alten Logik entstanden sind, lassen sich
          nicht mit derselben Logik lösen.
        </p>
        <p>
          Lange ging es darum, Abläufe zu optimieren, Zuständigkeiten zu
          klären und Entscheidungen besser abzusichern. Das war sinnvoll,
          solange die Welt planbarer war.
        </p>
        <p>
          Heute entsteht Wirksamkeit an einer anderen Stelle. Dort, wo
          Menschen Zusammenhänge erkennen, Verantwortung übernehmen und
          näher am Geschehen entscheiden können.
        </p>
      </SectionImage>

      {/* Rhythmusbruch: Kernsatz vollbreit */}
      <BigQuote text="Erst wenn man die Perspektive verändert, wird eine neue Lösung sichtbar." />

      {/* Neue Orientierung — bridge to Lebendige Führung */}
      <SectionImage
        heading="Neue Orientierung"
        imageSide="right"
        tint="var(--color-consulting-tint)"
        media={
          <ScrollGif
            src="/gifs/lebendige-fuehrung-consulting-coaching.gif"
            alt="Zwei Hände halten Erde mit einem jungen Setzling, im Hintergrund ein grosser Baum."
          />
        }
      >
        <p className="text-[19px] leading-snug text-ink">
          Was braucht es, damit Mitarbeitende aus eigenem Antrieb
          Verantwortung übernehmen?
        </p>
        <p>
          Aus dieser Frage ist das Prinzip der Lebendigen Führung
          entstanden.
        </p>
        <Link
          href="/lebendige-fuehrung"
          className="inline-block font-medium text-accent hover:text-accent-dark"
        >
          Lebendige Führung kennenlernen →
        </Link>
        <p>
          Ich arbeite mit CEOs, die bereit sind, ihr eigenes Führungsbild zu
          klären. So entsteht Raum, in dem Menschen Verantwortung
          übernehmen und sich entwickeln können.
        </p>
      </SectionImage>

      {/* Angebot */}
      <OfferSection angebote={consultingAngebote} />

      {/* Kundenstimme */}
      <Testimonial
        quote="Markus kommt nicht mit vorgefertigten Antworten oder stülpt seine Lösungen über. Durch seine gezielten Fragen und seine wertschätzende Art hilft er mir, eigene Lösungen zu entwickeln und die richtigen Schlüsse für mich und mein Umfeld zu ziehen."
        name="Michael Kummer"
        role="Geschäftsführer Wibilea AG"
      />

      {/* Der klare Blick + Kennenlerngespräch */}
      <SectionImage
        heading="Der klare Blick"
        imageSide="left"
        media={
          <Image
            src="/images/portrait-anzug-baum.jpg"
            alt="Porträt von Markus Tappolet im Anzug vor einem Baumstamm."
            width={2000}
            height={1333}
            className="h-full w-full object-cover"
          />
        }
      >
        <p className="text-[19px] leading-snug text-ink">
          Durch meine Begleitung öffnet sich in dir eine neue Perspektive.
        </p>
        <p>
          Du siehst klarer, was wirkt, was blockiert und wo Entwicklung
          beginnen kann. So entstehen Räume, in denen Menschen Verantwortung
          übernehmen und das Unternehmen lebendiger wird.
        </p>
        <p>
          Ich zeige dir, wie du dein Unternehmen zu einem Ort entwickelst,
          an dem Menschen mit Begeisterung wirken und abends erfüllt nach
          Hause gehen.
        </p>
        <ContactForm segment="consulting" className="mt-2 max-w-sm" />
      </SectionImage>
    </>
  );
}
