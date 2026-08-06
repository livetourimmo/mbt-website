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
}: {
  className?: string;
}) {
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

          return (
            <g key={seg.lines.join(" ")}>
              <path
                d={arcPath(cx, cy, rOuter, rInner, start, end)}
                fill={seg.color}
                stroke="var(--color-paper)"
                strokeWidth={3}
              />
              <text
                x={labelPos.x}
                y={labelPos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="var(--color-paper)"
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
    </svg>
  );
}
