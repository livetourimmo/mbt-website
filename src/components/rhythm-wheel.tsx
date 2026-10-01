type Segment = {
  lines: string[];
  color: string;
  radiusOffset?: number;
  fontSize?: number;
};

// Bei Segmenten, deren Winkelhalbierende nahe der Horizontalen liegt, ist
// die Symmetrieachse des Kreisel-Felds diagonal statt vertikal — horizontaler
// Text hat dort weniger Breite, bevor er den inneren oder äusseren Ring
// berührt. radiusOffset/fontSize korrigieren das pro Segment empirisch.
const RHYTHM: Segment[] = [
  { lines: ["Ausprobieren"], color: "#331641" },
  { lines: ["Resonanz", "erleben"], color: "#4a2359" },
  { lines: ["Innehalten"], color: "#5c3369" },
  {
    lines: ["Reflektieren"],
    color: "#8a6a9c",
    radiusOffset: -6,
    fontSize: 10.5,
  },
  { lines: ["Entscheiden"], color: "#c3b3ce" },
];

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(
  cx: number,
  cy: number,
  rOuter: number,
  rInner: number,
  startDeg: number,
  endDeg: number
) {
  const p1 = polar(cx, cy, rOuter, startDeg);
  const p2 = polar(cx, cy, rOuter, endDeg);
  const p3 = polar(cx, cy, rInner, endDeg);
  const p4 = polar(cx, cy, rInner, startDeg);
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${p1.x} ${p1.y} A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${p2.x} ${p2.y} L ${p3.x} ${p3.y} A ${rInner} ${rInner} 0 ${largeArc} 0 ${p4.x} ${p4.y} Z`;
}

export default function RhythmWheel({
  className = "",
  activeIndex,
  progress,
  onSelect,
}: {
  className?: string;
  activeIndex?: number;
  /** 0–1: füllt einen feinen Ring um das Rad (Fortschritt beim Scrollen) */
  progress?: number;
  /** Klick auf ein Segment springt zu diesem Schritt */
  onSelect?: (index: number) => void;
}) {
  const rRing = 178;
  const ringLength = 2 * Math.PI * rRing;
  const active = activeIndex !== undefined ? RHYTHM[activeIndex] : undefined;
  const cx = 190;
  const cy = 190;
  const rOuter = 160;
  const rInner = 86;
  const rLabel = 127;
  const step = 360 / RHYTHM.length;

  return (
    <svg
      viewBox="0 0 380 380"
      className={`mx-auto w-full ${className}`}
      role="img"
      aria-label="Der Führungsrhythmus als Kreis: Ausprobieren, Resonanz erleben, Innehalten, Reflektieren, Entscheiden — und wieder von vorn."
    >
      <defs>
        <filter id="rhythm-wheel-shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow
            dx="0"
            dy="10"
            stdDeviation="14"
            floodColor="#331641"
            floodOpacity="0.28"
          />
        </filter>
      </defs>

      <g filter="url(#rhythm-wheel-shadow)">
        {RHYTHM.map((seg, i) => {
          const start = i * step;
          const end = start + step;
          const mid = start + step / 2;
          const labelPos = polar(cx, cy, rLabel + (seg.radiusOffset ?? 0), mid);
          const firstDy = -((seg.lines.length - 1) * 0.6);

          // Mit aktivem Schritt: nur dieser ist kräftig, die übrigen ruhig hell.
          // Ohne: Farbverlauf. Helle Flächen bekommen dunkle Schrift (Kontrast).
          const interactive = activeIndex !== undefined;
          const isActive = activeIndex === i;
          const fill = interactive ? (isActive ? "#5c3369" : "#ddd3e5") : seg.color;
          const textFill =
            (interactive && !isActive) || (!interactive && i >= 3)
              ? "var(--color-ink)"
              : "var(--color-paper)";

          return (
            <g
              key={seg.lines.join(" ")}
              role={onSelect ? "button" : undefined}
              tabIndex={onSelect ? 0 : undefined}
              aria-label={onSelect ? `Zu „${seg.lines.join(" ")}“ springen` : undefined}
              aria-pressed={onSelect ? isActive : undefined}
              onClick={onSelect ? () => onSelect(i) : undefined}
              onKeyDown={
                onSelect
                  ? (e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onSelect(i);
                      }
                    }
                  : undefined
              }
              className={onSelect ? "cursor-pointer outline-none focus-visible:opacity-80" : undefined}
              style={{
                transform: isActive ? "scale(1.04)" : "scale(1)",
                transformOrigin: `${cx}px ${cy}px`,
                transition: "transform 0.6s cubic-bezier(0.22,1,0.36,1)",
              }}
            >
              <path
                d={arcPath(cx, cy, rOuter, rInner, start, end)}
                fill={fill}
                style={{ transition: "fill 0.4s ease" }}
                stroke="var(--color-paper)"
                strokeWidth={3}
              />
              <text
                x={labelPos.x}
                y={labelPos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={textFill}
                fontFamily="var(--font-body)"
                fontSize={seg.fontSize ?? 11.5}
                fontWeight={600}
                letterSpacing="-0.1"
              >
                {seg.lines.map((line, li) => (
                  <tspan
                    key={line}
                    x={labelPos.x}
                    dy={li === 0 ? `${firstDy}em` : "1.2em"}
                  >
                    {line}
                  </tspan>
                ))}
              </text>
            </g>
          );
        })}
      </g>

      {/* Fortschrittsring: füllt sich beim Scrollen im Uhrzeigersinn, ab 12 Uhr */}
      {progress !== undefined && (
        <g aria-hidden>
          <circle cx={cx} cy={cy} r={rRing} fill="none" stroke="var(--color-hairline)" strokeWidth={2} />
          <circle
            cx={cx}
            cy={cy}
            r={rRing}
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeDasharray={ringLength}
            strokeDashoffset={ringLength * (1 - progress)}
            transform={`rotate(-90 ${cx} ${cy})`}
            style={{ transition: "stroke-dashoffset 0.15s linear" }}
          />
        </g>
      )}

      {/* Mitte: aktueller Schritt, sonst «Der Rhythmus» */}
      {active && activeIndex !== undefined ? (
        <g key={activeIndex} className="rhythm-center" aria-hidden>
          <text
            x={cx}
            y={cy - (active.lines.length > 1 ? 24 : 14)}
            textAnchor="middle"
            fill="var(--color-accent)"
            fontFamily="var(--font-display)"
            fontSize="13"
            fontWeight={600}
          >
            {String(activeIndex + 1).padStart(2, "0")}
          </text>
          <text
            x={cx}
            y={cy + (active.lines.length > 1 ? 0 : 10)}
            textAnchor="middle"
            fill="var(--color-ink)"
            fontFamily="var(--font-display)"
            fontSize="16"
            fontWeight={600}
          >
            {active.lines.map((line, li) => (
              <tspan key={line} x={cx} dy={li === 0 ? 0 : "1.25em"}>
                {line}
              </tspan>
            ))}
          </text>
        </g>
      ) : (
        <>
          <text
            x={cx}
            y={cy - 8}
            textAnchor="middle"
            fill="var(--color-ink)"
            fontFamily="var(--font-display)"
            fontSize="15"
            fontWeight={600}
          >
            Der
          </text>
          <text
            x={cx}
            y={cy + 14}
            textAnchor="middle"
            fill="var(--color-ink)"
            fontFamily="var(--font-display)"
            fontSize="15"
            fontWeight={600}
          >
            Rhythmus
          </text>
        </>
      )}
    </svg>
  );
}
