"use client";

import { useState } from "react";
import Link from "next/link";
import { CustomerCard, CustomerPanel, useMe } from "@/components/customer-panel";
import { EmptyState, LoadingBlock } from "@/components/site-header";
import { buttonVariants } from "@/components/ui/button";
import { formatDateTime } from "@/lib/format";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function TaleplerimPage() {
  const { inbox, ready, session, markInboxRead } = useStore();
  const me = useMe();
  const [open, setOpen] = useState<string | null>(null);
  const mine =
    session.role === "customer" && session.customerId
      ? inbox.filter((i) => i.customerId === session.customerId)
      : inbox.filter((i) => i.customerId === "c-demo");

  return (
    <CustomerPanel
      title="Taleplerim"
      lead="Her adımın kaydı burada. WhatsApp metinleri de aynı yerde durur."
      className="sm:max-w-2xl"
    >
      {session.role !== "customer" ? (
        <CustomerCard>
          <p className="text-[15px] text-[#f0e6c8]/7">Taleplerinizi görmek için giriş yapın.</p>
          <Link href="/giris?next=/taleplerim" className={cn(buttonVariants(), "mt-4 inline-flex h-11")}>
            Giriş yap
          </Link>
        </CustomerCard>
      ) : null}

      {!ready ? (
        <LoadingBlock />
      ) : mine.length === 0 ? (
        <EmptyState
          title="Henüz talep yok"
          hint="Randevu veya yol yardım oluşturunca mesajlar burada birikir."
          action={
            <Link href="/randevu" className={cn(buttonVariants())}>
              Randevu al
            </Link>
          }
        />
      ) : (
        <ul className="space-y-3">
          {mine.map((item) => (
            <li key={item.id}>
              <CustomerCard className="!p-0 overflow-hidden">
                <button
                  type="button"
                  className="flex w-full items-start justify-between gap-3 px-4 py-3.5 text-left"
                  onClick={() => {
                    setOpen(open === item.id ? null : item.id);
                    markInboxRead(item.id);
                  }}
                >
                  <div className="min-w-0">
                    <p className="text-[16px] font-medium leading-snug text-[#f0e6c8]">{item.title}</p>
                    <p className="mt-1 text-[13px] text-[#f0e6c8]/45">
                      {formatDateTime(item.createdAt)}
                    </p>
                  </div>
                  {item.unread ? (
                    <span className="shrink-0 rounded-full bg-amber-400 px-2 py-0.5 text-[11px] font-semibold text-black">
                      yeni
                    </span>
                  ) : null}
                </button>
                {open === item.id ? (
                  <div className="space-y-2 border-t border-white/10 px-4 py-3">
                    {item.messages.map((m, i) => (
                      <div key={i} className="rounded-lg bg-black/30 p-3 text-[15px] leading-relaxed text-[#f0e6c8]/85">
                        <p className="text-[11px] tracking-[0.14em] text-[#f0e6c8]/4 uppercase">
                          {m.channel === "whatsapp" ? "WhatsApp" : m.from === "sistem" ? "Sistem" : "Siz"} ·{" "}
                          {formatDateTime(m.at)}
                        </p>
                        <p className="mt-1.5 whitespace-pre-line">{m.text}</p>
                        {m.waUrl ? (
                          <a
                            href={m.waUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-2 inline-block text-[13px] text-emerald-300 hover:underline"
                          >
                            WhatsApp’ta aç
                          </a>
                        ) : null}
                      </div>
                    ))}
                    <Link
                      href={item.kind === "yol-yardim" || item.kind === "is" ? `/takip/${item.refId}` : "/takip"}
                      className="inline-block text-[14px] text-amber-300 hover:underline"
                    >
                      Kaydı takip et →
                    </Link>
                  </div>
                ) : null}
              </CustomerCard>
            </li>
          ))}
        </ul>
      )}

      {me ? (
        <Link href="/profil" className="customer-nav-link">
          <span>Profil & araçlar</span>
          <span className="hint">{me.plate}</span>
        </Link>
      ) : null}
    </CustomerPanel>
  );
}
