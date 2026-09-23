"use client";

import { PanelShell } from "@/components/panel-shell";
import { CAMPAIGNS } from "@/lib/catalog";

export default function PanelKampanyalar() {
  return (
    <PanelShell>
      <h1 className="font-[family-name:var(--font-display)] text-3xl uppercase">Kampanyalar</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {CAMPAIGNS.map((c) => (
          <div key={c.id} className="rounded-xl border border-amber-500/20 bg-zinc-900/40 p-4">
            <p className="font-medium text-zinc-100">{c.title}</p>
            <p className="mt-2 text-sm text-zinc-400">{c.blurb}</p>
            <p className="mt-3 text-xs text-amber-200">
              {c.couponCode} · {c.audience} · {c.ends}
            </p>
          </div>
        ))}
      </div>
    </PanelShell>
  );
}
