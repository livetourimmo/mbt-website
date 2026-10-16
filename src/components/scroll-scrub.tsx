"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";

export type ScrubStage = {
  key: string;
  title: string;
  paragraphs: { text: string; emphasis?: boolean }[];
};

type ScrubState = {
  activeIndex: number;
  progress: number;
  /** Springt zu einem Schritt (nur im Scrub-Modus, sonst undefined) */
  jumpTo?: (index: number) => void;
};

type ScrubTrigger = {
  /** Element, über dessen Höhe gescrubbt wird – für eigene ScrollTrigger im Media-Slot */
  triggerRef: RefObject<HTMLDivElement | null>;
  scrubOn: boolean;
};

const ScrubContext = createContext<ScrubState>({ activeIndex: 0, progress: 0 });
// Getrennter Kontext: ändert sich nicht bei jedem Scroll-Frame, Media mit eigener
// GSAP-Timeline rendert so nicht bei jedem Frame neu.
const ScrubTriggerContext = createContext<ScrubTrigger>({
  triggerRef: { current: null },
  scrubOn: false,
});

export function useScrubState() {
  return useContext(ScrubContext);
}

export function useScrubTrigger() {
  return useContext(ScrubTriggerContext);
}

export default function ScrollScrub({
  stages,
  media,
  mobileScrub = false,
  centerMedia = false,
}: {
  stages: ScrubStage[];
  media: ReactNode;
  /** Auch auf Mobile pinnen: Media oben, aktiver Text darunter */
  mobileScrub?: boolean;
  /** Desktop: Media in der Mitte, Texte abwechselnd links und rechts */
  centerMedia?: boolean;
}) {
  const spacerRef = useRef<HTMLDivElement>(null);
  const stageRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [scrubOn, setScrubOn] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function applyMode() {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      const isMobile = window.innerWidth < 768;
      setMobile(isMobile);
      setScrubOn(!reduceMotion && (!isMobile || mobileScrub));
    }
    applyMode();
    window.addEventListener("resize", applyMode);
    return () => window.removeEventListener("resize", applyMode);
  }, [mobileScrub]);

  useGSAP(
    () => {
      if (!scrubOn || !spacerRef.current) return;
      const update = (self: ScrollTrigger) => {
        const p = self.progress;
        setProgress(p);
        setActiveIndex(Math.min(stages.length - 1, Math.floor(p * stages.length)));
      };
      ScrollTrigger.create({
        trigger: spacerRef.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: update,
        onRefresh: update,
      });
      // Höhe des Spacers hat sich mit dem Modus geändert – alle Trigger neu messen
      ScrollTrigger.refresh();
    },
    { dependencies: [scrubOn, stages.length], revertOnUpdate: true }
  );

  function jumpToStage(index: number) {
    const el = spacerRef.current;
    if (!el) return;
    const total = el.getBoundingClientRect().height - window.innerHeight;
    if (total <= 0) return;
    const targetProgress = (index + 0.5) / stages.length;
    const targetY =
      window.scrollY + el.getBoundingClientRect().top + targetProgress * total;
    window.scrollTo({ top: targetY, behavior: "smooth" });
  }

  useEffect(() => {
    if (scrubOn) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveIndex(Number((entry.target as HTMLElement).dataset.index));
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    stageRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [scrubOn]);

  // Mobile im Scrub-Modus: alle Textblöcke liegen in derselben Grid-Zelle übereinander,
  // der Container ist so hoch wie der längste Block.
  const stacked = scrubOn && mobile;
  // Desktop, mittig: Media in der Mitte, die Texte wechseln zwischen links und rechts
  const centered = centerMedia && scrubOn && !mobile;

  const mediaSlot = (
    <ScrubTriggerContext.Provider value={{ triggerRef: spacerRef, scrubOn }}>
      <ScrubContext.Provider value={{ activeIndex, progress, jumpTo: scrubOn ? jumpToStage : undefined }}>
        {media}
      </ScrubContext.Provider>
    </ScrubTriggerContext.Provider>
  );

  const stageContent = (stage: ScrubStage, i: number) => (
    <>
      <p className="font-display text-[14px] font-semibold tracking-wide text-accent">
        {String(i + 1).padStart(2, "0")}
        <span className="text-ink-soft/60"> / {String(stages.length).padStart(2, "0")}</span>
      </p>
      <h3
        className={`font-display font-semibold text-ink ${
          stacked ? "mt-1 text-[1.3rem]" : "mt-2 text-[1.5rem] md:text-[1.75rem]"
        }`}
      >
        {stage.title}
      </h3>
      {stage.paragraphs.map((p, pi) => (
        <p
          key={pi}
          className={`leading-relaxed text-ink-soft ${stacked ? "mt-2.5 text-[15px]" : "mt-4 text-[16px]"} ${
            p.emphasis ? "italic" : ""
          }`}
        >
          {p.text}
        </p>
      ))}
    </>
  );

  if (centered) {
    // Jede Zeile des Textblocks kommt nacheinander von oben herab; der abgelöste
    // Text sinkt leicht nach unten und blendet aus – wie der fallende Samen im Bild.
    const fall = (i: number, k: number) => {
      const on = i === activeIndex;
      return {
        className: `transition-[opacity,translate] ${
          on
            ? "translate-y-0 opacity-100 duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
            : `${i > activeIndex ? "-translate-y-6" : "translate-y-3"} opacity-0 duration-300 ease-in`
        }`,
        style: { transitionDelay: on ? `${250 + k * 110}ms` : "0ms" },
      };
    };
    // Gerade Schritte links, ungerade rechts; beide Spalten liegen übereinander gestapelt
    const side = (s: 0 | 1) => (
      <div className="relative col-span-4 min-h-[22rem]">
        {stages.map((stage, i) =>
          i % 2 === s ? (
            <div
              key={stage.key}
              aria-hidden={i !== activeIndex}
              className={`absolute inset-x-0 top-1/2 -translate-y-1/2 ${i === activeIndex ? "" : "pointer-events-none"}`}
            >
              <div
                className={`h-0.5 bg-accent transition-[scale,opacity] duration-700 ${
                  i === activeIndex ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
                } ${s === 0 ? "origin-right" : "origin-left"}`}
                style={{ transitionDelay: i === activeIndex ? "150ms" : "0ms" }}
              />
              <p {...fall(i, 0)} className={`mt-6 font-display text-[14px] font-semibold tracking-wide text-accent ${fall(i, 0).className}`}>
                {String(i + 1).padStart(2, "0")}
                <span className="text-ink-soft/60"> / {String(stages.length).padStart(2, "0")}</span>
              </p>
              <h3 {...fall(i, 1)} className={`mt-2 font-display text-[1.75rem] font-semibold text-ink ${fall(i, 1).className}`}>
                {stage.title}
              </h3>
              {stage.paragraphs.map((p, pi) => (
                <p
                  key={pi}
                  {...fall(i, 2 + pi)}
                  className={`mt-4 text-[16px] leading-relaxed text-ink-soft ${p.emphasis ? "italic" : ""} ${fall(i, 2 + pi).className}`}
                >
                  {p.text}
                </p>
              ))}
            </div>
          ) : null
        )}
      </div>
    );
    return (
      <div ref={spacerRef} style={{ height: `${(stages.length + 1) * 100}vh` }} className="relative">
        <div className="sticky top-0 flex h-screen items-center py-8">
          <div className="mx-auto grid w-full max-w-7xl grid-cols-12 items-center gap-10 px-10">
            {side(0)}
            <div className="col-span-4">{mediaSlot}</div>
            {side(1)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={spacerRef}
      style={scrubOn ? { height: `${(stages.length + 1) * 100}vh` } : undefined}
      className="relative"
    >
      <div
        className={
          stacked
            ? "sticky top-0 flex h-[100svh] flex-col justify-center py-6"
            : scrubOn
              ? "sticky top-0 flex h-screen items-center py-8"
              : "py-12 md:py-16"
        }
      >
        <div
          className={`mx-auto grid w-full max-w-7xl px-6 md:grid-cols-12 md:items-center md:gap-10 md:px-10 ${
            stacked ? "gap-6" : "gap-10"
          }`}
        >
          <div className="md:col-span-7">{mediaSlot}</div>

          <div
            className={
              stacked ? "grid" : "md:relative md:col-span-5 md:min-h-[22rem]"
            }
          >
            {stages.map((stage, i) => (
              <div
                key={stage.key}
                ref={(el) => {
                  stageRefs.current[i] = el;
                }}
                data-index={i}
                className={
                  stacked
                    ? `[grid-area:1/1] border-t-2 border-accent pt-4 transition-[opacity,translate] ease-out ${
                        i === activeIndex
                          ? "opacity-100 delay-200 duration-700"
                          : "pointer-events-none translate-y-3 opacity-0 duration-200"
                      }`
                    : scrubOn
                      ? `border-t-2 border-accent pt-6 transition-[opacity,translate] ease-out md:absolute md:inset-x-0 md:top-1/2 ${
                          i === activeIndex
                            ? "opacity-100 delay-200 duration-700 md:-translate-y-1/2"
                            : "pointer-events-none opacity-0 duration-200 md:translate-y-[calc(-50%+12px)]"
                        }`
                      : "mb-10 border-t-2 border-accent pt-6 last:mb-0"
                }
              >
                {stageContent(stage, i)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
