import type { Metadata } from "next";
import { Newsreader, Sora, Work_Sans } from "next/font/google";
import "./globals.css";
import { MAIN_URL } from "@/lib/site";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

// Register-Wechsel auf "Lebendige Führung" (siehe HANDOFF.md)
const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["500"],
  style: ["italic"],
});

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  // Relative Canonicals und Bild-URLs werden auf die Hauptadresse aufgelöst.
  metadataBase: new URL(MAIN_URL),
  openGraph: {
    type: "website",
    locale: "de_CH",
    siteName: "Markus Tappolet — Lebendige Führung",
    images: [{ url: "/images/startseite.jpg", alt: "Markus Tappolet auf einer Bank unter einem Baum" }],
  },
  title: {
    default: "Markus Tappolet — Lebendige Führung",
    template: "%s — Markus Tappolet",
  },
  description:
    "Consulting für Unternehmensführungen und Coaching für Führungspersönlichkeiten. Getragen vom gemeinsamen Kern: Lebendige Führung.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="de"
      className={`${sora.variable} ${workSans.variable} ${newsreader.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-body text-ink bg-paper">
        {children}
      </body>
    </html>
  );
}
