"use client";

import { useState, type FormEvent } from "react";

export default function BookFeedbackForm({ className = "" }: { className?: string }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [errorMsg, setErrorMsg] = useState("");

  const labelClass = "mb-1.5 block text-[13px] font-medium text-ink-soft";
  const fieldClass =
    "w-full rounded-lg border border-hairline bg-paper px-4 py-2.5 text-[15px] text-ink outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");

    const form = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/buch-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          feedback: form.get("feedback"),
          publish: form.get("publish") === "on",
          website: form.get("website"),
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
      <p role="status" className={`text-[17px] font-medium text-ink ${className}`}>
        Herzlichen Dank für dein Feedback.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-5 ${className}`}>
      <div>
        <label htmlFor="feedback-name" className={labelClass}>
          Name <span className="font-normal">(optional)</span>
        </label>
        <input
          id="feedback-name"
          name="name"
          type="text"
          maxLength={200}
          autoComplete="name"
          placeholder="Vorname Nachname"
          className={fieldClass}
        />
      </div>
      <div>
        <label htmlFor="feedback-text" className={labelClass}>
          Dein Feedback
        </label>
        <textarea
          id="feedback-text"
          name="feedback"
          required
          rows={6}
          maxLength={5000}
          placeholder="Was hat dich angesprochen, was nimmst du mit?"
          className={`resize-y ${fieldClass}`}
        />
      </div>
      {/* Honeypot gegen Spam-Bots, für Menschen unsichtbar */}
      <div aria-hidden className="absolute -left-[9999px]">
        <label htmlFor="feedback-website">Website</label>
        <input id="feedback-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <label className="flex cursor-pointer items-start gap-3 text-[14px] leading-relaxed text-ink-soft">
        <input
          name="publish"
          type="checkbox"
          className="mt-1 h-4 w-4 shrink-0 accent-[var(--color-accent)]"
        />
        <span>
          Mein Feedback darf als Rezension auf dieser Website und in
          Unterlagen zum Buch veröffentlicht werden, mit meinem Namen, falls
          ich einen angegeben habe.
        </span>
      </label>
      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-full bg-accent px-8 py-3 text-[15px] font-medium text-paper transition-colors hover:bg-accent-dark disabled:opacity-60"
      >
        {status === "sending" ? "Wird gesendet …" : "Feedback senden"}
      </button>
      {status === "error" && (
        <p role="alert" className="text-[14px] font-medium text-accent-dark">{errorMsg}</p>
      )}
    </form>
  );
}
