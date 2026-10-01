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
        <span
          key={i}
          aria-hidden
          className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom"
        >
          <span
            className="word-inner inline-block"
            style={{ "--i": i } as React.CSSProperties}
          >
            {word}
          </span>
          {i < words.length - 1 && " "}
        </span>
      ))}
    </span>
  );
}
