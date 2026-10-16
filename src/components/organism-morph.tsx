"use client";

import { useRef, useSyncExternalStore } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { seeded } from "@/lib/use-scrub-scene";

// Lebendige Führung · Vom Organigramm zum Organismus (angepinnt, gescrubbt).
// Im Organigramm berühren sich die Kästchen nie – jede Verbindung läuft über
// eine Linie nach oben. Beim Scrollen lösen sich zuerst die rechten Winkel,
// dann wachsen die Kästchen aufeinander zu und werden zu Zellen. Die Linien
// verschwinden von selbst, weil sich Nachbarn jetzt direkt berühren: Die
// Verbindung ist die gemeinsame Zellwand. Zwischen den alten Zellen wachsen
// neue nach, die frühere Spitze ist eine Zelle unter vielen. Zuletzt öffnet
// sich in einer einzigen Zelle die MBT-Blüte – das einzige farbige Element.

type P = [number, number];

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpP = (a: P, b: P, t: number): P => [lerp(a[0], b[0], t), lerp(a[1], b[1], t)];
const clamp = (t: number) => Math.max(0, Math.min(1, t));
/** Abschnitt [start, start + len] der Timeline, weich ein- und ausgeleitet */
const seg = (t: number, start: number, len: number) => 0.5 - Math.cos(Math.PI * clamp((t - start) / len)) / 2;

// ---------------------------------------------------------------------------
// Organigramm: 1 – 3 – 9 Kästchen

type Box = { c: P; w: number; h: number; level: number; parent: number };

const ROW_Y = [118, 238, 358];
const BOXES: Box[] = (() => {
  const boxes: Box[] = [{ c: [400, ROW_Y[0]], w: 92, h: 32, level: 0, parent: -1 }];
  const l1X = [180, 400, 620];
  l1X.forEach((x) => boxes.push({ c: [x, ROW_Y[1]], w: 80, h: 28, level: 1, parent: 0 }));
  l1X.forEach((x, i) =>
    [-74, 0, 74].forEach((off) => boxes.push({ c: [x + off, ROW_Y[2]], w: 60, h: 26, level: 2, parent: 1 + i }))
  );
  return boxes;
})();

// ---------------------------------------------------------------------------
// Gewebe: entspanntes Wabenraster, Zellen leicht in die Breite gezogen

const VIEW = { x: 0, y: 0, w: 800, h: 520 };
const ANISO = 1.3; // Zellen sind etwas breiter als hoch, wie in einem Pflanzenstängel
const TISSUE_C: P = [400, 268];
const GAP = 1.9; // halber Abstand zwischen zwei Zellwänden
const K = 48; // Punkte pro Umriss (12 pro Kästchenseite)

/** Halbebene: behält die Punkte p mit (p − m)·n ≤ 0 */
function clipHalf(poly: P[], m: P, n: P): P[] {
  const side = (p: P) => (p[0] - m[0]) * n[0] + (p[1] - m[1]) * n[1];
  const out: P[] = [];
  poly.forEach((a, i) => {
    const b = poly[(i + 1) % poly.length];
    const sa = side(a), sb = side(b);
    if (sa <= 0) out.push(a);
    if (sa * sb < 0) out.push(lerpP(a, b, sa / (sa - sb)));
  });
  return out;
}

function area(poly: P[]) {
  let s = 0;
  poly.forEach((a, i) => {
    const b = poly[(i + 1) % poly.length];
    s += a[0] * b[1] - b[0] * a[1];
  });
  return s / 2;
}

function centroid(poly: P[]): P {
  let x = 0, y = 0, s = 0;
  poly.forEach((a, i) => {
    const b = poly[(i + 1) % poly.length];
    const k = a[0] * b[1] - b[0] * a[1];
    s += k;
    x += (a[0] + b[0]) * k;
    y += (a[1] + b[1]) * k;
  });
  return [x / (3 * s), y / (3 * s)];
}

/** Voronoi-Zellen im gestauchten Raum (x / ANISO), danach zurück gestreckt */
function voronoi(sites: P[]): P[][] {
  const box: P[] = [[VIEW.x / ANISO, VIEW.y], [(VIEW.x + VIEW.w) / ANISO, VIEW.y], [(VIEW.x + VIEW.w) / ANISO, VIEW.y + VIEW.h], [VIEW.x / ANISO, VIEW.y + VIEW.h]];
  const iso = sites.map(([x, y]): P => [x / ANISO, y]);
  return iso.map((s, i) => {
    let poly = box;
    iso.forEach((o, j) => {
      if (i !== j && poly.length) poly = clipHalf(poly, [(s[0] + o[0]) / 2, (s[1] + o[1]) / 2], [o[0] - s[0], o[1] - s[1]]);
    });
    return poly.map(([x, y]): P => [x * ANISO, y]);
  });
}

/** Wand nach innen versetzen (konvexes Polygon), dann Ecken weich runden */
function cellOutline(poly: P[]): P[] {
  let p = area(poly) < 0 ? [...poly].reverse() : poly;
  const src = p;
  src.forEach((a, i) => {
    const b = src[(i + 1) % src.length];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (len < 1e-6) return;
    // Aussennormale bei Umlauf im Uhrzeigersinn auf dem Bildschirm (y nach unten)
    const n: P = [(b[1] - a[1]) / len, -(b[0] - a[0]) / len];
    p = clipHalf(p, [a[0] - n[0] * GAP, a[1] - n[1] * GAP], n);
  });
  // erst nur die Ecken knapp abschneiden, dann glätten: Wände bleiben gerade, Ecken weich
  [0.14, 0.25, 0.25].forEach((q) => {
    p = p.flatMap((a, i) => {
      const b = p[(i + 1) % p.length];
      return [lerpP(a, b, q), lerpP(a, b, 1 - q)];
    });
  });
  return p;
}

/** Schnittpunkt eines Strahls ab c mit dem (konvexen) Umriss */
function rayHit(poly: P[], c: P, ang: number): P {
  const d: P = [Math.cos(ang), Math.sin(ang)];
  let best = Infinity;
  poly.forEach((a, i) => {
    const b = poly[(i + 1) % poly.length];
    const e: P = [b[0] - a[0], b[1] - a[1]];
    const den = d[0] * e[1] - d[1] * e[0];
    if (Math.abs(den) < 1e-9) return;
    const w: P = [a[0] - c[0], a[1] - c[1]];
    const t = (w[0] * e[1] - w[1] * e[0]) / den;
    const u = (w[0] * d[1] - w[1] * d[0]) / den;
    if (t > 0 && u >= -1e-6 && u <= 1 + 1e-6) best = Math.min(best, t);
  });
  return [d[0] * best, d[1] * best];
}

/** Kästchen-Umriss relativ zur Mitte: 12 Punkte pro Seite, Ecken exakt */
function rectOutline(w: number, h: number): P[] {
  const c: P[] = [[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]];
  return c.flatMap((a, i) => Array.from({ length: K / 4 }, (_, k) => lerpP(a, c[(i + 1) % 4], k / (K / 4))));
}

function inTissue([x, y]: P) {
  const dx = (x - TISSUE_C[0]) / 292;
  const dy = (y - TISSUE_C[1]) / 178;
  const a = Math.atan2(dy, dx);
  const edge = 1 + 0.06 * Math.sin(3 * a + 2.2) + 0.04 * Math.sin(5 * a + 0.9);
  return dx * dx + dy * dy < edge * edge;
}

type Cell = {
  c: P; // Mitte der fertigen Zelle
  shape: P[]; // fertiger Umriss relativ zu c, K Punkte
  box: number; // Index des Kästchens, aus dem die Zelle entsteht (−1 = wächst neu)
  grow: number; // Startzeit für neue Zellen
};

const { CELLS, BLOOM_CELL } = (() => {
  const rnd = seeded(11);
  // Wabenraster im gestauchten Raum, leicht verrückt
  const s = 62;
  let sites: P[] = [];
  for (let row = 0, y = -s; y < VIEW.h + s; row++, y += s * 0.866) {
    for (let x = -s + (row % 2) * (s / 2); x < VIEW.w / ANISO + s; x += s) {
      sites.push([(x + (rnd() - 0.5) * s * 0.5) * ANISO, y + (rnd() - 0.5) * s * 0.5]);
    }
  }
  // zwei Durchgänge entspannen: gleichmässig, aber nicht starr
  for (let k = 0; k < 2; k++) sites = voronoi(sites).map((poly, i) => (poly.length > 2 ? centroid(poly) : sites[i]));
  const polys = voronoi(sites);

  // Randzellen mit zu wenigen Nachbarn weglassen, damit nichts einzeln absteht
  let keep = sites.map((site, i) => inTissue(site) && polys[i].length > 2);
  const near = (i: number, j: number) => Math.hypot((sites[i][0] - sites[j][0]) / ANISO, sites[i][1] - sites[j][1]) < s * 1.3;
  for (let k = 0; k < 3; k++) {
    keep = keep.map((on, i) => on && sites.filter((_, j) => j !== i && keep[j] && near(i, j)).length >= 3);
  }

  const cells: Cell[] = [];
  const outlines: P[][] = [];
  sites.forEach((site, i) => {
    if (!keep[i]) return;
    const outline = cellOutline(polys[i]);
    outlines.push(outline);
    cells.push({ c: centroid(outline), shape: [], box: -1, grow: 0 });
  });

  // Jedes Kästchen bekommt die Zelle, die seiner Lage im entspannten Bild am nächsten liegt
  const chartC: P = [400, ROW_Y[1]];
  BOXES.forEach((b, bi) => {
    const target: P = [TISSUE_C[0] + (b.c[0] - chartC[0]) * 0.8, TISSUE_C[1] + (b.c[1] - chartC[1]) * 0.56];
    let best = -1, bestD = Infinity;
    cells.forEach((cell, ci) => {
      if (cell.box !== -1) return;
      const d = Math.hypot(cell.c[0] - target[0], cell.c[1] - target[1]);
      if (d < bestD) {
        best = ci;
        bestD = d;
      }
    });
    cells[best].box = bi;
  });

  // Umrisse auf die Winkel der Kästchenpunkte abtasten, damit sich beide Formen punktweise entsprechen
  const angles = rectOutline(80, 28).map(([x, y]) => Math.atan2(y, x));
  const seeds = cells.filter((c) => c.box !== -1).map((c) => c.c);
  let maxD = 0;
  cells.forEach((cell, ci) => {
    const own = cell.box === -1 ? angles : rectOutline(BOXES[cell.box].w, BOXES[cell.box].h).map(([x, y]) => Math.atan2(y, x));
    cell.shape = own.map((a) => rayHit(outlines[ci], cell.c, a));
    if (cell.box === -1) {
      cell.grow = Math.min(...seeds.map((q) => Math.hypot(q[0] - cell.c[0], q[1] - cell.c[1])));
      maxD = Math.max(maxD, cell.grow);
    }
  });
  // neue Zellen wachsen von den alten aus nach aussen
  cells.forEach((cell) => {
    if (cell.box === -1) cell.grow = cell.grow / maxD;
  });

  // Die Blüte öffnet sich in einer früheren Zelle der untersten Ebene, rechts unten im Bild
  const bloomBox = 10;
  return { CELLS: cells, BLOOM_CELL: cells.findIndex((c) => c.box === bloomBox) };
})();

const BOX_CELL = BOXES.map((_, bi) => CELLS.findIndex((c) => c.box === bi));

// ---------------------------------------------------------------------------
// Zeichnen

const f1 = (n: number) => n.toFixed(1);
const polyPath = (pts: P[]) => `M${pts.map(([x, y]) => `${f1(x)} ${f1(y)}`).join("L")}Z`;

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

/** MBT-Blüte wie im Logo: 16 spitze Blätter um eine offene Mitte */
const BLOOM_R = 19;
const PETALS = Array.from({ length: 16 }, (_, k) => {
  const a = (k / 16) * Math.PI * 2 - Math.PI / 2;
  const half = Math.PI / 16;
  const pt = (r: number, ang: number) => `${f1(Math.cos(ang) * r * BLOOM_R)} ${f1(Math.sin(ang) * r * BLOOM_R)}`;
  return `M${pt(0.4, a)}L${pt(0.68, a - half)}L${pt(1, a)}L${pt(0.68, a + half)}Z`;
});

/** Zustand eines Kästchens / einer Zelle zur Zeit t */
function boxState(bi: number, t: number) {
  const b = BOXES[bi];
  const cell = CELLS[BOX_CELL[bi]];
  // die Spitze löst sich zuerst, die unteren Ebenen folgen
  const delay = b.level * 0.045 + (bi % 3) * 0.008;
  const move = seg(t, 0.16 + delay, 0.36);
  const form = seg(t, 0.22 + delay, 0.36);
  const c = lerpP(b.c, cell.c, move);
  const rect = rectOutline(b.w, b.h);
  return { c, pts: rect.map((q, i) => lerpP(q, cell.shape[i], form)).map(([x, y]): P => [x + c[0], y + c[1]]) };
}

function cellPath(ci: number, t: number) {
  const cell = CELLS[ci];
  if (cell.box !== -1) return polyPath(boxState(cell.box, t).pts);
  const g = seg(t, 0.5 + cell.grow * 0.26, 0.2);
  if (g <= 0) return "";
  return polyPath(cell.shape.map(([x, y]): P => [cell.c[0] + x * g, cell.c[1] + y * g]));
}

const BEND = BOXES.map((_, i) => ((i * 5) % 3) * 0.06 - 0.06);

function edgeD(i: number, t: number) {
  const b = BOXES[i];
  return edgePath(boxState(b.parent, t).c, boxState(i, t).c, seg(t, 0.04, 0.22), BEND[i]);
}

const WALL = "color-mix(in srgb, var(--color-ink) 82%, var(--color-neutral-tint))";
const LINK = "color-mix(in srgb, var(--color-ink) 55%, var(--color-neutral-tint))";

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
      const cells = root.querySelectorAll<SVGPathElement>(".o-cell");
      const edges = root.querySelectorAll<SVGPathElement>(".o-edge");
      const linkGroup = root.querySelector<SVGGElement>(".o-links")!;
      const from = root.querySelector<HTMLElement>(".o-from")!;
      const to = root.querySelector<HTMLElement>(".o-to")!;
      const rule = root.querySelector<HTMLElement>(".o-rule")!;

      const render = (t: number) => {
        cells.forEach((el, ci) => el.setAttribute("d", cellPath(ci, t)));
        edges.forEach((el, k) => el.setAttribute("d", edgeD(k + 1, t)));
        // Linien treten zurück, sobald die Zellen einander berühren
        linkGroup.setAttribute("opacity", f1(1 - seg(t, 0.52, 0.22)));
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
        .fromTo(".o-bloom", { scale: 0.82, rotation: -11.25, svgOrigin: "0 0" }, { scale: 1, rotation: 0, duration: 0.16 }, 0.8)
        .fromTo(".o-petal", { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.07, stagger: 0.006 }, 0.8);
      render(0);
    },
    { scope: figureRef, dependencies: [reduced], revertOnUpdate: true }
  );

  const bloomC = CELLS[BLOOM_CELL].c;

  const figure = (
    <figure ref={figureRef} className="mx-auto w-full max-w-5xl">
      <svg
        viewBox="68 66 664 404"
        className="line-scene mx-auto block h-auto max-h-[68svh] w-full"
        role="img"
        aria-label="Linienzeichnung: Ein Organigramm aus Kästchen, die nur über rechtwinklige Linien mit der Spitze verbunden sind, löst sich auf. Die Kästchen wachsen aufeinander zu und werden zu Zellen, die sich direkt berühren, die Linien verschwinden. Zwischen ihnen wachsen neue Zellen zu einem gleichmässigen Gewebe. In einer einzelnen Zelle öffnet sich die violette MBT-Blüte."
      >
        <g className="o-links fill-none" stroke={LINK} strokeWidth={1} opacity={0}>
          {BOXES.slice(1).map((_, k) => (
            <path key={k} className="o-edge" d={edgeD(k + 1, 1)} />
          ))}
        </g>
        <g fill="var(--color-paper)" stroke={WALL} strokeWidth={1.25} strokeLinejoin="round">
          {CELLS.map((_, ci) => (
            <path key={ci} className="o-cell" d={cellPath(ci, 1)} />
          ))}
        </g>
        <g transform={`translate(${f1(bloomC[0])} ${f1(bloomC[1])})`}>
          <g className="o-bloom fill-none" stroke="var(--color-accent)" strokeWidth={1.25} strokeLinejoin="round">
            {PETALS.map((d, k) => (
              <path key={k} className="o-petal" d={d} />
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
