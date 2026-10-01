import type { Segment } from "@/lib/segment";

/** Hauptadresse: gemeinsame Seiten (Lebendige Führung, Über mich, Blog …) sind hierauf kanonisch. */
export const MAIN_URL = "https://mbt-consulting.ch";

export const SITE_URL: Record<Segment, string> = {
  consulting: "https://mbt-consulting.ch",
  coaching: "https://mbt-coaching.ch",
};

/** Feste IDs, damit die Schema-Einträge seitenübergreifend aufeinander verweisen. */
export const PERSON_ID = `${MAIN_URL}/#markus-tappolet`;
export const orgId = (segment: Segment) => `${SITE_URL[segment]}/#organisation`;

/** Seiten, die unter beiden Domains erreichbar sind, aber auf MAIN_URL kanonisch zeigen. */
export const SHARED_PATHS = [
  "/lebendige-fuehrung",
  "/ueber-mich",
  "/blog",
  "/kennenlerngespraech",
  "/impressum",
  "/datenschutz",
] as const;

export const BUSINESS = {
  person: "Markus Tappolet",
  telephone: "+41774000107",
  address: {
    streetAddress: "Seestrasse 40",
    postalCode: "8330",
    addressLocality: "Pfäffikon ZH",
    addressRegion: "ZH",
    addressCountry: "CH",
  },
  vatId: "CHE-473.774.364",
} as const;

/** Segment anhand des Hosts (für robots.txt / sitemap.xml, die ausserhalb des Layouts laufen). */
export function segmentFromHost(host: string | null): Segment {
  return (host ?? "").toLowerCase().includes("coaching") ? "coaching" : "consulting";
}
