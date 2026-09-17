"use client";

import Link from "next/link";
import { PanelShell } from "@/components/panel-shell";
import { EmptyState } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/format";
import { useStore } from "@/lib/store";

export default function BildirimlerPage() {
  const { notifications, markAllNotificationsRead } = useStore();
  return (
    <PanelShell>
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-[family-name:var(--font-display)] text-3xl uppercase">Bildirimler</h1>
        <Button variant="outline" size="sm" onClick={markAllNotificationsRead}>
          Tümünü okundu say
        </Button>
      </div>
      {notifications.length === 0 ? (
        <div className="mt-8">
          <EmptyState title="Bildirim yok" hint="Yeni randevu ve yol yardım burada belirir." />
        </div>
      ) : (
        <ul className="mt-6 space-y-2">
          {notifications.map((n) => (
            <li key={n.id}>
              <Link
                href={n.href}
                className={`block rounded-lg border p-3 text-sm ${n.read ? "border-white/10 text-zinc-400" : "border-amber-400/30 bg-amber-400/5"}`}
              >
                <p className="font-medium text-zinc-100">{n.title}</p>
                <p className="text-zinc-400">{n.body}</p>
                <p className="mt-1 text-xs text-zinc-600">{formatDateTime(n.at)}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </PanelShell>
  );
}
