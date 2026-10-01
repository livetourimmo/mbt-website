"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import SplitWords from "@/components/split-words";

export default function SectionText({
  heading,
  tint,
  children,
}: {
  heading: string;
  tint?: string;
  children: ReactNode;
}) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap
          .timeline({
            defaults: { ease: "power3.out" },
            scrollTrigger: { trigger: root.current, start: "top 75%", once: true },
          })
          .from(".st-line", { scaleX: 0, duration: 1.2, ease: "expo.inOut" }, 0)
          .from(".st-title", { autoAlpha: 0, y: 8, duration: 1.2, ease: "power2.out" }, 0.15)
          .from(".st-body > *", { y: 8, autoAlpha: 0, duration: 0.9, stagger: 0.1 }, 0.4);
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
      <div className="relative mx-auto grid max-w-7xl gap-6 px-6 py-20 md:grid-cols-12 md:gap-10 md:px-10 md:py-32">
        <div className="md:col-span-4">
          <span aria-hidden className="st-line mb-6 block h-[2px] w-12 origin-left bg-accent" />
          <h2 className="st-title font-display text-[1.75rem] leading-[1.12] font-semibold tracking-tight text-ink md:text-[2.4rem]">
            <SplitWords text={heading} />
          </h2>
        </div>
        <div className="st-body max-w-3xl space-y-5 text-[17px] leading-relaxed text-ink-soft md:col-span-7 md:col-start-6">
          {children}
        </div>
      </div>
    </section>
  );
}
