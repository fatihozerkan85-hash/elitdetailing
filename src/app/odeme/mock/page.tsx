"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PublicShell } from "@/components/public-shell";
import { LoadingBlock } from "@/components/site-header";
import { Button } from "@/components/ui/button";

function MockPay() {
  const params = useSearchParams();
  const token = params?.get("token") || "";
  const conversationId = params?.get("conversationId") || token.replace(/^mock_/, "");
  const [busy, setBusy] = useState(false);

  function pay(ok: boolean) {
    setBusy(true);
    const q = new URLSearchParams({
      status: ok ? "ok" : "fail",
      conversationId,
      paymentId: ok ? `MOCK-${Date.now()}` : "",
      token,
      mode: "mock",
    });
    window.location.href = `/odeme/sonuc?${q.toString()}`;
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <p className="text-[11px] tracking-[0.25em] text-amber-300 uppercase">iyzico sandbox / demo</p>
      <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl uppercase">Ödeme simülasyonu</h1>
      <p className="mt-3 text-sm text-zinc-400">
        Canlı anahtar yoksa bu ekran açılır. Gerçek iyzico için <code className="text-zinc-300">IYZICO_API_KEY</code> ve{" "}
        <code className="text-zinc-300">IYZICO_SECRET_KEY</code> ekleyin.
      </p>
      <p className="mt-4 rounded-lg border border-white/10 bg-zinc-900/50 p-3 text-xs text-zinc-500 break-all">
        {conversationId || "—"}
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button disabled={busy} onClick={() => pay(true)}>
          Ödemeyi başarılı say
        </Button>
        <Button disabled={busy} variant="outline" onClick={() => pay(false)}>
          Başarısız
        </Button>
      </div>
    </div>
  );
}

export default function OdemeMockPage() {
  return (
    <PublicShell>
      <Suspense fallback={<LoadingBlock />}>
        <MockPay />
      </Suspense>
    </PublicShell>
  );
}
