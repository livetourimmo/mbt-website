"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

/**
 * Hervorgehobener Kernsatz mit Akzentlinie links; blendet einmal ruhig ein.
 */
export default function ScrollQuote({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const text = typeof children === "string" ? children.replace(/\s+/g, " ").trim() : null;

  useGSAP(
    () => {
      if (!text) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // Der Kernsatz blendet einmal als Ganzes ruhig ein
        gsap.from(ref.current, {
          autoAlpha: 0,
          y: 8,
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
        });
      });
    },
    { scope: ref }
  );

  return (
    <p
      ref={ref}
      className={`relative pl-5 font-display text-[19px] leading-snug font-medium text-ink md:text-[21px] ${className}`}
    >
      <span aria-hidden className="q-bar absolute top-1 bottom-1 left-0 w-[2px] origin-top rounded-full bg-accent" />
      {text ? (
        <span aria-label={text} role="text">
          {text.split(" ").map((w, i) => (
            <span key={i} aria-hidden className="q-word">
              {w}{" "}
            </span>
          ))}
        </span>
      ) : (
        children
      )}
    </p>
  );
}
