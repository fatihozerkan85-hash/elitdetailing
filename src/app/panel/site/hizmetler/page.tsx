"use client";

import { toast } from "sonner";
import { PanelShell } from "@/components/panel-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CATEGORY_LABEL } from "@/lib/catalog";
import { uid } from "@/lib/format";
import { newServiceDraft, SERVICE_CATEGORIES, type CmsHomeService, type CmsService } from "@/lib/site-cms";
import { useStore } from "@/lib/store";

export default function SiteHizmetlerPage() {
  const { cms, patchCms } = useStore();
  const services = cms.services;
  const homeServices = cms.homeServices;

  function updSvc(id: string, patch: Partial<CmsService>) {
    patchCms({ services: services.map((s) => (s.id === id ? { ...s, ...patch } : s)) });
  }

  function updHome(id: string, patch: Partial<CmsHomeService>) {
    patchCms({ homeServices: homeServices.map((s) => (s.id === id ? { ...s, ...patch } : s)) });
  }

  return (
    <PanelShell>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl uppercase">Hizmetler & fiyatlar</h1>
          <p className="mt-1 text-sm text-zinc-400">Katalog (randevu/ödeme) ve ana sayfa kartları.</p>
        </div>
        <Button
          onClick={() => {
            patchCms({ services: [...services, newServiceDraft()] });
            toast.success("Hizmet eklendi");
          }}
        >
          Katalog hizmeti ekle
        </Button>
      </div>

      <h2 className="mt-10 text-sm tracking-widest text-zinc-500 uppercase">Katalog</h2>
      <div className="mt-3 space-y-4">
        {services.map((s) => (
          <div key={s.id} className="rounded-xl border border-white/10 p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap gap-4 text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={s.active} onChange={(e) => updSvc(s.id, { active: e.target.checked })} />
                  Aktif
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={s.discovery} onChange={(e) => updSvc(s.id, { discovery: e.target.checked })} />
                  Keşif (önce ücretsiz)
                </label>
              </div>
              <Button size="sm" variant="destructive" onClick={() => patchCms({ services: services.filter((x) => x.id !== s.id) })}>
                Sil
              </Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="grid gap-1">
                <Label>ID</Label>
                <Input value={s.id} onChange={(e) => updSvc(s.id, { id: e.target.value })} />
              </div>
              <div className="grid gap-1">
                <Label>Ad</Label>
                <Input value={s.name} onChange={(e) => updSvc(s.id, { name: e.target.value })} />
              </div>
              <div className="grid gap-1">
                <Label>Kategori</Label>
                <select
                  className="h-9 rounded-lg border border-input bg-input/30 px-2 text-sm"
                  value={s.category}
                  onChange={(e) => updSvc(s.id, { category: e.target.value as CmsService["category"] })}
                >
                  {SERVICE_CATEGORIES.map((c) => (
                    <option key={c} value={c} style={{ color: "#111", backgroundColor: "#fff" }}>
                      {CATEGORY_LABEL[c]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-1">
                <Label>Fiyat (₺)</Label>
                <Input type="number" value={s.fromPrice} onChange={(e) => updSvc(s.id, { fromPrice: Number(e.target.value) })} />
              </div>
              <div className="grid gap-1">
                <Label>Süre (dk)</Label>
                <Input type="number" value={s.durationMin} onChange={(e) => updSvc(s.id, { durationMin: Number(e.target.value) })} />
              </div>
              <div className="grid gap-1">
                <Label>Tampon (dk)</Label>
                <Input type="number" value={s.bufferMin} onChange={(e) => updSvc(s.id, { bufferMin: Number(e.target.value) })} />
              </div>
              <div className="grid gap-1 sm:col-span-2">
                <Label>Kısa</Label>
                <Input value={s.short} onChange={(e) => updSvc(s.id, { short: e.target.value })} />
              </div>
              <div className="grid gap-1 sm:col-span-2 lg:col-span-4">
                <Label>Açıklama</Label>
                <Textarea value={s.description} onChange={(e) => updSvc(s.id, { description: e.target.value })} rows={2} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm tracking-widest text-zinc-500 uppercase">Ana sayfa hizmet kartları</h2>
        <Button
          size="sm"
          onClick={() => {
            const row: CmsHomeService = {
              id: uid("hs").toLowerCase(),
              title: "Yeni kart",
              subtitle: "",
              priceLabel: "0 ₺",
              duration: "30 dk",
              tag: "",
              icon: "/services/premium-oto-yikama.png",
              href: "/randevu",
              active: true,
            };
            patchCms({ homeServices: [...homeServices, row] });
          }}
        >
          Kart ekle
        </Button>
      </div>
      <div className="mt-3 space-y-4">
        {homeServices.map((s) => (
          <div key={s.id} className="rounded-xl border border-white/10 p-4">
            <div className="mb-3 flex justify-between">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={s.active} onChange={(e) => updHome(s.id, { active: e.target.checked })} />
                Aktif
              </label>
              <Button size="sm" variant="destructive" onClick={() => patchCms({ homeServices: homeServices.filter((x) => x.id !== s.id) })}>
                Sil
              </Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {(
                [
                  ["title", "Başlık"],
                  ["subtitle", "Alt başlık"],
                  ["priceLabel", "Fiyat yazısı"],
                  ["duration", "Süre"],
                  ["tag", "Etiket"],
                  ["icon", "İkon yolu"],
                  ["href", "Link"],
                ] as const
              ).map(([key, label]) => (
                <div key={key} className="grid gap-1">
                  <Label>{label}</Label>
                  <Input value={String(s[key])} onChange={(e) => updHome(s.id, { [key]: e.target.value })} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </PanelShell>
  );
}
