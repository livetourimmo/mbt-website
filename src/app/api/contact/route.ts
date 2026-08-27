import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { SEGMENT_META, type Segment } from "@/lib/segment";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, email, message, segment } = body as {
    name?: string;
    email?: string;
    message?: string;
    segment?: Segment;
  };

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Bitte alle Felder ausfüllen." },
      { status: 400 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY ist nicht gesetzt.");
    return NextResponse.json(
      { error: "Formular ist derzeit nicht verfügbar." },
      { status: 500 }
    );
  }

  const meta = SEGMENT_META[segment === "coaching" ? "coaching" : "consulting"];
  const resend = new Resend(apiKey);

  try {
    const { error } = await resend.emails.send({
      from: `${meta.brand} Kontaktformular <onboarding@resend.dev>`,
      to: meta.email,
      replyTo: email,
      subject: `Neue Anfrage über ${meta.brand}`,
      text: `Name: ${name}\nE-Mail: ${email}\n\nNachricht:\n${message}`,
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
