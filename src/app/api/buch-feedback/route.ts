import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { SEGMENT_META } from "@/lib/segment";

const MAX_LENGTH = 5000;

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const { name, feedback, publish, website } = body as {
    name?: string;
    feedback?: string;
    publish?: boolean;
    website?: string;
  };

  // Honeypot: Menschen sehen dieses Feld nicht, Bots füllen es aus
  if (website) {
    return NextResponse.json({ ok: true });
  }

  const text = feedback?.trim();
  const sender = name?.trim() || "";

  if (!text) {
    return NextResponse.json({ error: "Bitte schreib dein Feedback." }, { status: 400 });
  }
  if (text.length > MAX_LENGTH || sender.length > 200) {
    return NextResponse.json({ error: "Das Feedback ist zu lang." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY ist nicht gesetzt.");
    return NextResponse.json(
      { error: "Formular ist derzeit nicht verfügbar." },
      { status: 500 }
    );
  }

  // Buch-Feedback läuft immer über die Consulting-Adresse
  const meta = SEGMENT_META.consulting;
  const resend = new Resend(apiKey);

  const freigabe = publish
    ? sender
      ? `JA, darf mit Namen (${sender}) veröffentlicht werden.`
      : "JA, darf anonym veröffentlicht werden."
    : "NEIN, nicht veröffentlichen.";

  try {
    const { error } = await resend.emails.send({
      from: `${meta.brand} Buch-Feedback <onboarding@resend.dev>`,
      to: meta.email,
      subject: "Neues Feedback zum Buch «Lebendige Führung»",
      text: `Name: ${sender || "(nicht angegeben)"}\nVeröffentlichung als Rezension: ${freigabe}\n\nFeedback:\n${text}`,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Senden fehlgeschlagen. Bitte später erneut versuchen." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Resend error:", error);
    return NextResponse.json(
      { error: "Senden fehlgeschlagen. Bitte später erneut versuchen." },
      { status: 500 }
    );
  }
}
