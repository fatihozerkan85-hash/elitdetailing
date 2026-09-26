import { occupancyMin } from "./process";
import { SERVICES } from "./catalog";
import type { Appointment, Service } from "./types";

export const SLOT_TIMES = [
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
];

export function timeToMin(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

export function minToTime(n: number) {
  const h = Math.floor(n / 60);
  const m = n % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function resolveService(serviceId: string, catalog?: Service[]) {
  const list = catalog?.length ? catalog : SERVICES;
  return list.find((s) => s.id === serviceId) || SERVICES.find((s) => s.id === serviceId);
}

export function appointmentSpan(a: Appointment, catalog?: Service[]) {
  const svc = resolveService(a.serviceId, catalog);
  const mins = svc ? occupancyMin(svc) : 40;
  const start = timeToMin(a.time);
  return { start, end: start + mins };
}

export function slotConflicts(
  date: string,
  time: string,
  serviceId: string,
  appointments: Appointment[],
  ignoreId?: string,
  catalog?: Service[],
) {
  const svc = resolveService(serviceId, catalog);
  if (!svc) return false;
  const start = timeToMin(time);
  const end = start + occupancyMin(svc);
  return appointments.some((a) => {
    if (a.date !== date || a.status === "iptal" || a.id === ignoreId) return false;
    // Ödenmemiş / başarısız kayıt slot kilitlemez
    if (a.paymentStatus === "basarisiz") return false;
    const span = appointmentSpan(a, catalog);
    return start < span.end && end > span.start;
  });
}
