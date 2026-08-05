const STAGES = [
  { label: "Ausprobieren", detail: "Ein Anliegen, ein Pilotprojekt — im eigenen Handeln entsteht Erfahrung." },
  { label: "Resonanz erleben", detail: "Was die Entscheidung bewirkt, wird spürbar — wo sie trägt, wo etwas fehlt." },
  { label: "Innehalten", detail: "Kurz anhalten, bevor die Erfahrung gedeutet wird." },
  { label: "Reflektieren", detail: "Die Erfahrung gemeinsam betrachten und verstehen." },
  { label: "Entscheiden", detail: "Den nächsten Schritt bewusster wählen — daraus wird neues Saatgut." },
];

const CX = 200;
const CY = 200;
const R_OUTER = 176;
const R_INNER = 108;
const GAP_DEG = 2.2;

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function segmentPath(startAngle: number, endAngle: number) {
  const start = startAngle + GAP_DEG / 2;
  const end = endAngle - GAP_DEG / 2;
  const large = end - start > 180 ? 1 : 0;

  const oStart = polar(CX, CY, R_OUTER, start);
  const oEnd = polar(CX, CY, R_OUTER, end);
  const iEnd = polar(CX, CY, R_INNER, end);
  const iStart = polar(CX, CY, R_INNER, start);

  return [
    `M ${oStart.x} ${oStart.y}`,
    `A ${R_OUTER} ${R_OUTER} 0 ${large} 1 ${oEnd.x} ${oEnd.y}`,
    `L ${iEnd.x} ${iEnd.y}`,
    `A ${R_INNER} ${R_INNER} 0 ${large} 0 ${iStart.x} ${iStart.y}`,
    "Z",
  ].join(" ");
}

export default function GrowthCycle() {
  const step = 360 / STAGES.length;

  return (
    <div className="grid items-center gap-12 lg:grid-cols-[400px_1fr]">
      <svg
        viewBox="0 0 400 400"
        className="mx-auto w-full max-w-[360px]"
        role="img"
        aria-label="Der Führungsrhythmus als Kreislauf: Ausprobieren, Resonanz erleben, Innehalten, Reflektieren, Entscheiden"
      >
        {STAGES.map((stage, i) => {
          const startAngle = i * step;
          const endAngle = startAngle + step;
          const midAngle = (startAngle + endAngle) / 2;
          const labelPos = polar(CX, CY, (R_OUTER + R_INNER) / 2, midAngle);
          const opacity = 0.24 + (i / (STAGES.length - 1)) * 0.6;

          return (
            <g key={stage.label}>
              <path d={segmentPath(startAngle, endAngle)} fill="var(--color-accent)" opacity={opacity} />
              <text
                x={labelPos.x}
                y={labelPos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-paper font-body text-[10.5px] font-semibold"
                style={{ letterSpacing: "0.01em" }}
              >
                {stage.label.split(" ").map((word, wi) => (
                  <tspan key={wi} x={labelPos.x} dy={wi === 0 ? 0 : 12}>
                    {word}
                  </tspan>
                ))}
              </text>
            </g>
          );
        })}
        <circle cx={CX} cy={CY} r={R_INNER - 14} fill="var(--color-neutral-tint)" />
        <text
          x={CX}
          y={CY - 6}
          textAnchor="middle"
          className="fill-ink font-serif text-[15px] italic"
        >
          Die Pflege
        </text>
        <text
          x={CX}
          y={CY + 16}
          textAnchor="middle"
          className="fill-ink-soft font-body text-[10px]"
        >
          schliesst sich zum Saatgut
        </text>
      </svg>

      <ol className="space-y-5">
        {STAGES.map((stage, i) => (
          <li key={stage.label} className="flex gap-4 border-b border-hairline pb-5 last:border-0">
            <span className="font-serif text-lg italic text-accent">{i + 1}</span>
            <div>
              <p className="font-display text-base font-semibold text-ink">{stage.label}</p>
              <p className="mt-1 text-sm leading-relaxed text-ink-soft">{stage.detail}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
