"use client";

import { useState } from "react";
import GardenIcon from "./garden-icon";

const PAGES = [
  {
    icon: "saatgut" as const,
    title: "Das Saatgut",
    imageCaption:
      "Der Gärtner trägt ein inneres Bild von dem, was werden soll, und wählt dafür das richtige Saatgut. Im Korn ist dieses Bild bereits angelegt. Die Pflanze wächst dem Licht entgegen, das ihr die Richtung weist.",
    meaning:
      "Orientierung und innere Klarheit — Sinn, Werte, Richtung. Aus innerer Klarheit entfaltet sich äussere Wirkung. Was im Führenden klar ist, überträgt sich auf die Menschen ringsum: Sie spüren die Richtung und finden darin Halt für das eigene Wirken.",
  },
  {
    icon: "boden" as const,
    title: "Der Boden",
    imageCaption:
      "Der Gärtner bereitet den Acker. Der Boden gibt Halt und Nahrung zugleich — die Pflanze findet darin Wurzel und Kraft und zieht heraus, was sie zum Wachsen braucht.",
    meaning:
      "Der Raum, in dem Menschen mitgestalten dürfen, und die Unterstützung, die sie dabei trägt. Verantwortung wächst dort, wo Menschen schrittweise mehr davon übernehmen dürfen.",
  },
  {
    icon: "pflege" as const,
    title: "Die Pflege",
    imageCaption:
      "Der Gärtner korrigiert, wo es nötig ist, unterstützt, wo Bedarf besteht, und beobachtet das Übrige. Aus dem Gewachsenen entstehen neue Samen, aus denen er erneut wählt.",
    meaning:
      "Der Führungsrhythmus — Ausprobieren, Resonanz erleben, Innehalten, Reflektieren, Entscheiden. Aus Rückkopplung wird Lernen, und das Gelernte wird zum Saatgut des nächsten Schritts.",
  },
];

export default function BookPages() {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const page = PAGES[index];

  function go(next: number) {
    if (next < 0 || next >= PAGES.length) return;
    setDir(next > index ? 1 : -1);
    setIndex(next);
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div
        className="relative grid overflow-hidden rounded-[2px] border border-hairline bg-[#fdfaf5] shadow-[0_1px_2px_rgba(31,44,87,0.06),0_28px_60px_-32px_rgba(31,44,87,0.35)] sm:grid-cols-2"
        style={{ minHeight: "460px" }}
      >
        {/* spine */}
        <div className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-8 -translate-x-1/2 bg-gradient-to-r from-black/[0.06] via-black/[0.02] to-black/[0.06] sm:block" />

        <div
          key={`left-${index}`}
          className="flex flex-col justify-between p-10 sm:pr-14"
          style={{ animation: `page-in-${dir === 1 ? "l" : "r"} 0.5s ease` }}
        >
          <div>
            <GardenIcon name={page.icon} className="h-16 w-16" />
            <h3 className="mt-6 font-serif text-2xl italic text-ink">{page.title}</h3>
            <p className="mt-5 text-[10.5px] font-semibold tracking-[0.12em] text-ink-soft/70 uppercase">
              Das Bild des Gärtners
            </p>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{page.imageCaption}</p>
          </div>
          <p className="mt-8 font-serif text-xs italic text-ink-soft/50">
            {index + 1} / {PAGES.length}
          </p>
        </div>

        <div
          key={`right-${index}`}
          className="flex flex-col justify-center border-t border-hairline p-10 sm:border-t-0 sm:border-l sm:pl-14"
          style={{ animation: `page-in-${dir === 1 ? "l" : "r"} 0.5s ease 0.05s both` }}
        >
          <p className="text-[10.5px] font-semibold tracking-[0.12em] text-accent uppercase">
            Was es für die Führung heisst
          </p>
          <p className="mt-3 text-lg leading-relaxed text-ink">{page.meaning}</p>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <div className="flex gap-2">
          {PAGES.map((p, i) => (
            <button
              key={p.title}
              type="button"
              aria-label={`Zu ${p.title}`}
              onClick={() => go(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === i ? "w-6 bg-accent" : "w-1.5 bg-ink/20 hover:bg-ink/35"
              }`}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            aria-label="Vorherige Seite"
            onClick={() => go(index - 1)}
            disabled={index === 0}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/20 text-ink transition-colors hover:border-ink disabled:opacity-30 disabled:hover:border-ink/20"
          >
            ←
          </button>
          <button
            type="button"
            aria-label="Nächste Seite"
            onClick={() => go(index + 1)}
            disabled={index === PAGES.length - 1}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/20 text-ink transition-colors hover:border-ink disabled:opacity-30 disabled:hover:border-ink/20"
          >
            →
          </button>
        </div>
      </div>

      <style>{`
        @keyframes page-in-l {
          from { opacity: 0; transform: translateX(14px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes page-in-r {
          from { opacity: 0; transform: translateX(-14px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
