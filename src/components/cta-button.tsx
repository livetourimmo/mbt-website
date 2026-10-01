import Link from "next/link";
import type { ReactNode } from "react";

/** Button-Link: beim Darüberfahren ändern sich nur Farbe und Schatten. */
export default function CtaButton({
  href,
  children,
  variant = "solid",
  tone = "ink",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: "solid" | "outline";
  tone?: "ink" | "accent";
  className?: string;
}) {
  const base =
    variant === "solid"
      ? `group inline-flex items-center gap-2 rounded-full px-8 py-3 text-[15px] font-medium text-paper transition-[background-color,box-shadow] duration-300 ease-out hover:bg-accent-dark hover:shadow-[0_14px_24px_-10px_rgba(51,22,65,0.45)] ${
          tone === "accent" ? "bg-accent" : "bg-ink"
        }`
      : "group inline-flex items-center rounded-full border border-hairline px-4 py-2 text-[14px] text-ink transition-[color,border-color,box-shadow] duration-300 ease-out hover:border-accent hover:text-accent hover:shadow-[0_8px_16px_-8px_rgba(31,44,87,0.2)]";

  return (
    <Link href={href} className={`${base} ${className}`}>
      {children}
    </Link>
  );
}
