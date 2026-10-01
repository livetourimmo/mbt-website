"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import SplitWords from "@/components/split-words";

export default function HeroFull({
  kicker,
  headline,
  lede,
  media,
  tone = "ink",
}: {
  kicker?: string;
  headline: string;
  lede?: string;
  media: ReactNode;
  tone?: "ink" | "accent";
}) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // Der Auftritt läuft per CSS (globals.css, .hero-*), damit nichts aufblitzt.
        // Scroll: Bild wandert langsamer (Tiefe), Text hebt sich ab und verblasst
        gsap.to(".hero-parallax", {
          yPercent: 10,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
        gsap.to(".hero-content", {
          yPercent: -18,
          autoAlpha: 0,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "70% top", scrub: true },
        });
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="relative h-[92vh] min-h-[560px] w-full overflow-hidden bg-ink">
      {/* depth-0: Bild mit Parallax */}
      <div className="hero-parallax absolute inset-0 will-change-transform">
        <div className="hero-media absolute inset-0">{media}</div>
      </div>

      {/* depth-1: Farbverlauf + langsam wandernder Lichtschimmer */}
      <div
        aria-hidden
        className={`absolute inset-0 bg-gradient-to-t to-transparent ${
          tone === "accent"
            ? "from-accent/70 via-accent/20"
            : "from-consulting-accent/70 via-consulting-accent/20"
        }`}
      />
      <div aria-hidden className="hero-glow pointer-events-none absolute inset-0" />
      {/* Dezenter Verlauf hinter dem Text (links), damit er auch über hellem Laub lesbar bleibt */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/35 via-ink/10 to-transparent md:via-transparent"
      />

      {/* depth-4: Text */}
      <div className="hero-content absolute inset-x-0 bottom-0 px-6 pb-16 [text-shadow:0_1px_14px_rgba(15,20,40,0.35)] md:px-10 md:pb-20">
        <div className="mx-auto max-w-7xl">
          {kicker && (
            <p className="hero-kicker inline-flex items-center gap-3 text-[15px] text-paper/85">
              <span aria-hidden className="h-px w-8 bg-paper/60" />
              {kicker}
            </p>
          )}
          <h1 className="hero-title mt-4 max-w-3xl font-display text-[2.5rem] leading-[1.05] font-semibold tracking-tight text-paper md:text-[4rem]">
            <SplitWords text={headline} />
          </h1>
          {lede && (
            <p className="hero-lede mt-6 max-w-md text-[17px] leading-relaxed text-paper/90">
              {lede}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
