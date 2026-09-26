export type CheckoutKind = "randevu" | "aksesuar" | "kampanya" | "teklif" | "yol-yardim";

export type CheckoutDraft = {
  conversationId: string;
  kind: CheckoutKind;
  amount: number;
  title: string;
  buyerName: string;
  buyerPhone: string;
  buyerEmail?: string;
  /** Payload applied after successful payment */
  payload: Record<string, unknown>;
  createdAt: string;
};

const PREFIX = "elit-checkout-";

export function saveCheckoutDraft(draft: CheckoutDraft) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(`${PREFIX}${draft.conversationId}`, JSON.stringify(draft));
}

export function loadCheckoutDraft(conversationId: string): CheckoutDraft | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(`${PREFIX}${conversationId}`);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as CheckoutDraft;
  } catch {
    return null;
  }
}

export function clearCheckoutDraft(conversationId: string) {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(`${PREFIX}${conversationId}`);
}

export async function startIyzicoCheckout(input: {
  conversationId: string;
  amount: number;
  title: string;
  buyerName: string;
  buyerPhone: string;
  buyerEmail?: string;
  basketItems: { id: string; name: string; category1: string; price: number }[];
  draft: CheckoutDraft;
}) {
  saveCheckoutDraft(input.draft);
  const origin = window.location.origin;
  const res = await fetch("/api/iyzico/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      conversationId: input.conversationId,
      amount: input.amount,
      title: input.title,
      buyerName: input.buyerName,
      buyerPhone: input.buyerPhone,
      buyerEmail: input.buyerEmail,
      basketItems: input.basketItems,
      callbackUrl: `${origin}/api/iyzico/callback`,
    }),
  });
  const json = (await res.json()) as {
    ok?: boolean;
    error?: string;
    paymentPageUrl?: string;
    mode?: string;
  };
  if (!res.ok || !json.paymentPageUrl) {
    clearCheckoutDraft(input.conversationId);
    throw new Error(json.error || "Ödeme başlatılamadı");
  }
  window.location.href = json.paymentPageUrl;
}
