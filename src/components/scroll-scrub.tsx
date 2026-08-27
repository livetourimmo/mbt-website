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

type ScrubState = { activeIndex: number; progress: number };

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
      <div className={scrubOn ? "sticky top-20 py-8 md:top-24" : "py-12 md:py-16"}>
        <div className="mx-auto grid max-w-7xl gap-10 px-6 md:grid-cols-12 md:items-center md:gap-10 md:px-10">
          <div className="md:col-span-7">
            <ScrubContext.Provider value={{ activeIndex, progress }}>
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
                    ? `border-t-2 border-accent pt-6 transition-opacity duration-500 md:absolute md:inset-0 ${
                        i === activeIndex
                          ? "opacity-100"
                          : "pointer-events-none opacity-0"
                      }`
                    : "mb-10 border-t-2 border-accent pt-6 last:mb-0"
                }
              >
                <h3 className="font-display text-[1.25rem] font-semibold text-ink">
                  {stage.title}
                </h3>
                {stage.paragraphs.map((p, pi) => (
                  <p
                    key={pi}
                    className={`mt-4 text-[15px] leading-relaxed text-ink-soft ${
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
