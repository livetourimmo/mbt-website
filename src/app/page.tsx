import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Markus Tappolet",
  description:
    "Zwei Wege, ein Kern: Consulting für Unternehmensführungen und Coaching für Führungspersönlichkeiten.",
};

const doors = [
  {
    key: "consulting",
    href: "/consulting",
    heading: "Consulting",
    lede: "Für CEOs und Geschäftsleitungen — wie wird ein Unternehmen zukunftsfähig?",
    cta: "Zum Consulting",
    from: "31, 44, 87",
    delay: "0ms",
  },
  {
    key: "coaching",
    href: "/coaching",
    heading: "Coaching",
    lede: "Für Führungspersönlichkeiten — wer will ich als Führungsperson eigentlich sein?",
    cta: "Zum Coaching",
    from: "92, 51, 105",
    delay: "120ms",
  },
] as const;

export default function Home() {
  return (
    <div className="relative flex h-screen min-h-[640px] w-full flex-col overflow-hidden bg-ink md:flex-row">
      <Image
        src="/images/bank-sitzend.png"
        alt="Markus Tappolet sitzt auf einer Bank unter einem Baum."
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      {doors.map((door) => (
        <Link
          key={door.key}
          href={door.href}
          className="group relative flex flex-1 items-end overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-paper"
        >
          <div
            className="absolute inset-0 transition-[background] duration-500 ease-out"
            style={{
              background: `linear-gradient(to top, rgba(${door.from}, 0.88) 0%, rgba(${door.from}, 0.42) 42%, rgba(${door.from}, 0.02) 72%)`,
            }}
          />
          <div
            className="absolute inset-0 opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
            style={{
              background: `linear-gradient(to top, rgba(${door.from}, 0.94) 0%, rgba(${door.from}, 0.6) 50%, rgba(${door.from}, 0.1) 80%)`,
            }}
          />

          <div
            className="animate-rise relative z-10 px-8 pb-16 md:max-w-md md:px-14 md:pb-20"
            style={{ animationDelay: door.delay }}
          >
            <h1 className="font-display text-[2.5rem] font-semibold leading-[0.95] text-paper md:text-[3.25rem]">
              {door.heading}
            </h1>
            <p className="mt-5 max-w-xs text-[16px] leading-relaxed text-paper/85">
              {door.lede}
            </p>
            <span className="mt-8 inline-flex items-center gap-2 text-[15px] font-medium text-paper">
              <span className="border-b border-paper/40 pb-0.5 transition-colors duration-300 group-hover:border-paper">
                {door.cta}
              </span>
              <span
                aria-hidden
                className="transition-transform duration-300 ease-out group-hover:translate-x-1"
              >
                →
              </span>
            </span>
          </div>
        </Link>
      ))}

      {/* Naht zwischen den zwei Wegen */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center md:inset-y-0 md:inset-x-1/2"
      >
        <div className="absolute h-full w-px bg-paper/25 md:h-full" />
      </div>
    </div>
  );
}
