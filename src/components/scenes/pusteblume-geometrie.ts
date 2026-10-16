import { seeded, r1 } from "@/lib/use-scrub-scene";

// Gemeinsame Zeichnung der Pusteblume für beide Coaching-Szenen: Samen auf
// einer Kugel verteilt, jeder mit Stiel und einem Schirm aus feinen Strahlen.

export const HEAD: [number, number] = [400, 196];
export const STEM = "M406 520 C404 430 395 300 400 204";
const RADIUS = 104;

export type Seed = {
  d: string; // Stiel + Schirm als ein Pfad (zeichnet sich vom Kern nach aussen)
  tip: [number, number];
  dir: [number, number]; // projizierte Richtung vom Kopf aus
  front: boolean;
  angle: number; // Polarwinkel in der Ansicht, für die Reihenfolge
};

export function makeSeeds(count: number, seed: number, jitter: number): Seed[] {
  const rnd = seeded(seed);
  const golden = Math.PI * (3 - Math.sqrt(5));
  return Array.from({ length: count }, (_, i) => {
    const y = 1 - (2 * (i + 0.5)) / count;
    const rr = Math.sqrt(1 - y * y);
    const th = golden * i + (rnd() - 0.5) * jitter;
    const x = Math.cos(th) * rr;
    const z = Math.sin(th) * rr;
    const len = RADIUS * (1 + (rnd() - 0.5) * jitter * 0.25);
    const base: [number, number] = [HEAD[0] + x * 8, HEAD[1] + y * 8];
    const tip: [number, number] = [HEAD[0] + x * len, HEAD[1] + y * len];
    const mag = Math.hypot(x, y);
    const phi = Math.atan2(y, x);
    // Schirm: fächert in Wuchsrichtung, bei Samen, die zum Betrachter zeigen, rundum
    const spread = ((70 + (1 - mag) * 110) * Math.PI) / 180;
    const plen = 15 * (0.45 + 0.55 * mag);
    let d = `M${r1(base[0])} ${r1(base[1])} L${r1(tip[0])} ${r1(tip[1])}`;
    const rays = 9;
    for (let k = 0; k < rays; k++) {
      const a = phi - spread + (2 * spread * k) / (rays - 1);
      d += ` M${r1(tip[0])} ${r1(tip[1])} l${r1(Math.cos(a) * plen)} ${r1(Math.sin(a) * plen)}`;
    }
    return { d, tip: [r1(tip[0]), r1(tip[1])], dir: [x, y], front: z >= 0, angle: phi };
  });
}
