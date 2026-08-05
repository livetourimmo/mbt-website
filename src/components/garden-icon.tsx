const PATHS: Record<string, string> = {
  saatgut:
    "M60 20 C60 20 40 34 40 54 C40 68 48 78 60 78 C72 78 80 68 80 54 C80 34 60 20 60 20 Z M60 78 L60 104 M60 44 C56 48 52 52 48 60 M60 60 C64 56 70 54 76 52",
  boden:
    "M20 50 L100 50 M28 66 L92 66 M36 82 L84 82 M60 50 C58 60 54 68 46 74 M60 50 C62 60 66 68 74 74 M60 50 L60 28",
  pflege:
    "M30 40 C30 26 42 16 60 16 C78 16 90 26 90 40 M60 16 L60 6 M44 96 C44 96 40 78 60 68 C80 78 76 96 76 96 M52 96 L68 96 M60 68 L60 40",
};

export default function GardenIcon({
  name,
  className = "",
}: {
  name: "saatgut" | "boden" | "pflege";
  className?: string;
}) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" aria-hidden>
      <path
        d={PATHS[name]}
        stroke="var(--color-accent)"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
