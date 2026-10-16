"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useScrubScene, seeded, r1 } from "@/lib/use-scrub-scene";
import { HEAD, STEM, makeSeeds } from "@/components/scenes/pusteblume-geometrie";

// Coaching · Informationszeitalter: Wind aus allen Richtungen trägt Samen um
// Samen fort, bis nur der kahle Stängel bleibt. Kein accent – hier leert sich etwas.

const SEEDS = makeSeeds(88, 3, 0.35);

// Flugbahn jedes Samens: weg vom Kopf, mit leichtem Auftrieb; wenige bleiben im Bild
const LINGER = new Set([12, 41, 67]);
const FLIGHTS = (() => {
  const rnd = seeded(9);
  return SEEDS.map((s, i) => {
    const m = Math.hypot(s.dir[0], s.dir[1]) || 1;
    let ux = s.dir[0] / m;
    let uy = s.dir[1] / m;
    if (m < 0.25) {
      const a = rnd() * Math.PI * 2;
      ux = Math.cos(a);
      uy = Math.sin(a);
    }
    const dist = LINGER.has(i) ? 150 + rnd() * 90 : 360 + rnd() * 260;
    const fx = ux * dist + (rnd() - 0.5) * 60;
    const fy = uy * dist * 0.75 - 50 - rnd() * 60;
    // seitliches Pendeln unterwegs
    const wob = (rnd() - 0.5) * 70;
    return {
      fx: r1(fx),
      fy: r1(fy),
      mx: r1(fx * 0.4 - uy * wob),
      my: r1(fy * 0.4 + ux * wob - 18),
      rot: r1((rnd() - 0.5) * 80),
      start: rnd(),
    };
  });
})();
// Reihenfolge: zuerst einzeln, dann immer mehr
const ORDER = FLIGHTS.map((f, i) => [f.start, i] as const)
  .sort((a, b) => a[0] - b[0])
  .map(([, i]) => i);

// Windstösse aus verschiedenen Richtungen
const GUSTS = [
  "M40 150 C180 140 300 170 470 150",
  "M770 260 C620 250 520 280 360 262",
  "M60 330 C200 300 330 320 500 290",
  "M740 110 C600 130 500 110 340 140",
  "M90 230 C230 215 360 240 560 210",
  "M760 340 C620 320 470 350 300 320",
];

// leerer Blütenboden mit kleinen Ansatzstellen
const PITS = Array.from({ length: 14 }, (_, i) => {
  const a = (i / 14) * Math.PI * 2;
  return [r1(HEAD[0] + Math.cos(a) * 9), r1(HEAD[1] + Math.sin(a) * 9)] as const;
});

export default function PusteblumeLeer() {
  const ref = useRef<HTMLDivElement>(null);

  useScrubScene(ref, (tl, q) => {
    const seeds = q(".p-seed");
    tl.fromTo(q(".p-stem"), { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.1 }, 0);
    q(".p-gust").forEach((g, k) => {
      const t = 0.1 + k * 0.12;
      tl.fromTo(g, { drawSVG: "0% 0%" }, { drawSVG: "0% 100%", duration: 0.1 }, t).to(g, { drawSVG: "100% 100%", duration: 0.1 }, t + 0.1);
    });

    ORDER.forEach((i, k) => {
      const f = FLIGHTS[i];
      const el = seeds[i];
      const tip = SEEDS[i].tip;
      const start = 0.12 + 0.68 * Math.pow(k / ORDER.length, 0.7);
      // Ausgangslage: am Kopf. Danach Flug in zwei Bögen, dabei Drehen und Verblassen.
      gsap.set(el, { x: 0, y: 0, rotation: 0, svgOrigin: `${tip[0]} ${tip[1]}`, opacity: SEEDS[i].front ? 0.9 : 0.35 });
      tl.to(el, { x: f.mx, y: f.my, duration: 0.1, ease: "sine.out" }, start)
        .to(el, { x: f.fx, y: f.fy, duration: 0.12, ease: "sine.in" }, start + 0.1)
        .to(el, { rotation: f.rot, opacity: 0, duration: 0.22, ease: "sine.in" }, start);
      // wer im Bild bleibt, wird am Ende seines Flugs vom ruhenden Gegenstück abgelöst
      if (LINGER.has(i)) tl.fromTo(q(`.p-linger-${i}`), { opacity: 0 }, { opacity: 0.6, duration: 0.04 }, start + 0.18);
    });
  });

  return (
    <div ref={ref} className="line-scene relative aspect-[16/10] w-full overflow-hidden bg-paper">
      <svg
        viewBox="0 0 800 500"
        className="absolute inset-0 h-full w-full"
        role="img"
        aria-label="Linienzeichnung einer Pusteblume, deren Samen vom Wind aus allen Richtungen fortgetragen werden, bis nur der kahle Stängel bleibt."
      >
        <g className="fill-none stroke-ink" strokeWidth={0.6} strokeLinecap="round" opacity={0.28}>
          {GUSTS.map((d, i) => (
            <path key={i} className="p-gust" d={d} />
          ))}
        </g>

        <path className="p-stem fill-none stroke-ink" d={STEM} strokeWidth={1.3} strokeLinecap="round" />
        <circle className="fill-paper stroke-ink" cx={HEAD[0]} cy={HEAD[1]} r={12} strokeWidth={1.1} />
        <g className="fill-ink" opacity={0.45}>
          {PITS.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={0.9} />
          ))}
        </g>

        {/* Samen am Kopf – im Endzustand fortgeweht */}
        <g className="fill-none stroke-ink" strokeLinecap="round">
          {SEEDS.map((s, i) => (
            <path key={i} className="p-seed" d={s.d} strokeWidth={s.front ? 0.8 : 0.6} opacity={0} />
          ))}
          {/* die wenigen, die noch im Bild treiben */}
          {[...LINGER].map((i) => {
            const f = FLIGHTS[i];
            const t = SEEDS[i].tip;
            return (
              <path
                key={i}
                className={`p-linger-${i}`}
                d={SEEDS[i].d}
                strokeWidth={0.8}
                opacity={0.6}
                transform={`translate(${f.fx} ${f.fy}) rotate(${f.rot} ${t[0]} ${t[1]})`}
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
}
