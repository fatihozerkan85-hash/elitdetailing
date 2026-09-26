import { NextResponse } from "next/server";
import { uid } from "@/lib/format";
import type { EmailPayload } from "@/lib/email";

export async function POST(req: Request) {
  const body = (await req.json()) as Partial<EmailPayload>;
  const to = body.to?.trim() ?? "";
  const subject = body.subject?.trim() ?? "";
  const text = body.text?.trim() ?? "";
  if (!to || !subject || !text) {
    return NextResponse.json({ ok: false, error: "to, subject and text required" }, { status: 400 });
  }

  const id = uid("EM");

  const resendKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || "Elit Detailing <noreply@elitdetailing.com>";

  if (resendKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: [to],
          subject,
          text,
          html: body.html || `<pre style="font-family:sans-serif;white-space:pre-wrap">${text}</pre>`,
        }),
      });
      const json = (await res.json()) as { id?: string; message?: string };
      if (!res.ok) {
        return NextResponse.json({
          ok: false,
          mode: "resend",
          id,
          error: json.message || "resend failed",
        });
      }
      return NextResponse.json({ ok: true, mode: "resend", id: json.id || id });
    } catch (e) {
      return NextResponse.json({
        ok: false,
        mode: "resend",
        id,
        error: e instanceof Error ? e.message : "resend error",
      });
    }
  }

  // No credentials — mock success (dev / demo)
  console.info("[email:mock]", { to, subject, kind: body.kind, id });
  return NextResponse.json({
    ok: true,
    mode: "mock",
    id,
    preview: { to, subject, text: text.slice(0, 200) },
  });
}
