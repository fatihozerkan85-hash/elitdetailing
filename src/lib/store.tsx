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
import { ACCESSORIES, CAMPAIGNS, DEMO, JOB_STATUS_LABEL, ROADSIDE_STATUS_LABEL, SERVICES } from "./catalog";
import { uid } from "./format";
import { jobClock, hydrateJob, segmentsFor } from "./process";
import { buildSeed } from "./seed";
import type {
  AccessoryOrder,
  Appointment,
  AppState,
  InboxItem,
  Job,
  JobStatus,
  Notification,
  RoadsideCall,
  RoadsideStatus,
  Session,
} from "./types";

const KEY = "elit-detailing-v2";

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
  }) => AccessoryOrder | null;
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
              jobs: (parsed.jobs ?? seed.jobs).map((j) => hydrateJob(j as Job)),
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
    const service = SERVICES.find((x) => x.id === input.serviceId)!;
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
      status: "bekliyor",
      createdAt: new Date().toISOString(),
    };
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
      estimate: service.fromPrice,
      status: "giris-bekleniyor",
      technicianId: service.category === "lastik" ? "t-ali" : service.category === "detailing" ? "t-deniz" : "t-mehmet",
      appointmentId: appt.id,
      currentSegmentIndex: -1,
      notifiedSegmentIndex: -1,
      segments: segmentsFor(service.id),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      timeline: [
        {
          at: new Date().toISOString(),
          status: "giris-bekleniyor",
          note: `Randevu ${input.date} ${input.time} alındı. Saat gelmesi süreci başlatmaz; giriş onayı bekleniyor.`,
        },
      ],
    };
    setState((s) => ({
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
            text: `${input.date} ${input.time} için randevu talebiniz alındı (${service.durationMin} dk, ${service.segments.length} adım). Saat gelince süreç başlamaz. Araç girişte onaylanınca sayaç ve bildirimler açılır. İş kodu: ${job.id}.`,
          },
        ],
      }),
      notifications: notify(s.notifications, {
        title: "Yeni randevu",
        body: `${appt.id} · ${input.name} · ${service.name}`,
        href: `/yonetici/isler/${job.id}`,
      }),
    }));
    return appt;
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
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      timeline: [
        {
          at: new Date().toISOString(),
          status: "alindi",
          note: input.lat != null && input.lng != null
            ? `Otomatik kayıt — GPS pin alındı. Ekip ataması bekleniyor.`
            : "Otomatik kayıt — ekip ataması bekleniyor.",
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
            text: `${call.id} alındı (${input.urgency}). ${input.lat != null && input.lng != null ? "GPS konumu eklendi. " : ""}Konum notunuz operatöre iletildi. Arama yapmadan bu ekrandan takip edin.`,
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
    const acc = ACCESSORIES.find((a) => a.id === input.accessoryId);
    if (!acc) return null;
    const order: AccessoryOrder = {
      id: uid("AKS"),
      customerId: "c-demo",
      customerName: input.name,
      phone: input.phone,
      accessoryId: acc.id,
      accessoryName: acc.name,
      qty: input.qty,
      total: acc.price * input.qty,
      notes: input.notes,
      status: "talep",
      createdAt: new Date().toISOString(),
    };
    setState((s) => ({
      ...s,
      accessoryOrders: [order, ...s.accessoryOrders],
      inbox: pushInbox(s.inbox, {
        customerId: s.session.customerId ?? "c-demo",
        kind: "aksesuar",
        refId: order.id,
        title: `${acc.name} talebi`,
        messages: [
          {
            at: new Date().toISOString(),
            from: "sistem",
            text: `Sipariş ${order.id} alındı. Stok: ${acc.stock} adet. Hazır olunca Taleplerim güncellenir.`,
          },
        ],
      }),
      notifications: notify(s.notifications, {
        title: "Aksesuar talebi",
        body: `${order.id} · ${acc.name} ×${input.qty}`,
        href: "/yonetici",
      }),
    }));
    return order;
  }, []);

  const applyCheckIn = (s: AppState, jobId: string): AppState => {
    const job = s.jobs.find((j) => j.id === jobId);
    if (!job || job.startedAt || job.status === "iptal" || job.status === "teslim") return s;
    const at = new Date().toISOString();
    const first = job.segments[0];
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
            text: `WhatsApp: Aracınız tesise alındı. ${first ? `Şu an: ${first.title} (~${first.minutes} dk).` : "İşlem başladı."} Randevu saati süreci başlatmaz.`,
          },
        ],
      }),
      notifications: notify(s.notifications, {
        title: "Giriş onaylandı",
        body: `${job.id} · sayaç başladı`,
        href: `/yonetici/isler/${job.id}`,
      }),
    };
  };

  const checkInJob = useCallback((id: string) => {
    setState((s) => applyCheckIn(s, id));
  }, []);

  const checkInAppointment = useCallback((appointmentId: string) => {
    setState((s) => {
      const job = s.jobs.find((j) => j.appointmentId === appointmentId);
      return job ? applyCheckIn(s, job.id) : s;
    });
  }, []);

  const tickJobs = useCallback(() => {
    setState((s) => {
      let changed = false;
      let inbox = s.inbox;
      let notifications = s.notifications;
      const jobs = s.jobs.map((job) => {
        if (!job.startedAt || job.status === "iptal" || job.status === "teslim") return job;
        const clock = jobClock(job);
        const at = new Date().toISOString();
        if (clock.done) {
          changed = true;
          inbox = pushInbox(inbox, {
            customerId: job.customerId,
            kind: "is",
            refId: job.id,
            title: `${job.serviceName} — ${job.plate}`,
            messages: [
              {
                at,
                from: "sistem",
                text: "WhatsApp: Aracınız hazır, teslime alındı. Tahmini segmentler tamamlandı.",
              },
            ],
          });
          notifications = notify(notifications, {
            title: "Teslim",
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
          inbox = pushInbox(inbox, {
            customerId: job.customerId,
            kind: "is",
            refId: job.id,
            title: `${job.serviceName} — ${job.plate}`,
            messages: [
              {
                at,
                from: "sistem",
                text: `WhatsApp: Yeni adım — ${seg.title} (~${seg.minutes} dk). Takip ekranından izleyin.`,
              },
            ],
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
      return { ...s, jobs, inbox, notifications };
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
    const camp = CAMPAIGNS.find((c) => c.couponCode === code);
    if (!camp) return false;
    setState((s) => {
      const cid = s.session.customerId ?? "c-demo";
      if (s.coupons.some((c) => c.code === code && c.customerId === cid && c.status === "aktif")) return s;
      return {
        ...s,
        coupons: [
          {
            id: uid("CP"),
            customerId: cid,
            code: camp.couponCode,
            title: camp.title,
            rule: camp.blurb,
            expires: "2026-12-31",
            status: "aktif",
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
    return true;
  }, []);

  const setNotifPrefs = useCallback((p: { campaignNotif?: boolean; couponNotif?: boolean }) => {
    setState((s) => ({
      ...s,
      campaignNotif: p.campaignNotif ?? s.campaignNotif,
      couponNotif: p.couponNotif ?? s.couponNotif,
    }));
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
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore must be inside StoreProvider");
  return ctx;
}
