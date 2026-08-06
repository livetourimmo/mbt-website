export type Segment = "consulting" | "coaching";

export const SEGMENT_META: Record<
  Segment,
  { domain: string; brand: string; tint: string; email: string }
> = {
  consulting: {
    domain: "mbt-consulting.ch",
    brand: "MBT-Consulting",
    tint: "var(--color-consulting-tint)",
    email: "kontakt@mbt-consulting.ch",
  },
  coaching: {
    domain: "mbt-coaching.ch",
    brand: "MBT-Coaching",
    tint: "var(--color-coaching-tint)",
    email: "kontakt@mbt-coaching.ch",
  },
};

// Direkter Seitenpfad schlägt den Host — wichtig lokal/in Vorschauen, wo der
// Host keiner der beiden echten Domains entspricht, und clientseitig, weil
// (brand)/layout.tsx als gemeinsames Layout bei Client-Navigation zwischen
// Geschwister-Routen nicht neu ausgeführt wird.
export function resolveSegmentFromPath(
  pathname: string,
  fallback: Segment
): Segment {
  if (pathname.startsWith("/coaching")) return "coaching";
  if (pathname.startsWith("/consulting")) return "consulting";
  return fallback;
}
