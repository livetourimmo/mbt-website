import Reveal from "@/components/reveal";

export type Angebot = {
  titel: string;
  beschreibung: string;
  details: readonly string[];
};

export default function OfferSection({
  angebote,
  tint,
}: {
  angebote: readonly Angebot[];
  tint?: string;
}) {
  return (
    <section
      className="border-t border-hairline"
      style={tint ? { background: tint } : undefined}
    >
      <Reveal className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">
        <h2 className="font-display text-[1.6rem] leading-[1.15] font-semibold text-ink md:text-[2rem]">
          Angebot
        </h2>
        <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-ink-soft">
          Drei Beispiele, wie eine Zusammenarbeit konkret aussehen kann.
        </p>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {angebote.map((a) => (
            <div
              key={a.titel}
              className="flex h-full flex-col rounded-2xl border border-hairline bg-paper p-8 transition-transform duration-300 ease-out hover:-translate-y-1"
            >
              <h3 className="font-display min-h-[3.75rem] text-[1.25rem] font-semibold text-ink">
                {a.titel}
              </h3>
              <p className="mt-4 min-h-[6.5rem] text-[15px] leading-relaxed text-ink-soft">
                {a.beschreibung}
              </p>
              <ul className="mt-6 space-y-2 border-t border-hairline pt-5">
                {a.details.map((d) => (
                  <li
                    key={d}
                    className="flex items-start gap-2 text-[14px] leading-relaxed text-ink-soft"
                  >
                    <span aria-hidden className="text-accent">
                      —
                    </span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
