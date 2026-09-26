"use client";

import Link from "next/link";
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
  const { roadside, technicians, updateRoadsideStatus, assignTechnician } = useStore();
  return (
    <PanelShell>
      <h1 className="font-[family-name:var(--font-display)] text-3xl uppercase">Yol yardım</h1>
      <div className="mt-6 grid gap-3">
        {roadside.length === 0 ? (
          <p className="text-sm text-zinc-500">Açık çağrı yok.</p>
        ) : null}
        {roadside.map((r) => {
          const n = next[r.status];
          const tech = technicians.find((t) => t.id === r.technicianId);
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
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <label className="text-xs text-zinc-500">
                  Personel{" "}
                  <select
                    className="ml-1 h-8 rounded-md border border-input bg-transparent px-2 text-xs"
                    value={r.technicianId || ""}
                    onChange={(e) => assignTechnician(r.id, e.target.value)}
                  >
                    <option value="" style={{ color: "#111", backgroundColor: "#fff" }}>
                      Seç
                    </option>
                    {technicians.map((t) => (
                      <option key={t.id} value={t.id} style={{ color: "#111", backgroundColor: "#fff" }}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </label>
                {tech ? <span className="text-xs text-zinc-500">{tech.name}</span> : null}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {n ? (
                  <Button size="sm" onClick={() => updateRoadsideStatus(r.id, n)}>
                    {ROADSIDE_STATUS_LABEL[n]}
                  </Button>
                ) : null}
                {r.status !== "iptal" && r.status !== "tamamlandi" ? (
                  <Button size="sm" variant="destructive" onClick={() => updateRoadsideStatus(r.id, "iptal", "İptal")}>
                    İptal
                  </Button>
                ) : null}
                <Button size="sm" variant="outline" asChild>
                  <Link href={`/yonetici/isler/${r.id}`}>Detay</Link>
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </PanelShell>
  );
}
