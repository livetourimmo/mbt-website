"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useScrubTrigger } from "@/components/scroll-scrub";

// «Lebendige Linie»: Samen → Wurzeln/Keimling → MBT-Blüte, gekoppelt an die drei
// Bedingungen. Das Markup zeigt den Endzustand (gilt bei reduzierter Bewegung);
// im Scrub-Modus baut eine GSAP-Timeline die Pflanze beim Scrollen auf.

type P = [number, number];
const f = (n: number) => Math.round(n * 10) / 10;

/** Deterministischer Zufall: organisch, aber bei jedem Besuch gleich */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const SEED: P = [200, 376];

// Schirm des Pusteblumen-Samens: Stiel nach oben, feine Strahlen fächern auf
const PAPPUS = (() => {
  const top: P = [SEED[0], SEED[1] - 22];
  let d = `M${SEED[0]} ${SEED[1] - 5} L${top[0]} ${top[1]}`;
  for (let k = 0; k < 9; k++) {
    const a = ((-90 - 70 + (140 * k) / 8) * Math.PI) / 180;
    d += ` M${top[0]} ${top[1]} l${f(Math.cos(a) * 13)} ${f(Math.sin(a) * 13)}`;
  }
  return d;
})();

// Wurzeln: verzweigte, leicht gebogene Linien, nach Tiefe gestaffelt
function makeRoots() {
  const rnd = mulberry32(11);
  const roots: { d: string; depth: number }[] = [];
  const grow = (from: P, angle: number, len: number, depth: number) => {
    const a = (angle * Math.PI) / 180;
    const to: P = [from[0] + Math.cos(a) * len, from[1] + Math.sin(a) * len];
    const bend = (rnd() - 0.5) * 0.5 * len;
    const c: P = [(from[0] + to[0]) / 2 - Math.sin(a) * bend, (from[1] + to[1]) / 2 + Math.cos(a) * bend];
    roots.push({ d: `M${f(from[0])} ${f(from[1])} Q${f(c[0])} ${f(c[1])} ${f(to[0])} ${f(to[1])}`, depth });
    if (depth >= 2) return;
    const at = (t: number): P => [
      (1 - t) ** 2 * from[0] + 2 * (1 - t) * t * c[0] + t ** 2 * to[0],
      (1 - t) ** 2 * from[1] + 2 * (1 - t) * t * c[1] + t ** 2 * to[1],
    ];
    // Hauptwurzel verzweigt sich paarweise nach beiden Seiten, Seitenwurzeln abwechselnd
    const kids: [number, number][] = depth === 0 ? [[0.35, -1], [0.35, 1], [0.68, -1], [0.68, 1]] : [[0.5, 1], [0.85, -1]];
    kids.forEach(([t, side]) => {
      const spread = 30 + rnd() * 22;
      grow(at(t), angle + side * spread, len * (0.48 + rnd() * 0.14), depth + 1);
    });
  };
  grow(SEED, 90, 90, 0);
  grow(SEED, 138, 58, 1);
  grow(SEED, 42, 58, 1);
  return roots;
}
const ROOTS = makeRoots();

// Blatt als Kontur: Ansatz, Winkel (0° = rechts), Länge, halbe Breite
function leaf(base: P, deg: number, len: number, w: number) {
  const a = (deg * Math.PI) / 180;
  const d: P = [Math.cos(a), Math.sin(a)];
  const n: P = [-d[1], d[0]];
  const tip: P = [base[0] + d[0] * len, base[1] + d[1] * len];
  const m = (s: number): P => [base[0] + d[0] * len * 0.42 + n[0] * w * s, base[1] + d[1] * len * 0.42 + n[1] * w * s];
  const [c1, c2] = [m(1), m(-1)];
  const rib: P = [base[0] + d[0] * len * 0.78, base[1] + d[1] * len * 0.78];
  return {
    outline: `M${f(base[0])} ${f(base[1])} Q${f(c1[0])} ${f(c1[1])} ${f(tip[0])} ${f(tip[1])} Q${f(c2[0])} ${f(c2[1])} ${f(base[0])} ${f(base[1])}`,
    rib: `M${f(base[0])} ${f(base[1])} L${f(rib[0])} ${f(rib[1])}`,
  };
}

const COTYLEDONS = [leaf([200, 318], 200, 20, 9), leaf([200, 318], -20, 20, 9)];
const LEAVES = [
  leaf([199, 266], -24, 48, 15),
  leaf([200, 226], 206, 52, 16),
  leaf([199, 186], -30, 42, 13),
];

const STEM = "M200 376 C200 340 196 302 199 264 C202 224 197 190 200 152 C201 140 200 130 200 122";
const FLOWER: P = [200, 114];

// MBT-Blüte wie im Logo: 16 spitze Blätter um eine offene Mitte
const PETALS = Array.from({ length: 16 }, (_, i) => {
  const a = (i / 16) * Math.PI * 2 - Math.PI / 2;
  const half = Math.PI / 16;
  const pt = (r: number, ang: number) => `${f(Math.cos(ang) * r * 34)} ${f(Math.sin(ang) * r * 34)}`;
  return `M${pt(0.4, a)} L${pt(0.68, a - half)} L${pt(1, a)} L${pt(0.68, a + half)} Z`;
});

export default function GrowthMedia() {
  const { triggerRef, scrubOn } = useScrubTrigger();
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const trigger = triggerRef.current;
      if (!scrubOn || !trigger || !contextSafe) return;
      const q = gsap.utils.selector(ref);
      const hidden = { drawSVG: "0%" };

      // Erst bauen, kurz bevor die Sektion ins Bild kommt (der Aufbau misst viele Linien aus)
      const build = contextSafe(() => {
        // Zeitachse 0–3: 0–1 Saatgut, 1–2 Boden, 2–3 Pflege
        const tl = gsap.timeline({
          defaults: { ease: "sine.inOut" },
          scrollTrigger: { trigger, start: "top top", end: "bottom bottom", scrub: 1.2 },
        });

        // 01 Saatgut: Der Samen sinkt in die Erde, die Richtung ist angelegt
        tl.fromTo(q(".g-seedling"), { y: -205, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55 }, 0.02)
          .fromTo(q(".g-seedling"), { x: -26, rotation: -10, svgOrigin: "200 376" }, { x: 0, rotation: 0, duration: 0.55, ease: "sine.out" }, 0.02)
          .fromTo(q(".g-pappus"), { opacity: 1, y: 0 }, { opacity: 0, y: -14, duration: 0.12 }, 0.5)
          .fromTo(q(".g-ring"), { scale: 1, opacity: 0.6, transformOrigin: "50% 50%" }, { scale: 4.2, opacity: 0, duration: 0.4, stagger: 0.16, ease: "sine.out", immediateRender: false }, 0.58)
          .fromTo(q(".g-root-0"), hidden, { drawSVG: "0% 35%", duration: 0.3 }, 0.75)
          // 02 Boden: Wurzeln greifen in die Erde, der Keimling bricht durch
          .to(q(".g-root-0"), { drawSVG: "0% 100%", duration: 0.4 }, 1.02)
          .fromTo(q(".g-root-1"), hidden, { drawSVG: "0% 100%", duration: 0.4, stagger: 0.07 }, 1.15)
          .fromTo(q(".g-root-2"), hidden, { drawSVG: "0% 100%", duration: 0.35, stagger: 0.04 }, 1.4)
          .fromTo(q(".g-stem"), hidden, { drawSVG: "0% 24%", duration: 0.45 }, 1.3)
          .fromTo(q(".g-coty path"), hidden, { drawSVG: "0% 100%", duration: 0.25, stagger: 0.04 }, 1.7)
          // 03 Pflege: ein paar Tropfen Wasser, der Stängel wächst, Blätter entfalten sich, die Blüte öffnet sich
          .fromTo(q(".g-drop"), { y: -150 }, { y: 0, duration: 0.3, stagger: 0.09, ease: "power1.in" }, 1.98)
          .fromTo(q(".g-drop"), { opacity: 0 }, { opacity: 0.7, duration: 0.06, stagger: 0.09 }, 1.98)
          .to(q(".g-drop"), { opacity: 0, duration: 0.04, stagger: 0.09 }, 2.24)
          .to(q(".g-stem"), { drawSVG: "0% 100%", duration: 0.65 }, 2)
          .fromTo(q(".g-leaf-0 path"), hidden, { drawSVG: "0% 100%", duration: 0.25 }, 2.12)
          .fromTo(q(".g-leaf-1 path"), hidden, { drawSVG: "0% 100%", duration: 0.25 }, 2.24)
          .fromTo(q(".g-leaf-2 path"), hidden, { drawSVG: "0% 100%", duration: 0.22 }, 2.36)
          .fromTo(q(".g-flower"), { rotate: -24, scale: 0.55, transformOrigin: "50% 50%" }, { rotate: 0, scale: 1, duration: 0.4 }, 2.55)
          .fromTo(q(".g-petal"), { drawSVG: "0%", fillOpacity: 0 }, { drawSVG: "0% 100%", duration: 0.25, stagger: 0.012 }, 2.55)
          .to(q(".g-petal"), { fillOpacity: 0.12, duration: 0.2 }, 2.78);
      });
      ScrollTrigger.create({ trigger, start: "top bottom+=60%", once: true, onEnter: build });
    },
    { dependencies: [scrubOn], scope: ref, revertOnUpdate: true }
  );

  return (
    <div ref={ref} className="mx-auto w-fit">
      <svg
        viewBox="96 66 208 432"
        className="h-[38svh] w-auto overflow-visible md:h-[min(68vh,620px)]"
        role="img"
        aria-label="Linienzeichnung: Ein Samen sinkt in die Erde eines Topfes, Wurzeln breiten sich aus, ein Stängel mit Blättern wächst und am Ende öffnet sich eine violette Blüte in Form des MBT-Logos."
      >
        <defs>
          <clipPath id="g-pot-inside">
            <path d="M127 351 L147 474 H253 L273 351 Z" />
          </clipPath>
        </defs>

        <g className="fill-none stroke-ink" strokeLinecap="round" strokeLinejoin="round">
          {/* Wurzeln, auf das Topfinnere beschnitten */}
          <g clipPath="url(#g-pot-inside)" strokeWidth={1.1}>
            {ROOTS.map((r, i) => (
              <path key={i} className={`g-root-${r.depth}`} d={r.d} opacity={1 - r.depth * 0.25} />
            ))}
          </g>

          {/* Stängel – liegt hinter dem Topfrand und kommt darüber aus der Erde */}
          <path className="g-stem" d={STEM} strokeWidth={1.5} />
        </g>

        {/* Samen mit Impulsringen */}
        <g transform={`translate(${SEED[0]} ${SEED[1]})`}>
          {[0, 1].map((i) => (
            <circle key={i} className="g-ring fill-none stroke-accent" strokeWidth={1} r={7} opacity={0} />
          ))}
        </g>
        {/* Pusteblumen-Samen: schwebt am Schirm herab, der Schirm löst sich in der Erde */}
        <g className="g-seedling">
          <g className="g-pappus fill-none stroke-ink" strokeWidth={0.8} strokeLinecap="round" opacity={0}>
            <path d={PAPPUS} />
          </g>
          <ellipse className="fill-ink" cx={SEED[0]} cy={SEED[1]} rx={2.6} ry={5} />
        </g>

        {/* Wassertropfen (nur während der Animation sichtbar) */}
        {[166, 236, 214].map((x) => (
          <path key={x} className="g-drop fill-ink" opacity={0} d={`M${x} 322 c3 5 5 8 5 11 a5 5 0 0 1 -10 0 c0 -3 2 -6 5 -11 Z`} />
        ))}

        {/* Topf als offene Kontur; der Rand deckt den Stängel ab */}
        <g className="stroke-ink" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
          <path className="fill-neutral-tint" d="M112 331 H288 L284 349 H116 Z" />
          <path className="fill-none" d="M124 349 L145 471 Q146.5 478 154 478 H246 Q253.5 478 255 471 L276 349" />
          <path className="fill-none" d="M129 357 C168 352 232 352 271 357" strokeWidth={1} opacity={0.5} />
        </g>

        {/* Keimblätter und Blätter als Kontur */}
        <g className="fill-none stroke-ink" strokeLinecap="round" strokeLinejoin="round">
          {COTYLEDONS.map((l, i) => (
            <g key={`c${i}`} className="g-coty" strokeWidth={1.2}>
              <path d={l.outline} />
            </g>
          ))}
          {LEAVES.map((l, i) => (
            <g key={i} className={`g-leaf-${i}`} strokeWidth={1.3}>
              <path d={l.outline} />
              <path d={l.rib} strokeWidth={0.9} opacity={0.55} />
            </g>
          ))}
        </g>

        {/* MBT-Blüte – das einzige farbige Element */}
        <g transform={`translate(${FLOWER[0]} ${FLOWER[1]})`}>
          <g className="g-flower">
            {PETALS.map((d, i) => (
              <path
                key={i}
                className="g-petal fill-accent stroke-accent"
                d={d}
                fillOpacity={0.12}
                strokeWidth={1}
                strokeLinejoin="round"
              />
            ))}
          </g>
        </g>
      </svg>
    </div>
  );
}
