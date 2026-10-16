"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const REDUCED = "(prefers-reduced-motion: reduce)";
function subscribe(onChange: () => void) {
  const mq = window.matchMedia(REDUCED);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

/**
 * Stiller Video-Loop (ersetzt GIFs). Das Standbild kommt optimiert über
 * next/image; das Video wird erst geladen, wenn es sich dem Bildschirm nähert,
 * und spielt nur, solange es im Bild ist. Bei reduzierter Bewegung bleibt das Standbild.
 */
export default function LoopVideo({
  name,
  alt,
  width,
  height,
}: {
  /** Dateiname ohne Endung in /public/videos (name.webm, name.mp4, name-poster.jpg) */
  name: string;
  alt: string;
  width: number;
  height: number;
}) {
  const box = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const still = useSyncExternalStore(subscribe, () => window.matchMedia(REDUCED).matches, () => true);
  const [near, setNear] = useState(false);

  // Video erst anhängen, wenn es bis auf einen Bildschirm herangescrollt ist
  useEffect(() => {
    const el = box.current;
    if (!el || still) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: "100% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [still]);

  // Abspielen nur, solange es sichtbar ist
  useEffect(() => {
    const v = video.current;
    if (!v || !near) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.25 }
    );
    observer.observe(v);
    return () => observer.disconnect();
  }, [near]);

  return (
    <div ref={box} className="relative h-full w-full">
      <Image
        src={`/videos/${name}-poster.jpg`}
        alt={alt}
        width={width}
        height={height}
        sizes="(min-width: 768px) 58vw, 100vw"
        className="h-full w-full object-cover"
      />
      {near && !still && (
        <video
          ref={video}
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={`/videos/${name}.webm`} type="video/webm" />
          <source src={`/videos/${name}.mp4`} type="video/mp4" />
        </video>
      )}
    </div>
  );
}
