import { Badge } from "@/components/ui/badge";
import { JOB_FLOW, JOB_STATUS_LABEL, ROADSIDE_STATUS_LABEL } from "@/lib/catalog";
import { cn } from "@/lib/utils";

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
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

export function JobPipeline({ current }: { current: string }) {
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
