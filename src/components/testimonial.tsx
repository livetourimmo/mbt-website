"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

/** Kundenstimme als eigener, prominenter Abschnitt. */
export default function Testimonial({
  quote,
  name,
  role,
  tint,
}: {
  quote: string;
  name: string;
  role: string;
  tint?: string;
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
          .from(".tm-card", { y: 50, autoAlpha: 0, duration: 1.1 })
          .from(".tm-line", { scaleX: 0, duration: 1, ease: "expo.inOut" }, "-=0.7")
          .from(".tm-person", { y: 14, autoAlpha: 0, duration: 0.8 }, "-=0.6");
      });
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      className="border-t border-hairline px-6 py-20 md:px-10 md:py-28"
      style={tint ? { background: tint } : undefined}
    >
      <figure className="tm-card mx-auto max-w-4xl rounded-3xl border border-hairline bg-paper p-8 shadow-[0_30px_60px_-36px_rgba(31,44,87,0.35)] md:p-14">
        <p className="text-[13px] font-medium tracking-[0.18em] text-accent uppercase">
          Stimme aus der Zusammenarbeit
        </p>
        <blockquote className="mt-6 font-display text-[1.35rem] leading-[1.4] font-medium text-ink md:text-[1.8rem]">
          «{quote}»
        </blockquote>
        <figcaption className="mt-8 flex items-center gap-4">
          <span aria-hidden className="tm-line h-[2px] w-12 origin-left bg-accent" />
          <span className="tm-person text-[15px] text-ink-soft">
            <span className="font-semibold text-ink">{name}</span>, {role}
          </span>
        </figcaption>
      </figure>
    </section>
  );
}
