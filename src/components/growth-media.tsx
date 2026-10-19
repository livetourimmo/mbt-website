"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useScrubTrigger } from "@/components/scroll-scrub";
import { seeded, r1 } from "@/lib/use-scrub-scene";

// «Kreislauf» zu den drei Bedingungen: Ein Pusteblumen-Samen schwebt herab und
// sinkt in die Erde, Wurzeln greifen, eine Löwenzahn-Rosette treibt aus, der
// Schaft wächst und die MBT-Blüte öffnet sich. Zum Schluss steigt aus ihr ein
// neuer Samen auf – «Aus der Pflege entsteht das Saatgut des nächsten Schritts».
// Der Ring nimmt die Sprache des Rhythmus-Rads auf: feine Spur, darauf der
// Fortschritt mit je einem Punkt pro Bedingung.
// Das Markup zeigt den Endzustand (gilt bei reduzierter Bewegung); im
// Scrub-Modus baut eine GSAP-Timeline die Zeichnung beim Scrollen auf.

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

/** Punkte entlang der Kurve, gleichmässig im Kurvenparameter */
function sample(pts: P[], per = 8): P[] {
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

/** Linie, die zur Spitze hin feiner wird, als gefüllte Fläche */
function taper(pts: P[], w0: number, w1: number) {
  const s = sample(pts);
  const n = s.length - 1;
  const left: P[] = [];
  const right: P[] = [];
  s.forEach((p, i) => {
    const a = s[Math.max(0, i - 1)];
    const b = s[Math.min(n, i + 1)];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    const nrm: P = [-(b[1] - a[1]) / len, (b[0] - a[0]) / len];
    const w = (w1 + (w0 - w1) * Math.pow(1 - i / n, 0.9)) / 2;
    left.push(add(p, nrm, w));
    right.push(add(p, nrm, -w));
  });
  return `${poly(left)} L${right.reverse().map(pt).join(" L")} Z`;
}

// ── Bildaufbau ─────────────────────────────────────────────────────────────

const C = { cx: 200, cy: 220, r: 170 };
const GROUND_Y = 290;
const HALF = Math.sqrt(C.r ** 2 - (GROUND_Y - C.cy) ** 2);
const groundAt = (x: number) => GROUND_Y - 5 * Math.exp(-(((x - 200) / 62) ** 2));
const GROUND_PTS: P[] = Array.from({ length: 13 }, (_, i) => {
  const x = C.cx - HALF + (2 * HALF * i) / 12;
  return [x, groundAt(x)];
});
const GROUND = smooth(GROUND_PTS);
const SOIL = `${GROUND} A${C.r} ${C.r} 0 0 1 ${r1(C.cx - HALF)} ${GROUND_Y} Z`;
const BASE: P = [200, groundAt(200)];
const SEED_REST: P = [200, 294];

// Ring: beginnt oben und läuft im Uhrzeigersinn. Oben steht der wandernde
// Punkt (01), die Punkte für 02 und 03 liegen bei einem und zwei Dritteln.
const RING = `M${C.cx} ${C.cy - C.r} A${C.r} ${C.r} 0 1 1 ${C.cx - 0.01} ${C.cy - C.r}`;
const MARKERS: P[] = [30, 150].map((deg) => {
  const a = (deg * Math.PI) / 180;
  return [r1(C.cx + Math.cos(a) * C.r), r1(C.cy + Math.sin(a) * C.r)];
});

// Erde: feine Punktierung wie in einem Stich, unter der Oberfläche dicht, nach unten lichter
const SOIL_TEXTURE = (() => {
  const rnd = seeded(23);
  let d = "";
  for (let i = 0; i < 150; i++) {
    const y = GROUND_Y + 3 + Math.pow(rnd(), 2.4) * 86;
    const half = Math.sqrt(Math.max(0, C.r ** 2 - (y - C.cy) ** 2)) - 6;
    const x = C.cx - half + rnd() * 2 * half;
    if (y < groundAt(x) + 3) continue;
    d += ` M${r1(x)} ${r1(y)} h0.01`;
  }
  return d.trim();
})();

// Wurzeln: Pfahlwurzel, Seitenwurzeln in drei Ordnungen, Faserwurzeln unter der
// Oberfläche und feine Wurzelhaare. Die zwei kräftigen Ordnungen laufen als
// Fläche fein aus (über eine Maske gezeichnet), die feineren sind Haarlinien.
type Root = { c: string; d?: string; order: number };
const ROOT_W = [
  [2.4, 0.3],
  [1.35, 0.2],
];
const ROOT_LINE = [0, 0, 0.7, 0.45];
const ROOT_OPACITY = [1, 0.85, 0.62, 0.45];
const { roots: ROOTS, hairs: ROOT_HAIRS } = (() => {
  const rnd = seeded(9);
  const roots: Root[] = [];
  let hairs = "";
  const grow = (from: P, angle: number, len: number, order: number) => {
    const steps = order < 2 ? 7 : 4;
    const pts: P[] = [from];
    let ang = angle;
    for (let k = 1; k <= steps; k++) {
      ang += (rnd() - 0.5) * (order < 2 ? 16 : 24) + (90 - ang) * (order === 0 ? 0.12 : 0.05);
      const a = (ang * Math.PI) / 180;
      pts.push(add(pts[k - 1], [Math.cos(a), Math.sin(a)], len / steps));
    }
    roots.push({ c: smooth(pts), d: order < 2 ? taper(pts, ROOT_W[order][0], ROOT_W[order][1]) : undefined, order });
    const s = sample(pts, 4);
    const dirAt = (i: number) => {
      const [a, b] = [s[Math.max(0, i - 1)], s[Math.min(s.length - 1, i + 1)]];
      return (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI;
    };
    // Wurzelhaare: kurze, schräg nach vorn gerichtete Härchen
    if (order === 1 || order === 2) {
      for (let i = 3; i < s.length - 2; i += 2) {
        const side = i % 4 === 1 ? 1 : -1;
        const a = ((dirAt(i) + side * (30 + rnd() * 16)) * Math.PI) / 180;
        const l = 1.4 + rnd() * 2;
        hairs += ` M${pt(s[i])} l${r1(Math.cos(a) * l)} ${r1(Math.sin(a) * l)}`;
      }
    }
    if (order >= 3) return;
    const kids = [9, 4, 2][order];
    for (let k = 0; k < kids; k++) {
      const t = order === 0 ? 0.08 + k * 0.095 + rnd() * 0.03 : 0.18 + (k / kids) * 0.7 + rnd() * 0.06;
      const i = Math.round(t * (s.length - 1));
      const side = (k + order) % 2 === 0 ? 1 : -1;
      if (order === 0) {
        const tilt = 72 - t * 46 + rnd() * 10; // Grad weg von der Senkrechten, oben flacher
        grow(s[i], 90 - side * tilt, 100 * (0.74 - t * 0.55) * (0.8 + rnd() * 0.4), 1);
      } else {
        grow(s[i], dirAt(i) + side * (28 + rnd() * 22), len * (0.3 + rnd() * 0.16) * (1 - t * 0.4), order + 1);
      }
    }
  };
  grow([SEED_REST[0], SEED_REST[1] - 3], 90, 82, 0);
  // Faserwurzeln direkt unter der Oberfläche
  [-1, 1, -1, 1].forEach((side, i) => grow([200 + side * 1.5, 291 + i * 1.5], 90 - side * (78 - i * 7), 32 + rnd() * 14, 2));
  return { roots, hairs: hairs.trim() };
})();

// Blatt: steigt aus der Rosette auf und neigt sich unter dem eigenen Gewicht.
// Fein gewellter Rand, Mittelrippe und gefiederte, zur Spitze geschwungene Adern.
type Leaf = { edges: [string, string]; fill: string; rib: string; veins: string };
function archLeaf(base: P, deg: number, len: number, w: number, bend: number, seed: number): Leaf {
  const rnd = seeded(seed);
  const n = 28;
  const mid: P[] = [base];
  let ang = deg;
  for (let i = 1; i <= n; i++) {
    ang += (bend / n) * (0.4 + 1.2 * (i / n));
    const a = (ang * Math.PI) / 180;
    mid.push(add(mid[i - 1], [Math.cos(a), Math.sin(a)], len / n));
  }
  const nrm = (i: number): P => {
    const [a, b] = [mid[Math.max(0, i - 1)], mid[Math.min(n, i + 1)]];
    const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    return [-(b[1] - a[1]) / l, (b[0] - a[0]) / l];
  };
  const waves = 9 + Math.floor(rnd() * 4);
  const phase = rnd() * 6;
  const hw = (u: number) =>
    w * Math.pow(Math.sin(Math.PI * Math.pow(Math.min(1, u), 1.2)), 0.8) * (1 + 0.05 * Math.sin(u * Math.PI * 2 * waves + phase));
  const side = (s: 1 | -1) => mid.map((p, i) => add(p, nrm(i), hw(i / n) * s * (s > 0 ? 1 : 0.86)));
  const upper = side(-1);
  const lower = side(1);
  const at = (u: number, f: number, s: 1 | -1) => {
    const i = Math.min(n, Math.round(u * n));
    return add(mid[i], nrm(i), hw(u) * f * s * (s > 0 ? 1 : 0.86));
  };
  let veins = "";
  for (let k = 0; k < 6; k++) {
    const u = 0.12 + k * 0.115;
    ([-1, 1] as const).forEach((s) => {
      const from = mid[Math.round(u * n)];
      veins += ` M${pt(from)} Q${pt(at(u + 0.05, 0.45, s))} ${pt(at(u + 0.14, 0.8, s))}`;
    });
  }
  return {
    edges: [smooth(upper), smooth(lower)],
    fill: `${poly(upper)} L${lower.slice().reverse().map(pt).join(" L")} Z`,
    rib: smooth(mid.slice(0, n - 1)),
    veins: veins.trim(),
  };
}

// Rosette: hinten zwei aufrechte, dann zwei weit überhängende und ein kleines Blatt
const LEAVES = [
  { leaf: archLeaf([BASE[0] - 1, BASE[1]], -108, 72, 9, -72, 31), group: 0 },
  { leaf: archLeaf([BASE[0] + 1, BASE[1]], -72, 66, 8.5, 70, 32), group: 0 },
  { leaf: archLeaf([BASE[0] - 2, BASE[1] + 1], -148, 84, 10.5, -84, 33), group: 1 },
  { leaf: archLeaf([BASE[0] + 2, BASE[1] + 1], -34, 80, 10, 84, 34), group: 1 },
  { leaf: archLeaf([BASE[0] + 1, BASE[1] + 1], -128, 46, 7, -50, 35), group: 1 },
];

// Blütenschaft und Knospe
const FLOWER: P = [214, 112];
const BLOOM_R = 34;
const SCAPE_PTS: P[] = Array.from({ length: 8 }, (_, i) => {
  const u = i / 7;
  const top = FLOWER[1] + BLOOM_R * 0.37;
  return [BASE[0] + 14 * Math.pow(u, 1.5) - 4.5 * Math.sin(u * Math.PI), BASE[1] - u * (BASE[1] - top)];
});
const SCAPE = { d: taper(SCAPE_PTS, 2.6, 1.3), c: smooth(SCAPE_PTS) };

const BUD: P = [167, 184];
const BUD_PTS: P[] = Array.from({ length: 6 }, (_, i) => {
  const u = i / 5;
  return [BASE[0] - 1 - 33 * Math.pow(u, 1.25) + 3 * Math.sin(u * Math.PI), BASE[1] - u * (BASE[1] - BUD[1])];
});
const BUD_SCAPE = { d: taper(BUD_PTS, 1.8, 1), c: smooth(BUD_PTS) };
const BUD_SHAPE = (() => {
  const [p, q] = [BUD_PTS[4], BUD_PTS[5]];
  const ang = Math.atan2(q[1] - p[1], q[0] - p[0]);
  const d: P = [Math.cos(ang), Math.sin(ang)];
  const m: P = [-d[1], d[0]];
  const o = BUD;
  const L = 19;
  const W = 6.5;
  const tip = add(o, d, L);
  const body = `M${pt(o)} C${pt(add(add(o, d, L * 0.15), m, W * 1.2))} ${pt(add(add(o, d, L * 0.7), m, W * 0.9))} ${pt(tip)} C${pt(add(add(o, d, L * 0.7), m, -W * 0.9))} ${pt(add(add(o, d, L * 0.15), m, -W * 1.2))} ${pt(o)} Z`;
  // Kelchblätter umfassen die Knospe von unten
  const sepal = (s: number) =>
    `M${pt(add(o, m, s * 1.5))} Q${pt(add(add(o, d, L * 0.25), m, s * W * 1.45))} ${pt(add(add(o, d, L * 0.62), m, s * W * 0.35))}`;
  const lines = `M${pt(add(add(o, d, L * 0.3), m, W * 0.25))} Q${pt(add(add(o, d, L * 0.6), m, W * 0.3))} ${pt(add(o, d, L * 0.94))}`;
  return { body, sepals: `${sepal(1)} ${sepal(-1)}`, lines };
})();

// MBT-Blüte wie im Logo: 16 spitze Blätter um eine offene Mitte, innen je eine kleine gefüllte Spitze
const BLOOM = Array.from({ length: 16 }, (_, i) => {
  const a = (i / 16) * Math.PI * 2 - Math.PI / 2;
  const half = (Math.PI / 16) * 0.94;
  const q = (rr: number, ang: number) => `${r1(Math.cos(ang) * rr * BLOOM_R)} ${r1(Math.sin(ang) * rr * BLOOM_R)}`;
  return {
    petal: `M${q(0.37, a)} L${q(0.64, a - half)} L${q(1, a)} L${q(0.64, a + half)} Z`,
    dart: `M${q(0.37, a)} L${q(0.48, a - half * 0.3)} L${q(0.48, a + half * 0.3)} Z`,
  };
});

// Pusteblumen-Samen: Achäne mit Schnabel und feinem Schirm; Spitze bei (0,0)
const PAPPUS = (() => {
  const top = -24;
  let rays = `M0 -6.5 L0 ${top}`;
  for (let k = 0; k < 17; k++) {
    const a = ((-90 - 80 + (160 * k) / 16) * Math.PI) / 180;
    const len = 15 * (0.85 + 0.15 * Math.sin((k / 16) * Math.PI));
    const end: P = [Math.cos(a) * len, top + Math.sin(a) * len];
    const c: P = [Math.cos(a) * len * 0.5, top + Math.sin(a) * len * 0.5 - 2.2];
    rays += ` M0 ${top} Q${pt(c)} ${pt(end)}`;
  }
  const body = "M0 0 C2.3 -1.6 2.3 -4.6 0 -7 C-2.3 -4.6 -2.3 -1.6 0 0 Z";
  return { rays, body };
})();
const NEW_SEED: P = [282, 120]; // Endlage des neuen Samens
const NEW_SEED_ROT = 18;

const drop = (x: number, y: number) =>
  `M${x} ${y} c2.4 4 4.2 6.4 4.2 8.8 a4.2 4.2 0 0 1 -8.4 0 c0 -2.4 1.8 -4.8 4.2 -8.8 Z`;

export default function GrowthMedia() {
  const { triggerRef, scrubOn } = useScrubTrigger();
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const trigger = triggerRef.current;
      if (!scrubOn || !trigger || !contextSafe) return;
      const q = gsap.utils.selector(ref);
      const hidden = { drawSVG: "0%" };
      const shown = (duration: number, extra: gsap.TweenVars = {}) => ({ drawSVG: "0% 100%", duration, ...extra });

      // Erst bauen, kurz bevor die Sektion ins Bild kommt (der Aufbau misst viele Linien aus)
      const build = contextSafe(() => {
        // Zeitachse 0–3: 0–1 Saatgut, 1–2 Boden, 2–3 Pflege
        const tl = gsap.timeline({
          defaults: { ease: "sine.inOut" },
          scrollTrigger: { trigger, start: "top top", end: "bottom bottom", scrub: 1.2 },
        });

        // Ring: Fortschritt über die ganze Zeitachse, ein Punkt pro Bedingung
        tl.fromTo(q(".c-progress"), hidden, shown(3, { ease: "none" }), 0)
          .fromTo(q(".c-head"), { rotation: 0, svgOrigin: `${C.cx} ${C.cy}` }, { rotation: 360, duration: 3, ease: "none" }, 0);
        [0, 1].forEach((i) => tl.fromTo(q(`.c-marker-${i}`), { opacity: 0 }, { opacity: 1, duration: 0.06 }, i + 1));

        // 01 Saatgut: Horizont, der Samen schwebt im Bogen herab und sinkt in die Erde
        tl.fromTo(q(".c-ground"), { drawSVG: "50% 50%" }, shown(0.4), 0)
          .fromTo(q(".c-soil"), { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.15)
          .fromTo(q(".c-seed"), { x: -126, y: -214, rotation: -26, opacity: 0, svgOrigin: pt(SEED_REST) }, { x: 0, y: -10, rotation: 0, opacity: 1, duration: 0.54, ease: "sine.out" }, 0.02)
          .fromTo(q(".c-seed .c-pappus"), { opacity: 1, y: 0 }, { opacity: 0, y: -12, duration: 0.14 }, 0.5)
          .to(q(".c-seed"), { y: 0, duration: 0.16, ease: "sine.out" }, 0.54)
          .fromTo(q(".c-pulse"), { scale: 1, opacity: 0.45, svgOrigin: pt(BASE) }, { scale: 5, opacity: 0, duration: 0.4, stagger: 0.14, ease: "sine.out", immediateRender: false }, 0.62);

        // 02 Boden: Wurzeln greifen, die Erde bekommt Struktur, die Rosette treibt aus
        tl.fromTo(q(".c-texture"), { opacity: 0 }, { opacity: 1, duration: 0.4 }, 1.0)
          .fromTo(q(".c-rv-root-0"), hidden, shown(0.3), 0.76)
          .to(q(".c-rv-root-0"), { drawSVG: "0% 100%", duration: 0.45 }, 1.0)
          .fromTo(q(".c-rv-root-1"), hidden, shown(0.4, { stagger: { amount: 0.25 } }), 1.08)
          .fromTo(q(".c-rv-root-2"), hidden, shown(0.3, { stagger: { amount: 0.35 } }), 1.26)
          .fromTo(q(".c-rv-root-3"), hidden, shown(0.22, { stagger: { amount: 0.4 } }), 1.42)
          .fromTo(q(".c-hairs"), { opacity: 0 }, { opacity: 0.3, duration: 0.3 }, 1.62)
          .fromTo(q(".c-rv-scape"), hidden, { drawSVG: "0% 12%", duration: 0.35 }, 1.4);
        [1.55, 1.8].forEach((t, gi) => {
          tl.fromTo(q(`.c-leaf-${gi} .c-edge`), hidden, shown(0.3), t)
            .fromTo(q(`.c-leaf-${gi} .c-leaf-fill`), { opacity: 0 }, { opacity: 1, duration: 0.2 }, t + 0.06)
            .fromTo(q(`.c-leaf-${gi} .c-rib`), hidden, shown(0.24), t + 0.08)
            .fromTo(q(`.c-leaf-${gi} .c-veins`), { opacity: 0 }, { opacity: 1, duration: 0.18 }, t + 0.2);
        });

        // 03 Pflege: ein paar Tropfen, der Schaft wächst, Knospe und Blüte, ein neuer Samen steigt auf
        tl.fromTo(q(".c-drop"), { y: -150, opacity: 0 }, { y: 0, opacity: 0.8, duration: 0.3, stagger: 0.09, ease: "power1.in" }, 1.96)
          .to(q(".c-drop"), { opacity: 0, duration: 0.05, stagger: 0.09 }, 2.24)
          .to(q(".c-rv-scape"), { drawSVG: "0% 100%", duration: 0.55, ease: "none" }, 2.04)
          .fromTo(q(".c-rv-bud"), hidden, shown(0.3), 2.2)
          .fromTo(q(".c-bud"), { scale: 0.2, opacity: 0, svgOrigin: pt(BUD) }, { scale: 1, opacity: 1, duration: 0.18 }, 2.46)
          .fromTo(q(".c-bloom"), { rotate: -22, scale: 0.5, transformOrigin: "50% 50%" }, { rotate: 0, scale: 1, duration: 0.4 }, 2.56)
          .fromTo(q(".c-petal-base"), { opacity: 0 }, { opacity: 1, duration: 0.1 }, 2.56)
          .fromTo(q(".c-petal"), { drawSVG: "0%", fillOpacity: 0 }, shown(0.26, { stagger: 0.012 }), 2.58)
          .fromTo(q(".c-dart"), { opacity: 0 }, { opacity: 1, duration: 0.15, stagger: 0.01 }, 2.72)
          .to(q(".c-petal"), { fillOpacity: 0.1, duration: 0.18 }, 2.8)
          .fromTo(
            q(".c-newseed"),
            { x: FLOWER[0] - NEW_SEED[0], y: FLOWER[1] - NEW_SEED[1] + 6, rotation: -NEW_SEED_ROT, opacity: 0, svgOrigin: pt(NEW_SEED) },
            { x: 0, y: 0, rotation: 0, opacity: 1, duration: 0.22, ease: "sine.out" },
            2.78
          );
      });
      ScrollTrigger.create({ trigger, start: "top bottom+=60%", once: true, onEnter: build });
    },
    { dependencies: [scrubOn], scope: ref, revertOnUpdate: true }
  );

  const leafGroup = (items: typeof LEAVES, gi: number) =>
    items
      .filter((l) => l.group === gi)
      .map(({ leaf }, i) => (
        <g key={`${gi}-${i}`} className={`c-leaf-${gi}`}>
          <path className="c-leaf-fill fill-neutral-tint" d={leaf.fill} />
          <g className="fill-none stroke-ink" strokeLinecap="round" strokeLinejoin="round">
            <path className="c-veins" d={leaf.veins} strokeWidth={0.45} opacity={0.4} />
            <path className="c-rib" d={leaf.rib} strokeWidth={0.75} opacity={0.7} />
            <path className="c-edge" d={leaf.edges[0]} strokeWidth={1} />
            <path className="c-edge" d={leaf.edges[1]} strokeWidth={1} />
          </g>
        </g>
      ));

  // Feine, auslaufende Linien (Wurzeln, Schäfte) werden über eine Maske gezeichnet
  const revealed = (id: string, cls: string, d: string, c: string, width: number, opacity = 1) => (
    <g key={id}>
      <mask id={id} maskUnits="userSpaceOnUse" x={0} y={0} width={400} height={440}>
        <path className={cls} d={c} fill="none" stroke="#fff" strokeWidth={width + 4} strokeLinecap="round" />
      </mask>
      <path className="fill-ink" d={d} mask={`url(#${id})`} opacity={opacity} />
    </g>
  );

  return (
    <div ref={ref} className="mx-auto w-[min(100%,38svh)] md:w-[min(100%,64vh,440px)]">
      <svg
        viewBox="22 42 356 356"
        className="block h-auto w-full overflow-visible"
        role="img"
        aria-label="Linienzeichnung in einem Kreis: Ein Pusteblumen-Samen sinkt in die Erde, Wurzeln verzweigen sich, eine Löwenzahn-Rosette treibt aus, ein Schaft mit Knospe wächst und eine violette Blüte in Form des MBT-Logos öffnet sich. Aus ihr steigt ein neuer Samen auf."
      >
        <defs>
          <clipPath id="c-soil-clip">
            <path d={SOIL} />
          </clipPath>
        </defs>

        {/* Ring wie beim Rhythmus-Rad: feine Spur, darauf der Fortschritt */}
        <circle cx={C.cx} cy={C.cy} r={C.r} className="fill-none stroke-hairline" strokeWidth={1.5} />
        <path className="c-progress fill-none stroke-ink" d={RING} strokeWidth={1.1} strokeLinecap="round" opacity={0.55} />

        {/* Erde: Hauch von ink, feine Striche, ein paar Steine */}
        <path className="c-soil fill-ink" d={SOIL} fillOpacity={0.035} />
        <g clipPath="url(#c-soil-clip)">
          <path className="c-texture fill-none stroke-ink" d={SOIL_TEXTURE} strokeWidth={1.3} strokeLinecap="round" opacity={0.32} />
          {ROOTS.map((r, i) =>
            r.d ? (
              revealed(`c-root-${i}`, `c-rv-root-${r.order}`, r.d, r.c, ROOT_W[r.order][0], ROOT_OPACITY[r.order])
            ) : (
              <path
                key={`c-root-${i}`}
                className={`c-rv-root-${r.order} fill-none stroke-ink`}
                d={r.c}
                strokeWidth={ROOT_LINE[r.order]}
                strokeLinecap="round"
                opacity={ROOT_OPACITY[r.order]}
              />
            )
          )}
          <path className="c-hairs fill-none stroke-ink" d={ROOT_HAIRS} strokeWidth={0.35} strokeLinecap="round" opacity={0.3} />
          {[0, 1].map((i) => (
            <ellipse key={i} className="c-pulse fill-none stroke-ink" cx={BASE[0]} cy={BASE[1] + 2} rx={5} ry={1.4} strokeWidth={0.8} opacity={0} />
          ))}
        </g>
        <path className="c-ground fill-none stroke-ink" d={GROUND} strokeWidth={1.25} strokeLinecap="round" />

        {/* Samen in der Erde (der Schirm hat sich gelöst) */}
        <g className="c-seed">
          <g transform={`translate(${SEED_REST[0]} ${SEED_REST[1]})`}>
            <path className="c-pappus fill-none stroke-ink" d={PAPPUS.rays} strokeWidth={0.55} strokeLinecap="round" opacity={0} />
            <path className="fill-ink" d={PAPPUS.body} />
          </g>
        </g>

        {/* Rosette hinten, Schäfte, Rosette Mitte und vorne */}
        {leafGroup(LEAVES, 0)}
        {revealed("c-bud-scape", "c-rv-bud", BUD_SCAPE.d, BUD_SCAPE.c, 1.8)}
        {revealed("c-scape", "c-rv-scape", SCAPE.d, SCAPE.c, 2.6)}
        <g className="c-bud fill-none stroke-ink" strokeLinecap="round" strokeLinejoin="round">
          <path className="fill-neutral-tint" d={BUD_SHAPE.body} strokeWidth={1} />
          <path d={BUD_SHAPE.lines} strokeWidth={0.6} opacity={0.5} />
          <path d={BUD_SHAPE.sepals} strokeWidth={0.9} />
        </g>
        {leafGroup(LEAVES, 1)}

        {[170, 232, 210].map((x) => (
          <path key={x} className="c-drop fill-none stroke-ink" d={drop(x, 232)} strokeWidth={0.9} opacity={0} />
        ))}

        {/* MBT-Blüte – das einzige farbige Element */}
        <g transform={`translate(${FLOWER[0]} ${FLOWER[1]})`}>
          <g className="c-bloom">
            {/* Unterlage in Hintergrundfarbe: deckt den Schaft hinter den Blättern ab */}
            {BLOOM.map((b, i) => (
              <path key={`u${i}`} className="c-petal-base fill-neutral-tint" d={b.petal} />
            ))}
            {BLOOM.map((b, i) => (
              <path key={i} className="c-petal fill-accent stroke-accent" d={b.petal} fillOpacity={0.1} strokeWidth={1.1} strokeLinejoin="round" />
            ))}
            {BLOOM.map((b, i) => (
              <path key={`d${i}`} className="c-dart fill-accent" d={b.dart} />
            ))}
          </g>
        </g>

        {/* Neuer Samen, aus der Blüte aufgestiegen */}
        <g className="c-newseed">
          <g transform={`translate(${NEW_SEED[0]} ${NEW_SEED[1]}) rotate(${NEW_SEED_ROT})`}>
            <path className="fill-none stroke-ink" d={PAPPUS.rays} strokeWidth={0.55} strokeLinecap="round" />
            <path className="fill-ink" d={PAPPUS.body} />
          </g>
        </g>

        {/* Punkte der drei Bedingungen und der wandernde Fortschrittspunkt */}
        {MARKERS.map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r={3.2} className="fill-neutral-tint stroke-ink" strokeWidth={1} opacity={0.5} />
            <circle className={`c-marker-${i} fill-ink`} cx={x} cy={y} r={3.2} />
          </g>
        ))}
        <circle className="c-head fill-ink stroke-neutral-tint" cx={C.cx} cy={C.cy - C.r} r={4.2} strokeWidth={2} />
      </svg>
    </div>
  );
}
