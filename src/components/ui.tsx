import Link from "next/link";
import type { ReactNode } from "react";

export function Container({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`mx-auto max-w-6xl px-6 sm:px-8 ${className}`}>
      {children}
    </div>
  );
}

export function CTAButton({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "on-dark";
  className?: string;
}) {
  const base =
    "inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition-colors duration-200";
  const styles = {
    primary: "bg-accent text-paper hover:bg-accent-dark",
    secondary: "border border-ink/25 text-ink hover:border-ink hover:bg-ink/[0.03]",
    "on-dark": "bg-paper text-ink hover:bg-paper/90",
  };
  return (
    <Link href={href} className={`${base} ${styles[variant]} ${className}`}>
      <span aria-hidden className="text-base leading-none">→</span>
      {children}
    </Link>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs font-semibold tracking-[0.14em] text-accent uppercase">
      {children}
    </p>
  );
}
