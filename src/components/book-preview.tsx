"use client";

import { useState } from "react";
import Image from "next/image";

/*
 * Buch-Mockup, das sich beim Darüberfahren aufschlägt.
 * Über dem Foto liegt exakt auf der Coverfläche ein flacher Umschlag, der sich
 * um die linke Kante dreht. Die Innenseite zeigt den Anfang von «Zum Einstieg»,
 * die rechte Seite den Beginn von «Am Seil». Erst ab lg (Desktop mit Maus),
 * darunter wäre der Text zu klein: dort bleibt das Foto stehen.
 * Lage des Covers im Foto (1600 × 1846 px): x 358–1242, y 244–1580.
 */
const COVER = { left: "22.375%", top: "13.22%", width: "55.25%", height: "72.37%" };

const serif = "[font-family:var(--font-newsreader),Georgia,serif]";
const ease = "duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none";

export default function BookPreview() {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="group/book relative h-full w-full lg:cursor-pointer"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* Bühne: rückt beim Öffnen nach rechts, damit die Doppelseite mittig steht.
          bg-paper, weil das Foto per multiply auf genau diesen Grund blendet. */}
      <div
        className={`absolute inset-0 bg-paper transition-transform [perspective:2200px] ${ease} ${
          open ? "lg:translate-x-[26%] lg:scale-[0.94]" : ""
        }`}
      >
        <Image
          src="/images/buch/buch-vorne.jpg"
          alt="Das Buch «Lebendige Führung» von Markus Tappolet liegt flach. Auf dem Umschlag steht ein Mann auf einer herbstlichen Wiese unter einem Baum und blickt in die Weite."
          fill
          priority
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-contain mix-blend-multiply"
        />

        <div className="absolute hidden [container-type:inline-size] lg:block" style={COVER}>
          {/* Licht wie im Foto von rechts oben. Der Buchblock rechts behält seinen
              echten Fotoschatten (11cqw nach links, 15cqw nach unten). Der aufgeklappte
              Umschlag hängt am Rücken auf Buchhöhe und fällt nach links bis auf den Tisch:
              eine Rampe. Ihr Schatten ist darum ein Keil unter der Unterkante, am Rücken
              so lang wie der des Buchblocks, links null. Seine rechte Spitze trifft die
              Ecke des Fotoschattens. Gleicher Ton wie dieser (gemessen 252 → 120), per
              darken aufgelegt: Wo beide Schatten liegen, zählt der dunklere statt der Summe.
              Wandert mit dem sich senkenden Umschlag vom Rücken nach links aus. */}
          <div
            aria-hidden
            className={`absolute top-full -left-full h-[15cqw] w-full bg-[rgb(120,120,121)] mix-blend-darken [clip-path:polygon(0_0,100%_0,calc(100%-11cqw)_100%)] origin-right transition-[transform,opacity] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
              open
                ? "scale-x-100 opacity-100 delay-300 duration-[1300ms]"
                : "scale-x-0 opacity-0 duration-[600ms]"
            }`}
          />

          {/* Rechte Seite: Leseprobe */}
          {/* -inset: deckt die Coverkante im Foto auch bei Rundungsdifferenzen ganz ab */}
          <div className="absolute -inset-[0.4cqw] border border-ink/10 bg-paper px-[9cqw] py-[10cqw] text-ink">
            {/* Seite wölbt sich leicht in den Falz */}
            <span
              aria-hidden
              className="absolute inset-y-0 left-0 w-[8cqw] bg-[linear-gradient(to_right,rgba(31,44,87,0.13),rgba(31,44,87,0.04)_45%,transparent)]"
            />
            <p className="text-[2.6cqw] tracking-[0.25em] text-ink-soft uppercase">Teil 1 · Kapitel 1</p>
            <p className={`${serif} mt-[3cqw] text-[8.5cqw] leading-none font-normal`}>Am Seil</p>
            <div className={`${serif} mt-[6cqw] space-y-[3cqw] text-[4.1cqw] leading-[1.55] font-normal`}>
              <p>
                Der Lichtkegel reichte bis zu den Fersen vor ihr. Zwei Schuhe,
                links, rechts, dazwischen Steine, die kurz aufleuchteten und
                wieder im Dunkeln lagen. Susanne setzte ihre Füsse dorthin, wo
                die Schuhe gerade gewesen waren.
              </p>
              <p>
                Die Luft war kalt und roch nach Stein. Sie hörte ihren Atem, das
                Knirschen unter den Sohlen und von irgendwo weiter unten das
                Rauschen eines Baches. Über ihr stand der Himmel voller Sterne,
                doch sie schaute kaum hinauf. Der Weg brauchte ihre Augen.
              </p>
              <p>«Hier etwas links», sagte eine Stimme von vorn.</p>
            </div>
          </div>

          {/* Umschlag: dreht sich um die linke Kante auf */}
          <div
            className={`absolute inset-0 origin-left transition-transform [transform-style:preserve-3d] ${ease} ${
              open ? "[transform:rotateY(-180deg)]" : ""
            }`}
          >
            <div className="absolute inset-0 [backface-visibility:hidden]">
              <Image
                src="/images/buch/buch-umschlag.jpg"
                alt=""
                fill
                sizes="30vw"
                className="object-cover"
              />
              {/* wird dunkler, während er sich vom Licht wegdreht */}
              <span
                aria-hidden
                className={`absolute inset-0 bg-ink transition-opacity ${ease} ${open ? "opacity-40" : "opacity-0"}`}
              />
            </div>
            {/* Innenseite des Umschlags */}
            <div className="absolute inset-0 flex flex-col justify-center border border-ink/10 bg-paper px-[11cqw] [backface-visibility:hidden] [transform:rotateY(180deg)]">
              <p className="text-[2.6cqw] tracking-[0.25em] text-ink-soft uppercase">Zum Einstieg</p>
              <p className={`${serif} mt-[5cqw] text-[5.6cqw] leading-[1.45] text-ink italic`}>
                Schön, dass du dieses Buch aufschlägst. Danke für dein Interesse
                und für die Zeit, die du ihm schenkst.
              </p>
              <span aria-hidden className="mt-[7cqw] block h-[2px] w-[10cqw] bg-accent" />
            </div>
          </div>
        </div>
      </div>

      <p
        aria-hidden
        className={`absolute inset-x-0 bottom-0 hidden text-center text-[14px] text-ink-soft transition-opacity duration-700 lg:block ${
          open ? "opacity-0" : "opacity-100"
        }`}
      >
        Mit der Maus über das Buch fahren: Leseprobe
      </p>

      {/* Tastatur: dasselbe Aufschlagen per Fokus und Enter/Leertaste */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        onBlur={() => setOpen(false)}
        aria-pressed={open}
        className="absolute hidden focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent lg:block"
        style={COVER}
      >
        <span className="sr-only">{open ? "Buch zuklappen" : "Buch aufschlagen und Leseprobe zeigen"}</span>
      </button>
    </div>
  );
}
