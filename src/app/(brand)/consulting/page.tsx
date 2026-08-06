import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import SectionText from "@/components/section-text";
import SectionImage from "@/components/section-image";
import HeroFull from "@/components/hero-full";
import CtaButton from "@/components/cta-button";

export const metadata: Metadata = {
  title: "Consulting für Unternehmensführungen",
  description:
    "Wie wird ein Unternehmen zukunftsfähig? Ich begleite CEOs und Geschäftsleitungen dabei, Räume zu schaffen, in denen Menschen Verantwortung übernehmen.",
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
            src="/images/bank-ankunft.png"
            alt="Markus Tappolet geht unter einem Baum auf eine Bank zu, im Hintergrund ein See."
            fill
            priority
            sizes="100vw"
            className="object-cover"
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
        <p className="font-display text-[19px] font-medium text-ink">
          Die entscheidende Frage ist, warum so viel Aufwand so wenig
          Bewegung erzeugt.
        </p>
      </SectionImage>

      {/* Alte Strukturen */}
      <SectionText heading="Alte Strukturen" tint="var(--color-neutral-tint)">
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
        <p className="font-display text-[19px] font-medium text-ink">
          Funktioniert dieses System auch in einer komplexen, gleichzeitigen
          und volatilen Welt?
        </p>
      </SectionText>

      {/* Ein anderes Denken */}
      <SectionText heading="Ein anderes Denken">
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
        <p className="font-display text-[19px] font-medium text-ink">
          Erst wenn man die Perspektive verändert, wird eine neue Lösung
          sichtbar.
        </p>
      </SectionText>

      {/* Neue Orientierung — bridge to Lebendige Führung */}
      <SectionImage
        heading="Neue Orientierung"
        imageSide="right"
        tint="var(--color-consulting-tint)"
        media={
          <Image
            src="/images/saatgut-haende.png"
            alt="Zwei Hände halten Erde mit einem jungen Setzling, im Hintergrund ein grosser Baum."
            width={1672}
            height={941}
            className="h-full w-full object-cover"
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

      {/* Der klare Blick + Kennenlerngespräch */}
      <SectionImage
        heading="Der klare Blick"
        imageSide="left"
        media={
          <Image
            src="/images/markus-portrait.jpg"
            alt="Porträt von Markus Tappolet"
            width={640}
            height={960}
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
        <CtaButton href="/kennenlerngespraech" className="mt-2">
          Kennenlerngespräch vereinbaren
        </CtaButton>
      </SectionImage>
    </>
  );
}
