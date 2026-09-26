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
import { ACCESSORIES, DEMO, JOB_STATUS_LABEL, ROADSIDE_STATUS_LABEL, SERVICES } from "./catalog";
import { uid } from "./format";
import { jobClock, hydrateJob, segmentsFor } from "./process";
import { buildSeed } from "./seed";
import { buildDefaultCms, type SiteCms } from "./site-cms";
import { statusWhatsAppText, waMeUrl } from "./whatsapp";
import type {
  AccessoryOrder,
  Appointment,
  AppState,
  CartLine,
  Coupon,
  InboxItem,
  Job,
  JobStatus,
  Notification,
  PaymentRecord,
  RoadsideCall,
  RoadsideStatus,
  Session,
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
  createOwnerCoupon: (input: { code: string; title: string; rule: string; expires: string; customerId?: string }) => Coupon;
  deleteCoupon: (id: string) => void;
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

function notify(list: Notification[], n: Omit<Notification, "id" | "at" | "read">): Notification[] {
  return [
    { id: uid("NT"), at: new Date().toISOString(), read: false, ...n },
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
              cms: { ...buildDefaultCms(), ...(parsed.cms ?? {}), banners: parsed.cms?.banners ?? seed.cms.banners, ticker: parsed.cms?.ticker ?? seed.cms.ticker, homeServices: parsed.cms?.homeServices ?? seed.cms.homeServices, campaigns: parsed.cms?.campaigns ?? seed.cms.campaigns, services: parsed.cms?.services ?? seed.cms.services, texts: parsed.cms?.texts ?? seed.cms.texts, forms: parsed.cms?.forms ?? seed.cms.forms },
              whatsappOutbox: parsed.whatsappOutbox ?? [],
              coupons: parsed.coupons ?? seed.coupons,
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
    setState((s) => {
      const found = s.customers.find((c) => c.phone.replace(/\D/g, "") === digits);
      const session: Session = found
        ? { role: "customer", customerId: found.id, name: found.name }
        : {
            role: "customer",
            customerId: "c-demo",
            name: DEMO.customerName,
          };
      const next = { ...s, session };
      persist(next);
      return next;
    });
    return true;
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
      const discovery = input.discovery ?? ("discovery" in service ? Boolean(service.discovery) : service.id === "boya-koruma");
      const amount = input.amount ?? (discovery ? 0 : service.fromPrice);
      const paymentStatus = input.paymentStatus ?? (discovery ? "kesif" : "odendi");
      const status = input.status ?? (paymentStatus === "odendi" ? "onaylandi" : "bekliyor");
      const appt: Appointment = {
        id: uid("RDV"),
        customerId: "c-demo",
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
        customerId: "c-demo",
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
        appointments: [appt, ...s.appointments],
        jobs: [job, ...s.jobs],
        inbox: pushInbox(s.inbox, {
          customerId: s.session.customerId ?? "c-demo",
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
        }),
      };
    });
    return created;
  }, []);

  const createRoadside = useCallback<Store["createRoadside"]>((input) => {
    const call: RoadsideCall = {
      id: uid("YY"),
      customerId: "c-demo",
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
          note: input.lat != null && input.lng != null
            ? `Otomatik kayıt — GPS pin alındı. Ödeme ekibi yola çıktıktan / iş bitince iyzico linki ile.`
            : "Otomatik kayıt — ekip ataması bekleniyor. Ödeme çıkışı engellemez.",
        },
      ],
    };
    setState((s) => ({
      ...s,
      roadside: [call, ...s.roadside],
      inbox: pushInbox(s.inbox, {
        customerId: s.session.customerId ?? "c-demo",
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
      }),
    }));
    return call;
  }, []);

  const createAccessoryOrder = useCallback<Store["createAccessoryOrder"]>((input) => {
    const lines = input.lines?.length
      ? input.lines
      : [{ accessoryId: input.accessoryId, qty: input.qty }];
    const resolved = lines
      .map((l) => {
        const acc = ACCESSORIES.find((a) => a.id === l.accessoryId);
        return acc ? { acc, qty: l.qty } : null;
      })
      .filter(Boolean) as { acc: (typeof ACCESSORIES)[number]; qty: number }[];
    if (!resolved.length) return null;
    const primary = resolved[0]!;
    const total = resolved.reduce((s, r) => s + r.acc.price * r.qty, 0);
    const order: AccessoryOrder = {
      id: uid("AKS"),
      customerId: "c-demo",
      customerName: input.name,
      phone: input.phone,
      accessoryId: primary.acc.id,
      accessoryName:
        resolved.length === 1
          ? primary.acc.name
          : resolved.map((r) => `${r.acc.name}×${r.qty}`).join(", "),
      qty: resolved.reduce((s, r) => s + r.qty, 0),
      total,
      notes: input.notes,
      status: "hazirlaniyor",
      paymentStatus: input.paymentStatus ?? "odendi",
      paymentId: input.paymentId,
      createdAt: new Date().toISOString(),
    };
    setState((s) => ({
      ...s,
      accessoryOrders: [order, ...s.accessoryOrders],
      cart: [],
      inbox: pushInbox(s.inbox, {
        customerId: s.session.customerId ?? "c-demo",
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
      }),
    }));
    return order;
  }, []);

  const addToCart = useCallback<Store["addToCart"]>((accessoryId, qty = 1) => {
    setState((s) => {
      const exists = s.cart.find((c) => c.accessoryId === accessoryId);
      const cart: CartLine[] = exists
        ? s.cart.map((c) => (c.accessoryId === accessoryId ? { ...c, qty: c.qty + qty } : c))
        : [...s.cart, { accessoryId, qty }];
      return { ...s, cart };
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
        inbox: pushInbox(s.inbox, {
          customerId: job.customerId,
          kind: "is",
          refId: job.id,
          title: `${job.serviceName} — ${job.plate}`,
          messages: [
            {
              at,
              from: "sistem",
              text: `Durum güncellendi: ${JOB_STATUS_LABEL[status]}. ${note ?? "Temsilci aramanıza gerek yok."}`,
            },
          ],
        }),
      };
    });
  }, []);

  const updateRoadsideStatus = useCallback((id: string, status: RoadsideStatus, note?: string) => {
    setState((s) => {
      const call = s.roadside.find((r) => r.id === id);
      if (!call) return s;
      const at = new Date().toISOString();
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
        inbox: pushInbox(s.inbox, {
          customerId: call.customerId,
          kind: "yol-yardim",
          refId: call.id,
          title: `Yol yardım — ${call.plate}`,
          messages: [
            {
              at,
              from: "sistem",
              text: `${ROADSIDE_STATUS_LABEL[status]}. ${note ?? ""}`.trim(),
            },
          ],
        }),
      };
    });
  }, []);

  const updateAppointmentStatus = useCallback((id: string, status: Appointment["status"]) => {
    setState((s) => {
      const appt = s.appointments.find((a) => a.id === id);
      if (!appt) return s;
      return {
        ...s,
        appointments: s.appointments.map((a) => (a.id === id ? { ...a, status } : a)),
        inbox: pushInbox(s.inbox, {
          customerId: appt.customerId,
          kind: "randevu",
          refId: appt.id,
          title: `Randevu ${appt.id}`,
          messages: [
            {
              at: new Date().toISOString(),
              from: "sistem",
              text:
                status === "onaylandi"
                  ? `${appt.date} ${appt.time} randevunuz onaylandı. Plaka: ${appt.plate}. Süreç yine de giriş onayından sonra başlar.`
                  : `Randevu durumu: ${status}.`,
            },
          ],
        }),
      };
    });
  }, []);

  const updateOrderStatus = useCallback((id: string, status: AccessoryOrder["status"]) => {
    setState((s) => ({
      ...s,
      accessoryOrders: s.accessoryOrders.map((o) => (o.id === id ? { ...o, status } : o)),
    }));
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
          },
          ...s.coupons,
        ],
        notifications: notify(s.notifications, {
          title: "Kupon tanımlandı",
          body: `${camp.couponCode} cüzdanınıza eklendi.`,
          href: "/kuponlar",
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
    const row: Coupon = {
      id: uid("CP"),
      customerId: input.customerId || "c-demo",
      code: input.code.toUpperCase(),
      title: input.title,
      rule: input.rule,
      expires: input.expires,
      status: "aktif",
    };
    setState((s) => ({ ...s, coupons: [row, ...s.coupons] }));
    return row;
  }, []);

  const deleteCoupon = useCallback((id: string) => {
    setState((s) => ({ ...s, coupons: s.coupons.filter((c) => c.id !== id) }));
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
    }),
    [
      state,
      ready,
      loginCustomer,
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
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore must be inside StoreProvider");
  return ctx;
}
