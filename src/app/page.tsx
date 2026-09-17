"use client";

import Link from "next/link";
import { ArrowRight, Clock, Droplets, LifeBuoy, ShieldCheck, Sparkles, Wrench } from "lucide-react";
import { PublicShell } from "@/components/public-shell";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BRAND, CATEGORY_LABEL, SERVICES } from "@/lib/catalog";
import { cn } from "@/lib/utils";

const pillars = [
  { icon: Droplets, title: "Oto yıkama", text: "Dış, iç, motor, jant — kuyruk ve teslim bildirimleri otomatik." },
  { icon: Sparkles, title: "Detailing", text: "Pasta-cila, far, koltuk, boya koruma keşfi randevu ile." },
  { icon: Wrench, title: "Lastik", text: "Değişim, yama, balans. Ebatı yazın, sıra numarasını izleyin." },
  { icon: LifeBuoy, title: "Yol yardım", text: "Akü, stepne, çekici, yakıt. Konum notu yeter, aramayın." },
];

export default function HomePage() {
  const cats = Array.from(new Set(SERVICES.map((s) => s.category)));

  return (
    <PublicShell>
      <section className="metal-grid relative overflow-hidden border-b border-white/10">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
          <div>
            <p className="text-[11px] tracking-[0.35em] text-amber-300/90 uppercase">Premium yerel oto merkezi</p>
            <h1 className="mt-4 font-[family-name:var(--font-display)] text-5xl leading-[0.95] font-semibold tracking-tight text-zinc-50 uppercase md:text-7xl">
              Elit
              <br />
              Otomotiv
            </h1>
            <p className="mt-5 max-w-md text-lg text-zinc-400">{BRAND.tagline}</p>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-zinc-500">
              WhatsApp karmaşası yerine plaka, randevu ve yol yardım tek ekranda. Temsilciye bağlanmadan yıkama
              kuyruğu, lastik işi ve acil çağrı takibi.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/randevu" className={cn(buttonVariants({ size: "lg" }))}>
                Randevu al <ArrowRight className="size-4" />
              </Link>
              <Link href="/yol-yardim" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
                Acil yol yardım
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-4 text-xs text-zinc-500">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-3.5 text-amber-400" /> {BRAND.hours}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="size-3.5 text-amber-400" /> {BRAND.city} · {BRAND.instagramHandle}
              </span>
            </div>
          </div>
          <div className="relative">
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-800/80 via-zinc-900 to-black p-6 shadow-[0_0_80px_-20px_rgba(212,175,55,0.35)]">
              <p className="text-[10px] tracking-[0.3em] text-zinc-500 uppercase">Canlı zemin (demo)</p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {[
                  ["Kuyrukta", "3 araç"],
                  ["Yıkamada", "1 hat"],
                  ["Yol yardım", "2 açık"],
                  ["Teslim bekleyen", "1"],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-lg border border-white/10 bg-black/30 p-4">
                    <p className="text-[11px] text-zinc-500">{k}</p>
                    <p className="mt-1 font-[family-name:var(--font-display)] text-2xl text-amber-200">{v}</p>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-xs leading-relaxed text-zinc-500">
                Sahip panosunda her işin müşterisi, plakası, tahmini ücreti ve zaman çizelgesi görünür. Müşteri aynı
                kaydı ‘İş takibi’nden izler.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="font-[family-name:var(--font-display)] text-3xl tracking-wide uppercase">Neden self-servis?</h2>
        <p className="mt-2 max-w-2xl text-sm text-zinc-500">
          Telefon hatları temsilciyi yorar. Bu uygulama randevu, acil çağrı, aksesuar ve SSS ile ilk teması otomatikleştirir.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p) => (
            <Card key={p.title} className="border-white/10 bg-zinc-900/60">
              <CardHeader>
                <p.icon className="size-5 text-amber-400" />
                <CardTitle className="text-base">{p.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-zinc-400">{p.text}</CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-black/30">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-[family-name:var(--font-display)] text-3xl tracking-wide uppercase">Hizmet kategorileri</h2>
            <Link href="/hizmetler" className="text-sm text-amber-300 hover:underline">
              Tüm katalog →
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-2">
            {cats.map((c) => (
              <Link
                key={c}
                href={`/hizmetler#${c}`}
                className="rounded-full border border-white/15 px-4 py-2 text-sm text-zinc-300 hover:border-amber-400/50 hover:text-amber-200"
              >
                {CATEGORY_LABEL[c]}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-r from-amber-500/10 to-transparent p-8 md:flex md:items-center md:justify-between">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-2xl uppercase">İşletme sahibi misiniz?</h2>
            <p className="mt-2 text-sm text-zinc-400">PIN ile panoya girin: bugünün işleri, gelir, personel yükü, bildirimler.</p>
          </div>
          <Link href="/giris" className={cn(buttonVariants({ size: "lg" }), "mt-4 md:mt-0")}>
            Demo giriş
          </Link>
        </div>
      </section>
    </PublicShell>
  );
}
