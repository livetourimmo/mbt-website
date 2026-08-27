"use client";

import { useEffect, useRef } from "react";

type Pt = { x: number; y: number };

type OrgNode = {
  kind: "root" | "branch" | "leaf" | "twig";
  w?: number;
  h?: number;
  chart: Pt;
  net: Pt;
  parent: OrgNode | null;
  angle?: number;
  glow?: boolean;
  edgeEl?: SVGElement;
  glowEl?: SVGElement;
  shapeEl?: SVGElement;
  _x?: number;
  _y?: number;
};

const COL = {
  chartNode: "#8890a3",
  netNode: "#98a084",
  chartRoot: "#6d7690",
  netRoot: "#8f9678",
  chartLine: "#9aa0b0",
  netLine: "#b9b29a",
  twig: "#c9c2a6",
  glow: "#eecb6e",
  paper: "#fcfbfa",
};

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function lerpColor(c1: string, c2: string, t: number) {
  const a = parseInt(c1.slice(1), 16);
  const b = parseInt(c2.slice(1), 16);
  const ar = (a >> 16) & 255;
  const ag = (a >> 8) & 255;
  const ab = a & 255;
  const br = (b >> 16) & 255;
  const bg = (b >> 8) & 255;
  const bb = b & 255;
  const r = Math.round(lerp(ar, br, t));
  const g = Math.round(lerp(ag, bg, t));
  const bl = Math.round(lerp(ab, bb, t));
  return `rgb(${r},${g},${bl})`;
}

const SVG_NS = "http://www.w3.org/2000/svg";

function makeEl(tag: string, attrs: Record<string, string | number>) {
  const e = document.createElementNS(SVG_NS, tag);
  for (const k in attrs) e.setAttribute(k, String(attrs[k]));
  return e;
}

export default function OrganismMorph({
  className = "",
}: {
  className?: string;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const box = boxRef.current;
    const svg = svgRef.current;
    if (!box || !svg) return;

    while (svg.firstChild) svg.removeChild(svg.firstChild);

    const CX = 320;
    const CY = 180;

    const nodes: OrgNode[] = [];
    const root: OrgNode = {
      kind: "root",
      w: 40,
      h: 22,
      chart: { x: 320, y: 50 },
      net: { x: CX, y: CY },
      parent: null,
    };
    nodes.push(root);

    const branchAngles = [-90, 30, 150];
    const branchChartX = [170, 320, 470];
    const R1 = 78;
    const branches: OrgNode[] = branchAngles.map((deg, i) => {
      const rad = (deg * Math.PI) / 180;
      const b: OrgNode = {
        kind: "branch",
        w: 24,
        h: 16,
        parent: root,
        chart: { x: branchChartX[i], y: 140 },
        net: { x: CX + R1 * Math.cos(rad), y: CY + R1 * Math.sin(rad) },
        angle: deg,
      };
      nodes.push(b);
      return b;
    });

    const leafOffsets = [-34, 0, 34];
    const leafChartX = [
      [110, 170, 230],
      [260, 320, 380],
      [410, 470, 530],
    ];
    const R2 = 55;
    const glowLeaves: Record<string, boolean> = {
      "0,1": true,
      "1,2": true,
      "2,0": true,
    };
    const leaves: OrgNode[] = [];
    branches.forEach((b, bi) => {
      leafOffsets.forEach((off, li) => {
        const rad = ((b.angle! + off) * Math.PI) / 180;
        const leaf: OrgNode = {
          kind: "leaf",
          w: 18,
          h: 12,
          parent: b,
          chart: { x: leafChartX[bi][li], y: 230 },
          net: {
            x: b.net.x + R2 * Math.cos(rad),
            y: b.net.y + R2 * Math.sin(rad),
          },
          glow: !!glowLeaves[`${bi},${li}`],
        };
        nodes.push(leaf);
        leaves.push(leaf);
      });
    });

    const twigOffsets = [-24, 24];
    const R3 = 22;
    const glowTwigs: Record<number, boolean> = { 2: true, 11: true };
    leaves.forEach((leaf, leafIndex) => {
      const outAngle =
        (Math.atan2(leaf.net.y - CY, leaf.net.x - CX) * 180) / Math.PI;
      twigOffsets.forEach((off, ti) => {
        const rad = ((outAngle + off) * Math.PI) / 180;
        const idx = leafIndex * 2 + ti;
        const twig: OrgNode = {
          kind: "twig",
          chart: { x: leaf.chart.x, y: leaf.chart.y },
          net: {
            x: leaf.net.x + R3 * Math.cos(rad),
            y: leaf.net.y + R3 * Math.sin(rad),
          },
          parent: leaf,
          glow: !!glowTwigs[idx],
        };
        nodes.push(twig);
      });
    });

    const defs = makeEl("defs", {});
    const blur = makeEl("filter", {
      id: "organism-blur",
      x: "-100%",
      y: "-100%",
      width: "300%",
      height: "300%",
    });
    blur.appendChild(makeEl("feGaussianBlur", { stdDeviation: "6" }));
    defs.appendChild(blur);
    svg.appendChild(defs);

    const edgeLayer = makeEl("g", {});
    const glowLayer = makeEl("g", {});
    const nodeLayer = makeEl("g", {});
    svg.appendChild(edgeLayer);
    svg.appendChild(glowLayer);
    svg.appendChild(nodeLayer);

    nodes.forEach((n) => {
      if (n.parent) {
        n.edgeEl = makeEl("line", {
          stroke: COL.chartLine,
          "stroke-width": n.kind === "twig" ? 1 : 1.4,
          opacity: n.kind === "twig" ? 0 : 1,
        });
        edgeLayer.appendChild(n.edgeEl);
      }
      if (n.glow) {
        n.glowEl = makeEl("circle", {
          r: 0,
          fill: COL.glow,
          filter: "url(#organism-blur)",
          opacity: 0,
        });
        glowLayer.appendChild(n.glowEl);
      }
      n.shapeEl =
        n.kind === "twig"
          ? makeEl("circle", { r: 0, fill: COL.twig, opacity: 0 })
          : makeEl("rect", { width: n.w!, height: n.h!, rx: 2 });
      nodeLayer.appendChild(n.shapeEl);
    });

    function render(t: number) {
      nodes.forEach((n) => {
        const x = lerp(n.chart.x, n.net.x, t);
        const y = lerp(n.chart.y, n.net.y, t);
        n._x = x;
        n._y = y;

        if (n.kind === "twig") {
          const grow = Math.max(0, Math.min(1, (t - 0.5) / 0.5));
          n.shapeEl!.setAttribute("cx", String(x));
          n.shapeEl!.setAttribute("cy", String(y));
          n.shapeEl!.setAttribute("r", String(3 * grow));
          n.shapeEl!.setAttribute("opacity", String(grow));
          n.shapeEl!.setAttribute("fill", COL.twig);
          if (n.edgeEl) {
            n.edgeEl.setAttribute("x1", String(n.parent!._x));
            n.edgeEl.setAttribute("y1", String(n.parent!._y));
            n.edgeEl.setAttribute("x2", String(x));
            n.edgeEl.setAttribute("y2", String(y));
            n.edgeEl.setAttribute("opacity", String(grow * 0.8));
            n.edgeEl.setAttribute("stroke", COL.netLine);
          }
        } else {
          const isRoot = n.kind === "root";
          const fill = lerpColor(
            isRoot ? COL.chartRoot : COL.chartNode,
            isRoot ? COL.netRoot : COL.netNode,
            t
          );
          const rx = lerp(2, Math.min(n.w!, n.h!) / 2, t);
          n.shapeEl!.setAttribute("x", String(x - n.w! / 2));
          n.shapeEl!.setAttribute("y", String(y - n.h! / 2));
          n.shapeEl!.setAttribute("rx", String(rx));
          n.shapeEl!.setAttribute("ry", String(rx));
          n.shapeEl!.setAttribute("fill", fill);
          n.shapeEl!.setAttribute("stroke", COL.paper);
          n.shapeEl!.setAttribute("stroke-width", "1.5");
          if (n.edgeEl) {
            n.edgeEl.setAttribute("x1", String(n.parent!._x));
            n.edgeEl.setAttribute("y1", String(n.parent!._y));
            n.edgeEl.setAttribute("x2", String(x));
            n.edgeEl.setAttribute("y2", String(y));
            n.edgeEl.setAttribute(
              "stroke",
              lerpColor(COL.chartLine, COL.netLine, t)
            );
            n.edgeEl.setAttribute("stroke-width", String(lerp(1.4, 1, t)));
          }
        }

        if (n.glow && n.glowEl) {
          const glowT = Math.max(
            0,
            Math.min(1, (t - (n.kind === "root" ? 0.35 : 0.6)) / 0.4)
          );
          n.glowEl.setAttribute("cx", String(x));
          n.glowEl.setAttribute("cy", String(y));
          n.glowEl.setAttribute(
            "r",
            String(lerp(0, n.kind === "twig" ? 9 : 14, glowT))
          );
          n.glowEl.setAttribute("opacity", String(glowT * 0.75));
        }
      });
    }

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion) {
      render(1);
      return;
    }

    render(0);
    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const rect = box!.getBoundingClientRect();
        const vh = window.innerHeight;
        const progress = (vh - rect.top) / (vh + rect.height);
        render(Math.max(0, Math.min(1, progress)));
        ticking = false;
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      ref={boxRef}
      className={`relative mx-auto aspect-video max-w-2xl rounded-sm border border-hairline bg-[#f2ead9] ${className}`}
      role="img"
      aria-label="Illustration: Ein starres, hierarchisches Organigramm verwandelt sich beim Scrollen Schritt für Schritt in ein lebendiges, pulsierendes Netzwerk aus vernetzten, leuchtenden Knoten."
    >
      <svg
        ref={svgRef}
        viewBox="0 0 640 360"
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-0 h-full w-full"
      />
    </div>
  );
}
