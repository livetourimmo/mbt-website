"use client";

import { useRef, useSyncExternalStore } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { seeded, r1 } from "@/lib/use-scrub-scene";

// Lebendige Führung · Vom Organigramm zum Organismus (angepinnt, gescrubbt).
// Bild: Gewebe unter der Lupe. Im Organigramm berühren sich die Kästchen nie –
// jede Verbindung läuft über eine Linie nach oben. Beim Scrollen lösen sich die
// rechten Winkel, ein feiner Kreis legt sich wie das Sichtfeld einer Lupe um
// das Bild, die Kästchen wachsen aufeinander zu und werden zu Zellen. Die
// Linien verschwinden, weil sich Nachbarn jetzt direkt berühren; neue Zellen
// füllen das Sichtfeld. Dann reift das Gewebe: Membran, Zellkern, Körnung und
// feine Kanäle durch jede gemeinsame Wand (Plasmodesmen) – jede Zelle ist
// direkt mit ihren Nachbarn verbunden. Zuletzt öffnet sich in einer einzigen
// Zelle die MBT-Blüte – das einzige farbige Element.

type P = [number, number];

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpP = (a: P, b: P, t: number): P => [lerp(a[0], b[0], t), lerp(a[1], b[1], t)];
const clamp = (t: number) => Math.max(0, Math.min(1, t));
/** Abschnitt [start, start + len] der Timeline, weich ein- und ausgeleitet */
const seg = (t: number, start: number, len: number) => 0.5 - Math.cos(Math.PI * clamp((t - start) / len)) / 2;

// ---------------------------------------------------------------------------
// Sichtfeld und Organigramm: 1 – 3 – 9 Kästchen, im Kreis

const FIELD = { cx: 400, cy: 262, r: 192 };
const ROW_Y = [150, 240, 330];
type Box = { c: P; w: number; h: number; level: number; parent: number };
const BOXES: Box[] = (() => {
  const boxes: Box[] = [{ c: [400, ROW_Y[0]], w: 74, h: 26, level: 0, parent: -1 }];
  const l1X = [282, 400, 518];
  l1X.forEach((x) => boxes.push({ c: [x, ROW_Y[1]], w: 62, h: 23, level: 1, parent: 0 }));
  l1X.forEach((x, i) =>
    [-38, 0, 38].forEach((off) => boxes.push({ c: [x + off, ROW_Y[2]], w: 32, h: 19, level: 2, parent: 1 + i }))
  );
  return boxes;
})();

// ---------------------------------------------------------------------------
// Gewebe: entspannte Zufallspunkte, Zellen leicht in die Breite gezogen

const ANISO = 1.18; // Zellen sind etwas breiter als hoch, wie in einem Blattgewebe
const GAP = 1.7; // halber Abstand zwischen zwei Zellwänden
const K = 48; // Punkte pro Umriss (12 pro Kästchenseite)
const BOUND = { x0: FIELD.cx - FIELD.r - 60, y0: FIELD.cy - FIELD.r - 60, x1: FIELD.cx + FIELD.r + 60, y1: FIELD.cy + FIELD.r + 60 };

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
  const box: P[] = [[BOUND.x0 / ANISO, BOUND.y0], [BOUND.x1 / ANISO, BOUND.y0], [BOUND.x1 / ANISO, BOUND.y1], [BOUND.x0 / ANISO, BOUND.y1]];
  const iso = sites.map(([x, y]): P => [x / ANISO, y]);
  return iso.map((s, i) => {
    let poly = box;
    iso.forEach((o, j) => {
      if (i !== j && poly.length) poly = clipHalf(poly, [(s[0] + o[0]) / 2, (s[1] + o[1]) / 2], [o[0] - s[0], o[1] - s[1]]);
    });
    return poly.map(([x, y]): P => [x * ANISO, y]);
  });
}

/** Auf das Sichtfeld beschneiden (Kreis als Vieleck) */
function clipToField(poly: P[], inset: number): P[] {
  let p = poly;
  const n = 72;
  for (let k = 0; k < n && p.length; k++) {
    const a = (k / n) * Math.PI * 2;
    const d: P = [Math.cos(a), Math.sin(a)];
    p = clipHalf(p, [FIELD.cx + d[0] * (FIELD.r - inset), FIELD.cy + d[1] * (FIELD.r - inset)], d);
  }
  return p;
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
  [0.16, 0.25, 0.25].forEach((q) => {
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

type Cell = {
  c: P; // Mitte der fertigen Zelle
  shape: P[]; // fertiger Umriss relativ zu c, K Punkte
  box: number; // Index des Kästchens, aus dem die Zelle entsteht (−1 = wächst neu)
  grow: number; // Startzeit für neue Zellen (0–1)
  radius: number; // mittlerer Radius
};

const { CELLS, WALLS } = (() => {
  const rnd = seeded(17);
  const s = 40;
  // Zufallspunkte, zweimal entspannt: gleichmässig, aber jede Zelle anders
  let sites: P[] = [];
  for (let y = BOUND.y0; y < BOUND.y1; y += s * 0.86) {
    for (let x = BOUND.x0 / ANISO; x < BOUND.x1 / ANISO; x += s) {
      sites.push([(x + (rnd() - 0.5) * s * 0.9) * ANISO, y + (rnd() - 0.5) * s * 0.9]);
    }
  }
  for (let k = 0; k < 2; k++) sites = voronoi(sites).map((poly, i) => (poly.length > 2 ? centroid(poly) : sites[i]));
  const raw = voronoi(sites);
  const clipped = raw.map((poly) => (poly.length > 2 ? clipToField(poly, 4) : []));
  const full = Math.max(...raw.map((p) => (p.length > 2 ? Math.abs(area(p)) : 0)).filter((a) => a < s * s * 3));
  // Splitter am Rand weglassen
  const keep = clipped.map((p) => p.length > 2 && Math.abs(area(p)) > full * 0.22);

  const cells: Cell[] = [];
  const index: number[] = [];
  const outlines: P[][] = [];
  sites.forEach((_, i) => {
    if (!keep[i]) return;
    const outline = cellOutline(clipped[i]);
    outlines.push(outline);
    index.push(i);
    cells.push({ c: centroid(outline), shape: [], box: -1, grow: 0, radius: Math.sqrt(Math.abs(area(outline)) / Math.PI) });
  });

  // Jedes Kästchen bekommt die Zelle, die seiner Lage am nächsten liegt
  BOXES.forEach((b, bi) => {
    const target: P = [FIELD.cx + (b.c[0] - FIELD.cx) * 0.92, FIELD.cy + (b.c[1] - FIELD.cy) * 0.92];
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
  const angles = rectOutline(62, 23).map(([x, y]) => Math.atan2(y, x));
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
  cells.forEach((cell) => {
    if (cell.box === -1) cell.grow = cell.grow / maxD;
  });

  // Gemeinsame Wände: zwei Zellen teilen zwei Eckpunkte ihrer Voronoi-Vielecke
  const walls: { a: P; b: P; cells: [number, number] }[] = [];
  const same = (p: P, q: P) => Math.abs(p[0] - q[0]) < 0.01 && Math.abs(p[1] - q[1]) < 0.01;
  for (let x = 0; x < index.length; x++) {
    for (let y = x + 1; y < index.length; y++) {
      const shared = clipped[index[x]].filter((p) => clipped[index[y]].some((q) => same(p, q)));
      if (shared.length >= 2) walls.push({ a: shared[0], b: shared[1], cells: [x, y] });
    }
  }
  return { CELLS: cells, WALLS: walls };
})();

const BOX_CELL = BOXES.map((_, bi) => CELLS.findIndex((c) => c.box === bi));
// Die Blüte öffnet sich in einer früheren Zelle der untersten Ebene, nicht in der Spitze –
// in der geräumigsten, damit sie Platz hat
const BLOOM_CELL = BOX_CELL.slice(4).reduce((a, b) => (CELLS[b].radius > CELLS[a].radius ? b : a));

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

/** Zustand eines Kästchens / einer Zelle zur Zeit t */
function boxState(bi: number, t: number) {
  const b = BOXES[bi];
  const cell = CELLS[BOX_CELL[bi]];
  // die Spitze löst sich zuerst, die unteren Ebenen folgen
  const delay = b.level * 0.04 + (bi % 3) * 0.008;
  const move = seg(t, 0.14 + delay, 0.34);
  const form = seg(t, 0.2 + delay, 0.34);
  const c = lerpP(b.c, cell.c, move);
  const rect = rectOutline(b.w, b.h);
  return { c, pts: rect.map((q, i) => lerpP(q, cell.shape[i], form)).map(([x, y]): P => [x + c[0], y + c[1]]) };
}

const growStart = (cell: Cell) => 0.38 + cell.grow * 0.2;
/** Zeitpunkt, an dem eine Zelle ihre endgültige Form hat */
const cellDone = (cell: Cell) => (cell.box === -1 ? growStart(cell) + 0.16 : 0.2 + BOXES[cell.box].level * 0.04 + (cell.box % 3) * 0.008 + 0.34);

function cellPath(ci: number, t: number) {
  const cell = CELLS[ci];
  if (cell.box !== -1) return polyPath(boxState(cell.box, t).pts);
  const g = seg(t, growStart(cell), 0.16);
  if (g <= 0) return "";
  // ab einem Drittel der Grösse eingeblendet: winzige Anfänge sähen aus wie Staub
  const k = 0.35 + 0.65 * g;
  return polyPath(cell.shape.map(([x, y]): P => [cell.c[0] + x * k, cell.c[1] + y * k]));
}

const cellOpacity = (ci: number, t: number) => (CELLS[ci].box !== -1 ? 1 : seg(t, growStart(CELLS[ci]), 0.12));

const BEND = BOXES.map((_, i) => ((i * 5) % 3) * 0.06 - 0.06);

function edgeD(i: number, t: number) {
  const b = BOXES[i];
  return edgePath(boxState(b.parent, t).c, boxState(i, t).c, seg(t, 0.04, 0.22), BEND[i]);
}

// Reifes Gewebe: Membran, Zellkern, Körnung – je Zelle
const DETAILS = CELLS.map((cell, ci) => {
  const rnd = seeded(100 + ci);
  const k = 1 - 3.2 / cell.radius;
  const membrane = polyPath(cell.shape.map(([x, y]): P => [cell.c[0] + x * k, cell.c[1] + y * k]));
  const at = (ang: number, f: number): P => {
    const h = cell.shape[Math.round((((ang / (Math.PI * 2)) % 1) + 1) % 1 * (K - 1))];
    return [cell.c[0] + h[0] * f, cell.c[1] + h[1] * f];
  };
  // Zellkern etwas aus der Mitte gerückt, wie in einer echten Zelle
  const n0 = at(rnd() * Math.PI * 2, 0.22 + rnd() * 0.2);
  const nucleus: P = [r1(n0[0]), r1(n0[1])];
  const nr = r1(Math.min(4, Math.max(2.5, cell.radius * 0.18)));
  let grains = "";
  for (let g = 0; g < 6; g++) {
    const p = at(rnd() * Math.PI * 2, 0.45 + rnd() * 0.38);
    grains += ` M${f1(p[0])} ${f1(p[1])} h0.01`;
  }
  return { membrane, nucleus, nr, grains: grains.trim() };
});

// Plasmodesmen: feine Kanäle quer durch jede gemeinsame Wand
const CHANNELS = WALLS.map((w) => {
  const len = Math.hypot(w.b[0] - w.a[0], w.b[1] - w.a[1]);
  const d: P = [(w.b[0] - w.a[0]) / len, (w.b[1] - w.a[1]) / len];
  const n: P = [-d[1], d[0]];
  const count = len > 34 ? 2 : len > 10 ? 1 : 0;
  const half = GAP + 1.3;
  let path = "";
  for (let i = 0; i < count; i++) {
    const p = lerpP(w.a, w.b, (i + 1) / (count + 1));
    path += ` M${f1(p[0] - n[0] * half)} ${f1(p[1] - n[1] * half)} L${f1(p[0] + n[0] * half)} ${f1(p[1] + n[1] * half)}`;
  }
  const t = Math.max(cellDone(CELLS[w.cells[0]]), cellDone(CELLS[w.cells[1]]));
  return { d: path.trim(), t };
}).filter((c) => c.d);

/** MBT-Blüte wie im Logo: 16 spitze Blätter um eine offene Mitte, innen je eine kleine gefüllte Spitze */
const BLOOM_R = Math.min(17, CELLS[BLOOM_CELL].radius * 0.78);
const BLOOM = Array.from({ length: 16 }, (_, k) => {
  const a = (k / 16) * Math.PI * 2 - Math.PI / 2;
  const half = (Math.PI / 16) * 0.94;
  const q = (r: number, ang: number) => `${f1(Math.cos(ang) * r * BLOOM_R)} ${f1(Math.sin(ang) * r * BLOOM_R)}`;
  return {
    petal: `M${q(0.37, a)}L${q(0.64, a - half)}L${q(1, a)}L${q(0.64, a + half)}Z`,
    dart: `M${q(0.37, a)}L${q(0.48, a - half * 0.3)}L${q(0.48, a + half * 0.3)}Z`,
  };
});

const WALL = "color-mix(in srgb, var(--color-ink) 72%, var(--color-neutral-tint))";
/** Zellwand: im Organigramm kräftig wie die Kästchen, im Gewebe fein */
const wallWidth = (t: number) => lerp(1.1, 0.7, seg(t, 0.3, 0.4));
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
      const q = gsap.utils.selector(root);
      const cells = root.querySelectorAll<SVGPathElement>(".o-cell");
      const edges = root.querySelectorAll<SVGPathElement>(".o-edge");
      const linkGroup = root.querySelector<SVGGElement>(".o-links")!;
      const wallGroup = root.querySelector<SVGGElement>(".o-walls")!;
      const from = root.querySelector<HTMLElement>(".o-from")!;
      const to = root.querySelector<HTMLElement>(".o-to")!;
      const rule = root.querySelector<HTMLElement>(".o-rule")!;

      const render = (t: number) => {
        cells.forEach((el, ci) => {
          el.setAttribute("d", cellPath(ci, t));
          el.setAttribute("opacity", cellOpacity(ci, t).toFixed(2));
        });
        wallGroup.setAttribute("stroke-width", wallWidth(t).toFixed(2));
        edges.forEach((el, k) => el.setAttribute("d", edgeD(k + 1, t)));
        // Linien treten zurück, sobald die Zellen einander berühren
        linkGroup.setAttribute("opacity", f1(1 - seg(t, 0.46, 0.2)));
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
        // Das Sichtfeld legt sich um das Organigramm
        .fromTo(q(".o-field"), { drawSVG: "50% 50%" }, { drawSVG: "0% 100%", duration: 0.26 }, 0.1);

      // Das Gewebe reift Zelle für Zelle, sobald sie ihre Form gefunden hat
      CELLS.forEach((cell, ci) => {
        if (ci === BLOOM_CELL) return;
        const t = Math.min(0.9, cellDone(cell));
        tl.fromTo(q(`.o-membrane-${ci}`), { drawSVG: "0%" }, { drawSVG: "0% 100%", duration: 0.08 }, t)
          .fromTo(q(`.o-nucleus-${ci}`), { scale: 0, svgOrigin: `${f1(DETAILS[ci].nucleus[0])} ${f1(DETAILS[ci].nucleus[1])}` }, { scale: 1, duration: 0.05 }, t + 0.03)
          .fromTo(q(`.o-grains-${ci}`), { opacity: 0 }, { opacity: 0.25, duration: 0.05 }, t + 0.05);
      });
      CHANNELS.forEach((c, i) => tl.fromTo(q(`.o-channel-${i}`), { opacity: 0 }, { opacity: 0.45, duration: 0.05 }, Math.min(0.92, c.t + 0.06)));

      const bc = CELLS[BLOOM_CELL];
      tl.fromTo(q(".o-membrane-bloom"), { drawSVG: "0%" }, { drawSVG: "0% 100%", duration: 0.08 }, cellDone(bc))
        .fromTo(q(".o-bloom"), { scale: 0.5, rotation: -22, svgOrigin: "0 0" }, { scale: 1, rotation: 0, duration: 0.14 }, 0.84)
        .fromTo(q(".o-petal"), { drawSVG: "0%", fillOpacity: 0 }, { drawSVG: "0% 100%", duration: 0.08, stagger: 0.005 }, 0.84)
        .fromTo(q(".o-dart"), { opacity: 0 }, { opacity: 1, duration: 0.05, stagger: 0.003 }, 0.9)
        .to(q(".o-petal"), { fillOpacity: 0.1, duration: 0.06 }, 0.93)
        .set({}, {}, 1);
      render(0);
    },
    { scope: figureRef, dependencies: [reduced], revertOnUpdate: true }
  );

  const bloomCell = CELLS[BLOOM_CELL];

  const figure = (
    <figure ref={figureRef} className="mx-auto w-full max-w-5xl">
      <svg
        viewBox="196 58 408 408"
        className="mx-auto block aspect-square h-auto max-h-[64svh] w-full overflow-visible"
        role="img"
        aria-label="Linienzeichnung: Ein Organigramm aus Kästchen, die nur über rechtwinklige Linien mit der Spitze verbunden sind, löst sich in einem kreisrunden Sichtfeld auf. Die Kästchen wachsen aufeinander zu und werden zu Zellen, die sich direkt berühren, neue Zellen füllen das Feld. Jede Zelle bekommt einen Zellkern, durch jede gemeinsame Wand führen feine Kanäle zu den Nachbarn. In einer einzelnen Zelle öffnet sich die violette MBT-Blüte."
      >
        {/* Sichtfeld */}
        <circle cx={FIELD.cx} cy={FIELD.cy} r={FIELD.r + 2} className="fill-none stroke-hairline" strokeWidth={1.5} />
        <path
          className="o-field fill-none stroke-ink"
          d={`M${FIELD.cx} ${FIELD.cy - FIELD.r - 2} A${FIELD.r + 2} ${FIELD.r + 2} 0 1 1 ${FIELD.cx - 0.01} ${FIELD.cy - FIELD.r - 2}`}
          strokeWidth={0.9}
          opacity={0.35}
        />

        <g className="o-links fill-none" stroke={LINK} strokeWidth={1} opacity={0}>
          {BOXES.slice(1).map((_, k) => (
            <path key={k} className="o-edge" d={edgeD(k + 1, 1)} />
          ))}
        </g>
        <g className="o-walls" fill="var(--color-paper)" fillOpacity={0.75} stroke={WALL} strokeWidth={wallWidth(1)} strokeLinejoin="round">
          {CELLS.map((_, ci) => (
            <path key={ci} className="o-cell" d={cellPath(ci, 1)} />
          ))}
        </g>

        {/* Reifes Gewebe */}
        <g className="fill-none stroke-ink" strokeLinecap="round" strokeLinejoin="round">
          {DETAILS.map((d, ci) =>
            ci === BLOOM_CELL ? (
              <path key={ci} className="o-membrane-bloom" d={d.membrane} strokeWidth={0.45} opacity={0.25} />
            ) : (
              <g key={ci}>
                <path className={`o-membrane-${ci}`} d={d.membrane} strokeWidth={0.45} opacity={0.25} />
                <path className={`o-grains-${ci}`} d={d.grains} strokeWidth={1} opacity={0.25} />
                <g className={`o-nucleus-${ci}`}>
                  <circle cx={d.nucleus[0]} cy={d.nucleus[1]} r={d.nr} className="fill-ink" fillOpacity={0.05} strokeWidth={0.5} opacity={0.45} />
                  <circle cx={r1(d.nucleus[0] + d.nr * 0.12)} cy={r1(d.nucleus[1] - d.nr * 0.1)} r={r1(d.nr * 0.2)} className="fill-ink stroke-none" opacity={0.28} />
                </g>
              </g>
            )
          )}
          {CHANNELS.map((c, i) => (
            <path key={i} className={`o-channel-${i}`} d={c.d} strokeWidth={0.5} opacity={0.45} />
          ))}
        </g>

        {/* MBT-Blüte – das einzige farbige Element */}
        <g transform={`translate(${f1(bloomCell.c[0])} ${f1(bloomCell.c[1])})`}>
          <g className="o-bloom">
            {BLOOM.map((b, k) => (
              <path key={k} className="o-petal fill-accent stroke-accent" d={b.petal} fillOpacity={0.1} strokeWidth={0.9} strokeLinejoin="round" />
            ))}
            {BLOOM.map((b, k) => (
              <path key={`d${k}`} className="o-dart fill-accent" d={b.dart} />
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
