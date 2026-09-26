import { uid } from "./format";
import type { Accessory, Coupon, Customer, Service } from "./types";

export function normalizePhone(phone: string) {
  return phone.replace(/\D/g, "");
}

export function upsertCustomer(
  customers: Customer[],
  input: { name: string; phone: string; plate: string; vehicle: string },
): { customers: Customer[]; customer: Customer } {
  const digits = normalizePhone(input.phone);
  const plate = input.plate.toUpperCase().trim();
  const existing = customers.find(
    (c) => normalizePhone(c.phone) === digits || (plate && c.plate.toUpperCase() === plate),
  );
  if (existing) {
    const customer: Customer = {
      ...existing,
      name: input.name.trim() || existing.name,
      phone: input.phone.trim() || existing.phone,
      plate: plate || existing.plate,
      vehicle: input.vehicle.trim() || existing.vehicle,
    };
    return {
      customers: customers.map((c) => (c.id === existing.id ? customer : c)),
      customer,
    };
  }
  const customer: Customer = {
    id: uid("c").toLowerCase(),
    name: input.name.trim() || "Müşteri",
    phone: input.phone.trim(),
    plate: plate || "—",
    vehicle: input.vehicle.trim() || "—",
  };
  return { customers: [customer, ...customers], customer };
}

/** Parse % or fixed ₺ from coupon rule/code; prefer explicit fields. */
export function couponOffAmount(coupon: Coupon, baseAmount: number): number {
  if (baseAmount <= 0) return 0;
  if (coupon.discountAmount != null && coupon.discountAmount > 0) {
    return Math.min(baseAmount, coupon.discountAmount);
  }
  if (coupon.discountPercent != null && coupon.discountPercent > 0) {
    return Math.round((baseAmount * coupon.discountPercent) / 100);
  }
  const fromCode = coupon.code.match(/(\d+)/);
  if (/ELIT|DOGUM|YUZDE|%/i.test(coupon.code + coupon.rule) && fromCode) {
    const pct = Math.min(90, Number(fromCode[1]));
    if (pct > 0 && pct <= 90) return Math.round((baseAmount * pct) / 100);
  }
  const rulePct = coupon.rule.match(/%\s*(\d+)|(\d+)\s*%/);
  if (rulePct) {
    const pct = Number(rulePct[1] || rulePct[2]);
    if (pct > 0 && pct <= 90) return Math.round((baseAmount * pct) / 100);
  }
  const ruleTl = coupon.rule.match(/(\d+)\s*₺|₺\s*(\d+)/);
  if (ruleTl) {
    const amt = Number(ruleTl[1] || ruleTl[2]);
    if (amt > 0) return Math.min(baseAmount, amt);
  }
  return 0;
}

export function inferDiscountPercent(code: string, rule: string): number | undefined {
  const blob = `${code} ${rule}`;
  const m = blob.match(/%\s*(\d+)|(\d+)\s*%/);
  if (m) return Math.min(90, Number(m[1] || m[2]));
  if (/ELIT20/i.test(code)) return 20;
  if (/DOGUM15/i.test(code)) return 15;
  if (/YIKA21/i.test(code)) return 10;
  return undefined;
}

export function findService(
  services: Service[] | undefined,
  serviceId: string,
  fallback: Service[],
): Service | undefined {
  return services?.find((s) => s.id === serviceId) || fallback.find((s) => s.id === serviceId);
}

export function cloneAccessories(list: Accessory[]): Accessory[] {
  return list.map((a) => ({ ...a }));
}
