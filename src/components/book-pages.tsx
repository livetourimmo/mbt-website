"use client";

import { useRef, useState } from "react";

const PAGES = [
  {
    index: "I",
    title: "Das Saatgut",
    image: "Das Bild des Gärtners",
    imageText:
      "Der Gärtner trägt ein inneres Bild von dem, was werden soll, und wählt dafür das richtige Saatgut. Im Korn ist dieses Bild bereits angelegt. Die Pflanze wächst dem Licht entgegen, das ihr die Richtung weist.",
    meaning: "Was es für die Führung heisst",
    meaningText:
      "Orientierung und innere Klarheit — Sinn, Werte, Richtung. Aus innerer Klarheit entfaltet sich äussere Wirkung. Was im Führenden klar ist, überträgt sich auf die Menschen ringsum.",
  },
  {
    index: "II",
    title: "Der Boden",
    image: "Das Bild des Gärtners",
    imageText:
      "Der Gärtner bereitet den Acker. Der Boden gibt Halt und Nahrung zugleich — die Pflanze findet darin Wurzel und Kraft und zieht heraus, was sie zum Wachsen braucht.",
    meaning: "Was es für die Führung heisst",
    meaningText:
      "Der Raum, in dem Menschen mitgestalten dürfen, und die Unterstützung, die sie dabei trägt. Verantwortung wächst dort, wo Menschen schrittweise mehr davon übernehmen dürfen.",
  },
  {
    index: "III",
    title: "Die Pflege",
    image: "Das Bild des Gärtners",
    imageText:
      "Der Gärtner korrigiert, wo es nötig ist, unterstützt, wo Bedarf besteht, und beobachtet das Übrige. Aus dem Gewachsenen entstehen neue Samen, aus denen er erneut wählt.",
    meaning: "Was es für die Führung heisst",
    meaningText:
      "Der Führungsrhythmus — Ausprobieren, Resonanz erleben, Innehalten, Reflektieren, Entscheiden. Aus Rückkopplung wird Lernen, und das Gelernte wird zum Saatgut des nächsten Schritts.",
  },
];

export default function BookPages() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  function goTo(i: number) {
    const clamped = Math.max(0, Math.min(PAGES.length - 1, i));
    setActive(clamped);
    const node = scrollerRef.current;
    if (!node) return;
    const page = node.children[clamped] as HTMLElement | undefined;
    page?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }

  return (
    <div>
      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {PAGES.map((page, i) => (
          <article
            key={page.title}
            className="flex w-[85%] shrink-0 snap-center flex-col justify-between rounded-[2px] border border-hairline bg-[#fdfaf5] p-8 shadow-[0_1px_2px_rgba(31,44,87,0.06),0_16px_40px_-24px_rgba(31,44,87,0.25)] sm:w-[70%] sm:p-12 lg:w-[46%]"
            style={{ minHeight: "420px" }}
          >
            <div>
              <span className="font-serif text-2xl italic text-accent">{page.index}</span>
              <h3 className="mt-2 font-display text-2xl font-semibold text-ink">{page.title}</h3>

              <div className="mt-8">
                <p className="text-[11px] font-semibold tracking-[0.12em] text-ink-soft uppercase">
                  {page.image}
                </p>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{page.imageText}</p>
              </div>

              <div className="mt-8 border-t border-hairline pt-8">
                <p className="text-[11px] font-semibold tracking-[0.12em] text-accent uppercase">
                  {page.meaning}
                </p>
                <p className="mt-3 text-[15px] leading-relaxed text-ink">{page.meaningText}</p>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <div className="flex gap-2">
          {PAGES.map((page, i) => (
            <button
              key={page.title}
              type="button"
              aria-label={`Zu Seite ${i + 1}: ${page.title}`}
              onClick={() => goTo(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                active === i ? "w-6 bg-accent" : "w-1.5 bg-ink/20 hover:bg-ink/35"
              }`}
            />
          ))}
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            aria-label="Vorherige Seite"
            onClick={() => goTo(active - 1)}
            disabled={active === 0}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/20 text-ink transition-colors hover:border-ink disabled:opacity-30 disabled:hover:border-ink/20"
          >
            ←
          </button>
          <button
            type="button"
            aria-label="Nächste Seite"
            onClick={() => goTo(active + 1)}
            disabled={active === PAGES.length - 1}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/20 text-ink transition-colors hover:border-ink disabled:opacity-30 disabled:hover:border-ink/20"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}
