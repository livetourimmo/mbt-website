"use client";

import type { RefObject } from "react";
import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from "@/lib/gsap";

type Q = (selector: string) => Element[];

/**
 * Spielt eine Linien-Szene ab, während ihr Bildbereich durch die Bildschirmmitte
 * scrollt (ohne Anpinnen). Die Timeline läuft von 0 bis 1. Das Markup der Szene
 * zeigt den Endzustand – bei reduzierter Bewegung bleibt genau der stehen.
 *
 * Gebaut wird die Timeline erst, kurz bevor die Szene ins Bild kommt: Der Aufbau
 * misst viele SVG-Elemente aus und würde sonst das Laden der Seite blockieren.
 */
export function useScrubScene(
  scope: RefObject<HTMLElement | null>,
  build: (tl: gsap.core.Timeline, q: Q) => void
) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, (ctx) => {
        ctx.add("build", () => {
          const tl = gsap.timeline({
            defaults: { ease: "sine.inOut" },
            scrollTrigger: { trigger: scope.current, start: "top 75%", end: "bottom 50%", scrub: 1 },
          });
          build(tl, gsap.utils.selector(scope));
        });
        ScrollTrigger.create({
          trigger: scope.current,
          start: "top bottom+=60%",
          once: true,
          onEnter: () => (ctx as gsap.Context & { build: () => void }).build(),
        });
      });
    },
    { scope }
  );
}

/** Deterministischer Zufall: organisch, aber bei jedem Besuch gleich */
export function seeded(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Rundet Koordinaten für kompakte SVG-Pfade */
export const r1 = (n: number) => Math.round(n * 10) / 10;
