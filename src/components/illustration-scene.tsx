"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import Image from "next/image";
import { useScrubScene } from "@/lib/use-scrub-scene";

// Illustrations-Bildfolge: Mehrere Bilder mit identischem Bildaufbau liegen
// übereinander. Beim Scrollen wird jedes folgende Bild über eine weiche Maske
// freigelegt – das Wasser steigt, fliesst von links herein oder eine Blüte
// wächst aus ihrer Mitte. Das Markup zeigt den Endzustand (alle Masken offen),
// bei reduzierter Bewegung bleibt genau der stehen.

export type Reveal =
  | "fade" // Überblenden
  | "rise" // von unten nach oben, wie steigendes Wasser
  | "sweep" // von links nach rechts, wie fliessendes Wasser
  | "radial"; // aus einem Punkt heraus, wie Wachstum von innen

export type Frame = {
  src: string;
  /** Wie dieses Bild über dem vorherigen erscheint (das erste Bild ist die Grundlage) */
  reveal?: Reveal;
  /** Ausgangspunkt für "radial", z. B. "50% 38%" */
  origin?: string;
  /** Zeitfenster auf der Timeline (0 bis 1) */
  at?: [number, number];
};

// Breite des weichen Übergangs in Prozent der Bildfläche
const SOFT = 22;

function maskFor(frame: Frame): CSSProperties | undefined {
  const p = `calc(var(--p) * ${100 + SOFT}%)`;
  const edge = `calc(var(--p) * ${100 + SOFT}% - ${SOFT}%)`;
  let mask: string;
  switch (frame.reveal) {
    case "rise":
      mask = `linear-gradient(to top, #000 ${edge}, transparent ${p})`;
      break;
    case "sweep":
      mask = `linear-gradient(to right, #000 ${edge}, transparent ${p})`;
      break;
    case "radial":
      // Radius bis in die entfernteste Ecke
      mask = `radial-gradient(circle farthest-corner at ${frame.origin ?? "50% 50%"}, #000 ${edge}, transparent ${p})`;
      break;
    default:
      return undefined;
  }
  return { maskImage: mask, WebkitMaskImage: mask } as CSSProperties;
}

export default function IllustrationScene({
  frames,
  alt,
  width,
  height,
  sizes = "(min-width: 768px) 58vw, 100vw",
  overlay,
  className = "",
}: {
  frames: Frame[];
  /** beschreibt den Endzustand */
  alt: string;
  width: number;
  height: number;
  sizes?: string;
  /** zusätzliche, im Code animierte Ebene (z. B. fliegende Samen) */
  overlay?: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useScrubScene(ref, (tl, q) => {
    const layers = q(".is-layer");
    frames.forEach((f, i) => {
      if (i === 0) return;
      const n = frames.length - 1;
      const [a, b] = f.at ?? [((i - 1) / n) * 0.9, (i / n) * 0.9];
      const el = layers[i];
      if (f.reveal && f.reveal !== "fade") {
        tl.fromTo(el, { "--p": 0 }, { "--p": 1, duration: b - a, ease: "sine.inOut" }, a);
      } else {
        tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: b - a, ease: "sine.inOut" }, a);
      }
    });
    // Timeline auf volle Länge bringen, damit das Ende ruhig stehen bleibt
    tl.set({}, {}, 1);
  });

  return (
    <div ref={ref} className={`relative aspect-[16/10] w-full overflow-hidden bg-paper ${className}`}>
      {frames.map((f, i) => (
        <div
          key={f.src}
          className="is-layer absolute inset-0"
          style={{ "--p": 1, ...maskFor(f) } as CSSProperties}
          aria-hidden={i < frames.length - 1 || undefined}
        >
          <Image
            src={f.src}
            alt={i === frames.length - 1 ? alt : ""}
            width={width}
            height={height}
            sizes={sizes}
            className="h-full w-full object-cover"
          />
        </div>
      ))}
      {overlay}
    </div>
  );
}
