/** Strukturierte Daten (schema.org) als JSON-LD, serverseitig gerendert. */
export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // "<" escapen, damit Inhalte das Script-Tag nicht schliessen können.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
