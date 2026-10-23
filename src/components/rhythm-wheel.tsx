// Der Führungsrhythmus als Kreislauf mit fünf Stationen: ein feiner Ring, darauf
// füllt sich der Bogen des aktiven Schritts in accent; durchlaufene Bögen bleiben
// in ink stehen. Die Begriffe stehen aussen, in der Mitte Nummer und Begriff
// des aktiven Schritts in Newsreader kursiv.

const RHYTHM = ["Ausprobieren", "Resonanz erleben", "Innehalten", "Reflektieren", "Entscheiden"];

const CX = 220;
const CY = 206;
const R = 132; // Ring der Stationen
const GAP = 4.5; // Grad Abstand zwischen Bogen und Station (≈ 10 px)
const STEP = 360 / RHYTHM.length;

function polar(r: number, deg: number) {
  const a = ((deg - 90) * Math.PI) / 180;
  return { x: CX + r * Math.cos(a), y: CY + r * Math.sin(a) };
}

const f1 = (n: number) => Math.round(n * 10) / 10;

function arc(r: number, from: number, to: number) {
  const a = polar(r, from);
  const b = polar(r, to);
  return `M${f1(a.x)} ${f1(a.y)} A${r} ${r} 0 ${to - from > 180 ? 1 : 0} 1 ${f1(b.x)} ${f1(b.y)}`;
}

/** Lage der Beschriftung je nach Winkel: oben mittig, rechts linksbündig, links rechtsbündig */
function labelLayout(deg: number) {
  const p = polar(R + 20, deg);
  if (deg === 0) return { x: p.x, y: p.y - 18, anchor: "middle" as const };
  const right = deg < 180;
  const lower = deg > 90 && deg < 270;
  return { x: p.x + (right ? 2 : -2), y: p.y + (lower ? 4 : -10), anchor: right ? ("start" as const) : ("end" as const) };
}

export default function RhythmWheel({
  className = "",
  activeIndex,
  progress,
  onSelect,
}: {
  className?: string;
  activeIndex?: number;
  /** 0–1: Fortschritt beim Scrollen, füllt den Bogen des aktiven Schritts */
  progress?: number;
  /** Klick auf eine Station springt zu diesem Schritt */
  onSelect?: (index: number) => void;
}) {
  const n = RHYTHM.length;
  // Fortschritt innerhalb des aktiven Schritts (ohne Scrub: Bogen voll)
  const inStep = progress !== undefined && activeIndex !== undefined ? Math.max(0, Math.min(1, progress * n - activeIndex)) : 1;
  const headDeg = activeIndex !== undefined ? activeIndex * STEP + GAP + (STEP - 2 * GAP) * inStep : undefined;
  // Kopfpunkt nur unterwegs: am Ende des Schritts schliesst der Bogen sauber vor der nächsten Station
  const head = headDeg !== undefined && progress !== undefined && inStep < 0.97 ? polar(R, headDeg) : undefined;

  return (
    <svg
      viewBox="-48 14 536 392"
      className={`mx-auto w-full overflow-visible ${className}`}
      role="img"
      aria-label="Der Führungsrhythmus als Kreis: Ausprobieren, Resonanz erleben, Innehalten, Reflektieren, Entscheiden — und wieder von vorn."
    >
      {/* Ring: feine Spur, Skala, durchlaufene und aktive Bögen */}
      <g className="fill-none" strokeLinecap="round">
        <circle cx={CX} cy={CY} r={R} className="stroke-hairline" strokeWidth={1.5} />
        <circle cx={CX} cy={CY} r={R - 46} className="stroke-ink" strokeWidth={0.6} opacity={0.14} />
        {RHYTHM.map((_, i) => {
          const from = i * STEP + GAP;
          const to = (i + 1) * STEP - GAP;
          const passed = activeIndex !== undefined && i < activeIndex;
          const isActive = activeIndex === i;
          if (passed) return <path key={i} d={arc(R, from, to)} className="stroke-ink" strokeWidth={2} />;
          if (isActive && inStep > 0.002)
            return <path key={i} d={arc(R, from, from + (to - from) * inStep)} className="stroke-accent" strokeWidth={2} />;
          return null;
        })}
      </g>
      {head && <circle cx={head.x} cy={head.y} r={3} className="fill-accent" aria-hidden />}

      {/* Stationen mit Beschriftung aussen */}
      {RHYTHM.map((term, i) => {
        const deg = i * STEP;
        const dot = polar(R, deg);
        const l = labelLayout(deg);
        const isActive = activeIndex === i;
        const passed = activeIndex !== undefined && i < activeIndex;
        return (
          <g
            key={term}
            role={onSelect ? "button" : undefined}
            tabIndex={onSelect ? 0 : undefined}
            aria-label={onSelect ? `Zu „${term}“ springen` : undefined}
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
          >
            {/* grosszügige, unsichtbare Klickfläche */}
            {onSelect && <circle cx={(dot.x + l.x) / 2} cy={(dot.y + l.y) / 2} r={34} fill="transparent" />}
            {isActive && <circle cx={dot.x} cy={dot.y} r={9} className="fill-none stroke-accent" strokeWidth={0.8} opacity={0.4} />}
            <circle
              cx={dot.x}
              cy={dot.y}
              r={isActive ? 5.4 : 4.4}
              className={`${isActive ? "fill-accent stroke-accent" : passed ? "fill-ink stroke-ink" : "fill-neutral-tint stroke-ink"} group-focus-visible:stroke-accent`}
              strokeWidth={1.5}
              style={{ transition: "r 0.5s cubic-bezier(0.22,1,0.36,1), fill 0.5s ease" }}
            />
            <text
              x={l.x}
              y={l.y}
              textAnchor={l.anchor}
              fontFamily="var(--font-display)"
              fontWeight={600}
              letterSpacing="0.08em"
              style={{ fontVariantNumeric: "tabular-nums", transition: "fill 0.5s ease" }}
              // Handy: das Rad wird stark verkleinert, die Beschriftung bleibt lesbar
              className={`text-[12.5px] md:text-[10px] ${isActive ? "fill-accent" : "fill-ink-soft"}`}
              opacity={isActive ? 1 : 0.7}
            >
              {String(i + 1).padStart(2, "0")}
            </text>
            <text
              x={l.x}
              y={l.y + 17}
              textAnchor={l.anchor}
              fontFamily="var(--font-body)"
              fontWeight={500}
              letterSpacing="0.005em"
              className={`text-[17px] md:text-[14.5px] ${isActive ? "fill-ink" : "fill-ink-soft"} transition-[fill] duration-500 group-hover:fill-ink`}
            >
              {term}
            </text>
          </g>
        );
      })}

      {/* Mitte: Nummer und Begriff des aktuellen Schritts, sonst «Der Rhythmus» */}
      {activeIndex !== undefined ? (
        <g key={activeIndex} className="rhythm-center" aria-hidden>
          <text
            x={CX}
            y={CY - 12}
            textAnchor="middle"
            fontFamily="var(--font-display)"
            fontSize={10.5}
            fontWeight={600}
            letterSpacing="0.1em"
            className="fill-accent"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            {String(activeIndex + 1).padStart(2, "0")}
            <tspan className="fill-ink-soft" opacity={0.6}>
              {" "}/ {String(n).padStart(2, "0")}
            </tspan>
          </text>
          <text
            x={CX}
            y={CY + 20}
            textAnchor="middle"
            fontFamily="var(--font-newsreader), Georgia, serif"
            fontStyle="italic"
            fontSize={RHYTHM[activeIndex].length > 13 ? 23 : 26}
            fontWeight={500}
            letterSpacing="-0.01em"
            className="fill-ink"
          >
            {RHYTHM[activeIndex]}
          </text>
        </g>
      ) : (
        <text
          x={CX}
          y={CY + 9}
          textAnchor="middle"
          fontFamily="var(--font-newsreader), Georgia, serif"
          fontStyle="italic"
          fontSize={26}
          fontWeight={500}
          className="fill-ink"
        >
          Der Rhythmus
        </text>
      )}
    </svg>
  );
}
