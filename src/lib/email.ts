export type EmailKind =
  | "welcome"
  | "password-reset"
  | "password-changed"
  | "email-verify"
  | "appointment-receipt"
  | "payment-receipt"
  | "coupon"
  | "campaign"
  | "accessory-order"
  | "account-changed";

export type EmailPayload = {
  to: string;
  subject: string;
  text: string;
  html?: string;
  kind: EmailKind;
  meta?: Record<string, string>;
};

export type EmailSendResult = {
  ok: boolean;
  mode: "mock" | "smtp" | "resend";
  id: string;
  error?: string;
};

export function emailConfigured() {
  return Boolean(process.env.RESEND_API_KEY);
}

export function buildWelcomeEmail(input: { name: string; email: string }) {
  const subject = "Elit Detailing’e hoş geldiniz";
  const text = [
    `Merhaba ${input.name},`,
    "",
    "Hesabınız oluşturuldu. Randevu, yol yardım ve aksesuar işlemlerinizde bilgileriniz otomatik gelecek.",
    "",
    "Profil: https://www.elitdetailing.com/profil",
    "",
    "Elit Detailing",
  ].join("\n");
  return { to: input.email, subject, text, kind: "welcome" as const };
}

export function buildPasswordResetEmail(input: { name: string; email: string; resetUrl: string }) {
  const subject = "Şifre sıfırlama — Elit Detailing";
  const text = [
    `Merhaba ${input.name},`,
    "",
    "Şifre sıfırlama talebiniz alındı. Bağlantı 30 dakika geçerlidir:",
    input.resetUrl,
    "",
    "Bu talebi siz yapmadıysanız bu e-postayı yok sayın.",
    "",
    "Elit Detailing",
  ].join("\n");
  return { to: input.email, subject, text, kind: "password-reset" as const, meta: { resetUrl: input.resetUrl } };
}

export function buildPasswordChangedEmail(input: { name: string; email: string }) {
  const subject = "Şifreniz güncellendi";
  const text = [
    `Merhaba ${input.name},`,
    "",
    "Hesap şifreniz değiştirildi. Bu işlemi siz yapmadıysanız hemen destek ile iletişime geçin.",
    "",
    "Elit Detailing",
  ].join("\n");
  return { to: input.email, subject, text, kind: "password-changed" as const };
}

export function buildEmailVerifyEmail(input: { name: string; email: string; verifyUrl: string }) {
  const subject = "E-posta adresinizi doğrulayın";
  const text = [
    `Merhaba ${input.name},`,
    "",
    "E-posta adresinizi doğrulamak için:",
    input.verifyUrl,
    "",
    "Elit Detailing",
  ].join("\n");
  return { to: input.email, subject, text, kind: "email-verify" as const, meta: { verifyUrl: input.verifyUrl } };
}

export function buildAppointmentReceiptEmail(input: {
  name: string;
  email: string;
  serviceName: string;
  date: string;
  time: string;
  plate: string;
  amount: number;
  discovery?: boolean;
  refId: string;
}) {
  const subject = input.discovery
    ? `Keşif randevusu — ${input.date} ${input.time}`
    : `Randevu özeti — ${input.date} ${input.time}`;
  const text = [
    `Merhaba ${input.name},`,
    "",
    `Hizmet: ${input.serviceName}`,
    `Tarih: ${input.date} ${input.time}`,
    `Plaka: ${input.plate}`,
    input.discovery ? "Ödeme: Keşif sonrası iyzico linki" : `Tutar: ${input.amount} ₺`,
    `Kod: ${input.refId}`,
    "",
    "Süreç, randevu saatiyle değil tesis giriş onayı ile başlar.",
    "Takip: https://www.elitdetailing.com/taleplerim",
    "",
    "Elit Detailing",
  ].join("\n");
  return { to: input.email, subject, text, kind: "appointment-receipt" as const };
}

export function buildPaymentReceiptEmail(input: {
  name: string;
  email: string;
  title: string;
  amount: number;
  refId: string;
  providerPaymentId?: string;
}) {
  const subject = `Ödeme makbuzu — ${input.amount} ₺`;
  const text = [
    `Merhaba ${input.name},`,
    "",
    `Ödeme alındı: ${input.title}`,
    `Tutar: ${input.amount} ₺`,
    `Ref: ${input.refId}`,
    input.providerPaymentId ? `Sağlayıcı: ${input.providerPaymentId}` : "",
    "",
    "Elit Detailing",
  ]
    .filter(Boolean)
    .join("\n");
  return { to: input.email, subject, text, kind: "payment-receipt" as const };
}

export function buildCouponEmail(input: { name: string; email: string; code: string; title: string; rule: string }) {
  const subject = `Kuponunuz: ${input.code}`;
  const text = [
    `Merhaba ${input.name},`,
    "",
    `${input.title}`,
    `Kod: ${input.code}`,
    input.rule,
    "",
    "Kuponlar: https://www.elitdetailing.com/kuponlar",
    "",
    "Elit Detailing",
  ].join("\n");
  return { to: input.email, subject, text, kind: "coupon" as const };
}

export function buildCampaignEmail(input: { name: string; email: string; title: string; blurb: string }) {
  const subject = input.title;
  const text = [
    `Merhaba ${input.name},`,
    "",
    input.blurb,
    "",
    "Kampanyalar: https://www.elitdetailing.com/kampanyalar",
    "",
    "Elit Detailing",
  ].join("\n");
  return { to: input.email, subject, text, kind: "campaign" as const };
}

export function buildAccessoryOrderEmail(input: {
  name: string;
  email: string;
  orderId: string;
  items: string;
  total: number;
}) {
  const subject = `Aksesuar siparişi — ${input.orderId}`;
  const text = [
    `Merhaba ${input.name},`,
    "",
    `Siparişiniz alındı: ${input.items}`,
    `Tutar: ${input.total} ₺`,
    `Kod: ${input.orderId}`,
    "",
    "Hazır olunca WhatsApp ile bilgilendirileceksiniz.",
    "Taleplerim: https://www.elitdetailing.com/taleplerim",
    "",
    "Elit Detailing",
  ].join("\n");
  return { to: input.email, subject, text, kind: "accessory-order" as const };
}

export function buildAccountChangedEmail(input: {
  name: string;
  email: string;
  changes: string;
}) {
  const subject = "Hesap bilgileriniz güncellendi";
  const text = [
    `Merhaba ${input.name},`,
    "",
    `Güncellenen alanlar: ${input.changes}`,
    "",
    "Bu değişikliği siz yapmadıysanız destek ile iletişime geçin.",
    "",
    "Elit Detailing",
  ].join("\n");
  return { to: input.email, subject, text, kind: "account-changed" as const };
}

/** Client-side enqueue — hits /api/email (mock without keys). */
export async function sendEmailClient(payload: EmailPayload): Promise<EmailSendResult> {
  try {
    const res = await fetch("/api/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = (await res.json()) as EmailSendResult;
    return json;
  } catch {
    return { ok: false, mode: "mock", id: "err", error: "network" };
  }
}
