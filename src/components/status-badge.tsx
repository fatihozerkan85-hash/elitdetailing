import { Badge } from "@/components/ui/badge";
import { JOB_FLOW, JOB_STATUS_LABEL, ROADSIDE_STATUS_LABEL } from "@/lib/catalog";
import { jobClock } from "@/lib/process";
import type { Job, ServiceSegment } from "@/lib/types";
import { cn } from "@/lib/utils";

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    "giris-bekleniyor": "border-amber-400/40 bg-amber-400/15 text-amber-100",
    kuyrukta: "border-zinc-500/40 bg-zinc-500/15 text-zinc-200",
    yikamada: "border-sky-400/40 bg-sky-400/15 text-sky-200",
    kurulama: "border-amber-400/40 bg-amber-400/15 text-amber-100",
    teslim: "border-emerald-400/40 bg-emerald-400/15 text-emerald-200",
    iptal: "border-red-400/40 bg-red-400/15 text-red-200",
    alindi: "border-zinc-500/40 bg-zinc-500/15 text-zinc-200",
    yonlendirildi: "border-violet-400/40 bg-violet-400/15 text-violet-200",
    yolda: "border-amber-400/40 bg-amber-400/15 text-amber-100",
    yerinde: "border-sky-400/40 bg-sky-400/15 text-sky-200",
    tamamlandi: "border-emerald-400/40 bg-emerald-400/15 text-emerald-200",
    bekliyor: "border-amber-400/40 bg-amber-400/15 text-amber-100",
    onaylandi: "border-emerald-400/40 bg-emerald-400/15 text-emerald-200",
    talep: "border-zinc-500/40 bg-zinc-500/15 text-zinc-200",
    hazirlaniyor: "border-sky-400/40 bg-sky-400/15 text-sky-200",
    hazir: "border-amber-400/40 bg-amber-400/15 text-amber-100",
    kritik: "border-red-400/50 bg-red-500/20 text-red-100",
    yuksek: "border-orange-400/40 bg-orange-400/15 text-orange-100",
    normal: "border-zinc-500/40 bg-zinc-500/10 text-zinc-300",
  };
  const label =
    JOB_STATUS_LABEL[status] ??
    ROADSIDE_STATUS_LABEL[status] ??
    status.replace("-", " ");
  return (
    <Badge variant="outline" className={cn("capitalize", map[status] ?? "")}>
      {label}
    </Badge>
  );
}

export function SegmentPipeline({
  segments,
  currentIndex,
  started,
}: {
  segments: ServiceSegment[];
  currentIndex: number;
  started: boolean;
}) {
  if (!segments.length) return null;
  const idx = started ? currentIndex : -1;
  return (
    <ol className="grid gap-1 sm:grid-cols-2 lg:grid-cols-4">
      {segments.map((s, i) => (
        <li
          key={`${s.title}-${i}`}
          className={cn(
            "rounded-md border px-2 py-2 text-center",
            started && i === idx
              ? "border-amber-400/50 bg-amber-400/15 text-amber-100"
              : started && i < idx
                ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
                : "border-white/10 text-zinc-500",
          )}
        >
          <p className="text-[10px] tracking-wide uppercase">{s.title}</p>
          <p className="mt-1 text-xs">{s.minutes} dk</p>
        </li>
      ))}
    </ol>
  );
}

export function JobPipeline({ current, job }: { current?: string; job?: Job }) {
  if (job?.segments?.length) {
    const clock = jobClock(job);
    const started = Boolean(job.startedAt) && job.status !== "giris-bekleniyor";
    return (
      <SegmentPipeline
        segments={job.segments}
        currentIndex={clock.done ? job.segments.length : clock.index}
        started={started}
      />
    );
  }
  const idx = JOB_FLOW.indexOf(current as (typeof JOB_FLOW)[number]);
  return (
    <ol className="grid grid-cols-4 gap-1">
      {JOB_FLOW.map((s, i) => (
        <li
          key={s}
          className={cn(
            "rounded-md border px-1 py-2 text-center text-[10px] tracking-wide uppercase",
            i <= idx && current !== "iptal"
              ? "border-amber-400/40 bg-amber-400/10 text-amber-100"
              : "border-white/10 text-zinc-500",
          )}
        >
          {JOB_STATUS_LABEL[s]}
        </li>
      ))}
    </ol>
  );
}
