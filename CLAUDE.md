# MBT-Website

Next.js (App Router) + Tailwind v4 + GSAP. Design-Tokens und Seitenstruktur: siehe `HANDOFF.md`.

## Bildsprache

- **Farben** nur aus den bestehenden CSS-Variablen in `src/app/globals.css`: `ink`, `accent`, `paper`, `neutral-tint` (plus deren Ableitungen wie `ink-soft`, `accent-dark`). Kein Beige, kein Grau – auch nicht in Grafiken, Overlays oder Platzhaltern.
- **Animationen** sind ruhig und langsam und werden durch Scrollen gesteuert (GSAP ScrollTrigger mit `scrub`). Keine hektischen, selbstlaufenden Effekte.
- **prefers-reduced-motion**: immer direkt den Endzustand zeigen, ohne Animation und ohne Pinning.
- **Bilder** immer mit `next/image` einbinden und mit aussagekräftigem deutschem `alt`-Text versehen (beschreiben, was zu sehen ist – nicht „Bild von …“).
- **Rohdateien** (Original-Fotos, KI-Varianten, Videoclips) liegen in `assets-roh/` und werden nie direkt verwendet. Auf der Website kommen nur bearbeitete, optimierte Dateien aus `public/` zum Einsatz.
- **Keine GIFs.** Bewegte Fotos nur als stiller Video-Loop (`LoopVideo`, WebM und MP4 mit Standbild).
- **Externe Assets** immer mit Quelle und Lizenz in `CREDITS.md` festhalten.

### Bildthemen (Konzept: `KONZEPT-BILDSPRACHE.md`)
- **Consulting = Staudamm / Wasser:** Ideen stauen sich vor einer gestuften Hierarchie, und das Wasser findet seinen Weg herum.
- **Coaching = Pusteblume / Samen:** Ein Mensch wird leer geweht und wächst von innen neu.
- **Lebendige Führung** verbindet beides: Ein Pusteblumen-Samen sinkt in die Erde, Wasser lässt ihn wachsen.
- **Stil «Lebendige Linie»:** feine `ink`-Linien auf hellem Grund, keine Schatten oder Verläufe. `accent` erscheint nur dort, wo etwas lebendig wird, in Problem-Bildern nie. Die Signatur ist die MBT-Blüte (Logoform).
- **Szenen** liegen in `src/components/scenes/` und nutzen `useScrubScene` (`src/lib/use-scrub-scene.ts`). Das Markup zeigt den Endzustand, die Timeline läuft von 0 bis 1.
