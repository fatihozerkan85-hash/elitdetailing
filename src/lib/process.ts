import { SERVICES } from "./catalog";
import type { Job, Service, ServiceSegment } from "./types";

export function segmentsFor(serviceId: string): ServiceSegment[] {
  return SERVICES.find((s) => s.id === serviceId)?.segments ?? [{ title: "İşlem", minutes: 30 }];
}

export function totalMinutes(segments: ServiceSegment[]) {
  return segments.reduce((n, s) => n + s.minutes, 0);
}

export function occupancyMin(service: Service) {
  return service.durationMin + service.bufferMin;
}

export function elapsedMinutes(startedAt: string, now = Date.now()) {
  return Math.max(0, (now - new Date(startedAt).getTime()) / 60_000);
}

/** -1 = henüz başlamadı, segments.length = bitti */
export function segmentIndexAt(segments: ServiceSegment[], startedAt: string | undefined, now = Date.now()) {
  if (!startedAt || segments.length === 0) return -1;
  let acc = 0;
  const elapsed = elapsedMinutes(startedAt, now);
  for (let i = 0; i < segments.length; i++) {
    acc += segments[i].minutes;
    if (elapsed < acc) return i;
  }
  return segments.length;
}

export function jobClock(job: Pick<Job, "segments" | "startedAt" | "status">, now = Date.now()) {
  const segments = job.segments?.length ? job.segments : [];
  if (!job.startedAt || job.status === "iptal") {
    return { index: -1, done: false, elapsed: 0, remaining: totalMinutes(segments), title: "Giriş bekleniyor" };
  }
  const index = segmentIndexAt(segments, job.startedAt, now);
  const total = totalMinutes(segments);
  const elapsed = elapsedMinutes(job.startedAt, now);
  if (index >= segments.length) {
    return { index: segments.length, done: true, elapsed, remaining: 0, title: "Teslim" };
  }
  return {
    index,
    done: false,
    elapsed,
    remaining: Math.max(0, total - elapsed),
    title: segments[index]?.title ?? "İşlem",
  };
}

export function hydrateJob(job: Job): Job {
  const segs = job.segments?.length ? job.segments : segmentsFor(job.serviceId);
  const started = Boolean(job.startedAt) && job.status !== "giris-bekleniyor";
  return {
    ...job,
    segments: segs,
    currentSegmentIndex: job.currentSegmentIndex ?? (started ? 0 : -1),
    notifiedSegmentIndex: job.notifiedSegmentIndex ?? (started ? 0 : -1),
    status: job.startedAt ? job.status : job.status === "iptal" || job.status === "teslim" ? job.status : "giris-bekleniyor",
  };
}
