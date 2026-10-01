"use client";

import { useRef, type PointerEvent } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import SplitWords from "@/components/split-words";
import CtaButton from "@/components/cta-button";

export type Angebot = {
  titel: string;
  beschreibung: string;
  details: readonly string[];
  /** Ausführlicher Text für das Pop-up «Mehr erfahren» */
  mehr: {
    text: readonly string[];
    ablauf: readonly string[];
  };
};

/** Pop-up mit dem ausführlichen Angebotstext (natives <dialog>: Escape und Fokus inklusive). */
function OfferDialog({
  angebot,
  nummer,
  tone,
}: {
  angebot: Angebot;
  nummer: string;
  tone: "ink" | "accent";
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = `angebot-${nummer}-titel`;

  return (
    <>
      <button
        type="button"
        onClick={() => ref.current?.showModal()}
        className="mt-8 inline-flex items-center gap-2 self-start rounded-full border border-hairline px-5 py-2.5 text-[14px] font-medium text-ink transition-colors duration-300 hover:border-accent hover:text-accent"
      >
        Mehr erfahren
        <span aria-hidden>→</span>
      </button>

      <dialog
        ref={ref}
        aria-labelledby={titleId}
        // Klick auf den abgedunkelten Hintergrund schliesst das Pop-up
        onClick={(e) => e.target === e.currentTarget && ref.current?.close()}
        className="offer-dialog m-auto max-h-[92vh] w-[calc(100%-2rem)] max-w-2xl overflow-y-auto md:max-w-4xl rounded-3xl bg-paper p-0 text-ink shadow-[0_32px_64px_-24px_rgba(31,44,87,0.45)]"
      >
        <div className="p-7 md:px-11 md:py-9">
          <div className="flex items-start justify-between gap-6">
            <div>
              <span className="font-display text-[15px] font-semibold text-accent">{nummer}</span>
              <h3 id={titleId} className="mt-2 font-display text-[1.6rem] leading-[1.15] font-semibold md:text-[1.9rem]">
                {angebot.titel}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => ref.current?.close()}
              aria-label="Schliessen"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-hairline text-ink-soft transition-colors duration-300 hover:border-accent hover:text-accent"
            >
              <span aria-hidden>✕</span>
            </button>
          </div>

          {/* Ab Tablet zweispaltig: links Text, rechts Ablauf — so passt alles ohne Scrollen */}
          <div className="mt-5 grid gap-6 md:grid-cols-[1.15fr_1fr] md:gap-10">
            <div className="space-y-3 text-[16px] leading-relaxed text-ink-soft">
              {angebot.mehr.text.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>

            <div className="md:border-l md:border-hairline md:pl-10">
              <h4 className="font-display text-[1.05rem] font-semibold">So kann es ablaufen</h4>
              <ol className="mt-3 space-y-2 border-t border-hairline pt-4 md:border-t-0 md:pt-0">
                {angebot.mehr.ablauf.map((schritt, k) => (
                  <li key={schritt} className="flex gap-4 text-[15px] leading-relaxed text-ink-soft">
                    <span aria-hidden className="font-display font-semibold text-accent">
                      {k + 1}
                    </span>
                    <span>{schritt}</span>
                  </li>
                ))}
              </ol>

              <div className="mt-7">
                <CtaButton href="/kennenlerngespraech" tone={tone}>
                  Kennenlerngespräch vereinbaren
                </CtaButton>
              </div>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}

function trackPointer(e: PointerEvent<HTMLDivElement>) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${e.clientX - r.left}px`);
  el.style.setProperty("--my", `${e.clientY - r.top}px`);
}

export default function OfferSection({
  angebote,
  tint,
  tone = "ink",
}: {
  angebote: readonly Angebot[];
  tint?: string;
  tone?: "ink" | "accent";
}) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap
          .timeline({
            defaults: { ease: "power3.out" },
            scrollTrigger: { trigger: root.current, start: "top 70%", once: true },
          })
          .from(".of-title", { autoAlpha: 0, y: 8, duration: 1.2, ease: "power2.out" })
          .from(".of-lede", { y: 8, autoAlpha: 0, duration: 1 }, "-=0.8")
          .from(
            ".of-card",
            // clearProps: danach übernimmt wieder der CSS-Hover-Effekt (translate)
            { y: 24, autoAlpha: 0, duration: 1.2, stagger: 0.14, clearProps: "transform,translate" },
            "-=0.6"
          )
          .from(".of-num", { scale: 0.8, autoAlpha: 0, duration: 0.8, stagger: 0.14, ease: "power2.out" }, "<0.3");
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
              className="of-card spotlight group flex h-full flex-col rounded-3xl border border-hairline bg-paper/80 p-8 backdrop-blur-sm transition-[translate,box-shadow,border-color] duration-500 ease-out hover:-translate-y-1 hover:border-accent/30 hover:shadow-[0_24px_48px_-24px_rgba(31,44,87,0.28)]"
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
              <div className="mt-auto">
                <OfferDialog angebot={a} nummer={String(i + 1).padStart(2, "0")} tone={tone} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
