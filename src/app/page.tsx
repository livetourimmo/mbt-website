import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import SplitWords from "@/components/split-words";

export const metadata: Metadata = {
  title: "Markus Tappolet",
  description:
    "Zwei Wege, ein Kern: Consulting für Unternehmensführungen und Coaching für Führungspersönlichkeiten.",
  alternates: { canonical: "/" },
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
    mobileFocus: "object-[0%_35%]",
  },
  {
    key: "coaching",
    href: "/coaching",
    heading: "Coaching",
    lede: "Für Führungspersönlichkeiten — wer will ich als Führungsperson eigentlich sein?",
    cta: "Zum Coaching",
    from: "92, 51, 105",
    delay: "180ms",
    mobileFocus: "object-[100%_35%]",
  },
] as const;

export default function Home() {
  return (
    <div className="relative flex h-screen min-h-[640px] w-full flex-col overflow-hidden bg-ink md:flex-row">
      {/* depth-0: Bild atmet beim Laden ein und zoomt danach ganz langsam weiter */}
      <div className="hero-media absolute inset-0 hidden md:block">
        <div className="kenburns absolute inset-0">
          <Image
            src="/images/startseite.png"
            alt="Markus Tappolet sitzt zweimal auf derselben Bank unter einem Baum — links im Anzug für Consulting, rechts leger für Coaching."
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </div>
      {/* depth-1: wandernder Lichtschimmer */}
      <div aria-hidden className="hero-glow pointer-events-none absolute inset-0" />

      {doors.map((door) => (
        <Link
          key={door.key}
          href={door.href}
          className="group relative flex flex-1 items-end overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-paper"
        >
          {/* Handy: jede Tür zeigt ihre Hälfte des Bildes (Anzug bzw. Polo) */}
          <div className="hero-media absolute inset-0 md:hidden">
            <Image
              src="/images/startseite.png"
              alt=""
              fill
              priority
              sizes="100vw"
              className={`object-cover ${door.mobileFocus}`}
            />
          </div>
          <div
            className="absolute inset-0 transition-[background] duration-500 ease-out"
            style={{
              background: `linear-gradient(to top, rgba(${door.from}, 0.88) 0%, rgba(${door.from}, 0.42) 42%, rgba(${door.from}, 0.02) 72%)`,
            }}
          />
          <div
            className="absolute inset-0 opacity-0 transition-opacity duration-700 ease-out group-hover:opacity-100"
            style={{
              background: `linear-gradient(to top, rgba(${door.from}, 0.94) 0%, rgba(${door.from}, 0.6) 50%, rgba(${door.from}, 0.1) 80%)`,
            }}
          />

          <div
            className="relative z-10 px-8 pb-16 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-3 md:max-w-md md:px-14 md:pb-20"
            style={{ "--door-delay": door.delay } as React.CSSProperties}
          >
            <h1 className="hero-title door-delay font-display text-[2.75rem] leading-[0.95] font-semibold tracking-tight text-paper md:text-[4rem]">
              <SplitWords text={door.heading} />
            </h1>
            <p className="hero-lede door-delay mt-5 max-w-xs text-[16px] leading-relaxed text-paper/85">
              {door.lede}
            </p>
            <span className="hero-lede door-delay mt-8 inline-flex items-center gap-3 text-[15px] font-medium text-paper">
              <span className="border-b border-paper/40 pb-0.5 transition-colors duration-300 group-hover:border-paper">
                {door.cta}
              </span>
              <span
                aria-hidden
                className="flex h-9 w-9 items-center justify-center rounded-full border border-paper/40 transition-all duration-500 ease-out group-hover:translate-x-1.5 group-hover:border-paper group-hover:bg-paper group-hover:text-ink"
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
        <div className="seam-grow absolute h-px w-full bg-paper/30 md:h-full md:w-px" />
      </div>
    </div>
  );
}
