import { NextResponse } from "next/server";
import { initializeCheckout, iyzicoConfigured, toBuyer } from "@/lib/iyzico";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      conversationId?: string;
      amount?: number;
      title?: string;
      buyerName?: string;
      buyerPhone?: string;
      buyerEmail?: string;
      callbackUrl?: string;
      basketItems?: { id: string; name: string; category1: string; price: number }[];
    };

    const conversationId = body.conversationId?.trim();
    const amount = Number(body.amount);
    const title = body.title?.trim() || "Elit Detailing";
    const buyerName = body.buyerName?.trim();
    const buyerPhone = body.buyerPhone?.trim();
    const callbackUrl = body.callbackUrl?.trim();

    if (!conversationId || !Number.isFinite(amount) || amount <= 0 || !buyerName || !buyerPhone || !callbackUrl) {
      return NextResponse.json({ ok: false, error: "Eksik ödeme bilgisi" }, { status: 400 });
    }

    const items =
      body.basketItems && body.basketItems.length > 0
        ? body.basketItems
        : [{ id: conversationId, name: title, category1: "Hizmet", price: amount }];

    const sum = items.reduce((s, i) => s + i.price, 0);
    const paid = amount;
    const priceBase = Math.abs(sum - paid) < 0.01 ? sum : paid;

    const fwd = req.headers.get("x-forwarded-for");
    const ip = fwd?.split(",")[0]?.trim() || "85.34.78.112";

    const result = await initializeCheckout({
      conversationId,
      price: priceBase,
      paidPrice: paid,
      callbackUrl,
      basketId: conversationId,
      buyer: toBuyer({
        id: conversationId,
        fullName: buyerName,
        phone: buyerPhone,
        email: body.buyerEmail,
        ip,
      }),
      basketItems: items.map((i) => ({
        id: i.id,
        name: i.name,
        category1: i.category1,
        itemType: "PHYSICAL" as const,
        price: i.price.toFixed(2),
      })),
    });

    return NextResponse.json({
      ok: true,
      ...result,
      configured: iyzicoConfigured(),
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Ödeme hatası";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
