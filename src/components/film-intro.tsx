"use client";

import { useEffect } from "react";
import Image from "next/image";

const DURATION_MS = 7000;

export default function FilmIntro({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion) {
      onDone();
      return;
    }
    const timer = setTimeout(onDone, DURATION_MS);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className="relative h-[70vh] max-h-[640px] min-h-[420px] overflow-hidden bg-paper">
      <Image
        src="/images/bank-ankunft.png"
        alt=""
        aria-hidden
        fill
        priority
        sizes="100vw"
        className="object-cover [animation:film-walk_7s_ease-in-out_forwards]"
      />
      <Image
        src="/images/bank-sitzend.png"
        alt=""
        aria-hidden
        fill
        sizes="100vw"
        className="object-cover opacity-0 [animation:film-sit_7s_ease-in-out_forwards]"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-paper opacity-0 [animation:film-whiteout_7s_ease-in-out_forwards]"
      />

      <p className="sr-only">
        Eine Person geht zu einer Bank unter einem Baum, setzt sich und
        schlägt ein Buch auf.
      </p>

      <button
        type="button"
        onClick={onDone}
        className="absolute bottom-6 right-6 rounded-full border border-ink/15 bg-paper/85 px-4 py-2 text-[13px] text-ink-soft backdrop-blur-sm hover:text-ink"
      >
        Überspringen →
      </button>
    </div>
  );
}
