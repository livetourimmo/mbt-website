import type { ReactNode } from "react";

export default function SectionText({
  heading,
  tint,
  children,
}: {
  heading: string;
  tint?: string;
  children: ReactNode;
}) {
  return (
    <section
      className="border-t border-hairline"
      style={tint ? { background: tint } : undefined}
    >
      <div className="mx-auto grid max-w-7xl gap-6 px-6 py-20 md:grid-cols-12 md:gap-10 md:px-10 md:py-28">
        <h2 className="font-display text-[1.6rem] leading-[1.15] font-semibold text-ink md:col-span-4 md:text-[2rem]">
          {heading}
        </h2>
        <div className="max-w-2xl space-y-5 text-[17px] leading-relaxed text-ink-soft md:col-span-7 md:col-start-6">
          {children}
        </div>
      </div>
    </section>
  );
}
