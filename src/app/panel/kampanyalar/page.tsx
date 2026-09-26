"use client";

import { useState } from "react";
import { toast } from "sonner";
import { PanelShell } from "@/components/panel-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { uid } from "@/lib/format";
import { useStore } from "@/lib/store";
import type { CmsCampaign } from "@/lib/site-cms";

export default function PanelKampanyalar() {
  const { cms, patchCms, broadcastCampaign } = useStore();
  const campaigns = cms.campaigns;

  function update(id: string, patch: Partial<CmsCampaign>) {
    patchCms({ campaigns: campaigns.map((c) => (c.id === id ? { ...c, ...patch } : c)) });
  }

  return (
    <PanelShell>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl uppercase">Kampanyalar</h1>
          <p className="mt-1 text-sm text-zinc-400">
            /kampanyalar listesi, kupon kodları ve e-posta duyurusu.
          </p>
        </div>
        <Button
          onClick={() => {
            patchCms({
              campaigns: [
                ...campaigns,
                {
                  id: uid("cmp").toLowerCase(),
                  title: "Yeni kampanya",
                  blurb: "Açıklama",
                  couponCode: "YENI",
                  ends: "31 Aralık 2026",
                  audience: "Tüm müşteriler",
                  active: true,
                },
              ],
            });
            toast.success("Kampanya eklendi");
          }}
        >
          Kampanya ekle
        </Button>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {campaigns.map((c) => (
          <div key={c.id} className="rounded-xl border border-amber-500/20 bg-zinc-900/40 p-4">
            <div className="mb-3 flex flex-wrap justify-between gap-2">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={c.active} onChange={(e) => update(c.id, { active: e.target.checked })} />
                Aktif
              </label>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const res = broadcastCampaign(c.id);
                    if (res.ok) toast.success(res.message);
                    else toast.error(res.message);
                  }}
                >
                  E-posta gönder
                </Button>
                <Button size="sm" variant="destructive" onClick={() => patchCms({ campaigns: campaigns.filter((x) => x.id !== c.id) })}>
                  Sil
                </Button>
              </div>
            </div>
            <div className="grid gap-2">
              <div className="grid gap-1">
                <Label>Başlık</Label>
                <Input value={c.title} onChange={(e) => update(c.id, { title: e.target.value })} />
              </div>
              <div className="grid gap-1">
                <Label>Açıklama</Label>
                <Textarea value={c.blurb} onChange={(e) => update(c.id, { blurb: e.target.value })} rows={2} />
              </div>
              <div className="grid gap-2 sm:grid-cols-3">
                <div className="grid gap-1">
                  <Label>Kupon kodu</Label>
                  <Input value={c.couponCode} onChange={(e) => update(c.id, { couponCode: e.target.value.toUpperCase() })} />
                </div>
                <div className="grid gap-1">
                  <Label>Bitiş</Label>
                  <Input value={c.ends} onChange={(e) => update(c.id, { ends: e.target.value })} />
                </div>
                <div className="grid gap-1">
                  <Label>Kitle</Label>
                  <Input value={c.audience} onChange={(e) => update(c.id, { audience: e.target.value })} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </PanelShell>
  );
}
