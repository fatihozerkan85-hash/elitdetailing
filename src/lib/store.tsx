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

const KEY = "elit-otomotiv-v1";

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
  updateRoadsideStatus: (id: string, status: RoadsideStatus, note?: string) => void;
  updateAppointmentStatus: (id: string, status: Appointment["status"]) => void;
  updateOrderStatus: (id: string, status: AccessoryOrder["status"]) => void;
  markInboxRead: (id: string) => void;
  markAllNotificationsRead: () => void;
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
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setState(JSON.parse(raw) as AppState);
    } catch {
      /* keep seed */
    }
    setReady(true);
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
      return { ...s, session };
    });
    return true;
  }, []);

  const loginOwner = useCallback((pin: string) => {
    if (pin.trim() !== DEMO.ownerPin) return false;
    setState((s) => ({ ...s, session: { role: "owner", name: "İşletme sahibi" } }));
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
      status: "kuyrukta",
      technicianId: service.category === "lastik" ? "t-ali" : service.category === "detailing" ? "t-deniz" : "t-mehmet",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      timeline: [
        {
          at: new Date().toISOString(),
          status: "kuyrukta",
          note: `Randevu ${input.date} ${input.time} — otomatik kuyruk kaydı.`,
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
            text: `${input.date} ${input.time} için randevu talebiniz alındı. Onaylandığında bu kutuya mesaj düşer. İş kodu: ${job.id}.`,
          },
        ],
      }),
      notifications: notify(s.notifications, {
        title: "Yeni randevu",
        body: `${appt.id} · ${input.name} · ${service.name}`,
        href: `/panel/isler/${job.id}`,
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
      issue: input.issue,
      urgency: input.urgency,
      status: "alindi",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      timeline: [
        {
          at: new Date().toISOString(),
          status: "alindi",
          note: "Otomatik kayıt — ekip ataması bekleniyor.",
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
            text: `${call.id} alındı (${input.urgency}). Konum notunuz operatöre iletildi. Arama yapmadan bu ekrandan takip edin.`,
          },
        ],
      }),
      notifications: notify(s.notifications, {
        title: "Yeni yol yardım",
        body: `${call.id} · ${input.urgency} · ${input.plate}`,
        href: `/panel/isler/${call.id}`,
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
        href: "/panel",
      }),
    }));
    return order;
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
                  ? `${appt.date} ${appt.time} randevunuz onaylandı. Plaka: ${appt.plate}.`
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
      updateRoadsideStatus,
      updateAppointmentStatus,
      updateOrderStatus,
      markInboxRead,
      markAllNotificationsRead,
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
      updateRoadsideStatus,
      updateAppointmentStatus,
      updateOrderStatus,
      markInboxRead,
      markAllNotificationsRead,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore must be inside StoreProvider");
  return ctx;
}
