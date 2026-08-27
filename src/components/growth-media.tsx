"use client";

import MediaPlaceholder from "@/components/media-placeholder";
import { useScrubState } from "@/components/scroll-scrub";

export default function GrowthMedia({ labels }: { labels: string[] }) {
  const { activeIndex, progress } = useScrubState();

  return (
    <div className="relative aspect-video overflow-hidden rounded-sm border border-hairline bg-paper">
      <MediaPlaceholder
        kind="video"
        label={`Video folgt: ${labels[activeIndex]}`}
        aspect="aspect-video"
        className="h-full w-full"
      />
      <div className="absolute inset-x-4 bottom-4 h-1 overflow-hidden rounded-full bg-ink/10">
        <div
          className="h-full rounded-full bg-accent transition-[width] duration-100 ease-linear"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
}
