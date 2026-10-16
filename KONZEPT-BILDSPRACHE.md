# Konzept Bildsprache – MBT-Website (Version 2)

Stand: 14.10.2026 · Branch `bildsprache-neu` · zur Freigabe

Ersetzt Version 1. Grundlage sind eure Vorgaben **Staudamm** für Consulting und **Pusteblume** für Coaching.
**Texte bleiben unverändert.** Neu geschrieben werden nur alt-Texte und aria-labels, weil sich die Bilder ändern.

---

## 1. Die Idee in einem Satz

> **Consulting zeigt, was in Organisationen staut. Coaching zeigt, was einen Menschen leert. «Lebendige Führung» zeigt, was beides wieder wachsen lässt.**

Jede der zwei Türen bekommt ein eigenes, starkes Bild. Beide erzählen denselben Dreischritt wie die Texte: **Alltag → Problem → Lösung**.

| | Consulting | Coaching |
|---|---|---|
| Bild | Staudamm | Pusteblume |
| Was es erzählt | Ideen stauen sich vor einer steilen Hierarchie | Ein Mensch wird von Anforderungen leer geweht |
| Problem-Animation | Der Damm hält, das Wasser staut sich | Der Wind trägt Samen um Samen fort |
| Lösungs-Animation | Das Wasser findet seinen Weg herum | Von innen wächst eine neue, ganze Blüte |
| Was in beiden lebt | **Wasser** | **Samen** |

Auf der Seite **Lebendige Führung** kommen beide zusammen. Ein Pusteblumen-Samen sinkt in die Erde (Saatgut), und Wasser lässt ihn wachsen (Pflege). So sind die drei Seiten über ihre Bilder verbunden, ohne dass es jemand erklären muss.

---

## 2. Gestaltungsregeln für alle Animationen

**Stil «Lebendige Linie»**
- Feine Linien in `ink` (1–1,5 px) auf hellem Grund (`paper` oder die jeweilige Tint-Farbe der Seite)
- Flächen höchstens als Hauch von `ink` (4–8 % Deckkraft)
- Keine Schatten, keine Verläufe, keine Pastellflächen, kein Grau, kein Beige
- Formen sind gezeichnet, nicht fotografiert: ruhig, präzise, grafisch, in der Art einer feinen Architektur- oder Botanikzeichnung

**Farbe als Erzählung**
- In **Problem-Animationen gibt es kein `accent`**: Dort fehlt das Lebendige.
- `accent` erscheint erst dort, wo etwas lebendig wird: wo das Wasser ankommt, im Kern der neuen Blüte, in der Blüte auf «Lebendige Führung».
- Wer auf der Seite weiterscrollt, sieht also buchstäblich, wie Farbe ins Bild kommt.

**Signatur: die MBT-Blüte**
- Das Logo ist eine Blüte aus spitzen Blättern rund um eine offene Mitte, also eine Sonnen- bzw. Pusteblumenform.
- Am Ende jeder Lösungs-Animation steht eine Form, die an diese Blüte anklingt:
  - Coaching: die neue Pusteblume (fast wörtlich das Logo)
  - Consulting: die Ankunftspunkte des Wassers, die sich wie Blütenblätter um ein Zentrum legen
  - Lebendige Führung: die Blüte selbst

**Bewegung**
- **Gekoppelt an den Scroll:**
  - Die Animationen laufen ab, während man durch den Abschnitt scrollt. Rückwärts scrollen spult zurück.
  - Bild und Text stehen dabei wie heute nebeneinander. Es wird **nicht angepinnt**, das Lesen bleibt ungestört. Angepinnt wird nur auf «Lebendige Führung», wie bisher.
  - Die Bewegung zieht leicht nach (Nachzieh-Zeit 1 s). Alle Animationen nutzen die gleichen Kurven, nie federnd, nie hektisch.
- **Reduzierte Bewegung:** sofort ein ruhiges, aussagekräftiges Standbild (siehe pro Element)
- **Format:** gleiche Bildfläche wie heute (16:10, gleiche Eckenrundung), damit Satzspiegel und Layout bleiben

**Fotos «Nah dran»**
- Die echten Fotos von Markus und die Filme bleiben.
- Neue oder bestehende Stimmungsfotos werden farblich auf Markus' Fotos abgestimmt: warmes, weiches Tageslicht, leicht zurückgenommene Sättigung, feines Korn.

---

## 3. Consulting – Konzept «Staudamm»

Ablauf der Seite (Texte unverändert):

```
Hero (Foto Markus)                      bleibt
Der aktuelle Alltag   ── Foto ──        Ideen kleben fest           (Stau beginnt)
Alte Strukturen       ── Animation 1 ── Der Staudamm                (Problem)
Ein anderes Denken    ── Animation 2 ── Das Wasser findet den Weg   (Lösung)
Kernsatz «Perspektive»                  Seitenansicht → Aufsicht
Neue Orientierung     ── Video ──       Wasser lässt wachsen        (Brücke)
Angebot · Kundenstimme · Der klare Blick  bleiben
```

### 3.1 Der aktuelle Alltag – Foto
**Bild:** die Glaswand voller leerer Post-its, nur ein schmaler Streifen scharf. Dieses Bild habt ihr bereits erstellt und eingebaut.
**Warum es zum Staudamm passt:** Post-its sind Ideen. Hier hängen sie, ungenutzt, an einer Glaswand. Das ist der Stau, bevor man ihn als Damm sieht.
**Arbeit:** Farbanpassung an Markus' Fotos, feines Korn.

### 3.2 Alte Strukturen – Animation 1 «Der Staudamm»
**Ansicht:** Querschnitt von der Seite. Rechts steht der Damm, links der Stausee.

Der Damm ist **steil und gestuft**, jede Stufe ist eine Hierarchie-Ebene. Oben auf der Krone gibt es nur eine einzige, schmale Öffnung: die Spitze, über die alles muss.

```
Scroll  0 %                40 %                  80 %                 100 %
        ·  ·                ·· · ·· ·             ≈≈≈≈≈≈≈≈≈≈≈ ┐          ≈≈≈≈≈≈≈≈≈≈≈≈┐ ╷
        ────────┐           ≈≈≈≈≈≈≈≈┐             ≈·≈·≈·≈·≈·≈ ├┐         ≈·≈·≈·≈·≈·≈·├┐│ dünnes
                ├┐          ≈·≈·≈·≈ ├┐            ≈·≈·≈·≈·≈·≈ │├┐        ≈·≈·≈·≈·≈·≈·│├┐ Rinnsal
                │├┐         ≈·≈·≈·≈ │├┐           ≈·≈·≈·≈·≈·≈ ││├┐       ≈·≈·≈·≈·≈·≈·││├┐
        ────────┴┴┴──       ────────┴┴┴──         ────────────┴┴┴┴──     ─────────────┴┴┴┴──
        Damm steht leer      Wasser kommt          Pegel steigt, Ideen     Alles staut, nur ein
                                                   (Punkte) drücken an     Faden kommt durch
```

**Ablauf beim Scrollen:**
1. Zuerst steht der Damm allein, in feinen Konturlinien.
2. Von links fliesst Wasser herein: mehrere übereinanderliegende, ruhig gewellte Linien. Darin treiben kleine Punkte, die **Ideen**.
3. Der Pegel steigt, die Punkte treiben zum Damm und bleiben dort stehen. Sie verdichten sich an der Mauer.
4. Über die Krone rinnt nur ein **einziger dünner Faden** auf die andere Seite. Dort ist es leer und trocken (eine gerade Linie).
5. Ganz am Ende, synchron zur Frage «Funktioniert dieses System auch …?», zieht sich ein **feiner Haarriss** durch eine Stufe. Ein Hinweis, kein Bruch.

**Farbe:** nur `ink`, **kein `accent`**.
**Standbild (reduzierte Bewegung):** voller Stausee, verdichtete Ideen an der Mauer, dünnes Rinnsal, Haarriss.
**alt-Text:** «Linienzeichnung eines steilen, gestuften Staudamms. Davor staut sich Wasser voller kleiner Punkte, nur ein dünnes Rinnsal gelangt über die Krone.»

### 3.3 Ein anderes Denken – Animation 2 «Das Wasser findet den Weg»
**Ansicht:** **von oben**. Bewusst die andere Perspektive, die der folgende Kernsatz ausspricht: «Erst wenn man die Perspektive verändert, wird eine neue Lösung sichtbar.»

Der Damm ist jetzt ein Block in der Mitte, das Wasser kommt von links.

```
Scroll  0 %                       50 %                          100 %
        ≈≈≈≈≈≈≈≈ ███               ≈≈≈≈≈≈≈╮███ ╭─╮               ≈≈≈≈≈≈≈╮███ ╭─●─╮
        ≈≈≈≈≈≈≈≈ ███               ≈≈≈≈≈≈≈┼███─┤  ·              ≈≈≈≈≈≈≈┼███─┼─●─┼─●
        ≈≈≈≈≈≈≈≈ ███               ≈≈≈≈≈≈≈╯███ ╰─╮               ≈≈≈≈≈≈≈╯███ ╰─●─┴─●
        Wasser vor dem Block       Rinnen tasten sich herum      Ein Netz von Wegen, an jedem
                                                                 Ziel leuchtet ein Punkt (accent)
```

**Ablauf beim Scrollen:**
1. Das Wasser liegt als ruhige Fläche aus feinen Strömungslinien vor dem Block.
2. Einzelne Rinnen tasten sich seitlich um den Block herum. Sie zeichnen sich als weiche Linien und verzweigen sich wie ein Flussdelta oder Wurzeln.
3. Feine Punkte, wieder die **Ideen**, fliessen entlang dieser Wege, an vielen Stellen gleichzeitig.
4. Wo das Wasser ankommt, leuchtet ein Punkt in **`accent`** auf: **Menschen, die nahe am Geschehen entscheiden** (wörtlich aus dem Text). Diese Punkte ordnen sich locker um ein Zentrum, ein leiser Anklang an die MBT-Blüte.
5. Der Block bleibt stehen. Er wird nicht gesprengt, er wird einfach **unwichtig**.

**Farbe:** `ink`, **`accent` nur in den Ankunftspunkten**.
**Standbild:** das fertige Wegenetz mit allen accent-Punkten.
**alt-Text:** «Linienzeichnung von oben: Wasser fliesst in vielen verzweigten Wegen um einen Block herum. Wo es ankommt, leuchten violette Punkte auf.»

### 3.4 Kernsatz «Erst wenn man die Perspektive verändert …»
Bleibt, wie er ist. Er bekommt jetzt eine wörtliche Bedeutung: Davor sah man den Damm von der Seite, danach von oben. Keine zusätzliche Grafik.

### 3.5 Neue Orientierung – Video (Variante A)
Der Setzling in Erde, wie entschieden, als ruhiger Video-Loop statt GIF (WebM und MP4, mit Standbild).
**Verbindung:** Das Wasser, das seinen Weg gefunden hat, lässt etwas wachsen. Das ist die Brücke zu «Lebendige Führung».

### 3.6 Angebot, Kundenstimme, Der klare Blick
Bleiben. Optional siehe Kapitel 6.

---

## 4. Coaching – Konzept «Pusteblume»

Ablauf der Seite (Texte unverändert):

```
Hero (Foto Markus)                      bleibt
Der aktuelle Alltag   ── Foto ──        Keine Zeit zum Nachdenken
Informationszeitalter ── Animation 1 ── Die Pusteblume wird leer    (Problem)
Ein anderes Denken    ── Animation 2 ── Von innen wächst sie neu    (Lösung)  ← erhält neu ein Bild
Kernsatz «Perspektive»                  von aussen → nach innen
Neue Orientierung     ── Video ──       Ein Samen hat Wurzeln gefasst (Brücke)
Angebot · Der klare Blick               bleiben
```

### 4.1 Der aktuelle Alltag – Foto
**Bild:** das Stillleben am Fenster, das ihr bereits erstellt habt: Notizbuch, halb leere Tasse, Handy mit dem Bildschirm nach unten. Es steht für «keine Zeit zum Nachdenken».
**Arbeit:** Farbanpassung an Markus' Fotos, feines Korn. Zudem beschneide ich das Bild so, dass die unleserliche KI-Handschrift im Notizbuch nicht mehr ins Auge fällt.

### 4.2 Informationszeitalter – Animation 1 «Die Pusteblume wird leer»
**Bild:** eine einzelne Pusteblume, fein gezeichnet. Rund 90 Samen, jeder mit Stiel und einem Schirm aus feinen Strahlen. Ruhig, präzise, fast wie ein Logo.

```
Scroll  0 %             35 %              70 %               100 %
          ✳✳✳              ✳✳ ✳  ⸱          ✳     ⸱  ⸱           ·    ⸱        ⸱
         ✳✳✳✳✳            ✳✳✳ ⸱   ⸱         ✳ ⸱      ⸱   ⸱        ·      ⸱
          ✳✳✳              ✳✳  ⸱             ·           ⸱        |         ⸱
           |                |                |                    |
        volle Kugel      erste Böen         sie lichtet sich    kahler Stängel, wenige
                                                                Samen treiben davon
```

**Ablauf beim Scrollen:**
1. Die volle Kugel steht still.
2. Wind kommt auf, angedeutet durch wenige feine, waagrechte Linien, die von **allen Seiten** kommen: Informationen und Erwartungen von überall.
3. Samen um Samen löst sich und treibt davon, jeder auf einer eigenen, leicht geschwungenen Bahn, in verschiedene Richtungen. Zuerst einzeln, dann immer mehr.
4. Am Ende bleibt ein **kahler Stängel** mit dem leeren Blütenboden. Ein, zwei Samen treiben noch am Bildrand.
5. Mit der Frage «Was braucht ein Mensch, der selbst denkt und urteilt, um gerne zu folgen?» bleibt das Bild ruhig stehen.

**Farbe:** nur `ink`, **kein `accent`**.
**Standbild:** kahler Stängel, verstreute Samen im Bild.
**alt-Text:** «Linienzeichnung einer Pusteblume, deren Samen vom Wind aus allen Richtungen fortgetragen werden, bis nur der kahle Stängel bleibt.»

### 4.3 Ein anderes Denken – Animation 2 «Von innen heraus»
Dieser Abschnitt ist heute reiner Text. Er bekommt **neu ein Bild**, die Texte bleiben gleich. Der Abschnitt wird dafür im gleichen Layout wie die anderen Abschnitte gesetzt, Bild links, Text rechts.

Der Text sagt: «Verhalten folgt dem inneren Bild … verändert die eigene Führung von innen heraus.» Genau das zeigt die Animation.

```
Scroll  0 %             35 %              70 %               100 %
           ·                ●                 ✳●✳               ✳✳✳✳✳
           |               ·●·               ✳✳●✳✳             ✳✳✳●✳✳✳
           |                |                 ✳●✳               ✳✳✳✳✳
                                                                  |
        kahler Stängel    ein Kern leuchtet  Samen wachsen      eine neue, ganze Blüte –
                          (accent) innen     von innen nach     ruhig, vollständig,
                                             aussen             in der Form des MBT-Logos
```

**Ablauf beim Scrollen:**
1. Es beginnt dort, wo Animation 1 endet: der kahle Stängel.
2. In der Mitte des Blütenbodens erscheint ein kleiner **Kern in `accent`**, das innere Bild.
3. Von diesem Kern aus wachsen die Samen **von innen nach aussen** wieder nach, Strahl für Strahl, in einer ruhigen, kreisförmigen Bewegung.
4. Am Ende steht eine neue, volle Kugel, geordneter und klarer als zu Beginn. Ihre Form ist eine leise Anlehnung an die MBT-Blüte.

**Farbe:** `ink`, **`accent` nur im Kern**.
**Standbild:** die volle neue Blüte mit dem accent-Kern.
**alt-Text:** «Linienzeichnung: Aus einem violetten Kern wächst eine neue, vollständige Pusteblume von innen nach aussen.»

### 4.4 Kernsatz «Erst wenn man die Perspektive verändert …»
Bleibt, wie er ist. Bedeutung im Bild: Der Blick wechselt von aussen (Wind, Erwartungen) nach innen (Kern).

### 4.5 Neue Orientierung – Video (Variante A)
Der Setzling in Erde als ruhiger Video-Loop.
**Verbindung:** Einer der fortgewehten Samen hat irgendwo Wurzeln gefasst. Das ist die Brücke zu «Lebendige Führung».

### 4.6 Angebot, Der klare Blick
Bleiben. Optional siehe Kapitel 6.

---

## 5. Lebendige Führung – wo beide Bilder zusammenkommen

Alles aus Version 1 bleibt, mit zwei Verbindungen zu Consulting und Coaching.

### 5.1 Drei Bedingungen (angepinnt, Text 01–03 blendet passend)
Topf als feine, offene Kontur. Die Pflanze wächst in drei Phasen nach oben:
- **01 Saatgut:** Ein **Pusteblumen-Samen**, derselbe gezeichnete Samen wie auf Coaching, schwebt an seinem Schirm herab und sinkt in die Erde. Zwei feine Ringe zeigen, dass die Richtung angelegt ist.
- **02 Boden:** Wurzeln verzweigen sich in der Erde, im Code organisch erzeugt. Ein Keimling bricht durch.
- **03 Pflege:** Ein paar **Wassertropfen** fallen, dasselbe Wasser wie auf Consulting. Der Stängel wächst, die Blätter entfalten sich als Kontur, und am Ende öffnet sich die **MBT-Blüte in `accent`**, das einzige farbige Element.

### 5.2 Vom Organigramm zum Organismus (angepinnt)
1. **Organigramm:**
   - Schmale Rechtecke in `ink`-Kontur auf `neutral-tint`
   - Rechtwinklige Linien, eine Spitze oben
   - Die Hierarchie ist gestuft, dieselbe Treppenform wie der Staudamm auf Consulting.
2. **Übergang:**
   - Die Ecken runden sich, die Knoten werden zu Zellen.
   - Sie lösen sich aus dem Raster.
   - Die Linien biegen sich zu weichen, verzweigten Verbindungen wie Adern.
3. **Organismus:**
   - Seitliche Verbindungen kommen hinzu, es gibt keine Spitze mehr.
   - Im Zentrum steht eine kleine MBT-Blüte in `accent`.
   - Das Gewebe atmet kaum merklich (1–2 px).

Begleitbeschriftungen in kleiner Sora: «Hierarchie», «Übergang», «Organismus».
**Standbild:** der fertige Organismus.

### 5.3 Rhythmus-Rad (angepinnt)
- Feiner Ring (1,5 px, `ink` 20 %), keine Schatten, keine Pastell-Segmente
- Fünf kleine Punkte auf dem Ring, die Begriffe stehen aussen.
- Der Bogen des aktiven Abschnitts füllt sich beim Scrollen in `accent`. Durchlaufene Abschnitte bleiben als feine `ink`-Linie stehen.
- In der Mitte die MBT-Blüte als Kontur, darunter Nummer und Begriff in Newsreader kursiv
- Die Abschnitte bleiben anklickbar.

---

## 6. Optional: kleine Zeichen in den Angebotskarten
Eine Idee, die ich nur auf deinen Wunsch umsetze. Jede Angebotskarte bekäme ein winziges Liniensymbol aus dem Bildthema der Seite (ca. 32 px, 1,25 px Strich). Es zeichnet sich ein, wenn die Karte ins Bild kommt.

| Consulting | Symbol | Coaching | Symbol |
|---|---|---|---|
| Unternehmensidentität entwickeln | Quelle (konzentrische Ringe) | Die eigene Führung gestalten | Samen |
| Persönliche Begleitung | Flusslauf (ein geschwungener Kanal) | Klarheit in Führungssituationen | Keimling |
| Führungskräfteentwicklung | Delta (verzweigte Wege) | Verantwortung im Team stärken | Pusteblume |

Meine Empfehlung: **ja**. Es verankert das Bildthema bis in die Angebote, ohne laut zu sein.

---

## 7. Warum Animationen im Code statt Stock-Videos
In Version 1 waren Video-Loops vorgesehen (Dominosteine, Wasser, Pusteblume). Mit dem neuen Konzept empfehle ich, die Problem- und Lösungsbilder **im Code zu zeichnen**:
- **Erzählung:** Ein Stock-Video kann keinen *gestuften* Damm zeigen, der für Hierarchie steht. Es kann auch nicht von der Seiten- in die Aufsicht wechseln oder eine Pusteblume von innen nachwachsen lassen. Genau diese Details tragen eure Botschaft.
- **Steuerung:** Die Animation folgt dem Scroll und damit dem Lesetempo, auch rückwärts. Ein Video läuft einfach ab.
- **Einheit:** Alle Grafiken der Website (Consulting, Coaching, Lebendige Führung) sprechen dieselbe Linien-Sprache. Echte Fotos bleiben den echten Momenten vorbehalten.
- **Ladezeit und Lizenzen:** Grafiken wiegen wenige Kilobyte statt Megabyte, und es gibt keine Fremdrechte.

Einziges Video bleibt der Setzling («Neue Orientierung»). Er stammt aus eurem bestehenden GIF und wird als Video neu kodiert.

---

## 8. Technik

- **Animationen:**
  - SVG mit GSAP: ScrollTrigger und DrawSVG, beides schon im Projekt und kostenlos.
  - Für viele bewegte Punkte (Ideen im Wasser, Samen im Wind) nutze ich bei Bedarf ein Canvas, damit es auf dem iPhone flüssig bleibt.
  - Die Pusteblumen-Samen und die Wurzeln werden mit festem Zufallswert erzeugt: organisch, aber immer gleich.
- **Gemeinsame Bausteine:** Wasser, Samen und Blüte werden je einmal gebaut und auf allen Seiten wiederverwendet. Das spart Code und hält die Zeichnung identisch.
- **GIFs entfernen:**
  - Alle vier GIFs (17 MB) und die Komponente `ScrollGif` werden gelöscht.
  - Der Setzling wird mit ffmpeg zu WebM und MP4 mit Standbild umgewandelt. ffmpeg nutze ich dafür nur lokal als Werkzeug, es wird keine Projekt-Abhängigkeit.
- **Reduzierte Bewegung:** Überall wird das beschriebene Standbild gezeigt, ohne Anpinnen.
- **Barrierefreiheit:**
  - Neue deutsche alt-Texte bzw. aria-labels, wie oben vorgeschlagen
  - Die Texte der Seiten bleiben unverändert.
- **Ladezeit:**
  - Lighthouse vorher ist gemessen. Mobile: Consulting 85, Coaching 32, Lebendige Führung 40 Punkte. Desktop: 43, 55, 46.
  - Nach der Umsetzung messe ich erneut. Ziel: keine Verschlechterung. Durch das Wegfallen der GIFs ist eine Verbesserung zu erwarten.
- **Prüfung:** Nach jedem Element mache ich Screenshots auf Desktop (1440 px) und iPhone (390 px), zusätzlich mit reduzierter Bewegung. Ich messe die Flüssigkeit beim Scrollen. Was nicht auf Agenturniveau ist, überarbeite ich, bevor ich weitergehe.
- **Aufräumen:** nicht mehr benutzte Dateien löschen, Rohmaterial in `assets-roh/`.
- **`CREDITS.md`** mit allen Quellen. Voraussichtlich enthält sie nur eigene Grafiken und eure eigenen KI-Bilder, keine externen Assets.
- **Nur lokal:** Es wird nichts gepusht. Prüfen kannst du alles unter http://localhost:3001.

## 9. Reihenfolge

1. Gemeinsame Bausteine: Linienstil, Wasser, Samen, Blüte
2. Consulting: Animation 1 «Staudamm», dann Animation 2 «Wasser findet den Weg»
3. Coaching: Animation 1 «Pusteblume wird leer», dann Animation 2 «Von innen heraus»
4. Setzling-Video, GIFs entfernen, Farbanpassung der zwei Alltag-Fotos
5. Lebendige Führung: Drei Bedingungen, Organismus, Rhythmus-Rad
6. Optional: Symbole in den Angebotskarten
7. Art-Director-Durchgang über alle Seiten, Lighthouse nachher, Zusammenfassung

## 10. Was ich von dir brauche

1. **Okay zum Konzept**, besonders zur Verbindung beider Bilder auf «Lebendige Führung»
2. **Alltag-Fotos:** Post-its (Consulting) und Stillleben (Coaching) behalten, wie hier vorgeschlagen?
3. **«Ein anderes Denken» auf Coaching:** Darf der Abschnitt das Layout wechseln (Bild links, Text rechts), damit die Lösungs-Animation Platz hat?
4. **Kapitel 6:** Symbole in den Angebotskarten, ja oder nein?
