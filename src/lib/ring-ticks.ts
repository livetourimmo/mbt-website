// Feine Skala für die Kreise der Linien-Animationen (Topf, Organismus,
// Rhythmus-Rad): alle 5 Grad ein Strich, jeder dritte etwas länger, an
// Markierungen ausgespart. Winkel in Grad, 0° = oben, im Uhrzeigersinn.

const r1 = (n: number) => Math.round(n * 10) / 10;

export function ringTicks(cx: number, cy: number, r: number, skip: number[] = [], gap = 6) {
  let d = "";
  for (let deg = 0; deg < 360; deg += 5) {
    if (skip.some((s) => Math.abs(((deg - s + 540) % 360) - 180) <= gap)) continue;
    const a = ((deg - 90) * Math.PI) / 180;
    const len = deg % 15 === 0 ? 5 : 3;
    const [c, s] = [Math.cos(a), Math.sin(a)];
    d += ` M${r1(cx + c * r)} ${r1(cy + s * r)} L${r1(cx + c * (r + len))} ${r1(cy + s * (r + len))}`;
  }
  return d.trim();
}
