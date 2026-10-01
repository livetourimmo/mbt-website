"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Stummer Filmausschnitt, der startet, sobald er sichtbar ist.
 * Ab Tablet füllt er die volle Breite und genau die sichtbare Höhe
 * (Bildschirm minus Kopfzeile).
 * Mit `scrollToId` scrollt die Seite nach dem Ende sanft zum nächsten
 * Abschnitt, sofern der Film dann noch im Blick ist.
 * Bei reduzierter Bewegung startet nichts von selbst.
 */
export default function FilmClip({
  name,
  label,
  scrollToId,
  behindHeader = false,
  className = "",
}: {
  /** Dateiname ohne Endung in /public/videos, z. B. "film-anfang" */
  name: string;
  label: string;
  scrollToId?: string;
  /** Kopfzeile liegt durchsichtig über dem Film: dann volle Bildschirmhöhe */
  behindHeader?: boolean;
  className?: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const ref = useRef<HTMLVideoElement>(null);
  const [state, setState] = useState<"idle" | "playing" | "paused" | "ended">("idle");

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    video.muted = true;

    // Höhe der Kopfzeile, damit der Film genau in den sichtbaren Bereich passt
    const header = document.querySelector("header");
    if (header && root.current) root.current.style.setProperty("--header-h", `${header.offsetHeight}px`);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => setState("paused"));
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const onEnded = () => {
    setState("ended");
    const video = ref.current;
    if (!scrollToId || !video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Nur weiterführen, wenn noch mindestens die Hälfte des Films sichtbar ist
    const r = video.getBoundingClientRect();
    const visible = Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0);
    if (visible >= r.height * 0.5) {
      document.getElementById(scrollToId)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const toggle = () => {
    const video = ref.current;
    if (!video) return;
    if (state === "playing") video.pause();
    else {
      if (state === "ended") video.currentTime = 0;
      video.play();
    }
  };

  const buttonLabel = state === "playing" ? "Film pausieren" : state === "ended" ? "Film nochmals abspielen" : "Film abspielen";

  return (
    <div
      ref={root}
      data-header-overlay={behindHeader || undefined}
      className={`flex justify-center ${
        behindHeader ? "md:h-[100svh]" : "md:h-[calc(100svh-var(--header-h,5rem))]"
      } ${className}`}
    >
      {/* Filmfläche: Handy im Format 3:2; ab Tablet volle Breite und genau so hoch wie der
          sichtbare Bereich. Zugeschnitten wird vor allem unten, damit Köpfe im Bild bleiben. */}
      <div className="relative aspect-[3/2] w-full md:aspect-auto md:h-full">
        <video
          ref={ref}
          className="absolute inset-0 block h-full w-full object-cover object-[50%_35%]"
          poster={`/videos/${name}-poster.jpg`}
          muted
          playsInline
          preload="metadata"
          aria-label={label}
          onPlay={() => setState("playing")}
          onPause={() => setState((s) => (s === "ended" ? s : "paused"))}
          onEnded={onEnded}
        >
          <source src={`/videos/${name}-720.mp4`} type="video/mp4" media="(max-width: 767px)" />
          <source src={`/videos/${name}-1080.mp4`} type="video/mp4" />
        </video>
        <button
          type="button"
          onClick={toggle}
          aria-label={buttonLabel}
          className="absolute right-4 bottom-4 flex h-10 w-10 items-center justify-center rounded-full bg-ink/40 text-[13px] text-paper backdrop-blur-sm transition-colors duration-300 hover:bg-ink/60 md:right-6 md:bottom-6"
        >
          <span aria-hidden>{state === "playing" ? "❚❚" : state === "ended" ? "↺" : "▶"}</span>
        </button>
      </div>
    </div>
  );
}
