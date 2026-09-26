"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { PublicShell } from "@/components/public-shell";
import { LoadingBlock } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { startIyzicoCheckout } from "@/lib/checkout-draft";
import { tryFormat, uid } from "@/lib/format";
import { useStore } from "@/lib/store";
import type { PaymentKind } from "@/lib/types";

function Form() {
  const params = useSearchParams();
  const { ready, jobs, roadside, appointments } = useStore();
  const kind = (params?.get("kind") || "teklif") as PaymentKind;
  const refId = params?.get("refId") || "";
  const amountParam = Number(params?.get("amount") || 0);

  const entity = useMemo(() => {
    if (kind === "yol-yardim") return roadside.find((r) => r.id === refId);
    const job = jobs.find((j) => j.id === refId || j.appointmentId === refId);
    const appt = appointments.find((a) => a.id === refId);
    return job || appt;
  }, [kind, refId, roadside, jobs, appointments]);

  const defaultAmount =
    amountParam > 0
      ? amountParam
      : entity && "amount" in entity && entity.amount
        ? entity.amount
        : entity && "estimate" in entity
          ? entity.estimate
          : 0;

  const [name, setName] = useState(
    entity && "customerName" in entity ? entity.customerName : "Demo Müşteri",
  );
  const [phone, setPhone] = useState(entity && "phone" in entity ? entity.phone : "05551234567");
  const [email, setEmail] = useState("demo@elitdetailing.com");
  const [amount, setAmount] = useState(defaultAmount);
  const [pending, setPending] = useState(false);

  if (!ready) return <LoadingBlock />;

  async function pay(e: React.FormEvent) {
    e.preventDefault();
    if (!refId || amount <= 0) {
      toast.error("Geçersiz ödeme linki");
      return;
    }
    setPending(true);
    const conversationId = uid("CHK");
    const title =
      kind === "yol-yardim"
        ? `Yol yardım ${refId}`
        : kind === "teklif"
          ? `Teklif ödemesi ${refId}`
          : `Ödeme ${refId}`;
    try {
      await startIyzicoCheckout({
        conversationId,
        amount,
        title,
        buyerName: name,
        buyerPhone: phone,
        buyerEmail: email,
        basketItems: [{ id: refId, name: title, category1: "Hizmet", price: amount }],
        draft: {
          conversationId,
          kind: kind === "yol-yardim" ? "yol-yardim" : "teklif",
          amount,
          title,
          buyerName: name,
          buyerPhone: phone,
          buyerEmail: email,
          createdAt: new Date().toISOString(),
          payload: { refId },
        },
      });
    } catch (err) {
      setPending(false);
      toast.error(err instanceof Error ? err.message : "Ödeme başlatılamadı");
    }
  }

  return (
    <form onSubmit={pay} className="mx-auto max-w-md space-y-4 px-4 py-12">
      <p className="text-[11px] tracking-[0.25em] text-amber-300 uppercase">iyzico ödeme linki</p>
      <h1 className="font-[family-name:var(--font-display)] text-3xl uppercase">Güvenli ödeme</h1>
      <p className="text-sm text-zinc-400">
        Ref: {refId || "—"} · {kind}
      </p>
      <div className="grid gap-2">
        <Label>Ad</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="grid gap-2">
        <Label>Telefon</Label>
        <Input value={phone} onChange={(e) => setPhone(e.target.value)} required />
      </div>
      <div className="grid gap-2">
        <Label>E-posta</Label>
        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div className="grid gap-2">
        <Label>Tutar (₺)</Label>
        <Input type="number" min={1} value={amount} onChange={(e) => setAmount(Number(e.target.value))} required />
      </div>
      <Button type="submit" size="lg" disabled={pending || !refId}>
        {pending ? "Yönlendiriliyor…" : `iyzico ile ${tryFormat(amount || 0)} öde`}
      </Button>
    </form>
  );
}

export default function OdemeLinkPage() {
  return (
    <PublicShell>
      <Suspense fallback={<LoadingBlock />}>
        <Form />
      </Suspense>
    </PublicShell>
  );
}
