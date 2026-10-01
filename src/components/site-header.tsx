"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { Segment } from "@/lib/segment";
import { SEGMENT_META, resolveSegmentFromPath } from "@/lib/segment";
import LogoMark from "@/components/logo-mark";
import CtaButton from "@/components/cta-button";

const NAV_LINKS = [
  { href: "/consulting", label: "Consulting" },
  { href: "/coaching", label: "Coaching" },
  { href: "/lebendige-fuehrung", label: "Lebendige Führung" },
  { href: "/blog", label: "Blog" },
  { href: "/ueber-mich", label: "Über mich" },
];

export default function SiteHeader({ segment: initialSegment }: { segment: Segment }) {
  const pathname = usePathname();
  const segment = resolveSegmentFromPath(pathname, initialSegment);
  const meta = SEGMENT_META[segment];

  const headerRef = useRef<HTMLElement>(null);
  const [hidden, setHidden] = useState(false);
  const [compact, setCompact] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  // Über einem Element mit [data-header-overlay] (z. B. dem Einstiegsfilm) liegt
  // die Kopfzeile durchsichtig darüber, bis dieses aus dem Bild gescrollt ist.
  const overlayPage = pathname.startsWith("/lebendige-fuehrung");
  const [overVideo, setOverVideo] = useState(overlayPage);
  const transparent = overlayPage && overVideo && !menuOpen;

  // Menü nach Seitenwechsel schliessen (State während des Renders anpassen,
  // siehe react.dev "You might not need an effect"); Escape schliesst ebenfalls.
  const [menuPath, setMenuPath] = useState(pathname);
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setMenuOpen(false);
  }
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  // Header blendet beim Runterscrollen aus, beim Hochscrollen wieder ein.
  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    const update = () => {
      const y = window.scrollY;
      setCompact(y > 40);
      const overlay = document.querySelector("[data-header-overlay]");
      setOverVideo(!!overlay && overlay.getBoundingClientRect().bottom > 90);
      setHidden(y > 240 && y > lastY + 12 ? true : y < lastY - 40 ? false : (h) => h);
      lastY = y;
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  return (
    <header
      ref={headerRef}
      className={`${overlayPage ? "fixed inset-x-0" : "sticky"} top-0 z-50 border-b transition-[transform,background-color,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        hidden && !menuOpen ? "-translate-y-full" : "translate-y-0"
      } ${
        transparent
          ? "border-transparent bg-gradient-to-b bg-origin-border from-ink/55 to-transparent"
          : compact || menuOpen
            ? "border-hairline bg-paper/95 backdrop-blur-xl"
            : "border-transparent bg-paper"
      }`}
      onFocusCapture={() => setHidden(false)}
    >
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 transition-[padding] duration-500 md:px-10 ${
          compact ? "py-3.5" : "py-5 md:py-6"
        }`}
      >
        <Link
          href="/"
          className={`group flex items-center gap-3 font-display text-[15px] font-semibold tracking-tight transition-colors duration-500 ${
            transparent ? "text-paper" : "text-ink"
          }`}
        >
          <LogoMark
            size={30}
            className={`transition-[transform,filter] duration-1000 ease-out group-hover:rotate-[45deg] ${
              transparent ? "brightness-0 invert" : ""
            }`}
          />
          {meta.brand}
        </Link>

        {/* Desktop-Navigation */}
        <nav
          className={`hidden items-center gap-x-7 text-[14px] transition-colors duration-500 lg:flex ${
            transparent ? "text-paper/85" : "text-ink-soft"
          }`}
        >
          {NAV_LINKS.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`relative py-1 transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-right after:bg-accent after:transition-transform after:duration-500 after:ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  active
                    ? `after:scale-x-100 ${transparent ? "text-paper after:bg-paper" : "text-ink"}`
                    : `after:scale-x-0 hover:after:origin-left hover:after:scale-x-100 ${
                        transparent ? "hover:text-paper after:bg-paper" : "hover:text-ink"
                      }`
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <CtaButton
            href="/kennenlerngespraech"
            variant="outline"
            className={transparent ? "border-paper/50! text-paper! hover:border-paper! hover:text-paper!" : ""}
          >
            Kennenlerngespräch
          </CtaButton>
        </nav>

        {/* Menü-Button für Handy und Tablet */}
        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Menü schliessen" : "Menü öffnen"}
          className={`relative flex h-11 w-11 items-center justify-center rounded-full border transition-colors duration-500 lg:hidden ${
            transparent ? "border-paper/50 text-paper" : "border-hairline text-ink"
          }`}
        >
          <span
            aria-hidden
            className={`absolute h-[1.5px] w-5 bg-current transition-transform duration-300 ${menuOpen ? "rotate-45" : "-translate-y-[4px]"}`}
          />
          <span
            aria-hidden
            className={`absolute h-[1.5px] w-5 bg-current transition-transform duration-300 ${menuOpen ? "-rotate-45" : "translate-y-[4px]"}`}
          />
        </button>
      </div>

      {/* Ausklappbares Menü */}
      <div
        id="mobile-menu"
        className={`grid overflow-hidden transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:hidden ${
          menuOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <nav className="min-h-0" aria-label="Hauptnavigation" inert={!menuOpen}>
          <ul className="space-y-1 px-6 pt-2 pb-8">
            {NAV_LINKS.map((link) => {
              const active = pathname.startsWith(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center justify-between border-b border-hairline py-3.5 font-display text-[1.35rem] font-semibold ${
                      active ? "text-accent" : "text-ink"
                    }`}
                  >
                    {link.label}
                    <span aria-hidden className="text-[1rem] text-ink-soft">→</span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="px-6 pb-8">
            <CtaButton href="/kennenlerngespraech" tone="accent">
              Kennenlerngespräch vereinbaren
            </CtaButton>
          </div>
        </nav>
      </div>
    </header>
  );
}
