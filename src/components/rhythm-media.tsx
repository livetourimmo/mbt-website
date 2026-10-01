"use client";

import RhythmWheel from "@/components/rhythm-wheel";
import { useScrubState } from "@/components/scroll-scrub";

export default function RhythmMedia() {
  const { activeIndex, progress, jumpTo } = useScrubState();

  // Im Scrub-Modus zeigt der Ring um das Rad den Fortschritt; Segmente sind klickbar
  return (
    <RhythmWheel
      activeIndex={activeIndex}
      progress={jumpTo ? progress : undefined}
      onSelect={jumpTo}
      className="max-w-md p-2 md:p-4"
    />
  );
}
