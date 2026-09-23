"use client";

import { PanelShell } from "@/components/panel-shell";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";

export default function PanelRandevular() {
  const { appointments, updateAppointmentStatus } = useStore();
  return (
    <PanelShell>
      <h1 className="font-[family-name:var(--font-display)] text-3xl uppercase">Randevular</h1>
      <div className="mt-6 overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-white/5 text-zinc-500">
            <tr>
              <th className="px-3 py-2 font-medium">Tarih</th>
              <th className="px-3 py-2 font-medium">Müşteri</th>
              <th className="px-3 py-2 font-medium">Hizmet</th>
              <th className="px-3 py-2 font-medium">Durum</th>
              <th className="px-3 py-2 font-medium" />
            </tr>
          </thead>
          <tbody>
            {appointments.map((a) => (
              <tr key={a.id} className="border-t border-white/10">
                <td className="px-3 py-3 whitespace-nowrap">
                  {a.date} {a.time}
                </td>
                <td className="px-3 py-3">
                  {a.customerName}
                  <div className="plate text-xs text-zinc-500">{a.plate}</div>
                </td>
                <td className="px-3 py-3">{a.serviceName}</td>
                <td className="px-3 py-3">
                  <StatusBadge status={a.status} />
                </td>
                <td className="px-3 py-3">
                  {a.status === "bekliyor" ? (
                    <Button size="sm" onClick={() => updateAppointmentStatus(a.id, "onaylandi")}>
                      Onayla
                    </Button>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PanelShell>
  );
}
