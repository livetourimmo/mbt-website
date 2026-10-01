"use client";

import { useRef, type PointerEvent } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import SplitWords from "@/components/split-words";

export type Angebot = {
  titel: string;
  beschreibung: string;
  details: readonly string[];
};

function trackPointer(e: PointerEvent<HTMLDivElement>) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${e.clientX - r.left}px`);
  el.style.setProperty("--my", `${e.clientY - r.top}px`);
}

export default function OfferSection({
  angebote,
  tint,
}: {
  angebote: readonly Angebot[];
  tint?: string;
}) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap
          .timeline({
            defaults: { ease: "power4.out" },
            scrollTrigger: { trigger: root.current, start: "top 70%", once: true },
          })
          .from(".of-title .word-inner", { yPercent: 110, duration: 1, stagger: 0.06 })
          .from(".of-lede", { y: 20, autoAlpha: 0, duration: 0.9 }, "-=0.7")
          .from(
            ".of-card",
            // clearProps: danach übernimmt wieder der CSS-Hover-Effekt (translate)
            { y: 60, autoAlpha: 0, rotate: 1.5, duration: 1.1, stagger: 0.14, clearProps: "transform,translate,rotate" },
            "-=0.6"
          )
          .from(".of-num", { scale: 0.4, autoAlpha: 0, duration: 0.8, stagger: 0.14, ease: "back.out(2)" }, "<0.3");
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
      <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-32">
        <h2 className="of-title font-display text-[1.75rem] leading-[1.12] font-semibold tracking-tight text-ink md:text-[2.4rem]">
          <SplitWords text="Angebot" />
        </h2>
        <p className="of-lede mt-4 max-w-2xl text-[17px] leading-relaxed text-ink-soft">
          Drei Beispiele, wie eine Zusammenarbeit konkret aussehen kann.
        </p>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {angebote.map((a, i) => (
            <div
              key={a.titel}
              onPointerMove={trackPointer}
              className="of-card spotlight group flex h-full flex-col rounded-3xl border border-hairline bg-paper/80 p-8 backdrop-blur-sm transition-[translate,box-shadow,border-color] duration-500 ease-out hover:-translate-y-2 hover:border-accent/30 hover:shadow-[0_24px_48px_-24px_rgba(31,44,87,0.28)]"
            >
              <span
                aria-hidden
                className="of-num mb-6 flex h-11 w-11 items-center justify-center rounded-full bg-accent/10 font-display text-[15px] font-semibold text-accent transition-colors duration-500 group-hover:bg-accent group-hover:text-paper"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-display min-h-[3.75rem] text-[1.25rem] font-semibold text-ink">
                {a.titel}
              </h3>
              <p className="mt-4 min-h-[6.5rem] text-[15px] leading-relaxed text-ink-soft">
                {a.beschreibung}
              </p>
              <ul className="mt-6 space-y-2 border-t border-hairline pt-5">
                {a.details.map((d) => (
                  <li
                    key={d}
                    className="flex items-start gap-2 text-[14px] leading-relaxed text-ink-soft"
                  >
                    <span
                      aria-hidden
                      className="text-accent transition-transform duration-300 group-hover:translate-x-1"
                    >
                      —
                    </span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
