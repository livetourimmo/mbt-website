"use client";

import { useRef } from "react";
import { useScrubScene, seeded, r1 } from "@/lib/use-scrub-scene";

// Consulting · Alte Strukturen: Ein steiler, gestufter Damm (jede Stufe eine
// Hierarchie-Ebene). Davor staut sich Wasser voller Ideen, nur ein dünnes
// Rinnsal tropft über die Krone. Kein accent – hier fehlt das Lebendige.

const GROUND = 430;
const CROWN = 140;
const SURFACE = 168; // Pegel im Endzustand
const WALL = 455; // wasserseitige Dammkante
const LEFT = 50;

// Stufen: [x der Stufenkante, y der Stufe]
const STEPS: [number, number][] = [
  [487, 178],
  [519, 222],
  [552, 270],
  [588, 322],
  [628, 378],
  [670, GROUND],
];
// Krone mit einer schmalen Kerbe – die einzige Öffnung
const DAM =
  `M${WALL} ${GROUND} V${CROWN} H466 V145 H474 V${CROWN} H${STEPS[0][0]} ` +
  STEPS.map(([, y], i) => (i < STEPS.length - 1 ? `V${y} H${STEPS[i + 1][0]}` : `V${y}`)).join(" ");
const LEVELS = STEPS.slice(0, -1).map(([x, y]) => `M${WALL} ${y} H${x}`);

// Rinnsal: einzelne Tropfen fallen über die Stufen
const DROPS = (() => {
  const pts: [number, number][] = [[470, 136], [480, 136]];
  let prev: [number, number] = [STEPS[0][0], CROWN];
  for (const [x, y] of STEPS) {
    // über die Trittfläche der vorherigen Stufe, dann aussen an der Stufe hinunter
    if (x > prev[0]) pts.push([(prev[0] + x) / 2, prev[1] - 4]);
    for (const t of [0.2, 0.55, 0.9]) pts.push([x + 4, prev[1] + (y - prev[1]) * t]);
    prev = [x, y];
  }
  return pts.map(([x, y]) => [r1(x), r1(y)] as const);
})();

// Haarriss in der zweiten Stufe
const CRACK = "M508 232 L513 241 L510 249 L516 258 L513 266";

// Wasser: gewellte Linien, im Endzustand bis zum Pegel gefüllt
function wave(y: number, amp: number, phase: number) {
  let d = `M${LEFT} ${y}`;
  for (let x = LEFT; x < WALL; x += 30) {
    const dy = Math.sin((x + phase) / 37) * amp;
    d += ` Q${x + 15} ${r1(y + dy)} ${Math.min(x + 30, WALL)} ${y}`;
  }
  return d;
}
const WAVES = Array.from({ length: 13 }, (_, i) => ({
  d: wave(SURFACE + 15 + i * 19, 1.8, i * 23),
  o: 0.3 - i * 0.012,
}));

// Ideen: treiben von weit draussen an die Mauer und verdichten sich dort
const IDEAS = (() => {
  const rnd = seeded(5);
  return Array.from({ length: 95 }, () => {
    const x = WALL - 5 - Math.pow(rnd(), 1.9) * 120;
    const y = SURFACE + 10 + rnd() * (GROUND - SURFACE - 18);
    const sx = LEFT + 15 + rnd() * 200;
    const sy = SURFACE + 40 + rnd() * (GROUND - SURFACE - 50);
    return {
      x: r1(x),
      y: r1(y),
      dx: r1(sx - x),
      dy: r1(sy - y),
      r: r1(1.3 + rnd() * 1.7),
      o: r1(0.45 + rnd() * 0.5),
    };
  });
})();

// Trockener Grund hinter dem Damm
const DRY = Array.from({ length: 12 }, (_, i) => STEPS[STEPS.length - 1][0] + 10 + i * 7);

export default function Staudamm() {
  const ref = useRef<HTMLDivElement>(null);

  useScrubScene(ref, (tl, q) => {
    tl.fromTo(q(".d-ground, .d-dam"), { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.14 }, 0)
      .fromTo(q(".d-dam-fill"), { opacity: 0 }, { opacity: 1, duration: 0.1 }, 0.08)
      .fromTo(q(".d-level"), { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.06, stagger: 0.012 }, 0.1)
      .fromTo(q(".d-dry"), { opacity: 0 }, { opacity: 0.5, duration: 0.08, stagger: 0.004 }, 0.12)
      // Wasser steigt
      .fromTo(q(".d-water-clip"), { attr: { y: GROUND } }, { attr: { y: SURFACE }, duration: 0.6, ease: "sine.out" }, 0.12)
      .fromTo(q(".d-surface"), { y: GROUND - SURFACE, opacity: 0 }, { y: 0, opacity: 0.8, duration: 0.6, ease: "sine.out" }, 0.12)
      .fromTo(q(".d-waves"), { x: 0 }, { x: -24, duration: 0.88, ease: "none" }, 0.12)
      // Ideen treiben an die Mauer und bleiben stehen
      .fromTo(
        q(".d-idea"),
        { x: (i) => IDEAS[i].dx, y: (i) => IDEAS[i].dy, opacity: 0 },
        { x: 0, y: 0, opacity: (i) => IDEAS[i].o, duration: 0.4, stagger: { each: 0.0035, from: "random" }, ease: "power1.inOut" },
        0.3
      )
      // nur ein paar Tropfen kommen durch – dann der Haarriss
      .fromTo(q(".d-drop"), { opacity: 0, scale: 0, transformOrigin: "50% 50%" }, { opacity: 0.75, scale: 1, duration: 0.03, stagger: 0.007 }, 0.74)
      .fromTo(q(".d-crack"), { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.07 }, 0.92);
  });

  return (
    <div ref={ref} className="line-scene relative aspect-[16/10] w-full bg-paper">
      <svg
        viewBox="40 62 720 450"
        className="absolute inset-0 h-full w-full"
        role="img"
        aria-label="Linienzeichnung eines steilen, gestuften Staudamms. Davor staut sich Wasser voller kleiner Punkte, nur ein dünnes Rinnsal tropft über die Krone."
      >
        <defs>
          <clipPath id="d-water">
            <rect className="d-water-clip" x={LEFT} y={SURFACE} width={WALL - LEFT} height={GROUND} />
          </clipPath>
          <pattern id="d-hatch" width={7} height={7} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1={0} y1={0} x2={0} y2={7} className="stroke-ink" strokeWidth={0.6} opacity={0.28} />
          </pattern>
        </defs>

        {/* Stausee */}
        <g clipPath="url(#d-water)">
          <rect x={LEFT} y={0} width={WALL - LEFT} height={GROUND} className="fill-ink/[0.03]" />
          <g className="d-waves fill-none stroke-ink" strokeWidth={0.7}>
            {WAVES.map((w, i) => (
              <path key={i} d={w.d} opacity={w.o} />
            ))}
          </g>
        </g>
        <path className="d-surface fill-none stroke-ink" strokeWidth={1} d={wave(SURFACE, 2.2, 0)} opacity={0.8} />

        {/* Ideen */}
        <g className="fill-ink">
          {IDEAS.map((p, i) => (
            <circle key={i} className="d-idea" cx={p.x} cy={p.y} r={p.r} opacity={p.o} />
          ))}
        </g>

        {/* Damm: schraffiert wie in einer Konstruktionszeichnung */}
        <path className="d-dam-fill" fill="url(#d-hatch)" d={`${DAM} Z`} />
        <path className="d-dam fill-none stroke-ink" strokeWidth={1.2} strokeLinejoin="round" d={DAM} />
        <g className="fill-none stroke-ink" strokeWidth={0.7} opacity={0.45}>
          {LEVELS.map((d, i) => (
            <path key={i} className="d-level" d={d} />
          ))}
        </g>

        {/* Rinnsal und Haarriss */}
        <g className="fill-ink">
          {DROPS.map(([x, y], i) => (
            <circle key={i} className="d-drop" cx={x} cy={y} r={1.3} opacity={0.75} />
          ))}
        </g>
        <path className="d-crack fill-none stroke-ink" strokeWidth={0.6} strokeLinejoin="round" d={CRACK} />

        {/* Grund: unter dem Wasser durchgezogen, hinter dem Damm trocken */}
        <path className="d-ground fill-none stroke-ink" strokeWidth={1} d={`M${LEFT} ${GROUND} H${STEPS[STEPS.length - 1][0]}`} />
        <g className="fill-ink">
          {DRY.map((x) => (
            <circle key={x} className="d-dry" cx={x} cy={GROUND} r={0.9} opacity={0.5} />
          ))}
        </g>
      </svg>
    </div>
  );
}
