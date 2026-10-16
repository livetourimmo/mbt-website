// Kleine Liniensymbole für die Angebotskarten – aus dem Bildthema der Seite:
// Consulting (Wasser) und Coaching (Pusteblume).

export type GlyphName = "quelle" | "fluss" | "delta" | "samen" | "keimling" | "pusteblume";

const RAYS = (cx: number, cy: number, r0: number, r1: number, n: number, from = 0, to = 360) =>
  Array.from({ length: n }, (_, i) => {
    const a = ((from + ((to - from) * i) / (n - (to - from === 360 ? 0 : 1))) * Math.PI) / 180;
    return `M${(cx + Math.cos(a) * r0).toFixed(1)} ${(cy + Math.sin(a) * r0).toFixed(1)} L${(cx + Math.cos(a) * r1).toFixed(1)} ${(cy + Math.sin(a) * r1).toFixed(1)}`;
  }).join(" ");

const GLYPHS: Record<GlyphName, string[]> = {
  // Wasser
  quelle: ["M21 20 m-2 0 a2 2 0 1 0 4 0 a2 2 0 1 0 -4 0", "M21 20 m-8 0 a8 8 0 1 0 16 0 a8 8 0 1 0 -16 0", "M21 20 m-14 0 a14 14 0 1 0 28 0 a14 14 0 1 0 -28 0"],
  fluss: ["M4 28 C13 28 15 12 24 12 S33 12 38 12", "M4 34 C15 34 17 18 26 18 S34 18 38 18"],
  delta: ["M4 20 H15", "M15 20 C24 20 26 8 37 7", "M15 20 C24 20 27 20 37 20", "M15 20 C24 20 26 32 37 33"],
  // Pusteblume
  samen: ["M20 33 L20 17", RAYS(20, 17, 0, 9, 7, 200, 340), "M20 33 m-1.5 0 a1.5 3 0 1 0 3 0 a1.5 3 0 1 0 -3 0"],
  keimling: ["M5 31 H35", "M20 31 C20 26 20 22 20 18", "M20 20 C15 20 11 17 10 13 C15 13 19 15 20 20", "M20 20 C25 20 29 17 30 13 C25 13 21 15 20 20"],
  pusteblume: ["M20 37 C20 30 19 24 20 17", "M20 14 m-3 0 a3 3 0 1 0 6 0 a3 3 0 1 0 -6 0", RAYS(20, 14, 5, 12, 12)],
};

export default function OfferGlyph({ name, className = "" }: { name: GlyphName; className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={`h-10 w-10 ${className}`} aria-hidden>
      <g className="fill-none stroke-ink" strokeWidth={1.25} strokeLinecap="round" strokeLinejoin="round">
        {GLYPHS[name].map((d, i) => (
          <path key={i} className="of-glyph-line" d={d} />
        ))}
      </g>
    </svg>
  );
}
