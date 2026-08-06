const KIND_LABEL = {
  image: "Bild folgt",
  video: "Video folgt",
  animation: "Animation folgt",
} as const;

export default function MediaPlaceholder({
  kind = "image",
  label,
  className = "",
  aspect = "aspect-[4/3]",
}: {
  kind?: keyof typeof KIND_LABEL;
  label?: string;
  className?: string;
  aspect?: string;
}) {
  return (
    <div
      className={`${aspect} ${className} flex flex-col items-center justify-center gap-3 border border-dashed border-hairline bg-neutral-tint text-center`}
    >
      <span
        aria-hidden
        className="flex h-10 w-10 items-center justify-center rounded-full border border-ink-soft/40 text-ink-soft"
      >
        {kind === "video" ? "▶" : kind === "animation" ? "✺" : "◇"}
      </span>
      <p className="max-w-[16rem] px-6 text-[13px] leading-relaxed text-ink-soft">
        {label ?? KIND_LABEL[kind]}
      </p>
    </div>
  );
}
