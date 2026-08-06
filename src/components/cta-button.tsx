"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";

const TRANSITION =
  "transform 200ms ease-out, box-shadow 200ms ease-out, background-color 200ms ease-out, color 200ms ease-out, border-color 200ms ease-out";

export default function CtaButton({
  href,
  children,
  variant = "solid",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: "solid" | "outline";
  className?: string;
}) {
  const [hover, setHover] = useState(false);

  const style =
    variant === "solid"
      ? {
          background: hover ? "var(--color-accent-dark)" : "var(--color-ink)",
          color: "var(--color-paper)",
          transform: hover ? "translateY(-6px)" : "translateY(0)",
          boxShadow: hover
            ? "0 20px 25px -5px rgba(31,44,87,0.25), 0 8px 10px -6px rgba(31,44,87,0.2)"
            : "0 0 0 0 rgba(0,0,0,0)",
          transition: TRANSITION,
        }
      : {
          borderColor: hover ? "var(--color-accent)" : "var(--color-hairline)",
          color: hover ? "var(--color-accent)" : "var(--color-ink)",
          transform: hover ? "translateY(-6px)" : "translateY(0)",
          boxShadow: hover
            ? "0 10px 15px -3px rgba(31,44,87,0.15), 0 4px 6px -4px rgba(31,44,87,0.15)"
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
