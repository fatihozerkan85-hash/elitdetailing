"use client";

import { PanelShell } from "@/components/panel-shell";
import { ACCESSORIES } from "@/lib/catalog";

export default function PanelStok() {
  return (
    <PanelShell>
      <h1 className="font-[family-name:var(--font-display)] text-3xl uppercase">Stok</h1>
      <div className="mt-6 overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead className="bg-white/5 text-zinc-500">
            <tr>
              <th className="px-3 py-2">Ürün</th>
              <th className="px-3 py-2">Kategori</th>
              <th className="px-3 py-2">Stok</th>
            </tr>
          </thead>
          <tbody>
            {ACCESSORIES.map((a) => (
              <tr key={a.id} className="border-t border-white/10">
                <td className="px-3 py-3">{a.name}</td>
                <td className="px-3 py-3 text-zinc-500">{a.category}</td>
                <td className={a.stock < 5 ? "px-3 py-3 text-amber-300" : "px-3 py-3"}>{a.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PanelShell>
  );
}
