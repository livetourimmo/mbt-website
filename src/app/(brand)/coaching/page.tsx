import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import SectionText from "@/components/section-text";
import SectionImage from "@/components/section-image";
import HeroFull from "@/components/hero-full";
import OfferSection from "@/components/offer-section";
import ContactForm from "@/components/contact-form";
import ScrollGif from "@/components/scroll-gif";

export const metadata: Metadata = {
  title: "Coaching für Führungspersönlichkeiten",
  description:
    "Wer will ich als Führungsperson eigentlich sein? Ich begleite Führungspersönlichkeiten dabei, ihr eigenes Führungsbild zu klären.",
};

export default function CoachingPage() {
  return (
    <>
      {/* Hero — vollbild */}
      <HeroFull
        kicker="Coaching für Führungspersönlichkeiten"
        headline="Wer will ich als Führungsperson eigentlich sein?"
        lede="Unternehmen sind Orte, in denen Menschen mit Begeisterung wirken und abends erfüllt nach Hause gehen."
        tone="accent"
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
            src="/images/alltag-coaching.png"
            alt="Eine Führungsperson sitzt allein am Konferenztisch und blickt aus dem Fenster."
            width={1672}
            height={941}
            className="h-full w-full object-cover"
          />
        }
      >
        <p>
          Verantwortlich. Gefordert. Eingebunden. Getaktet. Entscheidungen
          treffen. Gespräche führen. Erwartungen erfüllen. Ansprechbar sein.
          Der Kalender ist gefüllt, die Themen wechseln rasch und vieles
          läuft über den eigenen Tisch.
        </p>
        <p>
          Zwischen Sitzungen, Gesprächen und operativen Aufgaben bleibt
          wenig Raum, um die eigene Führung bewusst zu betrachten. Der
          nächste Termin wartet bereits. Und am nächsten Morgen beginnt der
          Takt von Neuem.
        </p>
        <p className="font-display text-[19px] font-medium text-ink">
          Mitarbeitende erwarten Orientierung. Vorgesetzte erwarten
          Ergebnisse. Gleichzeitig fehlen bei wichtigen Fragen die Zeit, der
          Spielraum oder ein Gegenüber für einen offenen Austausch.
        </p>
      </SectionImage>

      {/* Informationszeitalter */}
      <SectionImage
        heading="Informationszeitalter"
        imageSide="right"
        tint="var(--color-coaching-tint)"
        media={
          <ScrollGif
            src="/gifs/informationszeitalter-coaching.gif"
            alt="Wissen strömt aus einer alten Bibliothek heraus und verbindet Menschen, die gemeinsam Informationen austauschen."
          />
        }
      >
        <p className="text-[19px] leading-snug text-ink">
          Wir leben in einer neuen Zeit mit alten Führungsbildern.
        </p>
        <p>
          Lange war Wissen ein Privileg weniger. Wer führte, wusste mehr,
          und wer folgte, fand darin Halt und Richtung. Mit den
          Massenmedien verbreitet sich Wissen schneller und formt das
          Informationszeitalter, wo es überall und jederzeit verfügbar ist.
          Damit verändert sich mehr als die Geschwindigkeit: Der Mensch
          selbst entwickelt sich weiter.
        </p>
        <p>
          Bis hierhin haben klare Vorgaben Orientierung und Sicherheit
          gegeben. Dieses Bild von Führung hat Generationen getragen. Die
          Menschen, die uns heute folgen, bilden sich ihr eigenes Urteil und
          suchen im Arbeiten Sinn, Mitgestaltung und Entwicklung.
        </p>
        <p className="font-display text-[19px] font-medium text-ink">
          Was braucht ein Mensch, der selbst denkt und urteilt, um gerne zu
          folgen?
        </p>
      </SectionImage>

      {/* Ein anderes Denken */}
      <SectionText heading="Ein anderes Denken">
        <p className="text-[19px] leading-snug text-ink">
          Probleme, die aus einer alten Logik entstanden sind, lassen sich
          nicht mit derselben Logik lösen.
        </p>
        <p>
          Lange ging es darum, das eigene Führungsverhalten zu verbessern:
          Methoden lernen, Gespräche vorbereiten, sich besser organisieren.
          Das hat vieles erleichtert und trägt bis heute.
        </p>
        <p>
          Wirksamkeit entsteht jedoch an einer tieferen Stelle. Verhalten
          folgt dem inneren Bild, das wir von Führung in uns tragen. Wer
          dieses Bild klärt, verändert die eigene Führung von innen heraus.
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
        tint="var(--color-coaching-tint)"
        media={
          <ScrollGif
            src="/gifs/lebendige-fuehrung-consulting-coaching.gif"
            alt="Zwei Hände halten Erde mit einem jungen Setzling, im Hintergrund ein grosser Baum."
          />
        }
      >
        <p className="text-[19px] leading-snug text-ink">
          Was braucht es, damit Menschen sich entfalten können?
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
          Ich begleite Führungspersönlichkeiten, die bereit sind, ihr
          eigenes Führungsbild zu klären. Aus dieser inneren Klarheit wächst
          Wirksamkeit im Alltag.
        </p>
      </SectionImage>

      {/* Angebot — zwei Musterangebote */}
      <OfferSection tint="var(--color-coaching-tint)" />

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
          Du erkennst das Führungsbild, das dich bisher geleitet hat, und du
          gestaltest das Bild, das dich künftig leiten soll. Du siehst
          klarer, was deine Führung trägt, was dir Kraft gibt und wo dein
          nächster Entwicklungsschritt liegt.
        </p>
        <p className="font-display text-[19px] font-medium text-ink">
          Ich begleite dich dahin, die Führungsperson zu sein, die du sein
          willst: klar von innen, wirksam im Alltag.
        </p>
        <ContactForm segment="coaching" tone="accent" className="mt-2 max-w-sm" />
      </SectionImage>
    </>
  );
}
