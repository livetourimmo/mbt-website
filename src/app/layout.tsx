import type { Metadata } from "next";
import { Sora, Work_Sans, Newsreader } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["italic", "normal"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
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
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
