"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import SplitWords from "@/components/split-words";

export default function SectionImage({
  heading,
  media,
  imageSide = "right",
  tint,
  children,
}: {
  heading: string;
  media: ReactNode;
  imageSide?: "left" | "right";
  tint?: string;
  children: ReactNode;
}) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const reveal = gsap.timeline({
          defaults: { ease: "power4.out" },
          scrollTrigger: { trigger: root.current, start: "top 72%", once: true },
        });
        // Bild öffnet sich wie ein Vorhang von der Textseite her
        reveal
          .fromTo(
            ".si-frame",
            { clipPath: imageSide === "left" ? "inset(0 100% 0 0 round 24px)" : "inset(0 0 0 100% round 24px)" },
            { clipPath: "inset(0 0% 0 0% round 24px)", duration: 1.5, ease: "expo.inOut" },
            0
          )
          .from(".si-title .word-inner", { yPercent: 110, duration: 1, stagger: 0.06 }, 0.3)
          .from(".si-body > *", { y: 28, autoAlpha: 0, duration: 0.9, stagger: 0.1 }, 0.55);

        // Tiefe: Bild zoomt beim Durchscrollen langsam heraus
        gsap.fromTo(
          ".si-zoom",
          { scale: 1.18, yPercent: -4 },
          {
            scale: 1,
            yPercent: 4,
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
          }
        );
      });
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      className="relative overflow-hidden border-t border-hairline"
      style={tint ? { background: tint } : undefined}
    >
      <div className="relative mx-auto grid max-w-7xl gap-10 px-6 py-20 md:grid-cols-12 md:items-center md:gap-12 md:px-10 md:py-32">
        <div
          className={`group si-frame overflow-hidden rounded-3xl md:col-span-7 ${
            imageSide === "left" ? "md:order-1" : "md:order-2"
          }`}
        >
          <div className="si-zoom will-change-transform">
            <div className="transition-transform duration-700 ease-out group-hover:scale-[1.03]">
              {media}
            </div>
          </div>
        </div>
        <div
          className={`md:col-span-5 ${
            imageSide === "left" ? "md:order-2" : "md:order-1"
          }`}
        >
          <h2 className="si-title font-display text-[1.75rem] leading-[1.12] font-semibold tracking-tight text-ink md:text-[2.4rem]">
            <SplitWords text={heading} />
          </h2>
          <div className="si-body mt-6 space-y-4 text-[17px] leading-relaxed text-ink-soft">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
