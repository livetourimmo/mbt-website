const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

export default function SectionMark({
  index,
  className = "",
}: {
  index: number;
  className?: string;
}) {
  return (
    <span className={`block font-serif text-lg italic text-ink-soft/70 ${className}`}>
      {ROMAN[index - 1] ?? index}
    </span>
  );
}
