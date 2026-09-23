"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Droplets,
  LifeBuoy,
  ShieldCheck,
  Sparkles,
  Wrench,
} from "lucide-react";
import { PublicShell } from "@/components/public-shell";
import { buttonVariants } from "@/components/ui/button";
import { BRAND, CATEGORY_LABEL, JOB_FLOW, SERVICES } from "@/lib/catalog";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const quick = [
  { href: "/hizmetler#yikama", label: "Yıkama", icon: Droplets },
  { href: "/hizmetler#lastik", label: "Lastik", icon: Wrench },
  { href: "/aksesuar", label: "Aksesuar", icon: ShieldCheck },
  { href: "/yol-yardim", label: "Yol yardım", icon: LifeBuoy },
  { href: "/hizmetler#detailing", label: "Detailing", icon: Sparkles },
  { href: "/randevu", label: "Randevu", icon: CalendarDays },
];

export default function HomePage() {
  const { jobs, session, customers } = useStore();
  const me = customers.find((c) => c.id === session.customerId) ?? customers[0];
  const active = jobs.find((j) => j.status !== "teslim" && j.status !== "iptal");
  const idx = active ? Math.max(JOB_FLOW.indexOf(active.status as (typeof JOB_FLOW)[number]), 0) : 0;
  const pct = active ? Math.round(((idx + 1) / JOB_FLOW.length) * 100) : 0;
  const cats = Array.from(new Set(SERVICES.map((s) => s.category)));

  return (
    <PublicShell>
      <section className="metal-grid relative overflow-hidden border-b border-white/10">
        <div className="mx-auto grid max-w-6xl items-start gap-8 px-4 py-8 sm:py-12 lg:grid-cols-2 lg:py-20">
          <div>
            <p className="text-[11px] tracking-[0.35em] text-amber-300/90 uppercase">Ankara · premium detailing</p>
            <div className="mt-3 flex items-center gap-3 sm:gap-5">
              <Image
                src="/branding/elit-logo.png"
                alt=""
                width={1106}
                height={906}
                className="h-20 w-auto shrink-0 object-contain sm:h-28 lg:h-32"
                priority
              />
              <h1 className="font-[family-name:var(--font-display)] text-4xl leading-[0.95] font-semibold tracking-tight text-zinc-50 sm:text-6xl lg:text-7xl">
                ELIT
                <br />
                DETAILING
              </h1>
            </div>
            <p className="mt-4 max-w-md text-base text-zinc-400 sm:text-lg">{BRAND.tagline}</p>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-zinc-500">
              Kurumsal site ve self-servis aynı yerde. Randevu, yol yardım, kupon ve iş takibi — temsilciye bağlanmadan.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/randevu" className={cn(buttonVariants({ size: "lg" }))}>
                Randevu al <ArrowRight className="size-4" />
              </Link>
              <Link href="/yol-yardim" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
                Acil yol yardım
              </Link>
            </div>
          </div>

          <div className="gold-ring rounded-2xl border border-amber-500/20 bg-gradient-to-br from-zinc-800/90 via-zinc-950 to-black p-4 sm:p-6">
            <p className="text-[10px] tracking-[0.3em] text-amber-200/80 uppercase">Hoş geldiniz</p>
            <div className="mt-3 rounded-xl border border-white/10 bg-black/40 p-4">
              <p className="text-[10px] tracking-widest text-zinc-500 uppercase">Araç</p>
              <p className="mt-1 font-[family-name:var(--font-display)] text-xl text-zinc-50 sm:text-2xl">
                {me?.vehicle ?? "2021 BMW 5.20i"}
              </p>
              <p className="plate mt-1 text-sm text-amber-200">{me?.plate ?? "06 ELT 01"}</p>
              <p className="mt-2 text-xs text-zinc-500">Bakım durumu: İyi</p>
            </div>

            <p className="mt-5 text-[10px] tracking-[0.25em] text-zinc-500 uppercase">Hızlı hizmetler</p>
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {quick.map((q) => (
                <Link
                  key={q.href}
                  href={q.href}
                  className="flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-black/30 px-2 py-4 text-center text-xs text-zinc-300 transition hover:border-amber-400/40 hover:text-amber-200"
                >
                  <q.icon className="size-5 text-amber-300" />
                  {q.label}
                </Link>
              ))}
            </div>

            <div className="mt-5 rounded-xl border border-white/10 bg-black/30 p-4">
              <p className="text-[10px] tracking-[0.25em] text-zinc-500 uppercase">Aktif iş</p>
              {active ? (
                <>
                  <div className="mt-2 flex items-center justify-between text-sm">
                    <span>
                      {active.serviceName} · %{pct}
                    </span>
                    <Link href={`/takip/${active.id}`} className="text-amber-300">
                      →
                    </Link>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-amber-400 transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </>
              ) : (
                <p className="mt-2 text-sm text-zinc-500">Açık iş yok. Randevu veya yol yardım ile başlayın.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <h2 className="font-[family-name:var(--font-display)] text-2xl tracking-wide uppercase sm:text-3xl">Hizmetler</h2>
        <p className="mt-2 max-w-2xl text-sm text-zinc-500">
          Detailing odaklı; yıkama, lastik, aksesuar ve acil yol yardım aynı katalogda.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
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
      </section>

      <section className="border-y border-white/10 bg-black/30">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3 sm:py-16">
          <div>
            <p className="text-[10px] tracking-[0.3em] text-amber-300 uppercase">Adres</p>
            <p className="mt-2 text-sm text-zinc-400">
              {BRAND.address}
              <br />
              {BRAND.hours}
            </p>
          </div>
          <div>
            <p className="text-[10px] tracking-[0.3em] text-amber-300 uppercase">İletişim</p>
            <p className="mt-2 text-sm text-zinc-400">{BRAND.phone}</p>
            <a className="text-sm text-amber-300 hover:underline" href={BRAND.instagram} target="_blank" rel="noreferrer">
              {BRAND.instagramHandle}
            </a>
          </div>
          <div>
            <p className="text-[10px] tracking-[0.3em] text-amber-300 uppercase">Kampanya</p>
            <Link href="/kampanyalar" className="mt-2 block text-sm text-zinc-300 hover:text-amber-200">
              Aktif kuponları gör →
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-r from-amber-500/10 to-transparent p-6 sm:flex sm:items-center sm:justify-between sm:p-8">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-xl uppercase sm:text-2xl">İşletme paneli</h2>
            <p className="mt-2 text-sm text-zinc-400">PIN 2580 · günün işleri, stok, kupon, gelir.</p>
          </div>
          <Link href="/giris" className={cn(buttonVariants({ size: "lg" }), "mt-4 sm:mt-0")}>
            Demo giriş
          </Link>
        </div>
      </section>
    </PublicShell>
  );
}
