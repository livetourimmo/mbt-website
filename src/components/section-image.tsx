import type { ReactNode } from "react";
import Reveal from "@/components/reveal";

export default function SectionImage({
  heading,
  media,
  imageSide = "right",
  tint,
  children,
}: {
  heading: string;
  media: ReactNode;
  imageSide?: "left" | "right";
  tint?: string;
  children: ReactNode;
}) {
  return (
    <section
      className="border-t border-hairline"
      style={tint ? { background: tint } : undefined}
    >
      <Reveal className="mx-auto grid max-w-7xl gap-10 px-6 py-20 md:grid-cols-12 md:items-center md:gap-8 md:px-10 md:py-28">
        <div
          className={`group overflow-hidden md:col-span-7 ${
            imageSide === "left" ? "md:order-1" : "md:order-2"
          }`}
        >
          <div className="transition-transform duration-700 ease-out group-hover:scale-[1.03]">
            {media}
          </div>
        </div>
        <div
          className={`md:col-span-5 ${
            imageSide === "left" ? "md:order-2" : "md:order-1"
          }`}
        >
          <h2 className="font-display text-[1.6rem] leading-[1.15] font-semibold text-ink md:text-[2rem]">
            {heading}
          </h2>
          <div className="mt-5 space-y-4 text-[17px] leading-relaxed text-ink-soft">
            {children}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
