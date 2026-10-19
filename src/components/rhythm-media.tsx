"use client";

import RhythmWheel from "@/components/rhythm-wheel";
import { useScrubState } from "@/components/scroll-scrub";

export default function RhythmMedia() {
  const { activeIndex, progress, jumpTo } = useScrubState();

  // Im Scrub-Modus füllt sich der Bogen des aktiven Schritts; Stationen sind klickbar
  return (
    <RhythmWheel
      activeIndex={activeIndex}
      progress={jumpTo ? progress : undefined}
      onSelect={jumpTo}
      className="max-w-2xl p-2 md:p-4"
    />
  );
}
