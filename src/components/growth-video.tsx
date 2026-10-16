"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useScrubTrigger } from "@/components/scroll-scrub";

// Lebendige Führung · Drei Bedingungen: Zeitraffer einer keimenden Bohne
// (Saatgut → Boden → Pflege). Im angepinnten Scrub-Modus folgt die Abspielposition
// dem Scrollen, rückwärts scrollen spult zurück. Ohne Scrub (reduzierte Bewegung)
// bleibt das Standbild mit der gewachsenen Pflanze stehen.

const NAME = "drei-bedingungen";

export default function GrowthVideo() {
  const { triggerRef, scrubOn } = useScrubTrigger();
  const video = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

  useGSAP(
    () => {
      const trigger = triggerRef.current;
      const v = video.current;
      if (!scrubOn || !trigger || !v) return;
      let target = 0;
      let raf = 0;
      // Weich nachziehen statt springen: currentTime nähert sich dem Ziel an
      const tick = () => {
        const d = target - v.currentTime;
        if (Math.abs(d) > 0.01) v.currentTime += d * 0.08;
        raf = requestAnimationFrame(tick);
      };
      const st = ScrollTrigger.create({
        trigger,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          if (v.duration) target = self.progress * (v.duration - 0.05);
        },
      });
      raf = requestAnimationFrame(tick);
      return () => {
        st.kill();
        cancelAnimationFrame(raf);
      };
    },
    { dependencies: [scrubOn], revertOnUpdate: true }
  );

  return (
    <div className="relative mx-auto aspect-[4/3] w-full max-w-[min(100%,calc(38svh*4/3))] overflow-hidden rounded-3xl bg-ink md:max-w-[min(100%,calc(68vh*4/3))]">
      <Image
        src={`/videos/${NAME}-poster.jpg`}
        alt="Zeitraffer in Nahaufnahme: Aus dunkler Erde bricht eine Bohne hervor und richtet sich langsam dem Licht entgegen auf."
        width={1200}
        height={900}
        sizes="(min-width: 768px) 560px, 100vw"
        className={`h-full w-full object-cover transition-opacity duration-500 ${scrubOn && ready ? "opacity-0" : ""}`}
      />
      {scrubOn && (
        <video
          ref={video}
          muted
          playsInline
          preload="auto"
          aria-hidden
          onLoadedData={() => setReady(true)}
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={`/videos/${NAME}.mp4`} type="video/mp4" />
          <source src={`/videos/${NAME}.webm`} type="video/webm" />
        </video>
      )}
    </div>
  );
}
