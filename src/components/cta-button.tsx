"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";

const TRANSITION =
  "transform 200ms ease-out, box-shadow 200ms ease-out, background-color 200ms ease-out, color 200ms ease-out, border-color 200ms ease-out";

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
  const [hover, setHover] = useState(false);

  const style =
    variant === "solid"
      ? {
          background: hover
            ? "var(--color-accent-dark)"
            : tone === "accent"
              ? "var(--color-accent)"
              : "var(--color-ink)",
          color: "var(--color-paper)",
          transform: hover ? "translateY(-2px)" : "translateY(0)",
          boxShadow: hover
            ? "0 8px 12px -4px rgba(31,44,87,0.18)"
            : "0 0 0 0 rgba(0,0,0,0)",
          transition: TRANSITION,
        }
      : {
          borderColor: hover ? "var(--color-accent)" : "var(--color-hairline)",
          color: hover ? "var(--color-accent)" : "var(--color-ink)",
          transform: hover ? "translateY(-2px)" : "translateY(0)",
          boxShadow: hover
            ? "0 6px 10px -4px rgba(31,44,87,0.12)"
            : "0 0 0 0 rgba(0,0,0,0)",
          transition: TRANSITION,
        };

  const base =
    variant === "solid"
      ? "inline-block rounded-full px-8 py-3 text-[15px] font-medium"
      : "rounded-full border px-4 py-2 text-[14px]";

  return (
    <Link
      href={href}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onTouchStart={() => setHover(true)}
      onTouchEnd={() => setHover(false)}
      className={`${base} ${className}`}
      style={style}
    >
      {children}
    </Link>
  );
}
