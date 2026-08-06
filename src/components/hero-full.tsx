import type { ReactNode } from "react";

export default function HeroFull({
  kicker,
  headline,
  lede,
  media,
  tone = "ink",
}: {
  kicker?: string;
  headline: string;
  lede?: string;
  media: ReactNode;
  tone?: "ink" | "accent";
}) {
  return (
    <section className="relative h-[88vh] min-h-[560px] w-full overflow-hidden">
      {media}
      <div
        aria-hidden
        className={`absolute inset-0 bg-gradient-to-t to-transparent ${
          tone === "accent"
            ? "from-accent/55 via-accent/15"
            : "from-consulting-accent/55 via-consulting-accent/15"
        }`}
      />
      <div className="absolute inset-x-0 bottom-0 px-6 pb-12 md:px-10 md:pb-16">
        <div className="animate-rise mx-auto max-w-7xl">
          {kicker && (
            <p className="text-[15px] text-paper/80">{kicker}</p>
          )}
          <h1 className="mt-3 max-w-2xl font-display text-[2.25rem] leading-[1.1] font-semibold text-paper md:text-[3.25rem]">
            {headline}
          </h1>
          {lede && (
            <p className="mt-5 max-w-md text-[17px] leading-relaxed text-paper/90">
              {lede}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
