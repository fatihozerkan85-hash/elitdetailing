import { NextResponse } from "next/server";
import { toWhatsAppE164, waMeUrl } from "@/lib/whatsapp";

export async function POST(req: Request) {
  const body = (await req.json()) as { phone?: string; text?: string };
  const phone = body.phone?.trim() ?? "";
  const text = body.text?.trim() ?? "";
  if (!phone || !text) {
    return NextResponse.json({ ok: false, error: "phone and text required" }, { status: 400 });
  }

  const token = process.env.WHATSAPP_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (token && phoneId) {
    const res = await fetch(`https://graph.facebook.com/v21.0/${phoneId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: toWhatsAppE164(phone),
        type: "text",
        text: { body: text },
      }),
    });
    const json = (await res.json()) as unknown;
    return NextResponse.json({ ok: res.ok, mode: "cloud", response: json });
  }

  return NextResponse.json({
    ok: true,
    mode: "link",
    url: waMeUrl(phone, text),
  });
}
