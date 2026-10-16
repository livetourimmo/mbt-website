"use client";

import { useRef } from "react";
import { useScrubScene } from "@/lib/use-scrub-scene";
import { HEAD, STEM, makeSeeds } from "@/components/scenes/pusteblume-geometrie";

// Coaching · Ein anderes Denken: Vom kahlen Stängel aus erscheint ein Kern in
// accent – das innere Bild. Von dort wachsen die Samen von innen nach aussen
// nach, bis eine neue, ganze Blüte steht (Anklang an die MBT-Blüte).

// geordneter als vorher: kaum Zufall
const SEEDS = makeSeeds(96, 3, 0.08);
// im Kreis herum wachsen lassen, hintere Samen zuerst
const ORDER = SEEDS.map((s, i) => [s.angle + (s.front ? 10 : 0), i] as const)
  .sort((a, b) => a[0] - b[0])
  .map(([, i]) => i);

export default function PusteblumeInnen() {
  const ref = useRef<HTMLDivElement>(null);

  useScrubScene(ref, (tl, q) => {
    const seeds = q(".p-seed");
    tl.fromTo(q(".p-core"), { scale: 0, transformOrigin: "50% 50%" }, { scale: 1, duration: 0.12, ease: "back.out(1.6)" }, 0.06)
      .fromTo(q(".p-pulse"), { scale: 0.6, opacity: 0.55, transformOrigin: "50% 50%" }, { scale: 3.2, opacity: 0, duration: 0.22, stagger: 0.09, ease: "sine.out" }, 0.12);
    ORDER.forEach((i, k) => {
      tl.fromTo(seeds[i], { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.16, ease: "sine.out" }, 0.22 + (k / ORDER.length) * 0.62);
    });
  });

  return (
    <div ref={ref} className="line-scene relative aspect-[16/10] w-full overflow-hidden bg-coaching-tint">
      <svg
        viewBox="0 0 800 500"
        className="absolute inset-0 h-full w-full"
        role="img"
        aria-label="Linienzeichnung: Aus einem violetten Kern wächst eine neue, vollständige Pusteblume von innen nach aussen."
      >
        <path className="fill-none stroke-ink" d={STEM} strokeWidth={1.3} strokeLinecap="round" />

        <g className="fill-none stroke-ink" strokeLinecap="round">
          {SEEDS.map((s, i) => (
            <path key={i} className="p-seed" d={s.d} strokeWidth={s.front ? 0.8 : 0.6} opacity={s.front ? 0.9 : 0.35} />
          ))}
        </g>

        {/* Kern: das innere Bild */}
        {[0, 1].map((i) => (
          <circle key={i} className="p-pulse fill-none stroke-accent" cx={HEAD[0]} cy={HEAD[1]} r={12} strokeWidth={1} opacity={0} />
        ))}
        <circle className="p-core fill-accent" cx={HEAD[0]} cy={HEAD[1]} r={10} />
      </svg>
    </div>
  );
}
