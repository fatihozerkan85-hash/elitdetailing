"use client";

import Link from "next/link";
import { PanelShell } from "@/components/panel-shell";
import { EmptyState } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/format";
import { useStore } from "@/lib/store";

export default function BildirimlerPage() {
  const { notifications, markAllNotificationsRead, whatsappOutbox, emailOutbox } = useStore();
  return (
    <PanelShell>
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-[family-name:var(--font-display)] text-3xl uppercase">Bildirimler</h1>
        <Button variant="outline" size="sm" onClick={markAllNotificationsRead}>
          Tümünü okundu say
        </Button>
      </div>

      <p className="mt-3 max-w-2xl text-sm text-zinc-500">
        E-posta: hesap, makbuz, kupon. WhatsApp: check-in, süreç adımı, yol yardım, ödeme linki.
      </p>

      <h2 className="mt-8 text-sm tracking-widest text-zinc-500 uppercase">E-posta kuyruğu</h2>
      {emailOutbox.length === 0 ? (
        <p className="mt-2 text-sm text-zinc-500">
          Henüz e-posta yok. Kayıt, şifre sıfırlama veya ödeme makbuzu üretince düşer.
        </p>
      ) : (
        <ul className="mt-3 space-y-2">
          {emailOutbox.map((m) => (
            <li key={m.id} className="rounded-lg border border-sky-400/20 bg-sky-400/5 p-3 text-sm">
              <p className="text-xs text-zinc-500">
                {m.to} · {m.kind} · {m.status} · {formatDateTime(m.at)}
              </p>
              <p className="mt-1 font-medium text-zinc-100">{m.subject}</p>
              <p className="mt-1 whitespace-pre-line text-zinc-300">{m.text}</p>
            </li>
          ))}
        </ul>
      )}

      <h2 className="mt-10 text-sm tracking-widest text-zinc-500 uppercase">WhatsApp kuyruğu</h2>
      {whatsappOutbox.length === 0 ? (
        <p className="mt-2 text-sm text-zinc-500">Henüz WhatsApp mesajı yok. Giriş onayı veya yeni adım üretince düşer.</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {whatsappOutbox.map((w) => (
            <li key={w.id} className="rounded-lg border border-emerald-400/20 bg-emerald-400/5 p-3 text-sm">
              <p className="text-xs text-zinc-500">
                {w.phone} · {formatDateTime(w.at)}
              </p>
              <p className="mt-1 whitespace-pre-line text-zinc-200">{w.text}</p>
              <a href={w.url} target="_blank" rel="noreferrer" className="mt-2 inline-block text-xs text-emerald-300 hover:underline">
                WhatsApp’tan gönder
              </a>
            </li>
          ))}
        </ul>
      )}
      <h2 className="mt-10 text-sm tracking-widest text-zinc-500 uppercase">Panel bildirimleri</h2>
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
