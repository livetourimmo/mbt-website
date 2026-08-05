import Link from "next/link";

const NAV = [
  { href: "/consulting", label: "Consulting" },
  { href: "/coaching", label: "Coaching" },
  { href: "/lebendige-fuehrung", label: "Lebendige Führung" },
  { href: "/ueber-mich", label: "Über mich" },
  { href: "/kontakt", label: "Kontakt" },
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-hairline bg-ink text-paper">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:px-8">
        <div className="grid gap-12 sm:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <p className="font-display text-lg font-semibold">Markus Tappolet</p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-paper/70">
              Mit innerer Klarheit äussere Wirksamkeit entfalten.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-wide text-paper/50 uppercase">
              Navigation
            </p>
            <ul className="mt-4 space-y-2.5">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-paper/80 transition-colors hover:text-paper"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-wide text-paper/50 uppercase">
              Kontakt
            </p>
            <ul className="mt-4 space-y-2.5 text-sm text-paper/80">
              <li>Seestrasse 40, 8330 Pfäffikon ZH</li>
              <li>
                <a
                  href="mailto:info@mbt-consulting.ch"
                  className="transition-colors hover:text-paper"
                >
                  info@mbt-consulting.ch
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-paper/15 pt-8 text-xs text-paper/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Markus Tappolet</p>
          <div className="flex gap-6">
            <Link href="/impressum" className="hover:text-paper/80">
              Impressum
            </Link>
            <Link href="/datenschutz" className="hover:text-paper/80">
              Datenschutz
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
