"use client";

import Link from "next/link";
import { PanelShell } from "@/components/panel-shell";
import { EmptyState } from "@/components/site-header";
import { StatusBadge } from "@/components/status-badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { tryFormat } from "@/lib/format";
import { jobClock } from "@/lib/process";
import { useStore } from "@/lib/store";
import { useMemo, useState } from "react";

export default function IslerPage() {
  const { jobs, roadside } = useStore();
  const [q, setQ] = useState("");
  const jf = useMemo(
    () => jobs.filter((j) => `${j.id} ${j.plate} ${j.customerName}`.toLowerCase().includes(q.toLowerCase())),
    [jobs, q],
  );
  const rf = useMemo(
    () => roadside.filter((j) => `${j.id} ${j.plate} ${j.customerName}`.toLowerCase().includes(q.toLowerCase())),
    [roadside, q],
  );

  return (
    <PanelShell>
      <h1 className="font-[family-name:var(--font-display)] text-3xl uppercase">İşler</h1>
      <Input className="mt-4 max-w-sm" placeholder="Plaka, müşteri, kod" value={q} onChange={(e) => setQ(e.target.value)} />
      <Tabs defaultValue="atolye" className="mt-6">
        <TabsList>
          <TabsTrigger value="atolye">Atölye</TabsTrigger>
          <TabsTrigger value="yol">Yol yardım</TabsTrigger>
        </TabsList>
        <TabsContent value="atolye" className="mt-4 space-y-2">
          {jf.length === 0 ? <EmptyState title="İş yok" hint="Aramayı temizleyin veya randevu bekleyin." /> : null}
          {jf.map((j) => (
            <Link
              key={j.id}
              href={`/yonetici/isler/${j.id}`}
              className="flex items-center justify-between gap-3 rounded-lg border border-white/10 p-3 text-sm hover:border-amber-400/30"
            >
              <div>
                <p className="plate">{j.plate}</p>
                <p className="text-zinc-500">
                  {j.id} · {j.customerName} · {j.startedAt ? jobClock(j).title : "Giriş bekleniyor"} · {tryFormat(j.estimate)}
                </p>
              </div>
              <StatusBadge status={j.status} />
            </Link>
          ))}
        </TabsContent>
        <TabsContent value="yol" className="mt-4 space-y-2">
          {rf.length === 0 ? <EmptyState title="Çağrı yok" hint="Yeni yol yardım Talepler üzerinden düşer." /> : null}
          {rf.map((r) => (
            <Link
              key={r.id}
              href={`/yonetici/isler/${r.id}`}
              className="flex items-center justify-between gap-3 rounded-lg border border-white/10 p-3 text-sm hover:border-amber-400/30"
            >
              <div>
                <p className="plate">{r.plate}</p>
                <p className="text-zinc-500">
                  {r.id} · {r.issue} · {r.location.slice(0, 48)}…
                </p>
              </div>
              <StatusBadge status={r.status} />
            </Link>
          ))}
        </TabsContent>
      </Tabs>
    </PanelShell>
  );
}
