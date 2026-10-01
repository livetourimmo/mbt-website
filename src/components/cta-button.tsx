"use client";

import Link from "next/link";
import { useRef, useState, type PointerEvent, type ReactNode } from "react";

const TRANSITION =
  "transform 350ms cubic-bezier(0.22,1,0.36,1), box-shadow 250ms ease-out, background-color 250ms ease-out, color 250ms ease-out, border-color 250ms ease-out";

/** Wie stark der Button dem Mauszeiger folgt (Magnet-Effekt). */
const PULL = 0.22;

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
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLAnchorElement>(null);

  const onMove = (e: PointerEvent<HTMLAnchorElement>) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = ref.current.getBoundingClientRect();
    setOffset({
      x: (e.clientX - (r.left + r.width / 2)) * PULL,
      y: (e.clientY - (r.top + r.height / 2)) * PULL,
    });
  };

  const reset = () => {
    setHover(false);
    setOffset({ x: 0, y: 0 });
  };

  const transform = `translate(${offset.x}px, ${offset.y + (hover ? -2 : 0)}px)`;

  const style =
    variant === "solid"
      ? {
          background: hover
            ? "var(--color-accent-dark)"
            : tone === "accent"
              ? "var(--color-accent)"
              : "var(--color-ink)",
          color: "var(--color-paper)",
          transform,
          boxShadow: hover
            ? "0 14px 24px -10px rgba(51,22,65,0.45)"
            : "0 0 0 0 rgba(0,0,0,0)",
          transition: TRANSITION,
        }
      : {
          borderColor: hover ? "var(--color-accent)" : "var(--color-hairline)",
          color: hover ? "var(--color-accent)" : "var(--color-ink)",
          transform,
          boxShadow: hover
            ? "0 8px 16px -8px rgba(31,44,87,0.2)"
            : "0 0 0 0 rgba(0,0,0,0)",
          transition: TRANSITION,
        };

  const base =
    variant === "solid"
      ? "group inline-flex items-center gap-2 rounded-full px-8 py-3 text-[15px] font-medium"
      : "group inline-flex items-center rounded-full border px-4 py-2 text-[14px]";

  return (
    <Link
      ref={ref}
      href={href}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={reset}
      onPointerMove={onMove}
      onTouchStart={() => setHover(true)}
      onTouchEnd={reset}
      className={`${base} ${className}`}
      style={style}
    >
      {children}
    </Link>
  );
}
