"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useScrubTrigger } from "@/components/scroll-scrub";
import { r1 } from "@/lib/use-scrub-scene";

// Drei Bedingungen als reduzierte, glatte Silhouette: Ein
// Pusteblumen-Samen sinkt in eine flache Schale, ein Keimling treibt aus, ein
// langes Blatt wächst, dann der Stängel, und an seiner Spitze öffnet sich direkt
// die MBT-Blüte in accent. Die Stadien gehen beim Scrollen weich ineinander über;
// die fertige Pflanze bleibt im letzten Teil des Abschnitts stehen.
// Das Markup zeigt den Endzustand (gilt bei reduzierter Bewegung).

type P = [number, number];

const add = (a: P, b: P, s = 1): P => [a[0] + b[0] * s, a[1] + b[1] * s];
const pt = (p: P) => `${r1(p[0])} ${r1(p[1])}`;
const poly = (pts: P[]) => `M${pts.map(pt).join(" L")}`;

/** Catmull-Rom-Kurve durch Punkte, als kubische Bézier-Segmente */
function segments(pts: P[]): [P, P, P, P][] {
  return pts.slice(0, -1).map((p1, i) => {
    const p0 = pts[Math.max(0, i - 1)];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    return [p1, [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6], p2];
  });
}

function smooth(pts: P[]) {
  return `M${pt(pts[0])}` + segments(pts).map(([, c1, c2, p]) => ` C${pt(c1)} ${pt(c2)} ${pt(p)}`).join("");
}

function sample(pts: P[], per = 10): P[] {
  const out: P[] = [pts[0]];
  segments(pts).forEach(([a, b, c, d]) => {
    for (let k = 1; k <= per; k++) {
      const t = k / per;
      const u = 1 - t;
      out.push([
        u * u * u * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t * t * t * d[0],
        u * u * u * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t * t * t * d[1],
      ]);
    }
  });
  return out;
}

/** Gefüllte Form entlang einer Mittellinie; `width(u)` ist die volle Breite bei u ∈ [0, 1] */
function ribbon(pts: P[], width: (u: number) => number) {
  const s = sample(pts);
  const n = s.length - 1;
  const left: P[] = [];
  const right: P[] = [];
  s.forEach((p, i) => {
    const a = s[Math.max(0, i - 1)];
    const b = s[Math.min(n, i + 1)];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    const nrm: P = [-(b[1] - a[1]) / len, (b[0] - a[0]) / len];
    const w = width(i / n) / 2;
    left.push(add(p, nrm, w));
    right.push(add(p, nrm, -w));
  });
  return `${poly(left)} L${right.reverse().map(pt).join(" L")} Z`;
}

// ── Bildaufbau ─────────────────────────────────────────────────────────────

const SOIL: P = [150, 318];

// Flache Schale mit kleinem Fuss
const BOWL = "M100 318 H200 C198 337 177 347 150 347 C123 347 102 337 100 318 Z";
const FOOT = "M135 360 C137 352.5 143 350 150 350 C157 350 163 352.5 165 360 Z";

// Keimling: kurzer Stiel, zwei ungleiche Keimblätter
const SPROUT_PTS: P[] = [SOIL, [150.5, 305], [151, 293]];
const SPROUT = { d: ribbon(SPROUT_PTS, (u) => 3.4 - u), c: smooth(SPROUT_PTS) };
const COTY_AT: P = [151, 294];
function almond(base: P, deg: number, len: number, w: number, bend: number) {
  const a = (deg * Math.PI) / 180;
  const d: P = [Math.cos(a), Math.sin(a)];
  const n: P = [-d[1], d[0]];
  const tip = add(add(base, d, len), n, bend * len);
  const c1 = add(add(base, d, len * 0.45), n, w);
  const c2 = add(add(base, d, len * 0.6), n, -w * 0.7 + bend * len * 0.5);
  return `M${pt(base)} Q${pt(c1)} ${pt(tip)} Q${pt(c2)} ${pt(base)} Z`;
}
const COTYLEDONS = [almond(COTY_AT, -146, 17, 7, 0.08), almond(COTY_AT, -44, 23, 8, -0.12)];

// Langes Blatt: wächst aus der Erde, schwingt nach rechts oben aus
const BLADE_PTS: P[] = [[155, SOIL[1]], [159, 296], [165, 270], [173, 244], [183, 222], [196, 204]];
const BLADE = {
  d: ribbon(BLADE_PTS, (u) => 2.5 + 11 * Math.pow(Math.sin(Math.PI * Math.min(1, u * 0.96)), 1.3) * (1 - u * 0.35)),
  c: smooth(BLADE_PTS),
};

// Stängel mit Blüte
const FLOWER: P = [140, 122];
const BLOOM_R = 37;
const STEM_PTS: P[] = Array.from({ length: 8 }, (_, i) => {
  const u = i / 7;
  const top = FLOWER[1] + BLOOM_R * 0.37;
  return [SOIL[0] - 10 * Math.pow(u, 1.3) + 3 * Math.sin(u * Math.PI), SOIL[1] - u * (SOIL[1] - top)];
});
const STEM = { d: ribbon(STEM_PTS, (u) => 4.4 - 1.8 * u), c: smooth(STEM_PTS) };
// MBT-Blüte wie im Logo: 16 spitze Blätter um eine offene Mitte – hier als Fläche
const PETALS = Array.from({ length: 16 }, (_, i) => {
  const a = (i / 16) * Math.PI * 2 - Math.PI / 2;
  const half = (Math.PI / 16) * 0.9;
  const q = (rr: number, ang: number) => `${r1(Math.cos(ang) * rr * BLOOM_R)} ${r1(Math.sin(ang) * rr * BLOOM_R)}`;
  return `M${q(0.38, a)} L${q(0.64, a - half)} L${q(1, a)} L${q(0.64, a + half)} Z`;
});

// Pusteblumen-Samen: Achäne, Schnabel, feiner Schirm; Spitze bei (0,0)
const PAPPUS = (() => {
  const top = -22;
  let rays = `M0 -6 L0 ${top}`;
  for (let k = 0; k < 13; k++) {
    const a = ((-90 - 76 + (152 * k) / 12) * Math.PI) / 180;
    const len = 13 * (0.85 + 0.15 * Math.sin((k / 12) * Math.PI));
    const end: P = [Math.cos(a) * len, top + Math.sin(a) * len];
    const c: P = [Math.cos(a) * len * 0.5, top + Math.sin(a) * len * 0.5 - 2];
    rays += ` M0 ${top} Q${pt(c)} ${pt(end)}`;
  }
  return { rays, body: "M0 0 C2.6 -1.8 2.6 -5 0 -7.5 C-2.6 -5 -2.6 -1.8 0 0 Z" };
})();

const drop = (x: number, y: number) => `M${x} ${y} c2.2 3.6 3.8 5.8 3.8 8 a3.8 3.8 0 0 1 -7.6 0 c0 -2.2 1.6 -4.4 3.8 -8 Z`;

// Feine, auslaufende Formen werden über eine Maske entlang ihrer Mittellinie gezeichnet
function Revealed({ id, cls, d, c, width }: { id: string; cls: string; d: string; c: string; width: number }) {
  return (
    <>
      <mask id={id} maskUnits="userSpaceOnUse" x={0} y={0} width={300} height={400}>
        <path className={cls} d={c} fill="none" stroke="#fff" strokeWidth={width} strokeLinecap="round" />
      </mask>
      <path d={d} mask={`url(#${id})`} />
    </>
  );
}

export default function GrowthMedia() {
  const { triggerRef, scrubOn } = useScrubTrigger();
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const trigger = triggerRef.current;
      if (!scrubOn || !trigger || !contextSafe) return;
      const q = gsap.utils.selector(ref);
      const hidden = { drawSVG: "0%" };

      // Erst bauen, kurz bevor die Sektion ins Bild kommt
      const build = contextSafe(() => {
        // Zeitachse 0–3: 0–1 Saatgut, 1–2 Boden, 2–3 Pflege
        const tl = gsap.timeline({
          defaults: { ease: "sine.inOut" },
          scrollTrigger: { trigger, start: "top top", end: "bottom bottom", scrub: 1.2 },
        });

        // 01 Saatgut: Der Samen schwebt herab, sinkt in die Schale, ein Keimling treibt aus
        tl.fromTo(q(".g-seed"), { x: -70, y: -230, rotation: -22, opacity: 0, svgOrigin: pt(SOIL) }, { x: 0, y: 0, rotation: 0, opacity: 1, duration: 0.56, ease: "sine.out" }, 0.02)
          .fromTo(q(".g-pappus"), { opacity: 1, y: 0 }, { opacity: 0, y: -12, duration: 0.16 }, 0.52)
          .to(q(".g-seed"), { y: 6, opacity: 0, duration: 0.14 }, 0.6)
          .fromTo(q(".g-rv-sprout"), hidden, { drawSVG: "0% 100%", duration: 0.16 }, 0.6)
          .fromTo(q(".g-sprout"), { opacity: 0 }, { opacity: 1, duration: 0.05 }, 0.6)
          .fromTo(q(".g-coty"), { scale: 0, svgOrigin: pt(COTY_AT) }, { scale: 1, duration: 0.2, stagger: 0.04 }, 0.68);

        // 02 Boden: das lange Blatt wächst, der Keimling tritt zurück
        tl.fromTo(q(".g-rv-blade"), hidden, { drawSVG: "0% 100%", duration: 0.55 }, 1.02)
          .to(q(".g-sprout"), { opacity: 0, duration: 0.3 }, 1.45)
          .fromTo(q(".g-rv-stem"), hidden, { drawSVG: "0% 22%", duration: 0.35 }, 1.5);

        // 03 Pflege: ein paar Tropfen, der Stängel wächst, an der Spitze öffnet sich direkt die Blüte
        tl.fromTo(q(".g-drop"), { y: -120, opacity: 0 }, { y: 0, opacity: 1, duration: 0.24, stagger: 0.07, ease: "power1.in" }, 1.86)
          .to(q(".g-drop"), { opacity: 0, duration: 0.04, stagger: 0.07 }, 2.08)
          .to(q(".g-rv-stem"), { drawSVG: "0% 100%", duration: 0.42, ease: "none" }, 1.96)
          .fromTo(q(".g-bloom"), { scale: 0.2, rotation: -28, opacity: 0, svgOrigin: "0 0" }, { scale: 1, rotation: 0, opacity: 1, duration: 0.26 }, 2.32)
          .fromTo(q(".g-petal"), { scale: 0.4, svgOrigin: "0 0" }, { scale: 1, duration: 0.2, stagger: 0.008 }, 2.34)
          // Ab 2.6 steht die fertige Pflanze; die Zeitachse endet exakt auf 3, passend zu den drei Texten
          .set({}, {}, 3);
      });
      ScrollTrigger.create({ trigger, start: "top bottom+=60%", once: true, onEnter: build });
    },
    { dependencies: [scrubOn], scope: ref, revertOnUpdate: true }
  );

  return (
    <div ref={ref} className="mx-auto w-[min(100%,30svh)] md:w-[min(100%,48vh,380px)]">
      <svg
        viewBox="40 70 220 300"
        className="block h-auto w-full overflow-visible"
        role="img"
        aria-label="Ein Pusteblumen-Samen sinkt in eine flache Schale, ein Keimling treibt aus, ein langes Blatt wächst, dann ein Stängel, und an seiner Spitze öffnet sich eine violette Blüte in Form des MBT-Logos."
      >
        <g>
          <g className="fill-ink">
            {/* Langes Blatt hinter dem Stängel */}
            <Revealed id="g-m-blade" cls="g-rv-blade" d={BLADE.d} c={BLADE.c} width={16} />
            <Revealed id="g-m-stem" cls="g-rv-stem" d={STEM.d} c={STEM.c} width={7} />

            {/* Keimling (nur während der Animation sichtbar) */}
            <g className="g-sprout" opacity={0}>
              <Revealed id="g-m-sprout" cls="g-rv-sprout" d={SPROUT.d} c={SPROUT.c} width={5} />
              {COTYLEDONS.map((d, i) => (
                <path key={i} className="g-coty" d={d} />
              ))}
            </g>

            {/* Samen, der in die Schale sinkt */}
            <g className="g-seed" opacity={0}>
              <g transform={`translate(${SOIL[0]} ${SOIL[1]})`}>
                <path className="g-pappus fill-none stroke-ink" d={PAPPUS.rays} strokeWidth={0.8} strokeLinecap="round" />
                <path d={PAPPUS.body} />
              </g>
            </g>

            {[134, 168, 151].map((x) => (
              <path key={x} className="g-drop" d={drop(x, 286)} opacity={0} />
            ))}

            <path d={BOWL} />
            <path d={FOOT} />
          </g>

          {/* MBT-Blüte – das einzige farbige Element */}
          <g transform={`translate(${FLOWER[0]} ${FLOWER[1]})`}>
            <g className="g-bloom fill-accent">
              {PETALS.map((d, i) => (
                <path key={i} className="g-petal" d={d} />
              ))}
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}
