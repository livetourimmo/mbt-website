import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import SectionText from "@/components/section-text";
import SectionImage from "@/components/section-image";
import HeroFull from "@/components/hero-full";
import OfferSection, { type Angebot } from "@/components/offer-section";
import ContactForm from "@/components/contact-form";
import ScrollGif from "@/components/scroll-gif";
import ScrollQuote from "@/components/scroll-quote";
import BigQuote from "@/components/big-quote";

const coachingAngebote: readonly Angebot[] = [
  {
    titel: "Die eigene Führung gestalten",
    beschreibung:
      "Für Führungspersönlichkeiten, die ihre Rolle bewusster gestalten und ihre Wirkung im Führungsalltag weiterentwickeln möchten.",
    details: ["Persönlich und vertraulich", "Regelmässige Reflexion der eigenen Führung"],
  },
  {
    titel: "Klarheit in Führungssituationen",
    beschreibung:
      "Für Führungspersönlichkeiten, die in einer anspruchsvollen Situation Klarheit gewinnen und daraus einen tragfähigen nächsten Schritt entwickeln möchten.",
    details: [
      "Persönlich und vertraulich",
      "Einzelgespräch oder Begleitung über mehrere Termine",
    ],
  },
  {
    titel: "Verantwortung im Team stärken",
    beschreibung:
      "Für Führungspersönlichkeiten, die in ihrem Bereich mehr Eigenständigkeit und eine wirksame Zusammenarbeit ermöglichen möchten.",
    details: ["Gemeinsam mit dem eigenen Team", "Drei halbtägige Module"],
  },
];

export const metadata: Metadata = {
  title: "Coaching für Führungspersönlichkeiten",
  alternates: { canonical: "https://mbt-coaching.ch/" },
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
        lede="Mit innerer Klarheit äussere Wirksamkeit entfalten."
        tone="accent"
        media={
          // Ausschnitt aus dem Startseitenbild: Markus im Polo (Coaching-Seite des Bildes)
          <div className="absolute inset-y-0 right-0 w-full md:w-[198%]">
            <Image
              src="/images/startseite.png"
              alt="Markus Tappolet sitzt im Polo-Shirt entspannt auf einer Bank unter einem Baum."
              fill
              priority
              sizes="(min-width: 768px) 198vw, 100vw"
              className="object-cover object-[71%_50%] md:object-[100%_15%]"
            />
          </div>
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
        <ScrollQuote>
          Mitarbeitende erwarten Orientierung. Vorgesetzte erwarten
          Ergebnisse. Gleichzeitig fehlen bei wichtigen Fragen die Zeit, der
          Spielraum oder ein Gegenüber für einen offenen Austausch.
        </ScrollQuote>
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
        <ScrollQuote>
          Was braucht ein Mensch, der selbst denkt und urteilt, um gerne zu
          folgen?
        </ScrollQuote>
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
      </SectionText>

      {/* Rhythmusbruch: Kernsatz vollbreit */}
      <BigQuote text="Erst wenn man die Perspektive verändert, wird eine neue Lösung sichtbar." tone="accent" />

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

      {/* Angebot */}
      <OfferSection angebote={coachingAngebote} tint="var(--color-coaching-tint)" />

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
        <ScrollQuote>
          Ich begleite dich dahin, die Führungsperson zu sein, die du sein
          willst: klar von innen, wirksam im Alltag.
        </ScrollQuote>
        <ContactForm segment="coaching" tone="accent" className="mt-2 max-w-sm" />
      </SectionImage>
    </>
  );
}
