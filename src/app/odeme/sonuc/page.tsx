"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PublicShell } from "@/components/public-shell";
import { LoadingBlock } from "@/components/site-header";
import { buttonVariants } from "@/components/ui/button";
import { clearCheckoutDraft, loadCheckoutDraft } from "@/lib/checkout-draft";
import { tryFormat } from "@/lib/format";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

function Sonuc() {
  const params = useSearchParams();
  const { ready, fulfillPaidCheckout } = useStore();
  const [message, setMessage] = useState("Ödeme doğrulanıyor…");
  const [ok, setOk] = useState<boolean | null>(null);
  const [refId, setRefId] = useState("");
  const ran = useRef(false);

  useEffect(() => {
    if (!ready || ran.current) return;
    ran.current = true;
    const status = params?.get("status");
    const conversationId = params?.get("conversationId") || "";
    const paymentId = params?.get("paymentId") || undefined;
    const mode = params?.get("mode") === "iyzico" ? "iyzico" : "mock";

    if (status !== "ok" || !conversationId) {
      setOk(false);
      setMessage("Ödeme tamamlanmadı. Randevu / sipariş oluşturulmadı.");
      if (conversationId) clearCheckoutDraft(conversationId);
      return;
    }

    const draft = loadCheckoutDraft(conversationId);
    if (!draft) {
      setOk(false);
      setMessage("Ödeme oturumu bulunamadı (sekme kapandıysa tekrar deneyin).");
      return;
    }

    try {
      const result = fulfillPaidCheckout({
        conversationId: draft.conversationId,
        providerPaymentId: paymentId,
        provider: mode,
        amount: draft.amount,
        title: draft.title,
        kind: draft.kind,
        buyerName: draft.buyerName,
        buyerPhone: draft.buyerPhone,
        payload: draft.payload,
      });
      clearCheckoutDraft(conversationId);
      setOk(true);
      setRefId(result.refId);
      setMessage(`${draft.title} · ${tryFormat(draft.amount)} tahsil edildi.`);
    } catch {
      setOk(false);
      setMessage("Ödeme alındı ama kayıt yazılamadı. Destek ile paylaşın.");
    }
  }, [ready, params, fulfillPaidCheckout]);

  if (!ready) return <LoadingBlock />;

  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <p className="text-[11px] tracking-[0.25em] text-amber-300 uppercase">iyzico</p>
      <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl uppercase">
        {ok === null ? "Bekleyin" : ok ? "Ödeme başarılı" : "Ödeme başarısız"}
      </h1>
      <p className="mt-3 text-sm text-zinc-400">{message}</p>
      {refId ? <p className="mt-2 text-xs text-zinc-500">Kayıt: {refId}</p> : null}
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/taleplerim" className={cn(buttonVariants())}>
          Taleplerim
        </Link>
        <Link href="/randevu" className={cn(buttonVariants({ variant: "outline" }))}>
          Randevu
        </Link>
      </div>
    </div>
  );
}

export default function OdemeSonucPage() {
  return (
    <PublicShell>
      <Suspense fallback={<LoadingBlock />}>
        <Sonuc />
      </Suspense>
    </PublicShell>
  );
}
