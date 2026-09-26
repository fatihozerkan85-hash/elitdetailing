import { NextResponse } from "next/server";
import { retrieveCheckout } from "@/lib/iyzico";

function resultRedirect(req: Request, params: Record<string, string>) {
  const url = new URL("/odeme/sonuc", req.url);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  return NextResponse.redirect(url, 303);
}

async function handle(req: Request, token: string | null) {
  if (!token) {
    return resultRedirect(req, { status: "fail", reason: "token-yok" });
  }
  try {
    const result = await retrieveCheckout(token);
    const paid = result.status === "success" && String(result.paymentStatus).toUpperCase() === "SUCCESS";
    return resultRedirect(req, {
      status: paid ? "ok" : "fail",
      conversationId: result.conversationId || "",
      paymentId: result.paymentId || "",
      token,
      mode: result.mode,
    });
  } catch {
    return resultRedirect(req, { status: "fail", reason: "dogrulama", token });
  }
}

export async function POST(req: Request) {
  const contentType = req.headers.get("content-type") || "";
  let token: string | null = null;
  if (contentType.includes("application/json")) {
    const json = (await req.json()) as { token?: string };
    token = json.token ?? null;
  } else {
    const form = await req.formData();
    token = String(form.get("token") || "") || null;
  }
  return handle(req, token);
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  return handle(req, url.searchParams.get("token"));
}
