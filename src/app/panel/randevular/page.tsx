"use client";

import Link from "next/link";
import { PanelShell } from "@/components/panel-shell";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { occupancyMin } from "@/lib/process";
import { useStore } from "@/lib/store";

export default function PanelRandevular() {
  const { appointments, jobs, cms, updateAppointmentStatus, checkInAppointment } = useStore();
  return (
    <PanelShell>
      <h1 className="font-[family-name:var(--font-display)] text-3xl uppercase">Randevular</h1>
      <p className="mt-2 text-sm text-zinc-500">
        Slot onayı defteri kilitler. Süreç, randevu saatiyle değil <span className="text-zinc-300">giriş onayı</span> ile başlar.
      </p>
      <div className="mt-6 overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-white/5 text-zinc-500">
            <tr>
              <th className="px-3 py-2 font-medium">Tarih</th>
              <th className="px-3 py-2 font-medium">Müşteri</th>
              <th className="px-3 py-2 font-medium">Hizmet / süre</th>
              <th className="px-3 py-2 font-medium">Durum</th>
              <th className="px-3 py-2 font-medium" />
            </tr>
          </thead>
          <tbody>
            {appointments.map((a) => {
              const svc = cms.services.find((s) => s.id === a.serviceId);
              const job = jobs.find((j) => j.appointmentId === a.id);
              const started = Boolean(job?.startedAt);
              return (
                <tr key={a.id} className="border-t border-white/10">
                  <td className="px-3 py-3 whitespace-nowrap">
                    {a.date} {a.time}
                  </td>
                  <td className="px-3 py-3">
                    {a.customerName}
                    <div className="plate text-xs text-zinc-500">{a.plate}</div>
                  </td>
                  <td className="px-3 py-3">
                    {a.serviceName}
                    <div className="text-xs text-zinc-500">
                      {svc
                        ? `${svc.durationMin} dk · ${svc.segments.length} adım · defter ${occupancyMin(svc)} dk`
                        : ""}
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <StatusBadge status={a.status} />
                    {started ? (
                      <p className="mt-1 text-[10px] tracking-wide text-emerald-300 uppercase">Süreç açık</p>
                    ) : a.status !== "iptal" ? (
                      <p className="mt-1 text-[10px] tracking-wide text-amber-200/80 uppercase">Giriş bekleniyor</p>
                    ) : null}
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex flex-wrap gap-2">
                      {a.status === "bekliyor" ? (
                        <Button size="sm" variant="outline" onClick={() => updateAppointmentStatus(a.id, "onaylandi")}>
                          Slot onayla
                        </Button>
                      ) : null}
                      {job && !started && job.status !== "iptal" && a.status !== "iptal" ? (
                        <Button size="sm" onClick={() => checkInAppointment(a.id)}>
                          Girişi onayla
                        </Button>
                      ) : null}
                      {job ? (
                        <Button size="sm" variant="ghost" asChild>
                          <Link href={`/yonetici/isler/${job.id}`}>İş</Link>
                        </Button>
                      ) : null}
                      {a.status !== "iptal" && a.status !== "tamamlandi" ? (
                        <Button size="sm" variant="destructive" onClick={() => updateAppointmentStatus(a.id, "iptal")}>
                          İptal
                        </Button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </PanelShell>
  );
}
