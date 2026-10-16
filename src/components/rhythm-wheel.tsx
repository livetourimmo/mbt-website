type Segment = {
  lines: string[];
  radiusOffset?: number;
  fontSize?: number;
};

// Bei Segmenten, deren Winkelhalbierende nahe der Horizontalen liegt, hat
// horizontaler Text weniger Breite – radiusOffset/fontSize korrigieren das.
const RHYTHM: Segment[] = [
  { lines: ["Ausprobieren"] },
  { lines: ["Resonanz", "erleben"] },
  { lines: ["Innehalten"] },
  { lines: ["Reflektieren"] },
  { lines: ["Entscheiden"] },
];

// Schriftgrösse so wählen, dass die Beschriftung mit Abstand in den Ring passt:
// Ein waagrechter Text ragt je nach Winkel radial unterschiedlich weit hinaus.
const MAX_FONT = 12;
const MIN_FONT = 10.5;
const PAD = 7; // Mindestabstand zum inneren und äusseren Rand
const CHAR = 0.6; // ungefähre Zeichenbreite im Verhältnis zur Schriftgrösse
function fitFont(lines: string[], angleDeg: number, halfRing: number) {
  const a = (angleDeg * Math.PI) / 180;
  const longest = Math.max(...lines.map((l) => l.length));
  for (let f = MAX_FONT; f >= MIN_FONT; f -= 0.25) {
    const w = longest * f * CHAR;
    const h = lines.length * f * 1.2;
    const radial = Math.abs((w / 2) * Math.sin(a)) + Math.abs((h / 2) * Math.cos(a));
    if (radial + PAD <= halfRing) return f;
  }
  return MIN_FONT;
}

// Farben aus den Marken-Tokens abgeleitet (accent auf paper gemischt)
const TINT = "color-mix(in srgb, var(--color-accent) 16%, var(--color-paper))";
const PASSED = "color-mix(in srgb, var(--color-accent) 30%, var(--color-paper))";
const ACTIVE = "var(--color-accent)";

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(cx: number, cy: number, rOuter: number, rInner: number, startDeg: number, endDeg: number) {
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
  const cx = 190;
  const cy = 190;
  const rRing = 178;
  const rOuter = 166;
  const rInner = 74;
  const rLabel = (rOuter + rInner) / 2;
  const halfRing = (rOuter - rInner) / 2;
  const step = 360 / RHYTHM.length;
  const active = activeIndex !== undefined ? RHYTHM[activeIndex] : undefined;
  const head = progress !== undefined ? polar(cx, cy, rRing, 360 * progress) : undefined;

  return (
    <svg
      viewBox="0 0 380 380"
      className={`mx-auto w-full overflow-visible ${className}`}
      role="img"
      aria-label="Der Führungsrhythmus als Kreis: Ausprobieren, Resonanz erleben, Innehalten, Reflektieren, Entscheiden — und wieder von vorn."
    >
      <defs>
        {/* sehr weicher, getönter Schatten – gibt dem Rad Tiefe, ohne schwer zu wirken */}
        <filter id="rhythm-wheel-shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="12" stdDeviation="18" floodColor="#331641" floodOpacity="0.14" />
        </filter>
      </defs>

      {/* Fortschrittsring: feine Spur, darauf der Bogen in accent mit einem Punkt am Ende */}
      {progress !== undefined && head && (
        <g aria-hidden>
          <circle cx={cx} cy={cy} r={rRing} fill="none" stroke="var(--color-hairline)" strokeWidth={1.5} />
          <circle
            cx={cx}
            cy={cy}
            r={rRing}
            fill="none"
            stroke={ACTIVE}
            strokeWidth={2.5}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray="1 1"
            strokeDashoffset={1 - progress}
            transform={`rotate(-90 ${cx} ${cy})`}
            style={{ transition: "stroke-dashoffset 0.2s linear" }}
          />
          <circle cx={head.x} cy={head.y} r={4.5} fill={ACTIVE} stroke="var(--color-paper)" strokeWidth={2} />
        </g>
      )}

      <g filter="url(#rhythm-wheel-shadow)">
        {/* Innenfläche */}
        <circle cx={cx} cy={cy} r={rInner - 2} fill="var(--color-paper)" />
        {RHYTHM.map((seg, i) => {
          const start = i * step;
          const end = start + step;
          const mid = start + step / 2;
          const labelPos = polar(cx, cy, rLabel + (seg.radiusOffset ?? 0), mid);
          const fontSize = seg.fontSize ?? fitFont(seg.lines, mid, halfRing);
          const firstDy = -((seg.lines.length - 1) * 0.6);
          const isActive = activeIndex === i;
          const passed = activeIndex !== undefined && i < activeIndex;
          const fill = isActive ? ACTIVE : passed ? PASSED : TINT;
          // aktiver Schritt tritt ein wenig nach aussen
          const out = polar(0, 0, isActive ? 5 : 0, mid);

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
              className={onSelect ? "group cursor-pointer outline-none" : undefined}
              style={{
                transform: `translate(${out.x}px, ${out.y}px)`,
                transition: "transform 0.7s cubic-bezier(0.22,1,0.36,1)",
              }}
            >
              <path
                d={arcPath(cx, cy, rOuter, rInner, start, end)}
                fill={fill}
                stroke="var(--color-paper)"
                strokeWidth={4}
                strokeLinejoin="round"
                className={onSelect && !isActive ? "transition-[filter] duration-300 group-hover:brightness-[0.97] group-focus-visible:brightness-[0.94]" : undefined}
                style={{ transition: "fill 0.5s ease" }}
              />
              <text
                x={labelPos.x}
                y={labelPos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={isActive ? "var(--color-paper)" : "var(--color-ink)"}
                fontFamily="var(--font-body)"
                fontSize={fontSize}
                fontWeight={600}
                letterSpacing="-0.1"
                style={{ transition: "fill 0.5s ease" }}
              >
                {seg.lines.map((line, li) => (
                  <tspan key={line} x={labelPos.x} dy={li === 0 ? `${firstDy}em` : "1.2em"}>
                    {line}
                  </tspan>
                ))}
              </text>
            </g>
          );
        })}
      </g>

      {/* Mitte: aktueller Schritt, sonst «Der Rhythmus» */}
      {active && activeIndex !== undefined ? (
        <g key={activeIndex} className="rhythm-center" aria-hidden>
          <text
            x={cx}
            y={cy - (active.lines.length > 1 ? 26 : 16)}
            textAnchor="middle"
            fill="var(--color-accent)"
            fontFamily="var(--font-display)"
            fontSize="12.5"
            fontWeight={600}
            letterSpacing="0.12em"
          >
            {String(activeIndex + 1).padStart(2, "0")} / {String(RHYTHM.length).padStart(2, "0")}
          </text>
          <text
            x={cx}
            y={cy + (active.lines.length > 1 ? 0 : 10)}
            textAnchor="middle"
            fill="var(--color-ink)"
            fontFamily="var(--font-display)"
            fontSize="18"
            fontWeight={600}
            letterSpacing="-0.01em"
          >
            {active.lines.map((line, li) => (
              <tspan key={line} x={cx} dy={li === 0 ? 0 : "1.2em"}>
                {line}
              </tspan>
            ))}
          </text>
        </g>
      ) : (
        <text x={cx} y={cy} textAnchor="middle" fill="var(--color-ink)" fontFamily="var(--font-display)" fontSize="16" fontWeight={600}>
          <tspan x={cx} dy="-0.35em">Der</tspan>
          <tspan x={cx} dy="1.25em">Rhythmus</tspan>
        </text>
      )}
    </svg>
  );
}
