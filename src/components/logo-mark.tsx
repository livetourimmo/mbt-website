const ICON_ASPECT = 295 / 304; // gemessener Anteil des Blüten-Icons am Logo-Bild
const IMAGE_ASPECT = 969 / 304; // Breite/Höhe des vollständigen Logo-Bilds

export default function LogoMark({
  size = 32,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={className}
      style={{
        display: "inline-block",
        width: size * ICON_ASPECT,
        height: size,
        backgroundImage: "url(/images/logo-mbt.png)",
        backgroundSize: `${size * IMAGE_ASPECT}px ${size}px`,
        backgroundPosition: "left center",
        backgroundRepeat: "no-repeat",
        flexShrink: 0,
      }}
    />
  );
}
