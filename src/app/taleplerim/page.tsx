"use client";

import { useState } from "react";
import Link from "next/link";
import { PublicShell } from "@/components/public-shell";
import { EmptyState, LoadingBlock } from "@/components/site-header";
import { buttonVariants } from "@/components/ui/button";
import { formatDateTime } from "@/lib/format";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function TaleplerimPage() {
  const { inbox, ready, session, markInboxRead } = useStore();
  const [open, setOpen] = useState<string | null>(null);
  const mine =
    session.role === "customer"
      ? inbox.filter((i) => i.customerId === session.customerId)
      : inbox.filter((i) => i.customerId === "c-demo" || session.role === "guest");

  return (
    <PublicShell>
      <div className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="font-[family-name:var(--font-display)] text-4xl uppercase">Taleplerim</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Her adımda WhatsApp metni üretilir; aynı kayıt burada da durur.
        </p>
        {!ready ? (
          <LoadingBlock />
        ) : mine.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              title="Henüz talep yok"
              hint="Randevu veya yol yardım oluşturunca sistem mesajları burada birikir."
              action={
                <Link href="/randevu" className={cn(buttonVariants())}>
                  İlk randevu
                </Link>
              }
            />
          </div>
        ) : (
          <ul className="mt-8 space-y-3">
            {mine.map((item) => (
              <li key={item.id} className="rounded-xl border border-white/10 bg-zinc-900/40">
                <button
                  type="button"
                  className="flex w-full items-start justify-between gap-3 px-4 py-3 text-left"
                  onClick={() => {
                    setOpen(open === item.id ? null : item.id);
                    markInboxRead(item.id);
                  }}
                >
                  <div>
                    <p className="text-sm font-medium text-zinc-100">{item.title}</p>
                    <p className="text-xs text-zinc-500">
                      {item.kind} · {item.refId} · {formatDateTime(item.createdAt)}
                    </p>
                  </div>
                  {item.unread ? <span className="rounded-full bg-amber-400 px-2 text-[10px] text-black">yeni</span> : null}
                </button>
                {open === item.id ? (
                  <div className="space-y-2 border-t border-white/10 px-4 py-3">
                    {item.messages.map((m, i) => (
                      <div key={i} className="rounded-lg bg-white/5 p-3 text-sm text-zinc-300">
                        <p className="text-[10px] tracking-widest text-zinc-500 uppercase">
                          {m.channel === "whatsapp" ? "WhatsApp" : m.from === "sistem" ? "Sistem" : "Siz"} · {formatDateTime(m.at)}
                        </p>
                        <p className="mt-1 whitespace-pre-line">{m.text}</p>
                        {m.waUrl ? (
                          <a href={m.waUrl} target="_blank" rel="noreferrer" className="mt-2 inline-block text-xs text-emerald-300 hover:underline">
                            WhatsApp’ta aç
                          </a>
                        ) : null}
                      </div>
                    ))}
                    <Link href={item.kind === "yol-yardim" || item.kind === "is" ? `/takip/${item.refId}` : "/takip"} className="text-xs text-amber-300 hover:underline">
                      Kaydı takip et →
                    </Link>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </div>
    </PublicShell>
  );
}
