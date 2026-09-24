"use client";

import { PanelShell } from "@/components/panel-shell";
import { GeoLink } from "@/components/geo-link";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { ROADSIDE_STATUS_LABEL } from "@/lib/catalog";
import { useStore } from "@/lib/store";
import type { RoadsideStatus } from "@/lib/types";

const next: Record<string, RoadsideStatus | undefined> = {
  alindi: "yonlendirildi",
  yonlendirildi: "yolda",
  yolda: "yerinde",
  yerinde: "tamamlandi",
};

export default function PanelYolYardim() {
  const { roadside, updateRoadsideStatus } = useStore();
  return (
    <PanelShell>
      <h1 className="font-[family-name:var(--font-display)] text-3xl uppercase">Yol yardım</h1>
      <div className="mt-6 grid gap-3">
        {roadside.map((r) => {
          const n = next[r.status];
          return (
            <div key={r.id} className="rounded-xl border border-white/10 bg-zinc-900/40 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-medium">
                  {r.id} · {r.issue}
                </p>
                <StatusBadge status={r.status} />
              </div>
              <p className="mt-1 text-sm text-zinc-400">
                {r.customerName} · <span className="plate">{r.plate}</span> · {r.urgency}
              </p>
              <p className="mt-1 text-xs text-zinc-500">{r.location}</p>
              <div className="mt-2">
                <GeoLink lat={r.lat} lng={r.lng} accuracyM={r.accuracyM} />
              </div>
              {n ? (
                <Button className="mt-3" size="sm" onClick={() => updateRoadsideStatus(r.id, n)}>
                  {ROADSIDE_STATUS_LABEL[n]}
                </Button>
              ) : null}
            </div>
          );
        })}
      </div>
    </PanelShell>
  );
}
