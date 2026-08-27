"use client";

import RhythmWheel from "@/components/rhythm-wheel";
import { useScrubState } from "@/components/scroll-scrub";

export default function RhythmMedia() {
  const { activeIndex, progress } = useScrubState();

  return (
    <div className="flex flex-col items-center">
      <RhythmWheel activeIndex={activeIndex} className="max-w-md p-4 md:p-8" />
      <div className="mt-2 h-1 w-full max-w-xs overflow-hidden rounded-full bg-ink/10">
        <div
          className="h-full rounded-full bg-accent transition-[width] duration-100 ease-linear"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
}
