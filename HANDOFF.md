# Handoff: MBT-Consulting / MBT-Coaching Website

## Overview
Neue Website für Markus Tappolet, zwei Marken (Consulting & Coaching) mit gemeinsamem inhaltlichem Kern "Lebendige Führung". Zwei Zielgruppen-Startseiten führen in eine gemeinsame Vertiefungsseite, gemeinsame "Über mich"-Seite und ein gemeinsames Kontakt-/Kennenlerngespräch-Ziel.

## Fidelity
**Nur Struktur und Design-Tokens — kein visuelles Hifi-Design.** Es gab HTML-Layoutentwürfe in diesem Projekt, die vom Auftraggeber visuell abgelehnt wurden. Dieses Handoff enthält absichtlich **nur**:
1. Die Farb- und Typografie-Tokens (unten), abgeleitet aus der bestehenden Live-Seite mbt-consulting.ch
2. Die Informationsarchitektur und den Content-Fluss pro Seite

Die eigentliche visuelle Gestaltung (Layout, Komponenten-Look, Spacing-Feingefühl, Bildkomposition) soll von Claude Code / dem Entwickler-Team neu und hochwertig gestaltet werden — nicht die vorherigen HTML-Entwürfe nachbauen.

## Design-Tokens

### Farben
| Token | Hex | Verwendung |
|---|---|---|
| `ink` | `#1F2C57` | Haupttext, Headlines, dunkler Anker (z.B. Footer/CTA-Band-Hintergrund) |
| `ink-soft` | `#5B6480` | Sekundärtext, Fliesstext auf hellem Grund |
| `accent` (Aubergine) | `#5C3369` | Einziger Akzent: Buttons, CTA-Pills, Icon-Kacheln, Links |
| `accent-dark` | `#331641` | Hover-/Active-State des Akzents |
| `consulting-tint` | `#DCE1F4` | Flächenfarbe auf Consulting-Seiten (kühles Lavendel) |
| `coaching-tint` | `#F0E3ED` | Flächenfarbe auf Coaching-Seiten (warmes Lavendel) |
| `neutral-tint` | `#EEF1FA` | Flächenfarbe auf dem gemeinsamen Kern (Lebendige Führung, Über mich) |
| `paper` | `#FCFBFA` | Grundhintergrund / Seitenweiss |
| `hairline` | `#E4E4EE` | Trennlinien, dünne Borders |

Prinzip: **Ein gemeinsamer Kern (ink + accent) trägt beide Marken.** Nur die Flächenfarbe (Tint) unterscheidet Consulting von Coaching — nicht der Akzent selbst. Das hält die Marke einheitlich, obwohl es zwei Türen sind.

### Typografie
- **Headlines**: Sora (600), geometrisch, klar — für Consulting- und Coaching-Seiten.
- **Fliesstext / UI / Navigation**: Work Sans (400/600).
- **Register-Wechsel auf der Seite "Lebendige Führung"**: Headlines dort in Newsreader (500, italic) statt Sora — bewusster Bruch, um die reflexive, organische Tonalität dieser Seite gegenüber den geschäftlichen Türen abzusetzen.
- Body-Text grosszügig: ~16–18px, Zeilenhöhe 1.6–1.7.

### Buttons
Primär-CTA: `accent`-Fläche, weisse Schrift, Pill-Form (`border-radius: 999px`), Pfeil-Präfix „→". Sekundär: transparent mit `ink`-Border.

## Sitemap / Informationsarchitektur

```

  Start (Consulting)           Start (Coaching)
        │                            │
        └──────────┬─────────────────┘
                    ▼
        Gemeinsamer Kern:
          - Lebendige Führung  (Vertiefungsseite)
          - Über mich
          - Kontakt / Kennenlerngespräch
```

Navigation (identisch auf allen Seiten, 5 Punkte): **Consulting · Coaching · Lebendige Führung · Über mich · Kontakt**. Aktueller Menüpunkt visuell hervorgehoben (Unterstrich in `accent`).

Regel: "Start" bleibt immer innerhalb der Domain, von der der Besucher kam (canonical-Tag auf Hauptadresse für SEO). "Lebendige Führung" und "Über mich" sind je ein Inhalt, unter beiden Domains sichtbar.

## Seiten & Content-Struktur

### 1. Startseite Consulting (mbt-consulting.ch)
Ton: Blick aufs System. Flächenfarbe: `consulting-tint`.
1. Hero: Frage-Headline "Wie wird ein Unternehmen zukunftsfähig?" + Subline "Consulting für Unternehmensführungen" + CTA "Kennenlerngespräch"
2. Vision-Block: "Lebendige Führung ist das Betriebssystem für Verantwortung" + 3 Kurz-Benefits (Strategischer Freiraum / Entscheidungen klarer & schneller / Talente binden) + Porträtbild
3. "Der aktuelle Alltag" — Pain-Points-Absatz + Pull-Quote
4. "Alte Strukturen" — warum alte Führungssysteme nicht mehr tragen + Pull-Quote
5. "Ein anderes Denken" — Reframe + Pull-Quote
6. "Neue Orientierung" — Brücken-Absatz + CTA-Link zu "Lebendige Führung kennenlernen"
7. "Der klare Blick" — was die Begleitung konkret bringt
8. CTA-Band "Kennenlerngespräch" (dunkler Hintergrund, Button "Termin vereinbaren")
9. Footer: Logo, Nav, Kontaktdaten, Copyright

### 2. Startseite Coaching (mbt-coaching.ch)
Ton: Blick auf die Person. Flächenfarbe: `coaching-tint`. Gleiche Struktur wie Consulting, Inhalt personenzentriert:
1. Hero: "Wer will ich als Führungsperson eigentlich sein?" + "Coaching für Führungspersönlichkeiten"
2. Vision-Block: "Mit innerer Klarheit äussere Wirksamkeit entfalten" + 3 Benefits (klareres Führungsbild / Wirksamkeit im Alltag / erfüllt nach Hause gehen)
3. "Der aktuelle Alltag" (persönlich: Verantwortlich, Gefordert, Eingebunden, Getaktet)
4. "Informationszeitalter" — neue Zeit, alte Führungsbilder
5. "Ein anderes Denken" — inneres Führungsbild klären
6. "Neue Orientierung" → CTA "Lebendige Führung kennenlernen"
7. "Der klare Blick" — was das Coaching konkret bringt
8. CTA-Band "Kennenlerngespräch"
9. Footer

### 3. Lebendige Führung (gemeinsamer Kern, neutral)
Flächenfarbe: `neutral-tint`. Register-Wechsel: Headlines in Newsreader.
1. Hero: "Lebendige Führung" + "Verantwortung wirkungsvoll übergeben"
2. Intro: Gärtner-Metapher (Pflanze statt Bauwerk)
3. Drei Bedingungen als gleichwertige Spalten: **Saatgut** (Orientierung/Sinn/Werte) · **Boden** (Entscheidungsraum) · **Pflege** (aufmerksames Begleiten)
4. Führungsrhythmus als Kreislauf: Ausprobieren → Resonanz erleben → Innehalten → Reflektieren → Entscheiden → (zurück zu Ausprobieren)
5. "Wie es wachsen kann" — Entwicklung beginnt im Kleinen
6. "Entwicklung aufmerksam begleiten" — Leistungsbeschreibung
7. Einladung/CTA: "Möchtest Du erfahren, wie das in Deinem Unternehmen aussieht? Lass uns reden." → Kontakt

### 4. Über mich (gemeinsamer Kern)
1. Foto + Name (Markus Tappolet) + Kurzrolle
2. Vision-Zitat: "Mit innerer Klarheit äussere Wirksamkeit entfalten"
3. Werdegang (chronologisch)
4. Ausbildungen/Zertifikate

### 5. Kontakt / Kennenlerngespräch (gemeinsamer Kern)
1. Headline "Kennenlerngespräch" + Einladungstext
2. Formular: Name, E-Mail, Anliegen (Consulting/Coaching), Nachricht
3. Kontaktdaten: Telefon, E-Mail, Adresse (Seestrasse 40, 8330 Pfäffikon ZH)

## Assets
- Bestehendes Logo (Sonnenblumen-Mark + "MBT-Consulting" Wortmarke) — vom Kunden bereitstellen lassen, nicht neu gestalten.
- Grossformatige, ruhige Porträtfotos von Markus Tappolet (mehrere bereits vorhanden, im Projekt unter `uploads/`).

## Files
Keine HTML-Dateien beigelegt — bewusst, siehe Fidelity-Hinweis oben. Nur dieses README als Spezifikation für Tokens + Struktur.
