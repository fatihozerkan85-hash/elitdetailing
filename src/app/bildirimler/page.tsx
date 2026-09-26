"use client";

import Link from "next/link";
import { PublicShell } from "@/components/public-shell";
import { EmptyState } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";

export default function BildirimlerPage() {
  const { notifications, markAllNotificationsRead, campaignNotif, couponNotif, setNotifPrefs } = useStore();
  const mine = notifications.filter(
    (n) =>
      n.audience === "customer" ||
      n.audience === "all" ||
      (!n.audience && !n.href.startsWith("/yonetici") && !n.href.startsWith("/panel")),
  );

  return (
    <PublicShell>
      <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
        <div className="flex items-center justify-between gap-3">
          <h1 className="font-[family-name:var(--font-display)] text-3xl uppercase">Bildirimler</h1>
          <Button size="sm" variant="outline" onClick={markAllNotificationsRead}>
            Tümünü oku
          </Button>
        </div>
        <div className="mt-4 flex flex-col gap-3 rounded-xl border border-white/10 p-4 text-sm sm:flex-row sm:items-center sm:justify-between">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={campaignNotif}
              onChange={(e) => setNotifPrefs({ campaignNotif: e.target.checked })}
            />
            Kampanya bildirimleri
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={couponNotif}
              onChange={(e) => setNotifPrefs({ couponNotif: e.target.checked })}
            />
            Kupon hatırlatma
          </label>
        </div>
        <div className="mt-6 space-y-2">
          {mine.length === 0 ? (
            <EmptyState title="Bildirim yok" hint="Kampanya, kupon ve iş durumları burada görünür." />
          ) : (
            mine.map((n) => (
              <Link
                key={n.id}
                href={n.href}
                className="block rounded-xl border border-white/10 bg-zinc-900/50 p-4 hover:border-amber-400/30"
              >
                <p className="text-sm font-medium text-zinc-100">
                  {!n.read ? <span className="mr-2 inline-block size-1.5 rounded-full bg-amber-400" /> : null}
                  {n.title}
                </p>
                <p className="mt-1 text-sm text-zinc-500">{n.body}</p>
              </Link>
            ))
          )}
        </div>
      </div>
    </PublicShell>
  );
}
