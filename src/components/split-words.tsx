import { Fragment } from "react";

/**
 * Zerlegt einen Text in maskierte Wörter. Jedes Wort steckt in einer
 * Maske (overflow hidden) und kann von unten hereingleiten (`.word-inner`).
 * Screenreader lesen den ganzen Satz über aria-label.
 */
export default function SplitWords({ text }: { text: string }) {
  const words = text.split(/\s+/).filter(Boolean);
  return (
    <span aria-label={text} role="text">
      {words.map((word, i) => (
        <Fragment key={i}>
          <span
            aria-hidden
            className="inline-block max-w-full overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom hyphens-auto"
          >
            <span
              className="word-inner inline-block max-w-full"
              style={{ "--i": i } as React.CSSProperties}
            >
              {word}
            </span>
          </span>
          {/* Leerzeichen ausserhalb der Maske, sonst entsteht nach getrennten Wörtern eine Leerzeile */}
          {i < words.length - 1 && " "}
        </Fragment>
      ))}
    </span>
  );
}
