import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Datenschutz",
};

export default function DatenschutzPage() {
  return (
    <section className="mx-auto max-w-2xl px-6 py-24 md:px-10 md:py-32">
      <h1 className="font-display text-[2rem] font-semibold text-ink">
        Datenschutz
      </h1>
      <p className="mt-6 text-[16px] leading-relaxed text-ink-soft">
        Der Schutz Ihrer Daten ist mir wichtig. Diese Datenschutzerklärung
        informiert Sie, welche Daten beim Besuch dieser Website erhoben und
        wie sie verarbeitet werden.
      </p>

      <h2 className="mt-10 font-display text-[1.25rem] font-semibold text-ink">
        Verantwortliche Stelle
      </h2>
      <div className="mt-4 space-y-1 text-[16px] leading-relaxed text-ink-soft">
        <p>MBT-Consulting Tappolet, Markus Tappolet</p>
        <p>Seestrasse 40, 8330 Pfäffikon ZH</p>
        <p>
          <a href="mailto:kontakt@mbt-consulting.ch" className="hover:text-ink">
            kontakt@mbt-consulting.ch
          </a>
        </p>
      </div>

      <h2 className="mt-10 font-display text-[1.25rem] font-semibold text-ink">
        Bearbeitung Ihrer Daten
      </h2>
      <p className="mt-4 text-[16px] leading-relaxed text-ink-soft">
        Diese Website verwendet keine Cookies und keine
        Analyse-/Tracking-Tools. Es werden nur Daten verarbeitet, die Sie mir
        aktiv über das Kontaktformular senden: Name, E-Mail-Adresse und Ihre
        Nachricht. Diese Angaben nutze ich ausschliesslich, um Sie zur
        Vereinbarung eines Kennenlerngesprächs zu kontaktieren, und
        speichere sie nicht darüber hinaus.
      </p>
      <p className="mt-4 text-[16px] leading-relaxed text-ink-soft">
        Für den Versand dieser Nachrichten setze ich den E-Mail-Dienst Resend
        (Resend Inc., USA) ein. Dabei können Ihre Angaben auch auf Servern
        ausserhalb der Schweiz und der EU verarbeitet werden.
      </p>
      <p className="mt-4 text-[16px] leading-relaxed text-ink-soft">
        Beim Besuch dieser Website erhebt der Hosting-Anbieter
        automatisch technische Angaben (z. B. IP-Adresse, Datum und Uhrzeit
        des Zugriffs, aufgerufene Seite) in Server-Logfiles. Diese Angaben
        dienen ausschliesslich dem sicheren und stabilen Betrieb der Website
        und werden nicht mit anderen Daten zusammengeführt.
      </p>

      <h2 className="mt-10 font-display text-[1.25rem] font-semibold text-ink">
        Ihre Rechte
      </h2>
      <p className="mt-4 text-[16px] leading-relaxed text-ink-soft">
        Sie haben jederzeit das Recht auf Auskunft über die zu Ihrer Person
        gespeicherten Daten sowie auf deren Berichtigung oder Löschung.
        Wenden Sie sich dazu einfach an die oben genannte Kontaktadresse.
      </p>

      <h2 className="mt-10 font-display text-[1.25rem] font-semibold text-ink">
        Änderungen
      </h2>
      <p className="mt-4 text-[16px] leading-relaxed text-ink-soft">
        Diese Datenschutzerklärung kann bei Bedarf angepasst werden, etwa
        wenn sich die Website oder die rechtlichen Vorgaben ändern.
      </p>
    </section>
  );
}
