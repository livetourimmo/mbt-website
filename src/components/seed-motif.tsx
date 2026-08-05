export default function SeedMotif({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 320"
      className={className}
      aria-hidden
      fill="none"
    >
      <path
        d="M100 8C132 60 172 110 172 176C172 240 140 300 100 312C60 300 28 240 28 176C28 110 68 60 100 8Z"
        stroke="var(--color-accent)"
        strokeWidth="1"
      />
      <path
        d="M100 40V300"
        stroke="var(--color-accent)"
        strokeWidth="1"
      />
      <path d="M100 90C100 90 76 104 66 128" stroke="var(--color-accent)" strokeWidth="1" />
      <path d="M100 140C100 140 128 154 138 178" stroke="var(--color-accent)" strokeWidth="1" />
      <path d="M100 190C100 190 76 204 66 228" stroke="var(--color-accent)" strokeWidth="1" />
    </svg>
  );
}
