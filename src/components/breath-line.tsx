"use client";

import { useEffect, useRef, useState } from "react";

const STAGES = [
  { label: "Ausprobieren", x: 90, y: 170, side: "below" as const },
  { label: "Resonanz erleben", x: 280, y: 70, side: "above" as const },
  { label: "Innehalten", x: 470, y: 170, side: "below" as const },
  { label: "Reflektieren", x: 660, y: 70, side: "above" as const },
  { label: "Entscheiden", x: 850, y: 170, side: "below" as const },
];

const PATH =
  "M90,170 C185,170 185,70 280,70 C375,70 375,170 470,170 C565,170 565,70 660,70 C755,70 755,170 850,170";
const RETURN_PATH = "M850,170 Q470,268 90,170";

export default function BreathLine() {
  const ref = useRef<SVGSVGElement>(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDrawn(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div>
      <svg
        ref={ref}
        viewBox="0 0 940 300"
        className="w-full"
        role="img"
        aria-label="Der Führungsrhythmus als wiederkehrende Bewegung: Ausprobieren, Resonanz erleben, Innehalten, Reflektieren, Entscheiden — und zurück zum Anfang."
      >
        <path
          d={RETURN_PATH}
          fill="none"
          stroke="var(--color-ink)"
          strokeOpacity="0.22"
          strokeWidth="1"
          strokeDasharray="1 7"
          strokeLinecap="round"
        />
        <path
          d={PATH}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="1.5"
          strokeLinecap="round"
          pathLength={1000}
          style={{
            strokeDasharray: 1000,
            strokeDashoffset: drawn ? 0 : 1000,
            transition: "stroke-dashoffset 1.8s cubic-bezier(0.65, 0, 0.35, 1)",
          }}
        />

        {STAGES.map((s, i) => (
          <g
            key={s.label}
            style={{
              opacity: drawn ? 1 : 0,
              transition: `opacity 0.5s ease ${0.3 + i * 0.28}s`,
            }}
          >
            <circle cx={s.x} cy={s.y} r={5} fill="var(--color-paper)" stroke="var(--color-accent)" strokeWidth="1.5" />
            <text
              x={s.x}
              y={s.side === "above" ? s.y - 22 : s.y + 34}
              textAnchor="middle"
              className="fill-ink font-display text-[15px] font-semibold"
            >
              {s.label}
            </text>
            <text
              x={s.x}
              y={s.side === "above" ? s.y - 6 : s.y + 18}
              textAnchor="middle"
              className="fill-ink-soft/60 font-serif text-[13px] italic"
            >
              {i + 1}
            </text>
          </g>
        ))}
      </svg>

      <p className="mx-auto mt-2 max-w-xs text-center font-serif text-sm italic text-ink-soft/70">
        Aus der Pflege entsteht das Saatgut des nächsten Schritts.
      </p>
    </div>
  );
}
