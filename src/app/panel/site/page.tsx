"use client";

import Link from "next/link";
import { PanelShell } from "@/components/panel-shell";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { buildDefaultCms } from "@/lib/site-cms";
import { toast } from "sonner";

const links = [
  { href: "/yonetici/site/bannerlar", title: "Kampanya bannerları", desc: "Büyük banner görseli, fiyat, kod, CTA" },
  { href: "/yonetici/site/serit", title: "Kayan şerit", desc: "Üstteki küçük duyuru metinleri" },
  { href: "/yonetici/site/hizmetler", title: "Hizmetler & fiyatlar", desc: "Katalog hizmet ekle/çıkar, fiyat, süre; ana sayfa kartları" },
  { href: "/yonetici/kampanyalar", title: "Kampanya listesi", desc: "Kampanyalar sayfası ve kupon kodları" },
  { href: "/yonetici/kuponlar", title: "Kuponlar", desc: "Müşteri kuponlarını oluştur / sil" },
  { href: "/yonetici/site/metinler", title: "Site metinleri", desc: "Hero, hakkımızda, CTA, iletişim, form açıklamaları" },
  { href: "/yonetici/site/formlar", title: "Formlar", desc: "Randevu / yol yardım / aksesuar alanlarını aç-kapa" },
];

export default function SiteCmsHub() {
  const { setCms } = useStore();
  return (
    <PanelShell>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl uppercase">Site içeriği</h1>
          <p className="mt-2 max-w-2xl text-sm text-zinc-400">
            Banner, şerit, hizmet, fiyat, kampanya, kupon, metin ve formları buradan yönetin. Değişiklikler anında sitede görünür (bu tarayıcıda kaydedilir).
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            setCms(buildDefaultCms());
            toast.success("Varsayılan içerik yüklendi");
          }}
        >
          Varsayılana sıfırla
        </Button>
      </div>
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {links.map((l) => (
          <Link key={l.href} href={l.href}>
            <Card className="h-full border-white/10 bg-zinc-900/50 transition hover:border-amber-400/40">
              <CardHeader>
                <CardTitle className="text-base">{l.title}</CardTitle>
                <CardDescription>{l.desc}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </PanelShell>
  );
}
