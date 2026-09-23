"use client";

import { PanelShell } from "@/components/panel-shell";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/store";

export default function PanelKuponlar() {
  const { coupons } = useStore();
  return (
    <PanelShell>
      <h1 className="font-[family-name:var(--font-display)] text-3xl uppercase">Kuponlar</h1>
      <div className="mt-6 overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="bg-white/5 text-zinc-500">
            <tr>
              <th className="px-3 py-2">Kod</th>
              <th className="px-3 py-2">Başlık</th>
              <th className="px-3 py-2">Müşteri</th>
              <th className="px-3 py-2">Durum</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c.id} className="border-t border-white/10">
                <td className="px-3 py-3 font-mono text-amber-200">{c.code}</td>
                <td className="px-3 py-3">{c.title}</td>
                <td className="px-3 py-3 text-zinc-500">{c.customerId}</td>
                <td className="px-3 py-3">
                  <Badge variant="secondary">{c.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PanelShell>
  );
}
