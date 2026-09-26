import { createHmac, randomBytes } from "crypto";

export type IyzicoBasketItem = {
  id: string;
  name: string;
  category1: string;
  itemType: "PHYSICAL" | "VIRTUAL";
  price: string;
};

export type IyzicoBuyer = {
  id: string;
  name: string;
  surname: string;
  gsmNumber: string;
  email: string;
  identityNumber: string;
  registrationAddress: string;
  ip: string;
  city: string;
  country: string;
};

export type CheckoutInitInput = {
  conversationId: string;
  price: number;
  paidPrice: number;
  callbackUrl: string;
  buyer: IyzicoBuyer;
  basketItems: IyzicoBasketItem[];
  basketId: string;
};

export type CheckoutInitResult = {
  mode: "iyzico" | "mock";
  token: string;
  paymentPageUrl: string;
  conversationId: string;
};

function hasCredentials() {
  return Boolean(process.env.IYZICO_API_KEY && process.env.IYZICO_SECRET_KEY);
}

function baseUrl() {
  return process.env.IYZICO_BASE_URL?.replace(/\/$/, "") || "https://sandbox-api.iyzipay.com";
}

function iyziAuth(uriPath: string, body: string) {
  const apiKey = process.env.IYZICO_API_KEY!;
  const secretKey = process.env.IYZICO_SECRET_KEY!;
  const randomKey = `${Date.now()}${randomBytes(8).toString("hex")}`;
  const signature = createHmac("sha256", secretKey)
    .update(randomKey + uriPath + body)
    .digest("hex");
  const authorizationString = `apiKey:${apiKey}&randomKey:${randomKey}&signature:${signature}`;
  return {
    Authorization: `IYZWSv2 ${Buffer.from(authorizationString).toString("base64")}`,
    "Content-Type": "application/json",
  };
}

function money(n: number) {
  return n.toFixed(2);
}

function splitName(full: string) {
  const parts = full.trim().split(/\s+/);
  if (parts.length === 1) return { name: parts[0], surname: parts[0] };
  return { name: parts[0], surname: parts.slice(1).join(" ") };
}

export function toBuyer(input: {
  id?: string;
  fullName: string;
  phone: string;
  email?: string;
  ip?: string;
}): IyzicoBuyer {
  const { name, surname } = splitName(input.fullName || "Musteri");
  const digits = input.phone.replace(/\D/g, "");
  const gsm = digits.startsWith("90") ? `+${digits}` : digits.startsWith("0") ? `+90${digits.slice(1)}` : `+90${digits}`;
  return {
    id: input.id ?? "BY-guest",
    name,
    surname,
    gsmNumber: gsm,
    email: input.email || "musteri@elitdetailing.com",
    identityNumber: "11111111111",
    registrationAddress: "Ostim, Ankara",
    ip: input.ip || "85.34.78.112",
    city: "Ankara",
    country: "Turkey",
  };
}

export async function initializeCheckout(input: CheckoutInitInput): Promise<CheckoutInitResult> {
  if (!hasCredentials()) {
    const token = `mock_${input.conversationId}`;
    const origin = new URL(input.callbackUrl).origin;
    return {
      mode: "mock",
      token,
      conversationId: input.conversationId,
      paymentPageUrl: `${origin}/odeme/mock?token=${encodeURIComponent(token)}&conversationId=${encodeURIComponent(input.conversationId)}`,
    };
  }

  const uriPath = "/payment/iyzipos/checkoutform/initialize/auth/ecom";
  const address = {
    contactName: `${input.buyer.name} ${input.buyer.surname}`,
    city: input.buyer.city,
    country: input.buyer.country,
    address: input.buyer.registrationAddress,
  };
  const payload = {
    locale: "tr",
    conversationId: input.conversationId,
    price: money(input.price),
    paidPrice: money(input.paidPrice),
    currency: "TRY",
    basketId: input.basketId,
    paymentGroup: "PRODUCT",
    callbackUrl: input.callbackUrl,
    enabledInstallments: [1],
    buyer: input.buyer,
    shippingAddress: address,
    billingAddress: address,
    basketItems: input.basketItems,
  };
  const body = JSON.stringify(payload);
  const res = await fetch(`${baseUrl()}${uriPath}`, {
    method: "POST",
    headers: iyziAuth(uriPath, body),
    body,
  });
  const json = (await res.json()) as {
    status?: string;
    errorMessage?: string;
    token?: string;
    paymentPageUrl?: string;
    conversationId?: string;
  };
  if (json.status !== "success" || !json.token || !json.paymentPageUrl) {
    throw new Error(json.errorMessage || "iyzico checkout başlatılamadı");
  }
  return {
    mode: "iyzico",
    token: json.token,
    paymentPageUrl: json.paymentPageUrl,
    conversationId: json.conversationId || input.conversationId,
  };
}

export async function retrieveCheckout(token: string) {
  if (token.startsWith("mock_")) {
    return {
      status: "success" as const,
      paymentStatus: "SUCCESS" as const,
      conversationId: token.replace(/^mock_/, ""),
      paymentId: `MOCK-${Date.now()}`,
      paidPrice: undefined as string | undefined,
      mode: "mock" as const,
    };
  }
  if (!hasCredentials()) {
    throw new Error("iyzico anahtarları yok");
  }
  const uriPath = "/payment/iyzipos/checkoutform/auth/ecom/detail";
  const payload = { locale: "tr", token };
  const body = JSON.stringify(payload);
  const res = await fetch(`${baseUrl()}${uriPath}`, {
    method: "POST",
    headers: iyziAuth(uriPath, body),
    body,
  });
  const json = (await res.json()) as {
    status?: string;
    paymentStatus?: string;
    conversationId?: string;
    paymentId?: string;
    paidPrice?: string;
    errorMessage?: string;
  };
  return {
    status: json.status === "success" ? ("success" as const) : ("failure" as const),
    paymentStatus: (json.paymentStatus || "FAILURE") as string,
    conversationId: json.conversationId || "",
    paymentId: json.paymentId,
    paidPrice: json.paidPrice,
    mode: "iyzico" as const,
    errorMessage: json.errorMessage,
  };
}

export function iyzicoConfigured() {
  return hasCredentials();
}
