"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

/**
 * Vollbreiter Kernsatz auf dunklem Grund. Bricht den Rhythmus der
 * Bild-Text-Abschnitte; die Wörter leuchten beim Scrollen nacheinander auf.
 */
export default function BigQuote({ text, tone = "ink" }: { text: string; tone?: "ink" | "accent" }) {
  const root = useRef<HTMLElement>(null);
  const words = text.split(/\s+/).filter(Boolean);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          ".bq-word",
          { opacity: 0.15 },
          {
            opacity: 1,
            stagger: 0.1,
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top 70%", end: "bottom 60%", scrub: true },
          }
        );
        gsap.from(".bq-mark", {
          scale: 0.4,
          autoAlpha: 0,
          duration: 1,
          ease: "back.out(2)",
          scrollTrigger: { trigger: root.current, start: "top 75%", once: true },
        });
      });
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      className={`relative overflow-hidden px-6 py-28 md:px-10 md:py-40 ${
        tone === "accent" ? "bg-accent-dark" : "bg-ink"
      }`}
    >
      <figure className="mx-auto max-w-5xl">
        <span
          aria-hidden
          className="bq-mark block font-display text-[5rem] leading-none text-accent md:text-[7rem]"
          style={tone === "accent" ? { color: "var(--color-coaching-tint)" } : undefined}
        >
          «
        </span>
        <blockquote className="mt-2 font-display text-[2rem] leading-[1.15] font-semibold tracking-tight text-paper md:text-[3.5rem]">
          <span aria-label={text} role="text">
            {words.map((w, i) => (
              <span key={i} aria-hidden className="bq-word">
                {w}{" "}
              </span>
            ))}
          </span>
        </blockquote>
      </figure>
    </section>
  );
}
