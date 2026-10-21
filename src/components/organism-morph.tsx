"use client";

import { useRef, useSyncExternalStore } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { seeded, r1 } from "@/lib/use-scrub-scene";

// Lebendige Führung · Vom Organigramm zum Organismus (angepinnt, gescrubbt).
// Glatte Silhouette im Stil des Topfs. Ein Organigramm aus Kästchen und
// rechtwinkligen Linien; ganz unten rechts beginnt eine Stelle zu leben (accent).
// Die Kästchen werden zu Knoten, die Linien zu weichen
// Verbindungen, das Ganze ordnet sich strahlenförmig: Die frühere Spitze rückt
// in die Mitte, aus jedem Knoten wachsen feine Äste mit kleinen Büscheln, ein
// paar Querverbindungen verbinden Nachbarn. Einzelne Knoten leuchten in accent,
// in der Mitte öffnet sich die MBT-Blüte.

type P = [number, number];

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpP = (a: P, b: P, t: number): P => [lerp(a[0], b[0], t), lerp(a[1], b[1], t)];
const clamp = (t: number) => Math.max(0, Math.min(1, t));
/** Abschnitt [start, start + len] der Timeline, weich ein- und ausgeleitet */
const seg = (t: number, start: number, len: number) => 0.5 - Math.cos(Math.PI * clamp((t - start) / len)) / 2;
const f1 = (n: number) => n.toFixed(1);
const pt = (p: P) => `${r1(p[0])} ${r1(p[1])}`;
const polar = (c: P, r: number, deg: number): P => [c[0] + Math.cos((deg * Math.PI) / 180) * r, c[1] + Math.sin((deg * Math.PI) / 180) * r];

// ---------------------------------------------------------------------------
// Organigramm: 1 – 3 – 9 Kästchen

const ROW_Y = [165, 255, 345];
type Box = { c: P; w: number; h: number; level: number; parent: number };
const BOXES: Box[] = (() => {
  const boxes: Box[] = [{ c: [400, ROW_Y[0]], w: 74, h: 26, level: 0, parent: -1 }];
  const l1X = [282, 400, 518];
  l1X.forEach((x) => boxes.push({ c: [x, ROW_Y[1]], w: 62, h: 23, level: 1, parent: 0 }));
  l1X.forEach((x, i) =>
    [-36, 0, 36].forEach((off) => boxes.push({ c: [x + off, ROW_Y[2]], w: 30, h: 18, level: 2, parent: 1 + i }))
  );
  return boxes;
})();

// Hier beginnt das Leben: das Kästchen ganz unten rechts
const SPARK = BOXES.length - 1;

// ---------------------------------------------------------------------------
// Organismus: strahlenförmig um die Mitte

const C: P = [400, 262];
const NODE_R = [8, 6.5, 5];
const L1_DEG = [205, 95, 335];
const ANGLE: number[] = BOXES.map((b, i) => {
  if (b.level === 0) return 0;
  if (b.level === 1) return L1_DEG[i - 1];
  const k = (i - 4) % 3; // links, mitte, rechts unter dem Elternknoten
  return L1_DEG[b.parent - 1] + (k - 1) * 40;
});
const FINAL: P[] = BOXES.map((b, i) => (b.level === 0 ? C : polar(C, b.level === 1 ? 72 : 124 + ((i * 7) % 3) * 6, ANGLE[i])));

// Reihenfolge des Wandels: vom Funken aus, nahe Kästchen zuerst
const SPARK_DIST = (() => {
  const d = BOXES.map((b) => Math.hypot(b.c[0] - BOXES[SPARK].c[0], b.c[1] - BOXES[SPARK].c[1]));
  const max = Math.max(...d);
  return d.map((v) => v / max);
})();

// Äste: aus jedem Knoten wachsen leicht S-förmig geschwungene Zweige nach aussen,
// verzweigen sich bis in die dritte Ordnung, tragen feine Härchen und enden in
// Büscheln aus kleinen Punkten.
type Twig = { d: string; depth: number };
type Tuft = { stalks: string; dots: string; at: P };
const TWIG_W = [1.35, 1, 0.75, 0.55];
const BRANCHES = BOXES.map((b, i) => {
  const twigs: Twig[] = [];
  const tufts: Tuft[] = [];
  const knots: { at: P; depth: number }[] = [];
  let hairs = "";
  if (b.level === 0) return { twigs, tufts, knots, hairs };
  const rnd = seeded(40 + i);
  const tuft = (at: P, deg: number, size: number) => {
    let stalks = "";
    let dots = "";
    const n = 3 + Math.floor(rnd() * 3);
    for (let k = 0; k < n; k++) {
      const a = deg + (k - (n - 1) / 2) * (110 / n) + (rnd() - 0.5) * 12;
      const len = (4 + rnd() * 4.5) * size;
      const end = polar(at, len, a);
      const c = polar(at, len * 0.55, a + (rnd() - 0.5) * 30);
      stalks += ` M${pt(at)} Q${pt(c)} ${pt(end)}`;
      const r = (0.9 + rnd() * 0.8) * size;
      dots += ` M${r1(end[0] - r)} ${r1(end[1])} a${r1(r)} ${r1(r)} 0 1 0 ${r1(2 * r)} 0 a${r1(r)} ${r1(r)} 0 1 0 ${r1(-2 * r)} 0`;
    }
    tufts.push({ stalks: stalks.trim(), dots: dots.trim(), at });
  };
  const grow = (from: P, deg: number, len: number, depth: number) => {
    // S-Schwung: zwei gegenläufige Biegungen
    const b1 = (rnd() - 0.5) * 30;
    const b2 = -b1 * 0.6 + (rnd() - 0.5) * 16;
    const p1 = polar(from, len * 0.35, deg + b1);
    const p2 = polar(p1, len * 0.35, deg + b2);
    const end = polar(p2, len * 0.32, deg + b2 * 0.5);
    twigs.push({ d: `M${pt(from)} C${pt(p1)} ${pt(p2)} ${pt(end)}`, depth });
    const at = (u: number): P => {
      const v = 1 - u;
      return [
        v * v * v * from[0] + 3 * v * v * u * p1[0] + 3 * v * u * u * p2[0] + u * u * u * end[0],
        v * v * v * from[1] + 3 * v * v * u * p1[1] + 3 * v * u * u * p2[1] + u * u * u * end[1],
      ];
    };
    // feine Härchen entlang des Zweigs
    for (let k = 0; k < 3; k++) {
      const u = 0.25 + k * 0.22 + rnd() * 0.06;
      const h = at(u);
      const side = k % 2 === 0 ? 1 : -1;
      const he = polar(h, (3 + rnd() * 3) * (1 - depth * 0.15), deg + side * (55 + rnd() * 25));
      hairs += ` M${pt(h)} L${pt(he)}`;
    }
    if (depth < 3) {
      const kids = depth === 0 ? 2 : depth === 1 ? (rnd() > 0.4 ? 2 : 1) : rnd() > 0.55 ? 1 : 0;
      for (let k = 0; k < kids; k++) {
        const u = kids === 1 ? 0.55 : 0.4 + k * 0.3;
        const from2 = at(u);
        knots.push({ at: from2, depth });
        const side = (k + depth + i) % 2 === 0 ? 1 : -1;
        grow(from2, deg + side * (32 + rnd() * 22), len * (0.5 + rnd() * 0.15), depth + 1);
      }
    }
    // Büschel nur an den feinen Enden, die kräftigen Zweige laufen frei aus
    if (depth >= 1) tuft(end, deg + b2 * 0.5, depth >= 2 ? 0.85 : 1);
  };
  const out = ANGLE[i];
  if (b.level === 1) {
    grow(FINAL[i], out + 58, 40, 1);
    grow(FINAL[i], out - 58, 40, 1);
  } else {
    const n = 2 + (i % 2);
    for (let k = 0; k < n; k++) grow(FINAL[i], out + (k - (n - 1) / 2) * 36 + (rnd() - 0.5) * 10, 56 + rnd() * 16, 0);
  }
  return { twigs, tufts, knots, hairs: hairs.trim() };
});

/** Punkt auf der weichen Verbindung zwischen zwei Knoten im Endzustand */
function edgePoint(a: P, b: P, bend: number, s: number): P {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const c1: P = [a[0] + dx * 0.33 - dy * bend, a[1] + dy * 0.33 + dx * bend];
  const c2: P = [a[0] + dx * 0.67 - dy * bend, a[1] + dy * 0.67 + dx * bend];
  const u = 1 - s;
  return [
    u * u * u * a[0] + 3 * u * u * s * c1[0] + 3 * u * s * s * c2[0] + s * s * s * b[0],
    u * u * u * a[1] + 3 * u * u * s * c1[1] + 3 * u * s * s * c2[1] + s * s * s * b[1],
  ];
}

// Querverbindungen zwischen Nachbarn verschiedener Äste: alle sind miteinander verbunden
// (die äussersten Knoten zweier Äste, die nebeneinander liegen)
const CROSS = [
  [6, 10],
  [4, 9],
  [7, 12],
].map(([a, b]) => {
  const m = lerpP(FINAL[a], FINAL[b], 0.5);
  const out = polar(m, 12, (Math.atan2(m[1] - C[1], m[0] - C[0]) * 180) / Math.PI);
  return `M${pt(FINAL[a])} Q${pt(out)} ${pt(FINAL[b])}`;
});

// Lebendige Knoten (accent): über den ganzen Organismus verteilt, nicht nur an einer Stelle
const GLOW: P[] = [
  [7, 0], [10, 1], [5, 2], [2, 0], [8, 3], [4, 1], [11, 2], [3, 1],
]
  .map(([n, k]) => BRANCHES[n].knots[k]?.at)
  .filter((p): p is P => Boolean(p));

// MBT-Blüte in der Mitte: 16 spitze Blätter um eine offene Mitte, als Fläche
const BLOOM_R = 27;
const PETALS = Array.from({ length: 16 }, (_, k) => {
  const a = (k / 16) * Math.PI * 2 - Math.PI / 2;
  const half = (Math.PI / 16) * 0.9;
  const q = (r: number, ang: number) => `${f1(Math.cos(ang) * r * BLOOM_R)} ${f1(Math.sin(ang) * r * BLOOM_R)}`;
  return `M${q(0.38, a)}L${q(0.64, a - half)}L${q(1, a)}L${q(0.64, a + half)}Z`;
});

// ---------------------------------------------------------------------------
// Zustand zur Zeit t

/** Verbindung als drei kubische Segmente: Organigramm = rechtwinklig, später = sanfter Bogen */
function edgePath(a: P, b: P, t: number, bend: number) {
  const mid = (a[1] + b[1]) / 2;
  const k1: P = [a[0], mid];
  const k2: P = [b[0], mid];
  const chart: P[] = [a, lerpP(a, k1, 1 / 3), lerpP(a, k1, 2 / 3), k1, lerpP(k1, k2, 1 / 3), lerpP(k1, k2, 2 / 3), k2, lerpP(k2, b, 1 / 3), lerpP(k2, b, 2 / 3), b];
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const c1: P = [a[0] + dx * 0.33 - dy * bend, a[1] + dy * 0.33 + dx * bend];
  const c2: P = [a[0] + dx * 0.67 - dy * bend, a[1] + dy * 0.67 + dx * bend];
  const bez = (s: number): P => {
    const u = 1 - s;
    return [
      u * u * u * a[0] + 3 * u * u * s * c1[0] + 3 * u * s * s * c2[0] + s * s * s * b[0],
      u * u * u * a[1] + 3 * u * u * s * c1[1] + 3 * u * s * s * c2[1] + s * s * s * b[1],
    ];
  };
  const soft = Array.from({ length: 10 }, (_, i) => bez(i / 9));
  const p = chart.map((q, i) => lerpP(q, soft[i], t)).map(([x, y]) => `${f1(x)} ${f1(y)}`);
  return `M${p[0]} C${p[1]} ${p[2]} ${p[3]} C${p[4]} ${p[5]} ${p[6]} ${p[7]} ${p[8]} ${p[9]}`;
}

const formAt = (i: number, t: number) => seg(t, 0.18 + SPARK_DIST[i] * 0.12, 0.2);
const moveAt = (i: number, t: number) => seg(t, 0.3 + SPARK_DIST[i] * 0.08, 0.3);
const posAt = (i: number, t: number) => lerpP(BOXES[i].c, FINAL[i], moveAt(i, t));
/** Kästchen → Knoten: Grösse und Rundung */
function nodeRect(i: number, t: number) {
  const b = BOXES[i];
  const f = formAt(i, t);
  const d = NODE_R[b.level] * 2;
  const w = lerp(b.w, d, f);
  const h = lerp(b.h, d, f);
  const c = posAt(i, t);
  return { x: c[0] - w / 2, y: c[1] - h / 2, w, h, rx: lerp(1.5, d / 2, f) };
}
const BEND = BOXES.map((_, i) => ((i * 5) % 3) * 0.08 - 0.08);
// Perlen: kleine Knoten auf den Hauptverbindungen (erscheinen, wenn alles seinen Platz hat)
const BEADS: P[] = BOXES.flatMap((b, i) =>
  b.level === 0 ? [] : (b.level === 1 ? [0.62] : [0.35, 0.68]).map((s) => edgePoint(FINAL[b.parent], FINAL[i], BEND[i], s))
);
const edgeD = (i: number, t: number) => edgePath(posAt(BOXES[i].parent, t), posAt(i, t), seg(t, 0.14, 0.24), BEND[i]);
/** Wann die Äste eines Knotens wachsen: alle erst nach dem Umordnen, fast gleichzeitig, leicht versetzt */
const branchStart = (i: number) => 0.52 + ((i * 7) % 5) * 0.015;

const LINK = "color-mix(in srgb, var(--color-ink) 75%, var(--color-neutral-tint))";

const REDUCED = "(prefers-reduced-motion: reduce)";
function subscribe(onChange: () => void) {
  const mq = window.matchMedia(REDUCED);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

export default function OrganismMorph() {
  const spacer = useRef<HTMLDivElement>(null);
  const figureRef = useRef<HTMLElement>(null);
  const reduced = useSyncExternalStore(subscribe, () => window.matchMedia(REDUCED).matches, () => true);

  useGSAP(
    () => {
      const root = figureRef.current;
      if (reduced || !root || !spacer.current) return;
      const q = gsap.utils.selector(root);
      const nodes = root.querySelectorAll<SVGRectElement>(".o-node");
      const edges = root.querySelectorAll<SVGPathElement>(".o-edge");
      const groups = root.querySelectorAll<SVGGElement>(".o-branches");
      const from = root.querySelector<HTMLElement>(".o-from")!;
      const to = root.querySelector<HTMLElement>(".o-to")!;
      const rule = root.querySelector<HTMLElement>(".o-rule")!;

      const render = (t: number) => {
        nodes.forEach((el) => {
          const i = Number(el.dataset.i);
          const r = nodeRect(i, t);
          el.setAttribute("x", f1(r.x));
          el.setAttribute("y", f1(r.y));
          el.setAttribute("width", f1(r.w));
          el.setAttribute("height", f1(r.h));
          el.setAttribute("rx", f1(r.rx));
        });
        edges.forEach((el, k) => el.setAttribute("d", edgeD(k + 1, t)));
        // Äste hängen an ihrem Knoten und wandern mit ihm
        groups.forEach((el) => {
          const i = Number(el.dataset.i);
          const c = posAt(i, t);
          el.setAttribute("transform", `translate(${f1(c[0] - FINAL[i][0])} ${f1(c[1] - FINAL[i][1])})`);
        });
        const w = seg(t, 0.2, 0.6);
        from.style.opacity = String(1 - 0.55 * w);
        to.style.opacity = String(0.45 + 0.55 * w);
        rule.style.transform = `scaleX(${t.toFixed(3)})`;
      };

      const state = { t: 0 };
      const tl = gsap.timeline({
        defaults: { ease: "sine.inOut" },
        scrollTrigger: { trigger: spacer.current, start: "top top", end: "bottom bottom", scrub: 1 },
      });
      tl.to(state, { t: 1, duration: 1, ease: "none", onUpdate: () => render(state.t) }, 0)
        // Der Funke: ein Kästchen ganz unten rechts wird lebendig
        .fromTo(q(".o-spark"), { opacity: 0 }, { opacity: 1, duration: 0.06 }, 0.08);

      // Äste wachsen Ordnung für Ordnung, die Büschel öffnen sich an den Enden
      BRANCHES.forEach((br, i) => {
        if (!br.twigs.length) return;
        const s = branchStart(i);
        [0, 1, 2, 3].forEach((depth) => {
          const els = q(`.o-twig-${i}-${depth}`);
          if (els.length) tl.fromTo(els, { drawSVG: "0%" }, { drawSVG: "0% 100%", duration: 0.09, stagger: 0.006 }, s + depth * 0.05);
        });
        tl.fromTo(q(`.o-knot-${i}`), { scale: 0, transformOrigin: "50% 50%" }, { scale: 1, duration: 0.04, stagger: 0.006 }, s + 0.06)
          .fromTo(q(`.o-hairs-${i}`), { opacity: 0 }, { opacity: 0.7, duration: 0.08 }, s + 0.12)
          .fromTo(q(`.o-tuft-${i}`), { opacity: 0, scale: 0.4, transformOrigin: "50% 50%" }, { opacity: 1, scale: 1, duration: 0.06, stagger: 0.004 }, s + 0.14);
      });

      tl.fromTo(q(".o-bead"), { scale: 0, transformOrigin: "50% 50%" }, { scale: 1, duration: 0.05, stagger: 0.01 }, 0.62)
        .fromTo(q(".o-cross"), { drawSVG: "0%" }, { drawSVG: "0% 100%", duration: 0.12, stagger: 0.03 }, 0.66)
        .fromTo(q(".o-glow"), { scale: 0, transformOrigin: "50% 50%" }, { scale: 1, duration: 0.06, stagger: 0.03 }, 0.78)
        // Die frühere Spitze, jetzt in der Mitte, öffnet sich zur Blüte
        .fromTo(q(".o-node-top"), { opacity: 1 }, { opacity: 0, duration: 0.04 }, 0.84)
        .fromTo(q(".o-yard"), { scale: 0, svgOrigin: `${C[0]} ${C[1]}` }, { scale: 1, duration: 0.08 }, 0.82)
        .fromTo(q(".o-bloom"), { scale: 0.3, rotation: -28, opacity: 0, svgOrigin: "0 0" }, { scale: 1, rotation: 0, opacity: 1, duration: 0.12 }, 0.84)
        .set({}, {}, 1);
      render(0);
    },
    { scope: figureRef, dependencies: [reduced], revertOnUpdate: true }
  );

  const end = (i: number) => nodeRect(i, 1);

  const figure = (
    <figure ref={figureRef} className="mx-auto w-full max-w-5xl">
      <svg
        viewBox="168 30 464 464"
        className="mx-auto block aspect-square h-auto max-h-[64svh] w-full overflow-visible"
        role="img"
        aria-label="Silhouette: Ein Organigramm aus Kästchen und rechtwinkligen Linien. Ganz unten rechts wird ein Kästchen lebendig und treibt Äste. Die Kästchen werden zu Knoten, die Linien zu weichen Verbindungen, alles ordnet sich strahlenförmig zu einem verzweigten Organismus mit Querverbindungen. Einzelne Knoten leuchten violett, in der Mitte öffnet sich die MBT-Blüte."
      >
        {/* Äste mit Büscheln, je Knoten in einer Gruppe, die mit dem Knoten wandert */}
        {BRANCHES.map((br, i) =>
          br.twigs.length ? (
            <g key={i} className="o-branches" data-i={i}>
              <g className="fill-none stroke-ink" strokeLinecap="round">
                {br.twigs.map((tw, k) => (
                  <path key={k} className={`o-twig-${i}-${tw.depth}`} d={tw.d} strokeWidth={TWIG_W[tw.depth]} />
                ))}
              </g>
              {br.tufts.map((tf, k) => (
                <g key={k} className={`o-tuft-${i}`}>
                  <path d={tf.stalks} className="fill-none stroke-ink" strokeWidth={0.6} strokeLinecap="round" />
                  <path d={tf.dots} className="fill-ink" />
                </g>
              ))}
              <path className={`o-hairs-${i} fill-none stroke-ink`} d={br.hairs} strokeWidth={0.45} strokeLinecap="round" opacity={0.7} />
              {br.knots.map((k, n) => (
                <circle key={n} className={`o-knot-${i} fill-ink`} cx={r1(k.at[0])} cy={r1(k.at[1])} r={[2.9, 2.3, 1.8][k.depth]} />
              ))}
            </g>
          ) : null
        )}

        {/* Querverbindungen */}
        <g className="fill-none stroke-ink" strokeWidth={0.9} strokeLinecap="round" opacity={0.55}>
          {CROSS.map((d, k) => (
            <path key={k} className="o-cross" d={d} />
          ))}
        </g>

        {/* Verbindungen des Organigramms, später weiche Bögen */}
        <g className="fill-none" stroke={LINK} strokeWidth={1.4} strokeLinecap="round">
          {BOXES.slice(1).map((_, k) => (
            <path key={k} className="o-edge" d={edgeD(k + 1, 1)} />
          ))}
        </g>

        {/* Kästchen → Knoten */}
        <g className="fill-ink">
          {BOXES.map((_, i) => {
            const r = end(i);
            return (
              <rect
                key={i}
                data-i={i}
                className={`o-node${i === 0 ? " o-node-top" : ""}`}
                x={f1(r.x)}
                y={f1(r.y)}
                width={f1(r.w)}
                height={f1(r.h)}
                rx={f1(r.rx)}
                opacity={i === 0 ? 0 : 1}
              />
            );
          })}
        </g>
        {/* Der Funke liegt deckungsgleich über seinem Knoten */}
        <g className="o-spark fill-accent">
          <rect className="o-node" data-i={SPARK} {...(() => { const r = end(SPARK); return { x: f1(r.x), y: f1(r.y), width: f1(r.w), height: f1(r.h), rx: f1(r.rx) }; })()} />
        </g>

        {/* Perlen auf den Hauptverbindungen */}
        <g className="fill-ink">
          {BEADS.map((p, k) => (
            <circle key={k} className="o-bead" cx={r1(p[0])} cy={r1(p[1])} r={2.3} />
          ))}
        </g>

        {/* Lebendige Knoten */}
        <g className="fill-accent">
          {GLOW.map((p, k) => (
            <circle key={k} className="o-glow" cx={r1(p[0])} cy={r1(p[1])} r={4.2} />
          ))}
        </g>

        {/* Freier Hof um die Blüte: keine Linie läuft durch das Logo */}
        <circle className="o-yard fill-neutral-tint" cx={C[0]} cy={C[1]} r={BLOOM_R + 6} />

        {/* MBT-Blüte in der Mitte – dort, wo früher die Spitze war */}
        <g transform={`translate(${C[0]} ${C[1]})`}>
          <g className="o-bloom fill-accent">
            {PETALS.map((d, k) => (
              <path key={k} d={d} />
            ))}
          </g>
        </g>
      </svg>
      <figcaption aria-hidden className="mx-auto mt-6 flex max-w-md items-center gap-4 font-display text-[13px] text-ink md:mt-8">
        <span className="o-from opacity-45">Organigramm</span>
        <span className="relative h-px flex-1 bg-hairline">
          <span className="o-rule absolute inset-0 origin-left bg-ink-soft" />
        </span>
        <span className="o-to">Organismus</span>
      </figcaption>
    </figure>
  );

  if (reduced) {
    return <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24">{figure}</div>;
  }

  return (
    <div ref={spacer} className="relative" style={{ height: "300vh" }}>
      <div className="sticky top-0 flex h-[100svh] items-center px-3 md:px-10">{figure}</div>
    </div>
  );
}
