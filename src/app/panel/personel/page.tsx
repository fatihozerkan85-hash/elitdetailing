"use client";

import { PanelShell } from "@/components/panel-shell";
import { Progress } from "@/components/ui/progress";
import { useStore } from "@/lib/store";

export default function PersonelPage() {
  const { technicians, jobs, roadside } = useStore();
  return (
    <PanelShell>
      <h1 className="font-[family-name:var(--font-display)] text-3xl uppercase">Personel yükü</h1>
      <p className="mt-1 text-sm text-zinc-500">Açık iş ve saha çağrılarına göre anlık yük (demo).</p>
      <ul className="mt-8 space-y-5">
        {technicians.map((t) => {
          const openJobs = jobs.filter((j) => j.technicianId === t.id && j.status !== "teslim" && j.status !== "iptal").length;
          const openRs = roadside.filter((r) => r.technicianId === t.id && r.status !== "tamamlandi" && r.status !== "iptal").length;
          const load = Math.min(100, (openJobs + openRs) * 28 + 12);
          return (
            <li key={t.id} className="rounded-xl border border-white/10 p-4">
              <div className="flex flex-wrap justify-between gap-2 text-sm">
                <div>
                  <p className="font-medium">{t.name}</p>
                  <p className="text-zinc-500">
                    {t.role} · {t.shift}
                  </p>
                </div>
                <p className="text-amber-200">
                  {openJobs} iş · {openRs} çağrı
                </p>
              </div>
              <Progress value={load} className="mt-3" />
            </li>
          );
        })}
      </ul>
    </PanelShell>
  );
}
