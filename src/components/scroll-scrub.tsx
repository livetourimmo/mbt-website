"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

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

const ScrubContext = createContext<ScrubState>({ activeIndex: 0, progress: 0 });

export function useScrubState() {
  return useContext(ScrubContext);
}

export default function ScrollScrub({
  stages,
  media,
}: {
  stages: ScrubStage[];
  media: ReactNode;
}) {
  const spacerRef = useRef<HTMLDivElement>(null);
  const stageRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [scrubOn, setScrubOn] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function applyMode() {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      setScrubOn(window.innerWidth >= 768 && !reduceMotion);
    }
    applyMode();
    window.addEventListener("resize", applyMode);
    return () => window.removeEventListener("resize", applyMode);
  }, []);

  useEffect(() => {
    if (!scrubOn) return;
    let ticking = false;

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const el = spacerRef.current;
        if (el) {
          const rect = el.getBoundingClientRect();
          const total = rect.height - window.innerHeight;
          const p = total > 0 ? Math.max(0, Math.min(1, -rect.top / total)) : 0;
          setProgress(p);
          setActiveIndex(Math.min(stages.length - 1, Math.floor(p * stages.length)));
        }
        ticking = false;
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [scrubOn, stages.length]);

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

  return (
    <div
      ref={spacerRef}
      style={scrubOn ? { height: `${(stages.length + 1) * 100}vh` } : undefined}
      className="relative"
    >
      <div className={scrubOn ? "sticky top-0 flex h-screen items-center py-8" : "py-12 md:py-16"}>
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-6 md:grid-cols-12 md:items-center md:gap-10 md:px-10">
          <div className="md:col-span-7">
            <ScrubContext.Provider
              value={{ activeIndex, progress, jumpTo: scrubOn ? jumpToStage : undefined }}
            >
              {media}
            </ScrubContext.Provider>
          </div>

          <div className="md:relative md:col-span-5 md:min-h-[22rem]">
            {stages.map((stage, i) => (
              <div
                key={stage.key}
                ref={(el) => {
                  stageRefs.current[i] = el;
                }}
                data-index={i}
                className={
                  scrubOn
                    ? `border-t-2 border-accent pt-6 transition-[opacity,translate] ease-out md:absolute md:inset-x-0 md:top-1/2 ${
                        i === activeIndex
                          ? "opacity-100 delay-200 duration-700 md:-translate-y-1/2"
                          : "pointer-events-none opacity-0 duration-200 md:translate-y-[calc(-50%+12px)]"
                      }`
                    : "mb-10 border-t-2 border-accent pt-6 last:mb-0"
                }
              >
                <p className="font-display text-[14px] font-semibold tracking-wide text-accent">
                  {String(i + 1).padStart(2, "0")}
                  <span className="text-ink-soft/60"> / {String(stages.length).padStart(2, "0")}</span>
                </p>
                <h3 className="mt-2 font-display text-[1.5rem] font-semibold text-ink md:text-[1.75rem]">
                  {stage.title}
                </h3>
                {stage.paragraphs.map((p, pi) => (
                  <p
                    key={pi}
                    className={`mt-4 text-[16px] leading-relaxed text-ink-soft ${
                      p.emphasis ? "italic" : ""
                    }`}
                  >
                    {p.text}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
