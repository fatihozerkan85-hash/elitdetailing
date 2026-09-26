"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { ACCESSORIES, DEMO, JOB_STATUS_LABEL, ORDER_STATUS_LABEL, ROADSIDE_STATUS_LABEL, SERVICES } from "./catalog";
import { uid } from "./format";
import { cloneAccessories, couponOffAmount, hydrateCustomer, inferDiscountPercent, makeVehicle, upsertCustomer, withActiveVehicle } from "./ops";
import { jobClock, hydrateJob, segmentsFor } from "./process";
import { buildSeed } from "./seed";
import { buildDefaultCms, type SiteCms } from "./site-cms";
import { statusWhatsAppText, waMeUrl } from "./whatsapp";
import type {
  Accessory,
  AccessoryOrder,
  Appointment,
  AppState,
  CartLine,
  Coupon,
  Customer,
  InboxItem,
  Job,
  JobStatus,
  Notification,
  PaymentRecord,
  RoadsideCall,
  RoadsideStatus,
  Session,
  Technician,
  Vehicle,
} from "./types";

const KEY = "elit-detailing-v4";

type PaidCheckoutInput = {
  conversationId: string;
  providerPaymentId?: string;
  provider?: "iyzico" | "mock";
  amount: number;
  title: string;
  kind: PaymentRecord["kind"];
  buyerName: string;
  buyerPhone: string;
  payload: Record<string, unknown>;
};

type Store = AppState & {
  ready: boolean;
  loginCustomer: (phone: string) => boolean;
  registerCustomer: (input: {
    name: string;
    phone: string;
    email?: string;
    plate: string;
    vehicle: string;
  }) => Customer;
  updateCustomerProfile: (input: { name?: string; phone?: string; email?: string }) => void;
  addVehicle: (input: { plate: string; label: string }) => Vehicle | null;
  removeVehicle: (vehicleId: string) => void;
  setActiveVehicle: (vehicleId: string) => void;
  loginOwner: (pin: string) => boolean;
  logout: () => void;
  reset: () => void;
  createAppointment: (input: {
    name: string;
    phone: string;
    plate: string;
    vehicle: string;
    serviceId: string;
    date: string;
    time: string;
    notes: string;
    /** Keşif randevusu — ödeme yok */
    discovery?: boolean;
    amount?: number;
    paymentId?: string;
    paymentStatus?: Appointment["paymentStatus"];
    status?: Appointment["status"];
  }) => Appointment;
  createRoadside: (input: {
    name: string;
    phone: string;
    plate: string;
    vehicle: string;
    location: string;
    lat?: number;
    lng?: number;
    accuracyM?: number;
    issue: string;
    urgency: RoadsideCall["urgency"];
  }) => RoadsideCall;
  createAccessoryOrder: (input: {
    name: string;
    phone: string;
    accessoryId: string;
    qty: number;
    notes: string;
    paymentId?: string;
    paymentStatus?: AccessoryOrder["paymentStatus"];
    lines?: { accessoryId: string; qty: number }[];
  }) => AccessoryOrder | null;
  addToCart: (accessoryId: string, qty?: number) => void;
  setCartQty: (accessoryId: string, qty: number) => void;
  removeFromCart: (accessoryId: string) => void;
  clearCart: () => void;
  fulfillPaidCheckout: (input: PaidCheckoutInput) => { payment: PaymentRecord; refId: string };
  markRefPaid: (input: {
    kind: PaymentRecord["kind"];
    refId: string;
    amount: number;
    conversationId: string;
    providerPaymentId?: string;
    provider?: "iyzico" | "mock";
    title: string;
    customerName: string;
    phone: string;
  }) => PaymentRecord;
  updateJobStatus: (id: string, status: JobStatus, note?: string) => void;
  checkInJob: (id: string) => void;
  checkInAppointment: (appointmentId: string) => void;
  updateRoadsideStatus: (id: string, status: RoadsideStatus, note?: string) => void;
  updateAppointmentStatus: (id: string, status: Appointment["status"]) => void;
  updateOrderStatus: (id: string, status: AccessoryOrder["status"]) => void;
  markInboxRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  claimCoupon: (code: string) => boolean;
  setNotifPrefs: (p: { campaignNotif?: boolean; couponNotif?: boolean }) => void;
  setCms: (cms: SiteCms) => void;
  patchCms: (patch: Partial<SiteCms>) => void;
  createOwnerCoupon: (input: {
    code: string;
    title: string;
    rule: string;
    expires: string;
    customerId?: string;
    discountPercent?: number;
    discountAmount?: number;
  }) => Coupon;
  deleteCoupon: (id: string) => void;
  updateCouponStatus: (id: string, status: Coupon["status"]) => void;
  redeemCoupon: (code: string, baseAmount: number, customerId?: string) => {
    coupon: Coupon;
    discount: number;
    amount: number;
  } | null;
  markCouponUsed: (id: string) => void;
  saveCustomer: (input: Partial<Customer> & { name: string; phone: string }) => Customer;
  deleteCustomer: (id: string) => void;
  saveTechnician: (input: Partial<Technician> & { name: string; role: string }) => Technician;
  deleteTechnician: (id: string) => void;
  assignTechnician: (refId: string, technicianId: string) => void;
  saveAccessory: (input: Partial<Accessory> & { name: string; price: number }) => Accessory;
  deleteAccessory: (id: string) => void;
  setAccessoryStock: (id: string, stock: number) => void;
  updateJobEstimate: (id: string, estimate: number, notes?: string) => void;
  enqueueWhatsApp: (input: { phone: string; text: string; jobId?: string; open?: boolean }) => string;
};

const Ctx = createContext<Store | null>(null);

function persist(state: AppState) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

function pushInbox(
  inbox: InboxItem[],
  item: Omit<InboxItem, "id" | "unread" | "createdAt"> & { createdAt?: string },
): InboxItem[] {
  const row: InboxItem = {
    id: uid("INB"),
    unread: true,
    createdAt: item.createdAt ?? new Date().toISOString(),
    ...item,
  };
  return [row, ...inbox];
}

function notify(
  list: Notification[],
  n: Omit<Notification, "id" | "at" | "read"> & { audience?: Notification["audience"] },
): Notification[] {
  const audience =
    n.audience ??
    (n.href.startsWith("/yonetici") || n.href.startsWith("/panel") ? "owner" : "customer");
  return [
    { id: uid("NT"), at: new Date().toISOString(), read: false, ...n, audience },
    ...list,
  ];
}

function pushWhatsApp(
  outbox: AppState["whatsappOutbox"],
  input: { phone: string; text: string; jobId?: string },
) {
  const item = {
    id: uid("WA"),
    phone: input.phone,
    text: input.text,
    url: waMeUrl(input.phone, input.text),
    jobId: input.jobId,
    at: new Date().toISOString(),
    status: "queued" as const,
  };
  if (typeof fetch !== "undefined") {
    void fetch("/api/whatsapp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: input.phone, text: input.text }),
    }).catch(() => undefined);
  }
  return { outbox: [item, ...outbox], item };
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => buildSeed());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      try {
        const raw = localStorage.getItem(KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as Partial<AppState>;
          const seed = buildSeed();
          setState((current) => {
            const merged: AppState = {
              ...seed,
              ...parsed,
              customers: (parsed.customers ?? seed.customers).map((c) => hydrateCustomer(c)),
              jobs: (parsed.jobs ?? seed.jobs).map((j) =>
                hydrateJob({
                  ...(j as Job),
                  paymentStatus: (j as Job).paymentStatus ?? "bekliyor",
                }),
              ),
              appointments: (parsed.appointments ?? seed.appointments).map((a) => ({
                ...a,
                paymentStatus: a.paymentStatus ?? ("bekliyor" as const),
                amount: a.amount ?? 0,
              })),
              roadside: (parsed.roadside ?? seed.roadside).map((r) => ({
                ...r,
                paymentStatus: r.paymentStatus ?? ("bekliyor" as const),
                amount: r.amount ?? 0,
              })),
              accessoryOrders: (parsed.accessoryOrders ?? seed.accessoryOrders).map((o) => ({
                ...o,
                paymentStatus: o.paymentStatus ?? ("bekliyor" as const),
              })),
              payments: parsed.payments ?? seed.payments ?? [],
              cart: parsed.cart ?? [],
              accessories: parsed.accessories?.length
                ? parsed.accessories
                : cloneAccessories(ACCESSORIES),
              cms: { ...buildDefaultCms(), ...(parsed.cms ?? {}), banners: parsed.cms?.banners ?? seed.cms.banners, ticker: parsed.cms?.ticker ?? seed.cms.ticker, homeServices: parsed.cms?.homeServices ?? seed.cms.homeServices, campaigns: parsed.cms?.campaigns ?? seed.cms.campaigns, services: parsed.cms?.services ?? seed.cms.services, texts: parsed.cms?.texts ?? seed.cms.texts, forms: parsed.cms?.forms ?? seed.cms.forms },
              whatsappOutbox: parsed.whatsappOutbox ?? [],
              coupons: (parsed.coupons ?? seed.coupons).map((c) => ({
                ...c,
                discountPercent: c.discountPercent ?? inferDiscountPercent(c.code, c.rule),
              })),
              campaignNotif: parsed.campaignNotif ?? true,
              couponNotif: parsed.couponNotif ?? true,
              session: current.session.role !== "guest" ? current.session : (parsed.session ?? seed.session),
            };
            return merged;
          });
        }
      } catch {
        /* keep seed */
      }
      setReady(true);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (ready) persist(state);
  }, [ready, state]);

  const loginCustomer = useCallback((phone: string) => {
    const digits = phone.replace(/\D/g, "");
    let ok = false;
    setState((s) => {
      const found = s.customers.map(hydrateCustomer).find((c) => c.phone.replace(/\D/g, "") === digits);
      if (!found) return s;
      ok = true;
      const session: Session = { role: "customer", customerId: found.id, name: found.name };
      return { ...s, session, customers: s.customers.map((c) => (c.id === found.id ? found : hydrateCustomer(c))) };
    });
    return ok;
  }, []);

  const registerCustomer = useCallback<Store["registerCustomer"]>((input) => {
    let created!: Customer;
    setState((s) => {
      const { customers, customer } = upsertCustomer(s.customers.map(hydrateCustomer), {
        name: input.name,
        phone: input.phone,
        email: input.email,
        plate: input.plate,
        vehicle: input.vehicle,
      });
      created = customer;
      return {
        ...s,
        customers,
        session: { role: "customer" as const, customerId: customer.id, name: customer.name },
      };
    });
    return created;
  }, []);

  const updateCustomerProfile = useCallback<Store["updateCustomerProfile"]>((input) => {
    setState((s) => {
      if (!s.session.customerId) return s;
      return {
        ...s,
        customers: s.customers.map((c) => {
          if (c.id !== s.session.customerId) return c;
          const next = hydrateCustomer({
            ...c,
            name: input.name?.trim() || c.name,
            phone: input.phone?.trim() || c.phone,
            email: input.email !== undefined ? input.email : c.email,
          });
          return next;
        }),
        session: {
          ...s.session,
          name: input.name?.trim() || s.session.name,
        },
      };
    });
  }, []);

  const addVehicle = useCallback<Store["addVehicle"]>((input) => {
    let added: Vehicle | null = null;
    setState((s) => {
      if (!s.session.customerId) return s;
      const plate = input.plate.toUpperCase().trim();
      if (!plate) return s;
      return {
        ...s,
        customers: s.customers.map((c) => {
          if (c.id !== s.session.customerId) return c;
          const base = hydrateCustomer(c);
          if (base.vehicles.some((v) => v.plate === plate)) {
            const existing = base.vehicles.find((v) => v.plate === plate)!;
            added = existing;
            return withActiveVehicle(base, existing.id);
          }
          const v = makeVehicle(plate, input.label);
          added = v;
          return withActiveVehicle(
            { ...base, vehicles: [v, ...base.vehicles] },
            v.id,
          );
        }),
      };
    });
    return added;
  }, []);

  const removeVehicle = useCallback((vehicleId: string) => {
    setState((s) => {
      if (!s.session.customerId) return s;
      return {
        ...s,
        customers: s.customers.map((c) => {
          if (c.id !== s.session.customerId) return c;
          const base = hydrateCustomer(c);
          if (base.vehicles.length <= 1) return base;
          const vehicles = base.vehicles.filter((v) => v.id !== vehicleId);
          const next = { ...base, vehicles };
          const keep =
            base.activeVehicleId === vehicleId ? vehicles[0]!.id : base.activeVehicleId || vehicles[0]!.id;
          return withActiveVehicle(next, keep);
        }),
      };
    });
  }, []);

  const setActiveVehicle = useCallback((vehicleId: string) => {
    setState((s) => {
      if (!s.session.customerId) return s;
      return {
        ...s,
        customers: s.customers.map((c) =>
          c.id === s.session.customerId ? withActiveVehicle(hydrateCustomer(c), vehicleId) : c,
        ),
      };
    });
  }, []);

  const loginOwner = useCallback((pin: string) => {
    if (pin.trim() !== DEMO.ownerPin) return false;
    setState((s) => {
      const next = { ...s, session: { role: "owner" as const, name: "İşletme sahibi" } };
      persist(next);
      return next;
    });
    return true;
  }, []);

  const logout = useCallback(() => {
    setState((s) => ({ ...s, session: { role: "guest", name: "Misafir" } }));
  }, []);

  const reset = useCallback(() => {
    const next = buildSeed();
    persist(next);
    setState(next);
  }, []);

  const createAppointment = useCallback<Store["createAppointment"]>((input) => {
    let created!: Appointment;
    setState((s) => {
      const service =
        s.cms.services.find((x) => x.id === input.serviceId && x.active) ||
        SERVICES.find((x) => x.id === input.serviceId);
      if (!service) return s;
      const { customers, customer } = upsertCustomer(s.customers, {
        name: input.name,
        phone: input.phone,
        plate: input.plate,
        vehicle: input.vehicle,
      });
      const discovery = input.discovery ?? ("discovery" in service ? Boolean(service.discovery) : service.id === "boya-koruma");
      const amount = input.amount ?? (discovery ? 0 : service.fromPrice);
      const paymentStatus = input.paymentStatus ?? (discovery ? "kesif" : "odendi");
      const status = input.status ?? (paymentStatus === "odendi" ? "onaylandi" : "bekliyor");
      const appt: Appointment = {
        id: uid("RDV"),
        customerId: customer.id,
        customerName: input.name,
        phone: input.phone,
        plate: input.plate.toUpperCase(),
        vehicle: input.vehicle,
        serviceId: service.id,
        serviceName: service.name,
        date: input.date,
        time: input.time,
        notes: input.notes,
        status,
        paymentStatus,
        paymentId: input.paymentId,
        amount,
        createdAt: new Date().toISOString(),
      };
      created = appt;
      const job: Job = {
        id: uid("IS"),
        kind: service.category === "lastik" ? "lastik" : service.category === "detailing" ? "detailing" : "yikama",
        customerId: customer.id,
        customerName: input.name,
        phone: input.phone,
        plate: input.plate.toUpperCase(),
        vehicle: input.vehicle,
        serviceId: service.id,
        serviceName: service.name,
        notes: input.notes,
        estimate: amount || service.fromPrice,
        paymentStatus,
        paymentId: input.paymentId,
        status: "giris-bekleniyor",
        technicianId: service.category === "lastik" ? "t-ali" : service.category === "detailing" ? "t-deniz" : "t-mehmet",
        appointmentId: appt.id,
        currentSegmentIndex: -1,
        notifiedSegmentIndex: -1,
        segments: service.segments?.length ? service.segments : segmentsFor(service.id),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        timeline: [
          {
            at: new Date().toISOString(),
            status: "giris-bekleniyor",
            note: discovery
              ? `Keşif randevusu ${input.date} ${input.time}. Fiyat keşif sonrası iyzico linki ile tahsil edilir.`
              : `Randevu ${input.date} ${input.time} — iyzico ile ödendi (${amount} ₺). Saat gelmesi süreci başlatmaz; giriş onayı bekleniyor.`,
          },
        ],
      };
      return {
        ...s,
        customers,
        appointments: [appt, ...s.appointments],
        jobs: [job, ...s.jobs],
        inbox: pushInbox(s.inbox, {
          customerId: customer.id,
          kind: "randevu",
          refId: appt.id,
          title: `${service.name} randevusu — ${appt.plate}`,
          messages: [
            {
              at: new Date().toISOString(),
              from: "sistem",
              text: discovery
                ? `${input.date} ${input.time} keşif randevunuz alındı. Teklif hazır olunca Taleplerim’e iyzico ödeme linki düşer.`
                : `${input.date} ${input.time} randevunuz iyzico ile ödendi (${amount} ₺). Giriş onayından sonra süreç başlar. İş: ${job.id}.`,
            },
          ],
        }),
        notifications: notify(s.notifications, {
          title: discovery ? "Keşif randevusu" : "Ödemeli randevu",
          body: `${appt.id} · ${input.name} · ${service.name}`,
          href: `/yonetici/isler/${job.id}`,
          audience: "owner",
        }),
      };
    });
    return created;
  }, []);

  const createRoadside = useCallback<Store["createRoadside"]>((input) => {
    let created!: RoadsideCall;
    setState((s) => {
      const { customers, customer } = upsertCustomer(s.customers, {
        name: input.name,
        phone: input.phone,
        plate: input.plate,
        vehicle: input.vehicle,
      });
      const call: RoadsideCall = {
        id: uid("YY"),
        customerId: customer.id,
        customerName: input.name,
        phone: input.phone,
        plate: input.plate.toUpperCase(),
        vehicle: input.vehicle,
        location: input.location,
        lat: input.lat,
        lng: input.lng,
        accuracyM: input.accuracyM,
        issue: input.issue,
        urgency: input.urgency,
        status: "alindi",
        paymentStatus: "bekliyor",
        amount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        timeline: [
          {
            at: new Date().toISOString(),
            status: "alindi",
            note:
              input.lat != null && input.lng != null
                ? `Otomatik kayıt — GPS pin alındı. Ödeme ekibi yola çıktıktan / iş bitince iyzico linki ile.`
                : "Otomatik kayıt — ekip ataması bekleniyor. Ödeme çıkışı engellemez.",
          },
        ],
      };
      created = call;
      return {
        ...s,
        customers,
        roadside: [call, ...s.roadside],
        inbox: pushInbox(s.inbox, {
          customerId: customer.id,
          kind: "yol-yardim",
          refId: call.id,
          title: `Yol yardım — ${call.plate}`,
          messages: [
            {
              at: new Date().toISOString(),
              from: "sistem",
              text: `${call.id} alındı (${input.urgency}). ${input.lat != null && input.lng != null ? "GPS konumu eklendi. " : ""}Ekip yönlendirilir; ödeme iyzico linki ile sonradan alınır.`,
            },
          ],
        }),
        notifications: notify(s.notifications, {
          title: "Yeni yol yardım",
          body: `${call.id} · ${input.urgency} · ${input.plate}`,
          href: `/yonetici/isler/${call.id}`,
          audience: "owner",
        }),
      };
    });
    return created;
  }, []);

  const createAccessoryOrder = useCallback<Store["createAccessoryOrder"]>((input) => {
    let created: AccessoryOrder | null = null;
    setState((s) => {
      const lines = input.lines?.length
        ? input.lines
        : [{ accessoryId: input.accessoryId, qty: input.qty }];
      const catalog = s.accessories.length ? s.accessories : cloneAccessories(ACCESSORIES);
      const resolved = lines
        .map((l) => {
          const acc = catalog.find((a) => a.id === l.accessoryId);
          return acc ? { acc, qty: l.qty } : null;
        })
        .filter(Boolean) as { acc: Accessory; qty: number }[];
      if (!resolved.length) return s;
      for (const r of resolved) {
        if (r.qty > r.acc.stock) return s;
      }
      const { customers, customer } = upsertCustomer(s.customers, {
        name: input.name,
        phone: input.phone,
        plate: "",
        vehicle: "",
      });
      const primary = resolved[0]!;
      const total = resolved.reduce((sum, r) => sum + r.acc.price * r.qty, 0);
      const order: AccessoryOrder = {
        id: uid("AKS"),
        customerId: customer.id,
        customerName: input.name,
        phone: input.phone,
        accessoryId: primary.acc.id,
        accessoryName:
          resolved.length === 1
            ? primary.acc.name
            : resolved.map((r) => `${r.acc.name}×${r.qty}`).join(", "),
        qty: resolved.reduce((sum, r) => sum + r.qty, 0),
        total,
        notes: input.notes,
        status: "hazirlaniyor",
        paymentStatus: input.paymentStatus ?? "odendi",
        paymentId: input.paymentId,
        createdAt: new Date().toISOString(),
      };
      created = order;
      const accessories = catalog.map((a) => {
        const hit = resolved.find((r) => r.acc.id === a.id);
        return hit ? { ...a, stock: Math.max(0, a.stock - hit.qty) } : a;
      });
      return {
        ...s,
        customers,
        accessories,
        accessoryOrders: [order, ...s.accessoryOrders],
        cart: [],
        inbox: pushInbox(s.inbox, {
          customerId: customer.id,
          kind: "aksesuar",
          refId: order.id,
          title: `Aksesuar siparişi — ${order.accessoryName}`,
          messages: [
            {
              at: new Date().toISOString(),
              from: "sistem",
              text: `Sipariş ${order.id} iyzico ile ödendi (${total} ₺). Hazırlanınca Taleplerim güncellenir.`,
            },
          ],
        }),
        notifications: notify(s.notifications, {
          title: "Ödemeli aksesuar",
          body: `${order.id} · ${total} ₺`,
          href: "/yonetici/gelir",
          audience: "owner",
        }),
      };
    });
    return created;
  }, []);

  const addToCart = useCallback<Store["addToCart"]>((accessoryId, qty = 1) => {
    setState((s) => {
      const catalog = s.accessories.length ? s.accessories : cloneAccessories(ACCESSORIES);
      const acc = catalog.find((a) => a.id === accessoryId);
      if (!acc || acc.stock <= 0) return s;
      const exists = s.cart.find((c) => c.accessoryId === accessoryId);
      const nextQty = Math.min(acc.stock, (exists?.qty ?? 0) + qty);
      const cart: CartLine[] = exists
        ? s.cart.map((c) => (c.accessoryId === accessoryId ? { ...c, qty: nextQty } : c))
        : [...s.cart, { accessoryId, qty: Math.min(acc.stock, qty) }];
      return { ...s, accessories: catalog, cart };
    });
  }, []);

  const setCartQty = useCallback<Store["setCartQty"]>((accessoryId, qty) => {
    setState((s) => ({
      ...s,
      cart: qty <= 0 ? s.cart.filter((c) => c.accessoryId !== accessoryId) : s.cart.map((c) => (c.accessoryId === accessoryId ? { ...c, qty } : c)),
    }));
  }, []);

  const removeFromCart = useCallback<Store["removeFromCart"]>((accessoryId) => {
    setState((s) => ({ ...s, cart: s.cart.filter((c) => c.accessoryId !== accessoryId) }));
  }, []);

  const clearCart = useCallback(() => setState((s) => ({ ...s, cart: [] })), []);

  const markRefPaid = useCallback<Store["markRefPaid"]>((input) => {
    const payment: PaymentRecord = {
      id: uid("PAY"),
      kind: input.kind,
      refId: input.refId,
      amount: input.amount,
      status: "odendi",
      provider: input.provider ?? "mock",
      providerPaymentId: input.providerPaymentId,
      conversationId: input.conversationId,
      title: input.title,
      customerName: input.customerName,
      phone: input.phone,
      createdAt: new Date().toISOString(),
      paidAt: new Date().toISOString(),
    };
    setState((s) => {
      let jobs = s.jobs;
      let appointments = s.appointments;
      let roadside = s.roadside;
      let accessoryOrders = s.accessoryOrders;
      if (input.kind === "randevu" || input.kind === "kampanya" || input.kind === "teklif") {
        appointments = appointments.map((a) =>
          a.id === input.refId ? { ...a, paymentStatus: "odendi" as const, paymentId: payment.id, amount: input.amount, status: "onaylandi" as const } : a,
        );
        jobs = jobs.map((j) =>
          j.appointmentId === input.refId || j.id === input.refId
            ? { ...j, paymentStatus: "odendi" as const, paymentId: payment.id, estimate: input.amount }
            : j,
        );
      }
      if (input.kind === "yol-yardim") {
        roadside = roadside.map((r) =>
          r.id === input.refId ? { ...r, paymentStatus: "odendi" as const, paymentId: payment.id, amount: input.amount } : r,
        );
      }
      if (input.kind === "aksesuar") {
        accessoryOrders = accessoryOrders.map((o) =>
          o.id === input.refId ? { ...o, paymentStatus: "odendi" as const, paymentId: payment.id, status: "hazirlaniyor" as const } : o,
        );
      }
      return {
        ...s,
        payments: [payment, ...s.payments],
        jobs,
        appointments,
        roadside,
        accessoryOrders,
        inbox: pushInbox(s.inbox, {
          customerId: s.session.customerId ?? "c-demo",
          kind: input.kind === "yol-yardim" ? "yol-yardim" : input.kind === "aksesuar" ? "aksesuar" : "randevu",
          refId: input.refId,
          title: `Ödeme alındı — ${input.title}`,
          messages: [
            {
              at: new Date().toISOString(),
              from: "sistem",
              text: `iyzico ödemesi tamam (${input.amount} ₺). Ref: ${input.providerPaymentId || payment.id}`,
            },
          ],
        }),
        notifications: notify(s.notifications, {
          title: "iyzico tahsilat",
          body: `${input.amount} ₺ · ${input.title}`,
          href: "/yonetici/gelir",
        }),
      };
    });
    return payment;
  }, []);

  const fulfillPaidCheckout = useCallback<Store["fulfillPaidCheckout"]>((input) => {
    const p = input.payload;
    if (p.couponId || p.couponCode) {
      setState((s) => ({
        ...s,
        coupons: s.coupons.map((c) => {
          if (p.couponId && c.id === String(p.couponId) && c.status === "aktif") {
            return { ...c, status: "kullanildi" as const };
          }
          if (
            p.couponCode &&
            c.code.toUpperCase() === String(p.couponCode).toUpperCase() &&
            c.status === "aktif"
          ) {
            return { ...c, status: "kullanildi" as const };
          }
          return c;
        }),
      }));
    }
    if (input.kind === "aksesuar") {
      const lines = (p.lines as { accessoryId: string; qty: number }[]) || [];
      const order = createAccessoryOrder({
        name: input.buyerName,
        phone: input.buyerPhone,
        accessoryId: lines[0]?.accessoryId || String(p.accessoryId || ""),
        qty: lines[0]?.qty || Number(p.qty) || 1,
        notes: String(p.notes || ""),
        lines,
        paymentStatus: "odendi",
      });
      const payment = markRefPaid({
        kind: "aksesuar",
        refId: order?.id || "AKS-unknown",
        amount: input.amount,
        conversationId: input.conversationId,
        providerPaymentId: input.providerPaymentId,
        provider: input.provider,
        title: input.title,
        customerName: input.buyerName,
        phone: input.buyerPhone,
      });
      return { payment, refId: order?.id || payment.refId };
    }

    if (input.kind === "yol-yardim") {
      const refId = String(p.refId || "");
      const payment = markRefPaid({
        kind: "yol-yardim",
        refId,
        amount: input.amount,
        conversationId: input.conversationId,
        providerPaymentId: input.providerPaymentId,
        provider: input.provider,
        title: input.title,
        customerName: input.buyerName,
        phone: input.buyerPhone,
      });
      return { payment, refId };
    }

    if (input.kind === "teklif") {
      const refId = String(p.refId || "");
      const payment = markRefPaid({
        kind: "teklif",
        refId,
        amount: input.amount,
        conversationId: input.conversationId,
        providerPaymentId: input.providerPaymentId,
        provider: input.provider,
        title: input.title,
        customerName: input.buyerName,
        phone: input.buyerPhone,
      });
      return { payment, refId };
    }

    const appt = createAppointment({
      name: input.buyerName,
      phone: input.buyerPhone,
      plate: String(p.plate || "06 ELT 01"),
      vehicle: String(p.vehicle || ""),
      serviceId: String(p.serviceId || "ic-dis-yikama"),
      date: String(p.date || ""),
      time: String(p.time || ""),
      notes: String(p.notes || "") + (p.campaignCode ? ` · Kampanya ${p.campaignCode}` : ""),
      discovery: false,
      amount: input.amount,
      paymentStatus: "odendi",
      status: "onaylandi",
    });
    const payment = markRefPaid({
      kind: input.kind === "kampanya" ? "kampanya" : "randevu",
      refId: appt.id,
      amount: input.amount,
      conversationId: input.conversationId,
      providerPaymentId: input.providerPaymentId,
      provider: input.provider,
      title: input.title,
      customerName: input.buyerName,
      phone: input.buyerPhone,
    });
    return { payment, refId: appt.id };
  }, [createAccessoryOrder, createAppointment, markRefPaid]);

  const applyCheckIn = (s: AppState, jobId: string): AppState => {
    const job = s.jobs.find((j) => j.id === jobId);
    if (!job || job.startedAt || job.status === "iptal" || job.status === "teslim") return s;
    const at = new Date().toISOString();
    const first = job.segments[0];
    const waText = statusWhatsAppText({
      plate: job.plate,
      service: job.serviceName,
      body: `Aracınız tesise alındı.${first ? ` Şu an: ${first.title} (~${first.minutes} dk).` : ""}`,
    });
    const wa = pushWhatsApp(s.whatsappOutbox, { phone: job.phone, text: waText, jobId: job.id });
    return {
      ...s,
      jobs: s.jobs.map((j) =>
        j.id === jobId
          ? {
              ...j,
              startedAt: at,
              status: "yikamada" as const,
              currentSegmentIndex: 0,
              notifiedSegmentIndex: 0,
              updatedAt: at,
              timeline: [
                ...j.timeline,
                {
                  at,
                  status: "yikamada",
                  note: `Giriş onaylandı. Sayaç başladı${first ? ` — ${first.title} (${first.minutes} dk)` : ""}.`,
                },
              ],
            }
          : j,
      ),
      inbox: pushInbox(s.inbox, {
        customerId: job.customerId,
        kind: "is",
        refId: job.id,
        title: `${job.serviceName} — ${job.plate}`,
        messages: [
          {
            at,
            from: "sistem",
            channel: "whatsapp",
            waUrl: wa.item.url,
            text: waText,
          },
        ],
      }),
      notifications: notify(s.notifications, {
        title: "WhatsApp gönderildi",
        body: `${job.plate} · giriş onayı`,
        href: `/yonetici/isler/${job.id}`,
      }),
      whatsappOutbox: wa.outbox,
    };
  };

  const checkInJob = useCallback((id: string) => {
    setState((s) => {
      const next = applyCheckIn(s, id);
      const sent = next.whatsappOutbox[0];
      if (next !== s && sent && typeof window !== "undefined") {
        window.open(sent.url, "_blank", "noopener,noreferrer");
      }
      return next;
    });
  }, []);

  const checkInAppointment = useCallback((appointmentId: string) => {
    setState((s) => {
      const job = s.jobs.find((j) => j.appointmentId === appointmentId);
      if (!job) return s;
      const next = applyCheckIn(s, job.id);
      const sent = next.whatsappOutbox[0];
      if (next !== s && sent && typeof window !== "undefined") {
        window.open(sent.url, "_blank", "noopener,noreferrer");
      }
      return next;
    });
  }, []);

  const tickJobs = useCallback(() => {
    setState((s) => {
      let changed = false;
      let inbox = s.inbox;
      let notifications = s.notifications;
      let whatsappOutbox = s.whatsappOutbox;
      const jobs = s.jobs.map((job) => {
        if (!job.startedAt || job.status === "iptal" || job.status === "teslim") return job;
        const clock = jobClock(job);
        const at = new Date().toISOString();
        if (clock.done) {
          changed = true;
          const waText = statusWhatsAppText({
            plate: job.plate,
            service: job.serviceName,
            body: "Aracınız hazır, teslime alındı.",
          });
          const wa = pushWhatsApp(whatsappOutbox, { phone: job.phone, text: waText, jobId: job.id });
          whatsappOutbox = wa.outbox;
          inbox = pushInbox(inbox, {
            customerId: job.customerId,
            kind: "is",
            refId: job.id,
            title: `${job.serviceName} — ${job.plate}`,
            messages: [{ at, from: "sistem", channel: "whatsapp", waUrl: wa.item.url, text: waText }],
          });
          notifications = notify(notifications, {
            title: "WhatsApp · teslim",
            body: `${job.plate} hazır`,
            href: `/yonetici/isler/${job.id}`,
          });
          return {
            ...job,
            status: "teslim" as const,
            currentSegmentIndex: job.segments.length,
            notifiedSegmentIndex: job.segments.length,
            updatedAt: at,
            timeline: [...job.timeline, { at, status: "teslim", note: "Tahmini süre doldu — teslim." }],
          };
        }
        if (clock.index > job.notifiedSegmentIndex && clock.index >= 0) {
          changed = true;
          const seg = job.segments[clock.index];
          const waText = statusWhatsAppText({
            plate: job.plate,
            service: job.serviceName,
            body: `Yeni adım: ${seg.title} (~${seg.minutes} dk).`,
          });
          const wa = pushWhatsApp(whatsappOutbox, { phone: job.phone, text: waText, jobId: job.id });
          whatsappOutbox = wa.outbox;
          inbox = pushInbox(inbox, {
            customerId: job.customerId,
            kind: "is",
            refId: job.id,
            title: `${job.serviceName} — ${job.plate}`,
            messages: [{ at, from: "sistem", channel: "whatsapp", waUrl: wa.item.url, text: waText }],
          });
          return {
            ...job,
            currentSegmentIndex: clock.index,
            notifiedSegmentIndex: clock.index,
            updatedAt: at,
            timeline: [...job.timeline, { at, status: "yikamada", note: `Segment: ${seg.title}` }],
          };
        }
        return job;
      });
      if (!changed) return s;
      return { ...s, jobs, inbox, notifications, whatsappOutbox };
    });
  }, []);

  const updateJobStatus = useCallback((id: string, status: JobStatus, note?: string) => {
    setState((s) => {
      const job = s.jobs.find((j) => j.id === id);
      if (!job) return s;
      const at = new Date().toISOString();
      const body = `Durum: ${JOB_STATUS_LABEL[status]}.${note ? ` ${note}` : ""}`;
      const waText = statusWhatsAppText({
        plate: job.plate,
        service: job.serviceName,
        body,
      });
      const wa = pushWhatsApp(s.whatsappOutbox, { phone: job.phone, text: waText, jobId: job.id });
      const nextJobs = s.jobs.map((j) =>
        j.id === id
          ? {
              ...j,
              status,
              updatedAt: at,
              timeline: [...j.timeline, { at, status, note: note ?? JOB_STATUS_LABEL[status] }],
            }
          : j,
      );
      return {
        ...s,
        jobs: nextJobs,
        whatsappOutbox: wa.outbox,
        inbox: pushInbox(s.inbox, {
          customerId: job.customerId,
          kind: "is",
          refId: job.id,
          title: `${job.serviceName} — ${job.plate}`,
          messages: [
            {
              at,
              from: "sistem",
              channel: "whatsapp",
              waUrl: wa.item.url,
              text: waText,
            },
          ],
        }),
        notifications: notify(s.notifications, {
          title: "WhatsApp · durum",
          body: `${job.plate} · ${JOB_STATUS_LABEL[status]}`,
          href: `/yonetici/isler/${job.id}`,
          audience: "owner",
        }),
      };
    });
  }, []);

  const updateRoadsideStatus = useCallback((id: string, status: RoadsideStatus, note?: string) => {
    setState((s) => {
      const call = s.roadside.find((r) => r.id === id);
      if (!call) return s;
      const at = new Date().toISOString();
      const body = `${ROADSIDE_STATUS_LABEL[status]}.${note ? ` ${note}` : ""}`;
      const waText = statusWhatsAppText({
        plate: call.plate,
        service: "Yol yardım",
        body,
      });
      const wa = pushWhatsApp(s.whatsappOutbox, { phone: call.phone, text: waText, jobId: call.id });
      return {
        ...s,
        roadside: s.roadside.map((r) =>
          r.id === id
            ? {
                ...r,
                status,
                technicianId: r.technicianId ?? "t-burak",
                updatedAt: at,
                timeline: [...r.timeline, { at, status, note: note ?? ROADSIDE_STATUS_LABEL[status] }],
              }
            : r,
        ),
        whatsappOutbox: wa.outbox,
        inbox: pushInbox(s.inbox, {
          customerId: call.customerId,
          kind: "yol-yardim",
          refId: call.id,
          title: `Yol yardım — ${call.plate}`,
          messages: [
            {
              at,
              from: "sistem",
              channel: "whatsapp",
              waUrl: wa.item.url,
              text: waText,
            },
          ],
        }),
        notifications: notify(s.notifications, {
          title: "WhatsApp · yol yardım",
          body: `${call.plate} · ${ROADSIDE_STATUS_LABEL[status]}`,
          href: `/yonetici/isler/${call.id}`,
          audience: "owner",
        }),
      };
    });
  }, []);

  const updateAppointmentStatus = useCallback((id: string, status: Appointment["status"]) => {
    setState((s) => {
      const appt = s.appointments.find((a) => a.id === id);
      if (!appt) return s;
      const at = new Date().toISOString();
      const text =
        status === "onaylandi"
          ? `${appt.date} ${appt.time} randevunuz onaylandı. Plaka: ${appt.plate}. Süreç yine de giriş onayından sonra başlar.`
          : status === "iptal"
            ? `Randevunuz iptal edildi (${appt.date} ${appt.time}).`
            : `Randevu durumu: ${status}.`;
      const wa = pushWhatsApp(s.whatsappOutbox, {
        phone: appt.phone,
        text: statusWhatsAppText({ plate: appt.plate, service: appt.serviceName, body: text }),
      });
      let jobs = s.jobs;
      if (status === "iptal") {
        jobs = s.jobs.map((j) =>
          j.appointmentId === id && j.status !== "teslim"
            ? {
                ...j,
                status: "iptal" as const,
                updatedAt: at,
                timeline: [...j.timeline, { at, status: "iptal", note: "Randevu iptal edildi." }],
              }
            : j,
        );
      }
      return {
        ...s,
        appointments: s.appointments.map((a) => (a.id === id ? { ...a, status } : a)),
        jobs,
        whatsappOutbox: wa.outbox,
        inbox: pushInbox(s.inbox, {
          customerId: appt.customerId,
          kind: "randevu",
          refId: appt.id,
          title: `Randevu ${appt.id}`,
          messages: [
            {
              at,
              from: "sistem",
              channel: "whatsapp",
              waUrl: wa.item.url,
              text: wa.item.text,
            },
          ],
        }),
      };
    });
  }, []);

  const updateOrderStatus = useCallback((id: string, status: AccessoryOrder["status"]) => {
    setState((s) => {
      const order = s.accessoryOrders.find((o) => o.id === id);
      if (!order) return s;
      const at = new Date().toISOString();
      const text = `Sipariş ${order.id}: ${ORDER_STATUS_LABEL[status] ?? status}.`;
      const wa = pushWhatsApp(s.whatsappOutbox, {
        phone: order.phone,
        text: statusWhatsAppText({ plate: "AKS", service: order.accessoryName, body: text }),
        jobId: order.id,
      });
      let accessories = s.accessories;
      if (status === "iptal" && order.status !== "iptal") {
        accessories = s.accessories.map((a) =>
          a.id === order.accessoryId ? { ...a, stock: a.stock + order.qty } : a,
        );
      }
      return {
        ...s,
        accessories,
        accessoryOrders: s.accessoryOrders.map((o) => (o.id === id ? { ...o, status } : o)),
        whatsappOutbox: wa.outbox,
        inbox: pushInbox(s.inbox, {
          customerId: order.customerId,
          kind: "aksesuar",
          refId: order.id,
          title: `Aksesuar — ${order.accessoryName}`,
          messages: [{ at, from: "sistem", channel: "whatsapp", waUrl: wa.item.url, text: wa.item.text }],
        }),
      };
    });
  }, []);

  const markInboxRead = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      inbox: s.inbox.map((i) => (i.id === id ? { ...i, unread: false } : i)),
    }));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setState((s) => ({
      ...s,
      notifications: s.notifications.map((n) => ({ ...n, read: true })),
    }));
  }, []);

  const claimCoupon = useCallback((code: string) => {
    let ok = false;
    setState((s) => {
      const camp = s.cms.campaigns.find((c) => c.couponCode === code && c.active);
      if (!camp) return s;
      const cid = s.session.customerId ?? "c-demo";
      if (s.coupons.some((c) => c.code === code && c.customerId === cid && c.status === "aktif")) {
        ok = true;
        return s;
      }
      ok = true;
      const discountPercent = inferDiscountPercent(camp.couponCode, camp.blurb) ?? 10;
      return {
        ...s,
        coupons: [
          {
            id: uid("CP"),
            customerId: cid,
            code: camp.couponCode,
            title: camp.title,
            rule: camp.blurb,
            expires: camp.ends || "2026-12-31",
            status: "aktif" as const,
            discountPercent,
          },
          ...s.coupons,
        ],
        notifications: notify(s.notifications, {
          title: "Kupon tanımlandı",
          body: `${camp.couponCode} cüzdanınıza eklendi.`,
          href: "/kuponlar",
          audience: "customer",
        }),
      };
    });
    return ok;
  }, []);

  const setNotifPrefs = useCallback((p: { campaignNotif?: boolean; couponNotif?: boolean }) => {
    setState((s) => ({
      ...s,
      campaignNotif: p.campaignNotif ?? s.campaignNotif,
      couponNotif: p.couponNotif ?? s.couponNotif,
    }));
  }, []);

  const setCms = useCallback((cms: SiteCms) => {
    setState((s) => ({ ...s, cms }));
  }, []);

  const patchCms = useCallback((patch: Partial<SiteCms>) => {
    setState((s) => ({ ...s, cms: { ...s.cms, ...patch } }));
  }, []);

  const createOwnerCoupon = useCallback<Store["createOwnerCoupon"]>((input) => {
    const discountPercent =
      input.discountPercent ?? inferDiscountPercent(input.code, input.rule);
    const row: Coupon = {
      id: uid("CP"),
      customerId: input.customerId || "c-demo",
      code: input.code.toUpperCase(),
      title: input.title,
      rule: input.rule,
      expires: input.expires,
      status: "aktif",
      discountPercent,
      discountAmount: input.discountAmount,
    };
    setState((s) => ({
      ...s,
      coupons: [row, ...s.coupons],
      notifications: notify(s.notifications, {
        title: "Yeni kupon",
        body: `${row.code} · ${row.title}`,
        href: "/kuponlar",
        audience: "customer",
      }),
    }));
    return row;
  }, []);

  const deleteCoupon = useCallback((id: string) => {
    setState((s) => ({ ...s, coupons: s.coupons.filter((c) => c.id !== id) }));
  }, []);

  const updateCouponStatus = useCallback((id: string, status: Coupon["status"]) => {
    setState((s) => ({
      ...s,
      coupons: s.coupons.map((c) => (c.id === id ? { ...c, status } : c)),
    }));
  }, []);

  const redeemCoupon = useCallback<Store["redeemCoupon"]>((code, baseAmount, customerId) => {
    // Preview only — status flips to kullanildi after paid checkout
    const s = state;
    const cid = customerId || s.session.customerId || "c-demo";
    const coupon = s.coupons.find(
      (c) =>
        c.code.toUpperCase() === code.toUpperCase() &&
        c.status === "aktif" &&
        (c.customerId === cid || c.customerId === "c-demo"),
    );
    if (!coupon) return null;
    const discount = couponOffAmount(coupon, baseAmount);
    if (discount <= 0) return null;
    return { coupon, discount, amount: Math.max(0, baseAmount - discount) };
  }, [state]);

  const markCouponUsed = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      coupons: s.coupons.map((c) => (c.id === id ? { ...c, status: "kullanildi" as const } : c)),
    }));
  }, []);

  const saveCustomer = useCallback<Store["saveCustomer"]>((input) => {
    let saved!: Customer;
    setState((s) => {
      if (input.id) {
        const customers = s.customers.map((c) => {
          if (c.id !== input.id) return c;
          const base = hydrateCustomer(c);
          const plate = (input.plate ?? base.plate).toUpperCase();
          const label = input.vehicle ?? base.vehicle;
          let vehicles = base.vehicles;
          if (plate && plate !== "—") {
            const hit = vehicles.find((v) => v.plate === plate);
            vehicles = hit
              ? vehicles.map((v) => (v.id === hit.id ? { ...v, label } : v))
              : [makeVehicle(plate, label), ...vehicles];
          }
          return hydrateCustomer({
            ...base,
            name: input.name,
            phone: input.phone,
            plate,
            vehicle: label,
            vehicles,
          });
        });
        saved = customers.find((c) => c.id === input.id)!;
        return { ...s, customers };
      }
      const next = upsertCustomer(s.customers.map(hydrateCustomer), {
        name: input.name,
        phone: input.phone,
        plate: input.plate || "",
        vehicle: input.vehicle || "",
      });
      saved = next.customer;
      return { ...s, customers: next.customers };
    });
    return saved;
  }, []);

  const deleteCustomer = useCallback((id: string) => {
    setState((s) => ({ ...s, customers: s.customers.filter((c) => c.id !== id) }));
  }, []);

  const saveTechnician = useCallback<Store["saveTechnician"]>((input) => {
    let saved!: Technician;
    setState((s) => {
      if (input.id) {
        const technicians = s.technicians.map((t) =>
          t.id === input.id
            ? {
                ...t,
                name: input.name,
                role: input.role,
                shift: input.shift ?? t.shift,
                load: input.load ?? t.load,
              }
            : t,
        );
        saved = technicians.find((t) => t.id === input.id)!;
        return { ...s, technicians };
      }
      saved = {
        id: uid("t").toLowerCase(),
        name: input.name,
        role: input.role,
        shift: input.shift || "08:30–17:00",
        load: input.load ?? 0,
      };
      return { ...s, technicians: [...s.technicians, saved] };
    });
    return saved;
  }, []);

  const deleteTechnician = useCallback((id: string) => {
    setState((s) => ({ ...s, technicians: s.technicians.filter((t) => t.id !== id) }));
  }, []);

  const assignTechnician = useCallback((refId: string, technicianId: string) => {
    setState((s) => {
      const at = new Date().toISOString();
      const tech = s.technicians.find((t) => t.id === technicianId);
      const jobs = s.jobs.map((j) =>
        j.id === refId
          ? {
              ...j,
              technicianId,
              updatedAt: at,
              timeline: [
                ...j.timeline,
                { at, status: j.status, note: `Personel atandı: ${tech?.name ?? technicianId}` },
              ],
            }
          : j,
      );
      const roadside = s.roadside.map((r) =>
        r.id === refId
          ? {
              ...r,
              technicianId,
              updatedAt: at,
              timeline: [
                ...r.timeline,
                { at, status: r.status, note: `Personel atandı: ${tech?.name ?? technicianId}` },
              ],
            }
          : r,
      );
      return { ...s, jobs, roadside };
    });
  }, []);

  const saveAccessory = useCallback<Store["saveAccessory"]>((input) => {
    let saved!: Accessory;
    setState((s) => {
      const list = s.accessories.length ? s.accessories : cloneAccessories(ACCESSORIES);
      if (input.id) {
        const accessories = list.map((a) =>
          a.id === input.id
            ? {
                ...a,
                name: input.name,
                category: input.category ?? a.category,
                price: input.price,
                stock: input.stock ?? a.stock,
                description: input.description ?? a.description,
              }
            : a,
        );
        saved = accessories.find((a) => a.id === input.id)!;
        return { ...s, accessories };
      }
      saved = {
        id: uid("acc").toLowerCase(),
        name: input.name,
        category: input.category || "Diğer",
        price: input.price,
        stock: input.stock ?? 0,
        description: input.description || "",
      };
      return { ...s, accessories: [...list, saved] };
    });
    return saved;
  }, []);

  const deleteAccessory = useCallback((id: string) => {
    setState((s) => ({ ...s, accessories: s.accessories.filter((a) => a.id !== id) }));
  }, []);

  const setAccessoryStock = useCallback((id: string, stock: number) => {
    setState((s) => ({
      ...s,
      accessories: (s.accessories.length ? s.accessories : cloneAccessories(ACCESSORIES)).map((a) =>
        a.id === id ? { ...a, stock: Math.max(0, stock) } : a,
      ),
    }));
  }, []);

  const updateJobEstimate = useCallback((id: string, estimate: number, notes?: string) => {
    setState((s) => ({
      ...s,
      jobs: s.jobs.map((j) =>
        j.id === id
          ? {
              ...j,
              estimate,
              notes: notes ?? j.notes,
              updatedAt: new Date().toISOString(),
            }
          : j,
      ),
      roadside: s.roadside.map((r) =>
        r.id === id ? { ...r, amount: estimate, updatedAt: new Date().toISOString() } : r,
      ),
    }));
  }, []);

  const enqueueWhatsApp = useCallback<Store["enqueueWhatsApp"]>((input) => {
    let url = "";
    setState((s) => {
      const wa = pushWhatsApp(s.whatsappOutbox, {
        phone: input.phone,
        text: input.text,
        jobId: input.jobId,
      });
      url = wa.item.url;
      if (input.open && typeof window !== "undefined") {
        window.open(url, "_blank", "noopener,noreferrer");
      }
      return {
        ...s,
        whatsappOutbox: wa.outbox,
        notifications: notify(s.notifications, {
          title: "WhatsApp kuyruğa eklendi",
          body: input.phone,
          href: "/yonetici/bildirimler",
          audience: "owner",
        }),
      };
    });
    return url;
  }, []);

  useEffect(() => {
    if (!ready) return;
    const t = setInterval(() => tickJobs(), 4000);
    return () => clearInterval(t);
  }, [ready, tickJobs]);

  const value = useMemo<Store>(
    () => ({
      ...state,
      ready,
      loginCustomer,
      registerCustomer,
      updateCustomerProfile,
      addVehicle,
      removeVehicle,
      setActiveVehicle,
      loginOwner,
      logout,
      reset,
      createAppointment,
      createRoadside,
      createAccessoryOrder,
      addToCart,
      setCartQty,
      removeFromCart,
      clearCart,
      fulfillPaidCheckout,
      markRefPaid,
      updateJobStatus,
      checkInJob,
      checkInAppointment,
      updateRoadsideStatus,
      updateAppointmentStatus,
      updateOrderStatus,
      markInboxRead,
      markAllNotificationsRead,
      claimCoupon,
      setNotifPrefs,
      setCms,
      patchCms,
      createOwnerCoupon,
      deleteCoupon,
      updateCouponStatus,
      redeemCoupon,
      markCouponUsed,
      saveCustomer,
      deleteCustomer,
      saveTechnician,
      deleteTechnician,
      assignTechnician,
      saveAccessory,
      deleteAccessory,
      setAccessoryStock,
      updateJobEstimate,
      enqueueWhatsApp,
    }),
    [
      state,
      ready,
      loginCustomer,
      registerCustomer,
      updateCustomerProfile,
      addVehicle,
      removeVehicle,
      setActiveVehicle,
      loginOwner,
      logout,
      reset,
      createAppointment,
      createRoadside,
      createAccessoryOrder,
      addToCart,
      setCartQty,
      removeFromCart,
      clearCart,
      fulfillPaidCheckout,
      markRefPaid,
      updateJobStatus,
      checkInJob,
      checkInAppointment,
      updateRoadsideStatus,
      updateAppointmentStatus,
      updateOrderStatus,
      markInboxRead,
      markAllNotificationsRead,
      claimCoupon,
      setNotifPrefs,
      setCms,
      patchCms,
      createOwnerCoupon,
      deleteCoupon,
      updateCouponStatus,
      redeemCoupon,
      markCouponUsed,
      saveCustomer,
      deleteCustomer,
      saveTechnician,
      deleteTechnician,
      assignTechnician,
      saveAccessory,
      deleteAccessory,
      setAccessoryStock,
      updateJobEstimate,
      enqueueWhatsApp,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore must be inside StoreProvider");
  return ctx;
}
