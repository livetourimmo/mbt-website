"use client";

import { useRef } from "react";
import { useScrubScene, r1 } from "@/lib/use-scrub-scene";

// Consulting · Ein anderes Denken: derselbe Damm, jetzt von oben. Die
// Strömungslinien des Sees fliessen um ihn herum, fächern sich auf und laufen
// in Ankunftspunkten zusammen. Dort leuchtet accent – wie Blütenblätter um ein Zentrum.

const BLOCK = { x: 330, y: 126, width: 40, height: 248 };
const CENTER: [number, number] = [612, 250];
const RING = 118;
const AXIS = 250;

// Ankunftspunkte: oben und unten je fünf, einer ganz rechts
const ANGLES_TOP = [-158, -122, -88, -55, -24];
const ANGLES_BOTTOM = [158, 122, 88, 55, 24];
const pointAt = (deg: number): [number, number] => [
  r1(CENTER[0] + Math.cos((deg * Math.PI) / 180) * RING),
  r1(CENTER[1] + Math.sin((deg * Math.PI) / 180) * RING),
];
const ENDS = [...ANGLES_TOP, 0, ...ANGLES_BOTTOM].map(pointAt);
const endIndex = (top: boolean, j: number) => (j >= 10 ? 5 : top ? Math.floor(j / 2) : 6 + Math.floor(j / 2));

// Strömungslinien: vom See um den Damm herum zu einem Ankunftspunkt
const STREAMS = Array.from({ length: 22 }, (_, i) => {
  const y = 66 + i * 17;
  const top = y < AXIS;
  const j = top ? 10 - i : i - 11; // 0 = nahe der Achse
  const s = top ? -1 : 1;
  const edge = top ? BLOCK.y : BLOCK.y + BLOCK.height;
  const hug = edge + s * (10 + j * 8.5); // innere Linien schmiegen sich eng an
  const pass = top ? Math.min(y, hug) : Math.max(y, hug);
  const e = endIndex(top, j);
  const [ex, ey] = ENDS[e];
  const bx = BLOCK.x + BLOCK.width;
  const d =
    `M40 ${y} C${BLOCK.x - 90} ${y} ${BLOCK.x - 40} ${r1(pass)} ${BLOCK.x + BLOCK.width / 2} ${r1(pass)} ` +
    `C${bx + 70} ${r1(pass)} ${r1(ex - 80)} ${r1(ey)} ${ex} ${ey}`;
  return { d, e };
});

// Seitliche Verbindungen zwischen benachbarten Punkten – ein Netz ohne Spitze
const ORDER = [...ANGLES_TOP, 0, ...[...ANGLES_BOTTOM].reverse()].map(pointAt);
const LINKS = ORDER.slice(0, -1).map((p, i) => {
  const n = ORDER[i + 1];
  const mx = (p[0] + n[0]) / 2;
  const my = (p[1] + n[1]) / 2;
  return `M${p[0]} ${p[1]} Q${r1(mx + (mx - CENTER[0]) * 0.1)} ${r1(my + (my - CENTER[1]) * 0.1)} ${n[0]} ${n[1]}`;
});

const PARTICLES = [3, 18, 7, 14, 0, 21, 10, 11, 5, 16, 1, 20, 8, 13, 4, 17];

export default function Wasserweg() {
  const ref = useRef<HTMLDivElement>(null);

  useScrubScene(ref, (tl, q) => {
    const streams = q(".w-stream") as SVGPathElement[];
    tl.fromTo(q(".w-block"), { opacity: 0 }, { opacity: 1, duration: 0.06 }, 0)
      // Das Wasser fliesst heran, staut nicht, sondern weicht aus und fächert sich auf
      .fromTo(streams, { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.55, stagger: { each: 0.008, from: "edges" }, ease: "sine.inOut" }, 0.02);

    // Ideen reisen entlang der Strömung
    q(".w-particle").forEach((el, k) => {
      const path = streams[PARTICLES[k]];
      const start = 0.28 + (k / PARTICLES.length) * 0.5;
      tl.fromTo(el, { opacity: 0 }, { opacity: 0.85, duration: 0.02 }, start)
        .fromTo(el, { motionPath: { path, align: path, alignOrigin: [0.5, 0.5], start: 0.25, end: 0.25 } }, { motionPath: { path, align: path, alignOrigin: [0.5, 0.5], start: 0.25, end: 1 }, duration: 0.2, ease: "sine.in" }, start)
        .to(el, { opacity: 0, duration: 0.03 }, start + 0.18);
    });

    // Ankunft: accent-Punkte leuchten auf, dann verbinden sie sich
    tl.fromTo(q(".w-arrive"), { scale: 0, transformOrigin: "50% 50%" }, { scale: 1, duration: 0.07, stagger: { each: 0.025, from: "edges" }, ease: "back.out(2)" }, 0.5)
      .fromTo(q(".w-halo"), { scale: 0.4, opacity: 0, transformOrigin: "50% 50%" }, { scale: 1, opacity: 0.35, duration: 0.1, stagger: { each: 0.025, from: "edges" } }, 0.5)
      .fromTo(q(".w-link"), { drawSVG: "50% 50%" }, { drawSVG: "0% 100%", duration: 0.14, stagger: 0.01 }, 0.82);
  });

  return (
    <div ref={ref} className="line-scene relative aspect-[16/10] w-full bg-neutral-tint">
      <svg
        viewBox="20 2 760 475"
        className="absolute inset-0 h-full w-full"
        role="img"
        aria-label="Linienzeichnung von oben: Das Wasser eines Sees fliesst in vielen Strömungslinien um einen Damm herum. Wo es ankommt, leuchten violette Punkte auf, die sich wie Blütenblätter um ein Zentrum legen."
      >
        <defs>
          <pattern id="w-hatch" width={7} height={7} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1={0} y1={0} x2={0} y2={7} className="stroke-ink" strokeWidth={0.6} opacity={0.28} />
          </pattern>
        </defs>

        {/* Strömung */}
        <g className="fill-none stroke-ink" strokeWidth={0.75} strokeLinecap="round" opacity={0.42}>
          {STREAMS.map((s, i) => (
            <path key={i} className="w-stream" d={s.d} />
          ))}
        </g>

        {/* Damm von oben – gleiche Schraffur wie in der Seitenansicht */}
        <g className="w-block">
          <rect {...BLOCK} rx={3} fill="url(#w-hatch)" className="stroke-none" />
          <rect {...BLOCK} rx={3} className="fill-neutral-tint/40 stroke-ink" strokeWidth={1.2} />
        </g>

        {/* Netz zwischen den Ankunftspunkten */}
        <g className="fill-none stroke-ink" strokeWidth={0.7} strokeLinecap="round">
          {LINKS.map((d, i) => (
            <path key={i} className="w-link" d={d} opacity={0.35} />
          ))}
        </g>

        {/* Ideen unterwegs */}
        <g className="fill-ink">
          {PARTICLES.map((_, k) => (
            <circle key={k} className="w-particle" r={2.2} opacity={0} />
          ))}
        </g>

        {/* Ankunftspunkte */}
        {ENDS.map(([x, y], i) => (
          <g key={i}>
            <circle className="w-halo fill-none stroke-accent" cx={x} cy={y} r={11} strokeWidth={0.9} opacity={0.35} />
            <circle className="w-arrive fill-accent" cx={x} cy={y} r={4.5} />
          </g>
        ))}
      </svg>
    </div>
  );
}
