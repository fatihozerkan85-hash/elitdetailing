import { uid } from "./format";
import type { Accessory, Coupon, Customer, Service, Vehicle } from "./types";

export function normalizePhone(phone: string) {
  return phone.replace(/\D/g, "");
}

export function makeVehicle(plate: string, label: string, id?: string): Vehicle {
  return {
    id: id || uid("vh").toLowerCase(),
    plate: plate.toUpperCase().trim() || "—",
    label: label.trim() || "Araç",
  };
}

export function hydrateCustomer(raw: Partial<Customer> & { id: string; name: string; phone: string }): Customer {
  const plate = (raw.plate || "").toUpperCase().trim() || "—";
  const vehicle = raw.vehicle?.trim() || "—";
  let vehicles = Array.isArray(raw.vehicles) ? raw.vehicles.map((v) => ({
    id: v.id || uid("vh").toLowerCase(),
    plate: (v.plate || "").toUpperCase().trim() || "—",
    label: v.label?.trim() || "Araç",
  })) : [];
  if (!vehicles.length && (plate !== "—" || vehicle !== "—")) {
    vehicles = [makeVehicle(plate, vehicle, `vh-${raw.id}`)];
  }
  const activeVehicleId =
    (raw.activeVehicleId && vehicles.some((v) => v.id === raw.activeVehicleId) && raw.activeVehicleId) ||
    vehicles[0]?.id;
  const active = vehicles.find((v) => v.id === activeVehicleId) || vehicles[0];
  return {
    id: raw.id,
    name: raw.name,
    phone: raw.phone,
    email: raw.email,
    passwordHash: raw.passwordHash,
    emailVerified: raw.emailVerified,
    resetToken: raw.resetToken,
    resetTokenExpires: raw.resetTokenExpires,
    plate: active?.plate || plate,
    vehicle: active?.label || vehicle,
    vehicles,
    activeVehicleId: active?.id,
  };
}

export function withActiveVehicle(customer: Customer, vehicleId: string): Customer {
  const active = customer.vehicles.find((v) => v.id === vehicleId) || customer.vehicles[0];
  if (!active) return customer;
  return {
    ...customer,
    activeVehicleId: active.id,
    plate: active.plate,
    vehicle: active.label,
  };
}

export function upsertCustomer(
  customers: Customer[],
  input: { name: string; phone: string; plate: string; vehicle: string; email?: string },
): { customers: Customer[]; customer: Customer } {
  const digits = normalizePhone(input.phone);
  const plate = input.plate.toUpperCase().trim();
  const existing = customers.find((c) => normalizePhone(c.phone) === digits);
  if (existing) {
    let vehicles = existing.vehicles?.length
      ? [...existing.vehicles]
      : hydrateCustomer(existing).vehicles;
    if (plate && plate !== "—") {
      const hit = vehicles.find((v) => v.plate.toUpperCase() === plate);
      if (hit) {
        vehicles = vehicles.map((v) =>
          v.id === hit.id ? { ...v, label: input.vehicle.trim() || v.label } : v,
        );
      } else {
        vehicles = [makeVehicle(plate, input.vehicle || "Araç"), ...vehicles];
      }
    }
    let customer = hydrateCustomer({
      ...existing,
      name: input.name.trim() || existing.name,
      phone: input.phone.trim() || existing.phone,
      email: input.email ?? existing.email,
      vehicles,
      plate: plate || existing.plate,
      vehicle: input.vehicle.trim() || existing.vehicle,
    });
    if (plate) {
      const match = customer.vehicles.find((v) => v.plate === plate);
      if (match) customer = withActiveVehicle(customer, match.id);
    }
    return {
      customers: customers.map((c) => (c.id === existing.id ? customer : c)),
      customer,
    };
  }
  const first = makeVehicle(plate || "—", input.vehicle.trim() || "Araç");
  const customer = hydrateCustomer({
    id: uid("c").toLowerCase(),
    name: input.name.trim() || "Müşteri",
    phone: input.phone.trim(),
    email: input.email,
    plate: first.plate,
    vehicle: first.label,
    vehicles: [first],
    activeVehicleId: first.id,
  });
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
