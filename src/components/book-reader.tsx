"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

export default function BookReader({ pages }: { pages: ReactNode[] }) {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const total = pages.length;

  const go = useCallback(
    (next: number) => {
      setIndex(Math.max(0, Math.min(total - 1, next)));
    },
    [total]
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") go(index + 1);
      if (e.key === "ArrowLeft") go(index - 1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, go]);

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (delta < -40) go(index + 1);
    if (delta > 40) go(index - 1);
    touchStartX.current = null;
  }

  return (
    <div className="border-t border-hairline bg-neutral-tint">
      <div
        className="mx-auto max-w-4xl px-6 py-20 md:px-10 md:py-28"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div
          key={index}
          className="animate-rise min-h-[22rem] md:min-h-[26rem]"
          aria-live="polite"
        >
          {pages[index]}
        </div>

        <div className="mt-14 flex items-center justify-between gap-6">
          <button
            type="button"
            onClick={() => go(index - 1)}
            disabled={index === 0}
            aria-label="Vorherige Seite"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-hairline text-ink hover:border-accent hover:text-accent disabled:opacity-30 disabled:hover:border-hairline disabled:hover:text-ink"
          >
            ←
          </button>

          <div className="flex gap-2">
            {pages.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => go(i)}
                aria-label={`Seite ${i + 1} von ${total}`}
                aria-current={i === index}
                className={`h-2 w-2 rounded-full transition-colors ${
                  i === index ? "bg-accent" : "bg-hairline hover:bg-ink-soft"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => go(index + 1)}
            disabled={index === total - 1}
            aria-label="Nächste Seite"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-hairline text-ink hover:border-accent hover:text-accent disabled:opacity-30 disabled:hover:border-hairline disabled:hover:text-ink"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}
