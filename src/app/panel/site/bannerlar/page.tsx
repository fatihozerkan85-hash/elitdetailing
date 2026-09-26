"use client";

import { toast } from "sonner";
import { PanelShell } from "@/components/panel-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { uid } from "@/lib/format";
import { useStore } from "@/lib/store";
import type { CmsBanner } from "@/lib/site-cms";

function emptyBanner(): CmsBanner {
  return {
    id: uid("bnr").toLowerCase(),
    tag: "YENİ",
    title: "Kampanya başlığı",
    highlight: "%10",
    desc: "Açıklama",
    cta: "Satın Al",
    code: "YENI",
    serviceId: "ic-dis-yikama",
    listPrice: 1000,
    price: 900,
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1400&h=600&fit=crop&auto=format",
    accent: "#C9A84C",
    active: true,
  };
}

export default function SiteBannerlarPage() {
  const { cms, patchCms } = useStore();
  const banners = cms.banners;

  function update(id: string, patch: Partial<CmsBanner>) {
    patchCms({ banners: banners.map((b) => (b.id === id ? { ...b, ...patch } : b)) });
  }

  return (
    <PanelShell>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl uppercase">Kampanya bannerları</h1>
          <p className="mt-1 text-sm text-zinc-400">Ana sayfa büyük slider. Görsel URL + fiyat → iyzico ödemeli.</p>
        </div>
        <Button
          onClick={() => {
            patchCms({ banners: [...banners, emptyBanner()] });
            toast.success("Banner eklendi");
          }}
        >
          Banner ekle
        </Button>
      </div>
      <div className="mt-6 space-y-6">
        {banners.map((b) => (
          <div key={b.id} className="rounded-xl border border-white/10 bg-zinc-900/40 p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={b.active} onChange={(e) => update(b.id, { active: e.target.checked })} />
                Aktif
              </label>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => {
                  patchCms({ banners: banners.filter((x) => x.id !== b.id) });
                  toast.success("Silindi");
                }}
              >
                Sil
              </Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {(
                [
                  ["tag", "Etiket"],
                  ["title", "Başlık"],
                  ["highlight", "Vurgu"],
                  ["cta", "Buton"],
                  ["code", "Kod"],
                  ["serviceId", "Hizmet ID"],
                  ["accent", "Renk"],
                ] as const
              ).map(([key, label]) => (
                <div key={key} className="grid gap-1">
                  <Label>{label}</Label>
                  <Input value={String(b[key])} onChange={(e) => update(b.id, { [key]: e.target.value })} />
                </div>
              ))}
              <div className="grid gap-1">
                <Label>Liste fiyatı</Label>
                <Input type="number" value={b.listPrice} onChange={(e) => update(b.id, { listPrice: Number(e.target.value) })} />
              </div>
              <div className="grid gap-1">
                <Label>Satış fiyatı (iyzico)</Label>
                <Input type="number" value={b.price} onChange={(e) => update(b.id, { price: Number(e.target.value) })} />
              </div>
              <div className="grid gap-1 sm:col-span-2 lg:col-span-3">
                <Label>Görsel URL</Label>
                <Input value={b.image} onChange={(e) => update(b.id, { image: e.target.value })} />
              </div>
              <div className="grid gap-1 sm:col-span-2 lg:col-span-3">
                <Label>Açıklama</Label>
                <Textarea value={b.desc} onChange={(e) => update(b.id, { desc: e.target.value })} rows={2} />
              </div>
            </div>
            {b.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={b.image} alt="" className="mt-3 h-28 w-full rounded-lg object-cover opacity-90" />
            ) : null}
          </div>
        ))}
      </div>
    </PanelShell>
  );
}
