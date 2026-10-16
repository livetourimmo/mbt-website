"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { gsap } from "@/lib/gsap";

const REDUCED = "(prefers-reduced-motion: reduce)";
function subscribe(onChange: () => void) {
  const mq = window.matchMedia(REDUCED);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}
const ease = (t: number) => 0.5 - Math.cos(Math.PI * Math.max(0, Math.min(1, t))) / 2;

/**
 * Stummer Filmausschnitt, der startet, sobald er sichtbar ist.
 * Ab Tablet füllt er die volle Breite und genau die sichtbare Höhe
 * (Bildschirm minus Kopfzeile).
 * Mit `scrollToId` geht es nach dem Ende zum nächsten Abschnitt, sofern der
 * Film dann noch im Blick ist. Mit `zoomOutro` zoomt der Film in den letzten
 * Sekunden weiter ins Bild, die helle Buchseite geht in die Seitenfarbe über,
 * und der nächste Abschnitt blendet sich direkt darauf ein.
 * Vor dem Abspielen, angehalten und am Ende steht ein grosser Knopf in der Mitte.
 * Bei reduzierter Bewegung startet nichts von selbst.
 */
export default function FilmClip({
  name,
  label,
  scrollToId,
  zoomOutro = false,
  behindHeader = false,
  className = "",
}: {
  /** Dateiname ohne Endung in /public/videos, z. B. "film-anfang" */
  name: string;
  label: string;
  scrollToId?: string;
  zoomOutro?: boolean;
  /** Kopfzeile liegt durchsichtig über dem Film: dann volle Bildschirmhöhe */
  behindHeader?: boolean;
  className?: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const ref = useRef<HTMLVideoElement>(null);
  const veil = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"idle" | "playing" | "paused" | "ended">("idle");
  // Bei reduzierter Bewegung startet nichts von selbst: dann gleich den Knopf zeigen
  const reduced = useSyncExternalStore(subscribe, () => window.matchMedia(REDUCED).matches, () => false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    video.muted = true;

    // Höhe der Kopfzeile, damit der Film genau in den sichtbaren Bereich passt
    const header = document.querySelector("header");
    if (header && root.current) root.current.style.setProperty("--header-h", `${header.offsetHeight}px`);

    if (window.matchMedia(REDUCED).matches) return;

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

  // Ausklang: in den letzten Sekunden weiter ins Bild zoomen und in die Seitenfarbe übergehen
  useEffect(() => {
    const video = ref.current;
    if (!zoomOutro || state !== "playing" || !video) return;
    let raf = 0;
    const tick = () => {
      const left = video.duration - video.currentTime;
      if (Number.isFinite(left)) {
        video.style.transform = `scale(${(1 + 0.14 * ease((2.4 - left) / 2.4)).toFixed(4)})`;
        if (veil.current) veil.current.style.opacity = ease((1.1 - left) / 1.1).toFixed(3);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [zoomOutro, state]);

  const resetOutro = () => {
    if (ref.current) ref.current.style.transform = "";
    if (veil.current) veil.current.style.opacity = "0";
  };

  const onEnded = () => {
    setState("ended");
    const video = ref.current;
    const target = scrollToId ? document.getElementById(scrollToId) : null;
    if (!target || !video || window.matchMedia(REDUCED).matches) return resetOutro();
    // Nur weiterführen, wenn noch mindestens die Hälfte des Films sichtbar ist
    const r = video.getBoundingClientRect();
    const visible = Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0);
    if (visible < r.height * 0.5) return resetOutro();

    if (!zoomOutro) {
      target.scrollIntoView({ behavior: "smooth" });
      return;
    }
    // Der Bildschirm ist jetzt ganz in Seitenfarbe: ohne sichtbaren Sprung zum Text wechseln
    target.scrollIntoView({ behavior: "instant" });
    const next = target.nextElementSibling;
    if (next) {
      gsap.fromTo(
        next,
        { autoAlpha: 0, scale: 0.97, transformOrigin: "50% 20%" },
        { autoAlpha: 1, scale: 1, duration: 1.6, ease: "power2.out", clearProps: "opacity,visibility,transform" }
      );
    }
    requestAnimationFrame(resetOutro);
  };

  const toggle = () => {
    const video = ref.current;
    if (!video) return;
    if (state === "playing") video.pause();
    else {
      if (state === "ended") {
        resetOutro();
        video.currentTime = 0;
      }
      video.play();
    }
  };

  const buttonLabel = state === "playing" ? "Film pausieren" : state === "ended" ? "Film nochmals abspielen" : "Film abspielen";
  const waiting = state === "paused" || state === "ended" || (state === "idle" && reduced);

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
      <div className="relative aspect-[3/2] w-full overflow-hidden md:aspect-auto md:h-full">
        <video
          ref={ref}
          className="absolute inset-0 block h-full w-full object-cover object-[50%_35%] will-change-transform"
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
        {zoomOutro && <div ref={veil} aria-hidden className="pointer-events-none absolute inset-0 bg-paper opacity-0" />}

        {/* Vor dem Abspielen, angehalten und am Ende: grosser Knopf in der Mitte */}
        <button
          type="button"
          onClick={toggle}
          aria-label={buttonLabel}
          tabIndex={waiting ? 0 : -1}
          aria-hidden={!waiting}
          className={`absolute top-1/2 left-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-ink/45 text-paper ring-1 ring-paper/40 backdrop-blur-sm transition-[opacity,background-color,scale] duration-500 hover:scale-105 hover:bg-ink/65 md:h-20 md:w-20 ${
            waiting ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          {state === "ended" ? (
            <svg aria-hidden viewBox="0 0 24 24" className="h-7 w-7 md:h-8 md:w-8" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
              <path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3" />
              <path d="M4.5 4.5v3.2h3.2" />
            </svg>
          ) : (
            <svg aria-hidden viewBox="0 0 24 24" className="ml-1 h-7 w-7 md:h-8 md:w-8" fill="currentColor">
              <path d="M8 5.5v13l10.5-6.5z" />
            </svg>
          )}
        </button>

        {/* Während des Abspielens: kleiner Pausenknopf in der Ecke */}
        <button
          type="button"
          onClick={toggle}
          aria-label="Film pausieren"
          tabIndex={state === "playing" ? 0 : -1}
          aria-hidden={state !== "playing"}
          className={`absolute right-4 bottom-4 flex h-10 w-10 items-center justify-center rounded-full bg-ink/40 text-[13px] text-paper backdrop-blur-sm transition-[opacity,background-color] duration-300 hover:bg-ink/60 md:right-6 md:bottom-6 ${
            state === "playing" ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <span aria-hidden>❚❚</span>
        </button>
      </div>
    </div>
  );
}
