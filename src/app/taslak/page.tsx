"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { PublicShell } from "@/components/public-shell";

const MUSTERI = [
  { src: "/taslak/musteri-ana.png", title: "Ana", href: "/", note: "Marka, araç özeti, hızlı hizmet ızgarası, aktif iş." },
  { src: "/taslak/musteri-hizmetler.png", title: "Hizmetler", href: "/hizmetler", note: "Katalog kartları, süre ve self-servis." },
  { src: "/taslak/musteri-randevu.png", title: "Randevu", href: "/randevu", note: "Plaka, tarih/saat, hizmet." },
  { src: "/taslak/musteri-yol-yardim.png", title: "Yol yardım", href: "/yol-yardim", note: "Konum notu, aciliyet, acil CTA." },
  { src: "/taslak/musteri-is-takip.png", title: "İş takibi", href: "/takip", note: "Boru hattı kuyrukta → teslim." },
  { src: "/taslak/musteri-taleplerim.png", title: "Taleplerim", href: "/taleplerim", note: "Sistem durum mesajları." },
  { src: "/taslak/musteri-aksesuar.png", title: "Aksesuar", href: "/aksesuar", note: "Stok ve talep formu." },
  { src: "/taslak/musteri-sss.png", title: "SSS", href: "/sss", note: "Temsilcisiz yardım." },
  { src: "/taslak/musteri-bildirimler.png", title: "Bildirimler (taslak)", href: "/taleplerim", note: "Push benzeri kutu." },
  { src: "/taslak/musteri-profil.png", title: "Profil (taslak)", href: "/giris", note: "Plaka ve oturum." },
  { src: "/taslak/musteri-kampanyalar.png", title: "Kampanya (ileri)", href: "/hizmetler", note: "Henüz canlı değil." },
  { src: "/taslak/musteri-kuponlar.png", title: "Kupon (ileri)", href: "/hizmetler", note: "Henüz canlı değil." },
];

const PANEL = [
  { src: "/taslak/isletme-gunun-panosu.png", title: "Günün panosu", href: "/panel", note: "KPI, canlı iş, yol yardım." },
  { src: "/taslak/panel-isler.png", title: "İşler", href: "/panel/isler", note: "Atölye listesi." },
  { src: "/taslak/panel-yol-yardim.png", title: "Yol yardım", href: "/panel/isler", note: "Açık çağrılar." },
  { src: "/taslak/panel-randevular.png", title: "Randevular", href: "/panel", note: "Onay aksiyonu." },
  { src: "/taslak/panel-musteriler.png", title: "Müşteriler", href: "/panel/musteriler", note: "Plaka rehberi." },
  { src: "/taslak/panel-personel.png", title: "Personel", href: "/panel/personel", note: "Yük çubukları." },
  { src: "/taslak/panel-gelir.png", title: "Gelir", href: "/panel/gelir", note: "Teslim + aksesuar." },
  { src: "/taslak/panel-stok.png", title: "Stok (ileri)", href: "/panel/gelir", note: "Aksesuar siparişleri." },
  { src: "/taslak/panel-bildirimler.png", title: "Bildirimler", href: "/panel/bildirimler", note: "Yeni talepler." },
  { src: "/taslak/panel-kampanyalar.png", title: "Kampanya (ileri)", href: "/panel", note: "Taslak." },
  { src: "/taslak/panel-kuponlar.png", title: "Kupon (ileri)", href: "/panel", note: "Taslak." },
];

function Frame({ src, title, href, note }: { src: string; title: string; href: string; note: string }) {
  return (
    <figure className="overflow-hidden rounded-xl border border-white/10 bg-zinc-950">
      <div className="relative aspect-[9/16] max-h-[420px] w-full bg-black md:aspect-auto md:h-[280px]">
        <Image src={src} alt={`${title} taslak çizimi`} fill className="object-contain object-top" sizes="(max-width:768px) 100vw, 33vw" />
      </div>
      <figcaption className="border-t border-white/10 p-3">
        <p className="text-sm text-zinc-100">{title}</p>
        <p className="text-xs text-zinc-500">{note}</p>
        <Link href={href} className="mt-1 inline-block text-xs text-amber-300 hover:underline">
          Canlı ekran →
        </Link>
      </figcaption>
    </figure>
  );
}

function Box({ className = "", children, label }: { className?: string; children?: ReactNode; label?: string }) {
  return (
    <div className={`rounded border border-dashed border-zinc-600 bg-zinc-800/60 p-1.5 ${className}`}>
      {label ? <p className="text-[8px] tracking-wide text-amber-400/80 uppercase">{label}</p> : null}
      {children}
    </div>
  );
}

export default function TaslakPage() {
  return (
    <PublicShell>
      <div className="mx-auto max-w-6xl px-4 py-12">
        <p className="text-[11px] tracking-[0.3em] text-amber-300 uppercase">Ürün tasarım destesi</p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl uppercase">Taslak çizimler</h1>
        <p className="mt-3 max-w-2xl text-sm text-zinc-400">
          Ana ekranların görsel tel kafesleri. Figma MCP bu ortamda kimlik doğrulaması gerektiriyor; deste uygulama içinde
          önizlenir. “İleri” işaretliler henüz canlıya alınmamış fikirlerdir.
        </p>

        <h2 className="mt-12 font-[family-name:var(--font-display)] text-xl uppercase text-amber-200">Müşteri</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MUSTERI.map((m) => (
            <Frame key={m.src} {...m} />
          ))}
        </div>

        <h2 className="mt-14 font-[family-name:var(--font-display)] text-xl uppercase text-amber-200">Sahip / operasyon</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {PANEL.map((m) => (
            <Frame key={m.src} {...m} />
          ))}
        </div>

        <h2 className="mt-14 font-[family-name:var(--font-display)] text-xl uppercase text-amber-200">Bölge haritası</h2>
        <p className="mt-1 text-xs text-zinc-500">Kutular UI bölgeleridir — akış: keşif → form → takip → kutu mesajı.</p>
        <div className="mt-4 grid gap-3 md:grid-cols-4 text-[10px] text-zinc-400">
          <Box label="Landing hero + CTA" className="h-24" />
          <Box label="Form: plaka / konum" className="h-24" />
          <Box label="Boru hattı 4 adım" className="h-24" />
          <Box label="Pano: KPI + 3 sütun" className="h-24" />
        </div>
      </div>
    </PublicShell>
  );
}
