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
    <form onSubmit={handleSubmit} className={`space-y-3 ${className}`}>
      <input
        name="name"
        type="text"
        required
        placeholder="Dein Name"
        className={`w-full rounded-lg border border-hairline bg-paper px-4 py-2.5 text-[15px] text-ink outline-none transition-colors focus:ring-2 ${ring}`}
      />
      <input
        name="email"
        type="email"
        required
        placeholder="Deine E-Mail-Adresse"
        className={`w-full rounded-lg border border-hairline bg-paper px-4 py-2.5 text-[15px] text-ink outline-none transition-colors focus:ring-2 ${ring}`}
      />
      <textarea
        name="message"
        required
        rows={3}
        placeholder="Kurz, worum es geht …"
        className={`w-full resize-none rounded-lg border border-hairline bg-paper px-4 py-2.5 text-[15px] text-ink outline-none transition-colors focus:ring-2 ${ring}`}
      />
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
