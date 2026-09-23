"use client";

import Link from "next/link";
import { PublicShell } from "@/components/public-shell";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";

export default function ProfilPage() {
  const { session, customers, coupons, campaignNotif, couponNotif, setNotifPrefs, logout } = useStore();
  const me = customers.find((c) => c.id === session.customerId) ?? customers[0];
  const aktif = coupons.filter((c) => c.status === "aktif").length;

  return (
    <PublicShell>
      <div className="mx-auto max-w-lg px-4 py-8 sm:py-12">
        <h1 className="font-[family-name:var(--font-display)] text-3xl uppercase">Profil</h1>
        <div className="mt-6 rounded-2xl border border-white/10 bg-zinc-900/50 p-5">
          <p className="text-lg text-zinc-100">{session.name === "Misafir" ? me.name : session.name}</p>
          <p className="mt-1 text-sm text-zinc-500">{me.phone}</p>
          <p className="plate mt-3 text-amber-200">{me.plate}</p>
          <p className="text-sm text-zinc-400">{me.vehicle}</p>
        </div>
        <div className="mt-4 grid gap-2 text-sm">
          <Link href="/kuponlar" className="rounded-xl border border-white/10 px-4 py-3 hover:border-amber-400/40">
            Kuponlarım · {aktif} aktif
          </Link>
          <Link href="/taleplerim" className="rounded-xl border border-white/10 px-4 py-3 hover:border-amber-400/40">
            Taleplerim
          </Link>
          <label className="flex items-center justify-between rounded-xl border border-white/10 px-4 py-3">
            Kampanya bildirimi
            <input
              type="checkbox"
              checked={campaignNotif}
              onChange={(e) => setNotifPrefs({ campaignNotif: e.target.checked })}
            />
          </label>
          <label className="flex items-center justify-between rounded-xl border border-white/10 px-4 py-3">
            Kupon hatırlatma
            <input
              type="checkbox"
              checked={couponNotif}
              onChange={(e) => setNotifPrefs({ couponNotif: e.target.checked })}
            />
          </label>
        </div>
        <Button className="mt-6 w-full" variant="outline" onClick={logout}>
          Çıkış
        </Button>
      </div>
    </PublicShell>
  );
}
