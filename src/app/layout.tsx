import type { Metadata } from "next";
import { Sora, Work_Sans } from "next/font/google";
import "./globals.css";

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
      className={`${sora.variable} ${workSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-body text-ink bg-paper">
        {children}
      </body>
    </html>
  );
}
