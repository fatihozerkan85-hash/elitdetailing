"use client";

import Link from "next/link";
import { CustomerCard, CustomerPanel, useMe } from "@/components/customer-panel";
import { EmptyState } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";

export default function BildirimlerPage() {
  const { notifications, markAllNotificationsRead, campaignNotif, couponNotif, setNotifPrefs, session } =
    useStore();
  const me = useMe();
  const mine = notifications.filter(
    (n) =>
      n.audience === "customer" ||
      n.audience === "all" ||
      (!n.audience && !n.href.startsWith("/yonetici") && !n.href.startsWith("/panel")),
  );

  return (
    <CustomerPanel
      title="Bildirimler"
      lead="Kampanya ve kupon e-posta; süreç adımları WhatsApp; burada uygulama özeti."
      className="sm:max-w-2xl"
    >
      {session.role !== "customer" ? (
        <CustomerCard>
          <p className="text-[15px] text-[#f0e6c8]/7">Kişisel bildirimler için giriş yapın.</p>
          <Link href="/giris?next=/bildirimler">
            <Button className="mt-4 h-11">Giriş yap</Button>
          </Link>
        </CustomerCard>
      ) : null}

      <div className="flex items-center justify-between gap-3">
        <p className="text-[14px] text-[#f0e6c8]/5">{mine.length} bildirim</p>
        <Button size="sm" variant="outline" onClick={markAllNotificationsRead}>
          Tümünü oku
        </Button>
      </div>

      <CustomerCard>
        <p className="customer-section-label">Tercihler</p>
        <label className="mt-3 flex items-center justify-between gap-3 text-[15px]">
          Kampanya bildirimleri
          <input
            type="checkbox"
            className="size-4 accent-amber-400"
            checked={campaignNotif}
            onChange={(e) => setNotifPrefs({ campaignNotif: e.target.checked })}
          />
        </label>
        <label className="mt-3 flex items-center justify-between gap-3 text-[15px]">
          Kupon hatırlatma
          <input
            type="checkbox"
            className="size-4 accent-amber-400"
            checked={couponNotif}
            onChange={(e) => setNotifPrefs({ couponNotif: e.target.checked })}
          />
        </label>
      </CustomerCard>

      <div className="space-y-2">
        {mine.length === 0 ? (
          <EmptyState title="Bildirim yok" hint="Kampanya veya iş durumu olunca burada görünür." />
        ) : (
          mine.map((n) => (
            <Link key={n.id} href={n.href} className="customer-nav-link !items-start !flex-col">
              <span className="flex items-center gap-2 text-[16px] font-medium">
                {!n.read ? <span className="inline-block size-1.5 rounded-full bg-amber-400" /> : null}
                {n.title}
              </span>
              <span className="hint !text-[14px] leading-relaxed">{n.body}</span>
            </Link>
          ))
        )}
      </div>

      {me ? (
        <Link href="/profil" className="customer-nav-link">
          <span>Profilime dön</span>
          <span className="hint">{me.name}</span>
        </Link>
      ) : null}
    </CustomerPanel>
  );
}
