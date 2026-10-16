# Übergabe: Animationen «Organismus» und «Topf» (Lebendige Führung)

Stand: 16.10.2026 · Branch `bildsprache-neu`

Es geht um zwei scroll-gesteuerte Animationen auf der Seite **/lebendige-fuehrung**. Beide sind fertig und funktionieren. Deine Aufgabe ist, sie weiter zu verbessern. Der konkrete Auftrag kommt separat.

> **Wichtig:** `master` ist die Live-Seite (mbt-consulting.ch). Dort nie direkt arbeiten und nie hineinmergen. Alles läuft über eigene Branches und einen Pull Request in `bildsprache-neu`.

---

## 1. Einrichten

Voraussetzungen: Node.js 20 oder neuer (wir nutzen 24), Git, Zugriff auf das GitHub-Repository `livetourimmo/mbt-website`.

```bash
git clone https://github.com/livetourimmo/mbt-website.git
cd mbt-website
git checkout bildsprache-neu
git checkout -b animationen-<dein-name>   # dein eigener Arbeits-Branch
npm install
npm run dev
```

Dann <http://localhost:3000/lebendige-fuehrung> öffnen.

- Eine `.env`-Datei brauchst du nicht. Die einzige Umgebungsvariable (`RESEND_API_KEY`) betrifft nur das Kontaktformular.
- Den Ordner `assets-roh/` (Rohvideos, Original-Fotos) gibt es nur lokal bei uns. Für die Animationen brauchst du ihn nicht.

---

## 2. Die zwei Animationen

### A · Topf: «Drei Bedingungen» (Saatgut → Boden → Pflege)

Ein Pusteblumen-Samen sinkt in die Erde eines Topfes, Wurzeln wachsen, dann Stängel und Blätter, zum Schluss öffnet sich die MBT-Blüte in Pflaume (`accent`). Der Topf steht in der Mitte. Die drei Texte (01, 02, 03) erscheinen abwechselnd links und rechts und fallen dabei von oben herein.

| Datei | Inhalt |
|---|---|
| `src/components/growth-media.tsx` | Die Zeichnung (SVG) und ihre GSAP-Timeline. **Hier arbeitest du.** |
| `src/components/scroll-scrub.tsx` | Pinnt den Abschnitt, berechnet den Scroll-Fortschritt, zeigt die Texte. Option `centerMedia` = Topf in der Mitte, Texte links/rechts. |
| `src/app/(brand)/lebendige-fuehrung/page.tsx` | Einbindung: `<ScrollScrub … media={<GrowthMedia />} mobileScrub centerMedia />`. Die Texte stehen oben in der Datei (`bedingungen`). |

So funktioniert es:
- `ScrollScrub` legt einen hohen Abschnitt an (4 × Bildschirmhöhe), darin klebt der Inhalt (`sticky`). Über den Context `useScrubTrigger()` bekommt `GrowthMedia` dieses Element als ScrollTrigger-`trigger`.
- `GrowthMedia` baut **eine** GSAP-Timeline mit `scrub: 1.2`. Die Zeitachse läuft von 0 bis 3: 0–1 Saatgut, 1–2 Boden, 2–3 Pflege, passend zu den drei Texten.
- Linien zeichnen sich mit `drawSVG` (GSAP-Plugin, schon registriert).
- Die Timeline wird erst gebaut, kurz bevor der Abschnitt ins Bild kommt. Das hält das Laden der Seite schnell.
- Der Textwechsel ist reines CSS (Transitions) in `scroll-scrub.tsx`, im Block `if (centered)`. Die Funktion `fall()` steuert «von oben herein» und «nach unten hinaus».
- Auf dem Handy liegt der Text unter dem Topf (`stacked`). Die Variante links/rechts gilt nur ab 768 px Breite.

⚠️ `scroll-scrub.tsx` wird auch vom **Rhythmus-Rad** weiter unten auf derselben Seite genutzt. Änderungen dort bitte nur im Block `if (centered)` oder mit Rücksprache.

### B · Organismus: «Vom Organigramm zum Organismus»

Ein Organigramm (1–3–9 Kästchen mit rechtwinkligen Linien) wird beim Scrollen zu einem Zellgewebe:
1. Die rechten Winkel lösen sich.
2. Die Kästchen wachsen aufeinander zu und werden zu Zellen.
3. Die Linien verschwinden, weil sich die Nachbarn jetzt direkt berühren.
4. Neue Zellen wachsen nach.
5. Zum Schluss öffnet sich in einer Zelle die MBT-Blüte in Pflaume.

Darunter steht eine Zeile «Organigramm ——— Organismus» mit Fortschrittslinie.

| Datei | Inhalt |
|---|---|
| `src/components/organism-morph.tsx` | Alles: Geometrie, Zeichnung, Timeline. **Hier arbeitest du.** |
| `src/lib/use-scrub-scene.ts` | Liefert nur `seeded()` (deterministischer Zufall). Nicht ändern. |

So funktioniert es:
- **Geometrie:** Sie wird einmal beim Laden des Moduls berechnet und ist bei jedem Besuch gleich (fester Seed).
  - Das Gewebe entsteht aus einem Wabenraster, das zweimal entspannt wird (Lloyd-Iteration).
  - Daraus werden Voronoi-Zellen berechnet, in x-Richtung um den Faktor 1,3 gestreckt.
  - Jede Zelle wird um `GAP` nach innen versetzt und an den Ecken gerundet.
  - Randzellen mit zu wenigen Nachbarn fallen weg.
- **Morph:** Jedes Kästchen und jede Zelle hat genau `K = 48` Umrisspunkte. Die Zellpunkte werden in denselben Winkeln abgetastet wie die Kästchenpunkte. So lässt sich punktweise zwischen Rechteck und Zelle überblenden, ohne dass sich etwas verdreht.
- **Animation:** eine GSAP-Timeline mit `scrub: 1` über einen 300vh hohen Abschnitt mit `sticky`-Inhalt. Ein Proxy-Wert `t` läuft von 0 bis 1, und `render(t)` setzt bei jedem Frame die `d`-Attribute der Pfade.
  - Das Timing steuert die Hilfsfunktion `seg(t, start, länge)`.
  - Kästchen bewegen sich ab ca. 0,16, neue Zellen wachsen ab ca. 0,5, die Blüte erscheint ab 0,8.
- **Markup:** Es zeigt immer den Endzustand. Ohne JavaScript und bei reduzierter Bewegung steht das fertige Gewebe.
- **Stellschrauben:**
  - `ROW_Y` / `BOXES`: Organigramm
  - `ANISO`, `GAP`, `inTissue()`, Seed in `seeded(11)`: Gewebe
  - `seg(...)`-Werte in `boxState`, `cellPath`, `render`: Timing
  - `BLOOM_R`, `bloomBox`: Blüte

---

## 3. Gestaltungsregeln (bitte einhalten)

Ausführlich in `CLAUDE.md` und `KONZEPT-BILDSPRACHE.md`. Kurzfassung:

- **Farben** nur aus den CSS-Variablen in `src/app/globals.css`: `ink`, `accent`, `paper`, `neutral-tint` (plus Ableitungen). Kein Grau, kein Beige, keine Verläufe, keine Schatten.
- **Stil «Lebendige Linie»:** feine `ink`-Linien (ca. 1–1,5 px) auf hellem Grund. `accent` (Pflaume) **nur** dort, wo etwas lebendig wird, hier also nur die MBT-Blüte.
- **MBT-Blüte:** 16 spitze, umrandete Blätter um eine offene Mitte, wie im Logo (`public/images/logo-mbt.png`).
- **Bewegung:** ruhig und langsam, nur durch Scrollen gesteuert (`scrub`). Keine selbstlaufenden Effekte, nichts Federndes.
- **Reduzierte Bewegung** (`prefers-reduced-motion`): sofort den Endzustand zeigen, ohne Animation und ohne Pinning.
- **Responsive:** Desktop und Handy müssen beide funktionieren.
- Keine zusätzliche Dekoration, die nicht zur Aussage beiträgt.

---

## 4. Testen, bevor du übergibst

1. **Desktop** (ca. 1440 px) und **Handy** (ca. 390 px, DevTools-Gerätemodus): langsam vorwärts und rückwärts scrollen. Läuft alles flüssig und spult sauber zurück?
2. **Reduzierte Bewegung:** Chrome DevTools → ⋮ → More tools → Rendering → «Emulate CSS media feature prefers-reduced-motion: reduce». Erwartet: Endzustand, kein Pinning.
3. **Konsole:** keine Fehler oder Warnungen.
4. **Technische Prüfungen** (alle müssen ohne Fehler durchlaufen):
   ```bash
   npx tsc --noEmit
   npm run lint
   npm run build
   ```
   `npm run build` bitte bei gestopptem `npm run dev` ausführen.

---

## 5. Zurückgeben

1. Änderungen in kleinen, verständlichen Commits auf deinem Branch `animationen-<dein-name>`. Commit-Nachrichten gerne auf Deutsch.
2. Branch hochladen:
   ```bash
   git push -u origin animationen-<dein-name>
   ```
3. Auf GitHub einen **Pull Request** öffnen:
   - **base: `bildsprache-neu`** ← compare: `animationen-<dein-name>`
   - ⚠️ **Nicht `master`** als Ziel wählen, das wäre die Live-Seite.
4. In die Beschreibung des Pull Requests:
   - was du geändert hast und warum (kurz)
   - Screenshots oder eine kurze Bildschirmaufnahme (Desktop und Handy)
   - welche Dateien ausser `growth-media.tsx` und `organism-morph.tsx` betroffen sind, falls überhaupt
5. Vercel baut automatisch eine **Vorschau** und verlinkt sie im Pull Request. Über diesen Link wird abgenommen, die Live-Seite bleibt unberührt.
6. Nach der Abnahme wird der Pull Request in `bildsprache-neu` übernommen. Erst später, bei der Freigabe der ganzen neuen Bildsprache, geht alles zusammen live.

Fragen zu Konzept und Gestaltung: an die Auftraggeberin. Fragen zur Technik: Kommentar direkt im Pull Request.
