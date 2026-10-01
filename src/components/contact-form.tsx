"use client";

import { useState, type FormEvent } from "react";
import type { Segment } from "@/lib/segment";

export default function ContactForm({
  segment,
  tone = "ink",
  className = "",
}: {
  segment: Segment;
  tone?: "ink" | "accent";
  className?: string;
}) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [errorMsg, setErrorMsg] = useState("");

  const ring =
    tone === "accent"
      ? "focus:border-accent focus:ring-accent/20"
      : "focus:border-ink focus:ring-ink/10";

  const labelClass = "mb-1.5 block text-[13px] font-medium text-ink-soft";
  const fieldClass = `w-full rounded-lg border border-hairline bg-paper px-4 py-2.5 text-[15px] text-ink outline-none transition-colors focus:ring-2 ${ring}`;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");

    const form = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email"),
          message: form.get("message"),
          segment,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error ?? "Senden fehlgeschlagen.");
      }

      setStatus("sent");
    } catch (error) {
      setErrorMsg(
        error instanceof Error ? error.message : "Senden fehlgeschlagen."
      );
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <p className={`text-[15px] font-medium text-ink ${className}`}>
        Danke für deine Nachricht — ich melde mich in Kürze.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      <div>
        <label htmlFor="contact-name" className={labelClass}>
          Name
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          required
          autoComplete="name"
          placeholder="Vorname Nachname"
          className={fieldClass}
        />
      </div>
      <div>
        <label htmlFor="contact-email" className={labelClass}>
          E-Mail
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="name@firma.ch"
          className={fieldClass}
        />
      </div>
      <div>
        <label htmlFor="contact-message" className={labelClass}>
          Worum geht es?
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={3}
          placeholder="Kurz, worum es geht …"
          className={`resize-none ${fieldClass}`}
        />
      </div>
      <button
        type="submit"
        disabled={status === "sending"}
        className={`rounded-full px-8 py-3 text-[15px] font-medium text-paper transition-colors disabled:opacity-60 ${
          tone === "accent"
            ? "bg-accent hover:bg-accent-dark"
            : "bg-ink hover:bg-accent-dark"
        }`}
      >
        {status === "sending" ? "Wird gesendet …" : "Nachricht senden"}
      </button>
      {status === "error" && (
        <p className="text-[14px] text-red-600">{errorMsg}</p>
      )}
    </form>
  );
}
