"use client";

import { useRef } from "react";
import Image from "next/image";
import { useScrubScene, seeded, r1 } from "@/lib/use-scrub-scene";

// Consulting · Alte Strukturen als Illustration. Grundlage ist ein einziges
// Bild (leeres Becken, gestufter Damm), dazu das freigestellte Ufer davor.
// Wasser, Papierschiffchen, Wasserfaden
// und Haarriss liegen als Ebenen darüber und werden beim Scrollen bewegt –
// dadurch passt alles von selbst deckungsgleich. Kein accent im Problem-Bild.
// Markup = Endzustand, bei reduzierter Bewegung bleibt genau der stehen.

// Koordinaten im Bild (1920 × 1200)
const W = 1920;
const H = 1200;
const WALL = 973; // wasserseitige Dammkante
const FLOOR = 969; // Beckengrund
const HALF = 640; // Pegel Zwischenstand (halbe Dammhöhe)
const FULL = 334; // Pegel Endzustand: knapp unter der Krone (307), über dem Kerbenboden (343)

// Wasserfaden: tritt unter der Kerbe aus und rinnt eng an der Kante Stufe für Stufe hinunter
const RISERS = [1154, 1220, 1271, 1328, 1383, 1443, 1502, 1551, 1604, 1666];
const TREADS = [427, 487, 549, 609, 669, 729, 789, 849, 911, 968];
const THREAD =
  `M${RISERS[0] - 5} 346 ` +
  RISERS.map((x, i) => `V${TREADS[i] + 5}` + (i < RISERS.length - 1 ? ` H${RISERS[i + 1] - 5}` : "")).join(" ");

// Haarriss in einer der mittleren Stufen
const CRACK = "M1296 556 l7 15 l-5 13 l9 17 l-4 12 M1302 584 l-11 9";

// Papierschiffchen = Ideen: treiben erst verstreut, drängen sich dann an der Mauer
const BOATS = (() => {
  const rnd = seeded(11);
  const n = 9;
  return Array.from({ length: n }, (_, i) => {
    // Endlage: dicht an dicht vor der Mauer, die grössten vorne
    const ex = WALL - 62 - i * 64 - rnd() * 14;
    const sx = 90 + rnd() * 560;
    return {
      sx: r1(sx),
      ex: r1(ex),
      s: r1(2.1 - i * 0.07 + rnd() * 0.3),
      tilt: r1((rnd() - 0.5) * 8),
      dy: r1(rnd() * 6),
    };
  });
})();

function Boat({ s, tilt }: { s: number; tilt: number }) {
  return (
    <g transform={`rotate(${tilt}) scale(${s})`}>
      <path
        d="M-14 -9 L0 -34 L14 -9 Z"
        fill="var(--color-consulting-tint)"
        stroke="var(--color-consulting-accent)"
        strokeOpacity={0.45}
        strokeWidth={0.9}
        strokeLinejoin="round"
      />
      <path d="M0 -34 V-9" stroke="var(--color-consulting-accent)" strokeOpacity={0.45} strokeWidth={0.9} />
      <path d="M-29 -9 H29 L19 4 H-19 Z" fill="var(--color-paper)" />
      <path d="M-19 4 H19" stroke="var(--color-consulting-accent)" strokeOpacity={0.35} strokeWidth={1} />
    </g>
  );
}

export default function StaudammIllustration() {
  const ref = useRef<HTMLDivElement>(null);

  useScrubScene(ref, (tl, q) => {
    const water = q(".d-water")[0];
    const top = q(".d-top")[0];
    const boats = q(".d-boat");

    // 1 · Wasser steigt bis zur halben Höhe, Ideen tauchen auf und treiben heran
    tl.fromTo(water, { attr: { y: FLOOR, height: 0 } }, { attr: { y: HALF, height: FLOOR - HALF }, duration: 0.4 }, 0);
    tl.fromTo(top, { y: FLOOR - FULL }, { y: HALF - FULL, duration: 0.4 }, 0);
    tl.fromTo(top, { opacity: 0 }, { opacity: 1, duration: 0.12 }, 0.1);
    boats.forEach((el, i) => {
      const b = BOATS[i];
      tl.fromTo(el, { x: b.sx - 90 }, { x: b.sx, duration: 0.4 }, 0.05);
      // 2 · Wasser steigt weiter, die Schiffchen drängen sich an die Mauer
      tl.to(el, { x: b.ex, duration: 0.42 }, 0.44);
    });
    tl.to(water, { attr: { y: FULL, height: FLOOR - FULL }, duration: 0.4 }, 0.44);
    tl.to(top, { y: 0, duration: 0.4 }, 0.44);
    tl.fromTo(q(".d-notch"), { opacity: 0 }, { opacity: 1, duration: 0.04 }, 0.8);

    // 3 · Nur ein dünner Faden rinnt über die Stufen, dann zeigt sich der Riss
    tl.fromTo(q(".d-thread"), { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.14, ease: "none" }, 0.8);
    tl.fromTo(q(".d-crack"), { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.06 }, 0.92);
    tl.set({}, {}, 1);
  });

  return (
    <div ref={ref} className="relative aspect-[16/10] w-full overflow-hidden bg-paper">
      <Image
        src="/illustrationen/consulting-damm.jpg"
        alt="Querschnitt durch eine Landschaft: Ein hoher, gestufter Staudamm hält einen bis knapp unter die Krone gefüllten Stausee zurück. Papierschiffchen drängen sich dicht an der Mauer, nur ein dünner Wasserfaden rinnt über die Stufen, in einer Stufe zeigt sich ein feiner Riss. Das Land hinter dem Damm bleibt trocken."
        width={W}
        height={H}
        sizes="(min-width: 768px) 58vw, 100vw"
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Wasser: deckend, mit derselben Körnung wie das Bild */}
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <pattern id="damm-wasser" patternUnits="userSpaceOnUse" width={256} height={256}>
            <image href="/illustrationen/wasser-korn.png" width={256} height={256} />
          </pattern>
        </defs>
        <rect className="d-water" x={0} y={FULL} width={WALL} height={FLOOR - FULL} fill="url(#damm-wasser)" />
        <rect className="d-notch" x={1069} y={FULL} width={15} height={343 - FULL} fill="url(#damm-wasser)" />
      </svg>
      {/* Ufer und Grund liegen vor dem Wasser, damit es im Becken bleibt */}
      <Image
        src="/illustrationen/consulting-damm-ufer.png"
        alt=""
        width={980}
        height={H}
        sizes="(min-width: 768px) 30vw, 52vw"
        className="pointer-events-none absolute left-0 top-0 h-full w-[51.0417%]"
      />
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden>
        <path className="d-thread" d={THREAD} fill="none" stroke="var(--color-paper)" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
        <path className="d-crack" d={CRACK} fill="none" stroke="var(--color-ink)" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
        <g className="d-top">
          <line x1={0} x2={WALL} y1={FULL} y2={FULL} stroke="var(--color-paper)" strokeOpacity={0.7} strokeWidth={3} />
          {[18, 46, 84].map((d, i) => (
            <line key={d} x1={0} x2={WALL} y1={FULL + d} y2={FULL + d} stroke="var(--color-paper)" strokeOpacity={0.22 - i * 0.05} strokeWidth={2} strokeDasharray={`${120 - i * 20} ${60 + i * 30}`} />
          ))}
          {BOATS.map((b, i) => (
            <g key={i} className="d-boat" transform={`translate(${b.ex} ${FULL + 2 + b.dy})`}>
              <Boat s={b.s} tilt={b.tilt} />
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
