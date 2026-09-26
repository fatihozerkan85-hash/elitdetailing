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

const SITE = "https://www.elitdetailing.com";
const LOGO = "https://elitdetailing.vercel.app/branding/elit-logo-tr.png";

const COLORS = {
  bg: "#080808",
  card: "#12141a",
  border: "rgba(201,168,76,0.28)",
  gold: "#c9a84c",
  goldSoft: "#e8d5a3",
  cream: "#f0e6c8",
  muted: "rgba(240,230,200,0.62)",
  faint: "rgba(240,230,200,0.4)",
  buttonBg: "#c9a84c",
  buttonText: "#120e06",
};

export function emailConfigured() {
  return Boolean(process.env.RESEND_API_KEY);
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function rowsHtml(rows: { label: string; value: string }[]) {
  return rows
    .map(
      (r) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid rgba(201,168,76,0.12);font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:${COLORS.faint};width:38%;vertical-align:top;">${escapeHtml(r.label)}</td>
        <td style="padding:10px 0;border-bottom:1px solid rgba(201,168,76,0.12);font-family:Arial,Helvetica,sans-serif;font-size:15px;color:${COLORS.cream};vertical-align:top;">${escapeHtml(r.value)}</td>
      </tr>`,
    )
    .join("");
}

type LayoutInput = {
  preheader?: string;
  eyebrow?: string;
  title: string;
  greeting: string;
  bodyHtml: string;
  cta?: { label: string; href: string };
  footnote?: string;
};

/** Branded dark/gold Elit Detailing shell — table + inline CSS for mail clients. */
export function brandEmailHtml(input: LayoutInput) {
  const pre = escapeHtml(input.preheader || input.title);
  const cta = input.cta
    ? `
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:28px 0 8px;">
        <tr>
          <td style="border-radius:8px;background:${COLORS.buttonBg};">
            <a href="${escapeHtml(input.cta.href)}" style="display:inline-block;padding:14px 28px;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;text-decoration:none;color:${COLORS.buttonText};">${escapeHtml(input.cta.label)}</a>
          </td>
        </tr>
      </table>`
    : "";

  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${escapeHtml(input.title)}</title>
  <!--[if mso]><style>body,table,td{font-family:Arial,Helvetica,sans-serif!important;}</style><![endif]-->
</head>
<body style="margin:0;padding:0;background:${COLORS.bg};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${pre}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${COLORS.bg};">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background:${COLORS.card};border:1px solid ${COLORS.border};border-radius:16px;overflow:hidden;">
          <tr>
            <td style="padding:0;background:linear-gradient(180deg, rgba(201,168,76,0.16) 0%, ${COLORS.card} 100%);">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="padding:28px 28px 12px;">
                    <img src="${LOGO}" width="88" height="88" alt="Elit Detailing" style="display:block;width:88px;height:auto;border:0;" />
                    <div style="margin-top:14px;font-family:Georgia,'Times New Roman',serif;font-size:22px;letter-spacing:0.28em;text-transform:uppercase;color:${COLORS.gold};font-weight:700;">ELIT</div>
                    <div style="margin-top:4px;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.36em;text-transform:uppercase;color:rgba(201,168,76,0.55);font-weight:600;">DETAILING</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 28px 32px;">
              ${
                input.eyebrow
                  ? `<p style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:${COLORS.gold};">${escapeHtml(input.eyebrow)}</p>`
                  : ""
              }
              <h1 style="margin:0 0 18px;font-family:Georgia,'Times New Roman',serif;font-size:26px;line-height:1.25;font-weight:700;color:${COLORS.cream};">${escapeHtml(input.title)}</h1>
              <p style="margin:0 0 16px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:${COLORS.muted};">Merhaba <span style="color:${COLORS.goldSoft};">${escapeHtml(input.greeting)}</span>,</p>
              <div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.65;color:${COLORS.muted};">${input.bodyHtml}</div>
              ${cta}
              ${
                input.footnote
                  ? `<p style="margin:24px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.55;color:${COLORS.faint};">${escapeHtml(input.footnote)}</p>`
                  : ""
              }
            </td>
          </tr>
          <tr>
            <td style="padding:18px 28px;border-top:1px solid rgba(201,168,76,0.18);background:#0b0c0e;">
              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:${COLORS.faint};">Elit Oto Detailing · Ankara</p>
              <p style="margin:8px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;">
                <a href="${SITE}" style="color:${COLORS.gold};text-decoration:none;">www.elitdetailing.com</a>
                &nbsp;·&nbsp;
                <a href="${SITE}/taleplerim" style="color:${COLORS.gold};text-decoration:none;">Taleplerim</a>
                &nbsp;·&nbsp;
                <a href="${SITE}/profil" style="color:${COLORS.gold};text-decoration:none;">Profil</a>
              </p>
            </td>
          </tr>
        </table>
        <p style="margin:18px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;color:rgba(240,230,200,0.28);">Bu mesaj Elit Detailing hesabınızla ilişkilidir.</p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function p(text: string) {
  return `<p style="margin:0 0 14px;color:${COLORS.muted};">${escapeHtml(text)}</p>`;
}

function payload(
  kind: EmailKind,
  to: string,
  subject: string,
  text: string,
  html: string,
  meta?: Record<string, string>,
): EmailPayload {
  return { to, subject, text, html, kind, meta };
}

export function buildWelcomeEmail(input: { name: string; email: string }) {
  const subject = "Elit Detailing’e hoş geldiniz";
  const text = [
    `Merhaba ${input.name},`,
    "",
    "Hesabınız oluşturuldu. Randevu, yol yardım ve aksesuar işlemlerinizde bilgileriniz otomatik gelecek.",
    "",
    `Profil: ${SITE}/profil`,
    "",
    "Elit Detailing",
  ].join("\n");
  const html = brandEmailHtml({
    preheader: "Hesabınız hazır — premium bakım paneline hoş geldiniz.",
    eyebrow: "Hoş geldiniz",
    title: "Hesabınız hazır",
    greeting: input.name,
    bodyHtml: [
      p("Elit Detailing müşteri panelinize kaydınız tamamlandı."),
      p("Randevu, yol yardım ve aksesuar işlemlerinde adınız, telefonunuz ve araçlarınız otomatik gelir."),
      p("Süreç bildirimleri WhatsApp’tan; makbuz ve hesap mailleri e-posta ile gelir."),
    ].join(""),
    cta: { label: "Profile git", href: `${SITE}/profil` },
  });
  return payload("welcome", input.email, subject, text, html);
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
  const html = brandEmailHtml({
    preheader: "Şifre sıfırlama bağlantınız 30 dakika geçerlidir.",
    eyebrow: "Güvenlik",
    title: "Şifrenizi sıfırlayın",
    greeting: input.name,
    bodyHtml: [
      p("Hesabınız için şifre sıfırlama talebi aldık. Aşağıdaki düğmeyle yeni şifrenizi belirleyebilirsiniz."),
      p("Bağlantı 30 dakika geçerlidir."),
    ].join(""),
    cta: { label: "Yeni şifre belirle", href: input.resetUrl },
    footnote: "Bu talebi siz yapmadıysanız bu e-postayı yok sayın. Şifreniz değişmez.",
  });
  return payload("password-reset", input.email, subject, text, html, { resetUrl: input.resetUrl });
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
  const html = brandEmailHtml({
    preheader: "Hesap şifreniz güncellendi.",
    eyebrow: "Güvenlik",
    title: "Şifreniz güncellendi",
    greeting: input.name,
    bodyHtml: p("Hesap şifreniz başarıyla değiştirildi. Bu işlemi siz yapmadıysanız hemen destek ile iletişime geçin."),
    cta: { label: "Giriş yap", href: `${SITE}/giris` },
  });
  return payload("password-changed", input.email, subject, text, html);
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
  const html = brandEmailHtml({
    preheader: "E-posta adresinizi bir tıkla doğrulayın.",
    eyebrow: "Doğrulama",
    title: "E-postanızı onaylayın",
    greeting: input.name,
    bodyHtml: p("Hesabınızı güvenceye almak için e-posta adresinizi doğrulayın."),
    cta: { label: "E-postayı doğrula", href: input.verifyUrl },
  });
  return payload("email-verify", input.email, subject, text, html, { verifyUrl: input.verifyUrl });
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
    `Takip: ${SITE}/taleplerim`,
    "",
    "Elit Detailing",
  ].join("\n");
  const html = brandEmailHtml({
    preheader: `${input.serviceName} · ${input.date} ${input.time}`,
    eyebrow: input.discovery ? "Keşif randevusu" : "Randevu özeti",
    title: input.discovery ? "Keşif kaydınız alındı" : "Randevunuz onaylandı",
    greeting: input.name,
    bodyHtml: `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 16px;">
        ${rowsHtml([
          { label: "Hizmet", value: input.serviceName },
          { label: "Tarih", value: `${input.date} ${input.time}` },
          { label: "Plaka", value: input.plate },
          {
            label: "Ödeme",
            value: input.discovery ? "Keşif sonrası iyzico linki" : `${input.amount} ₺`,
          },
          { label: "Kod", value: input.refId },
        ])}
      </table>
      ${p("Süreç, randevu saatiyle değil tesis giriş onayı ile başlar.")}
    `,
    cta: { label: "Taleplerim", href: `${SITE}/taleplerim` },
  });
  return payload("appointment-receipt", input.email, subject, text, html);
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
  const detailRows = [
    { label: "İşlem", value: input.title },
    { label: "Tutar", value: `${input.amount} ₺` },
    { label: "Ref", value: input.refId },
  ];
  if (input.providerPaymentId) detailRows.push({ label: "Sağlayıcı", value: input.providerPaymentId });
  const html = brandEmailHtml({
    preheader: `Ödeme alındı · ${input.amount} ₺`,
    eyebrow: "iyzico makbuzu",
    title: "Ödemeniz alındı",
    greeting: input.name,
    bodyHtml: `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 16px;">
        ${rowsHtml(detailRows)}
      </table>
      ${p("Teşekkürler. Makbuz kaydınız Taleplerim’de de görünür.")}
    `,
    cta: { label: "Taleplerim", href: `${SITE}/taleplerim` },
  });
  return payload("payment-receipt", input.email, subject, text, html);
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
    `Kuponlar: ${SITE}/kuponlar`,
    "",
    "Elit Detailing",
  ].join("\n");
  const html = brandEmailHtml({
    preheader: `Kupon kodunuz: ${input.code}`,
    eyebrow: "Kupon",
    title: input.title,
    greeting: input.name,
    bodyHtml: `
      <div style="margin:12px 0 18px;padding:18px;border:1px dashed ${COLORS.border};border-radius:12px;text-align:center;background:rgba(201,168,76,0.06);">
        <div style="font-family:Georgia,'Times New Roman',serif;font-size:28px;letter-spacing:0.18em;color:${COLORS.gold};font-weight:700;">${escapeHtml(input.code)}</div>
        <div style="margin-top:8px;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:${COLORS.muted};">${escapeHtml(input.rule)}</div>
      </div>
      ${p("Randevu veya aksesuar ödemesinde kodu kullanabilirsiniz.")}
    `,
    cta: { label: "Kuponlarım", href: `${SITE}/kuponlar` },
  });
  return payload("coupon", input.email, subject, text, html);
}

export function buildCampaignEmail(input: { name: string; email: string; title: string; blurb: string }) {
  const subject = input.title;
  const text = [
    `Merhaba ${input.name},`,
    "",
    input.blurb,
    "",
    `Kampanyalar: ${SITE}/kampanyalar`,
    "",
    "Elit Detailing",
  ].join("\n");
  const html = brandEmailHtml({
    preheader: input.blurb.slice(0, 90),
    eyebrow: "Kampanya",
    title: input.title,
    greeting: input.name,
    bodyHtml: p(input.blurb),
    cta: { label: "Kampanyaları gör", href: `${SITE}/kampanyalar` },
  });
  return payload("campaign", input.email, subject, text, html);
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
    `Taleplerim: ${SITE}/taleplerim`,
    "",
    "Elit Detailing",
  ].join("\n");
  const html = brandEmailHtml({
    preheader: `Sipariş ${input.orderId} alındı`,
    eyebrow: "Aksesuar",
    title: "Siparişiniz alındı",
    greeting: input.name,
    bodyHtml: `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 16px;">
        ${rowsHtml([
          { label: "Ürünler", value: input.items },
          { label: "Tutar", value: `${input.total} ₺` },
          { label: "Kod", value: input.orderId },
        ])}
      </table>
      ${p("Hazır olunca WhatsApp ile bilgilendirileceksiniz.")}
    `,
    cta: { label: "Taleplerim", href: `${SITE}/taleplerim` },
  });
  return payload("accessory-order", input.email, subject, text, html);
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
  const html = brandEmailHtml({
    preheader: `Güncellenen alanlar: ${input.changes}`,
    eyebrow: "Hesap",
    title: "Bilgileriniz güncellendi",
    greeting: input.name,
    bodyHtml: `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 16px;">
        ${rowsHtml([{ label: "Alanlar", value: input.changes }])}
      </table>
      ${p("Bu değişikliği siz yapmadıysanız destek ile iletişime geçin.")}
    `,
    cta: { label: "Profil", href: `${SITE}/profil` },
  });
  return payload("account-changed", input.email, subject, text, html);
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
