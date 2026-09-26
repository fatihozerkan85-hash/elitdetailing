import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    email: process.env.RESEND_API_KEY ? "resend" : "mock",
    whatsapp:
      process.env.WHATSAPP_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID ? "cloud" : "link",
    iyzico: process.env.IYZICO_API_KEY && process.env.IYZICO_SECRET_KEY ? "live" : "mock",
  });
}
