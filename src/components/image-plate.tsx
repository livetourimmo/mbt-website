export default function ImagePlate({
  caption,
  className = "",
  tone = "warm",
}: {
  caption: string;
  className?: string;
  tone?: "warm" | "cool";
}) {
  const gradient =
    tone === "warm"
      ? "linear-gradient(155deg, #2b2140 0%, #5c3369 46%, #7d5a3f 100%)"
      : "linear-gradient(155deg, #1f2c57 0%, #3a4470 55%, #5c3369 100%)";

  return (
    <div className={`relative overflow-hidden bg-ink ${className}`}>
      <div className="absolute inset-0" style={{ backgroundImage: gradient }} />
      <svg className="absolute inset-0 h-full w-full opacity-[0.18] mix-blend-overlay" aria-hidden>
        <filter id={`grain-${tone}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#grain-${tone})`} />
      </svg>
      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
      <p className="absolute bottom-4 left-4 font-body text-[11px] tracking-wide text-paper/60">
        {caption}
      </p>
    </div>
  );
}
