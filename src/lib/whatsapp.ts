export function toWhatsAppE164(phone: string) {
  const d = phone.replace(/\D/g, "");
  if (d.startsWith("90") && d.length >= 12) return d;
  if (d.startsWith("0") && d.length === 11) return `90${d.slice(1)}`;
  if (d.length === 10) return `90${d}`;
  return d;
}

export function waMeUrl(phone: string, text: string) {
  return `https://wa.me/${toWhatsAppE164(phone)}?text=${encodeURIComponent(text)}`;
}

export function statusWhatsAppText(opts: { plate: string; service: string; body: string }) {
  return `Elit Detailing\n${opts.plate} · ${opts.service}\n${opts.body}\nTakip: elitdetailing — Taleplerim / İş takibi`;
}
