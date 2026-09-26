"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { PublicShell } from "@/components/public-shell";
import { LoadingBlock } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BANNER_OFFERS } from "@/lib/catalog";
import { startIyzicoCheckout } from "@/lib/checkout-draft";
import { addDaysISO, todayISO, tryFormat, uid } from "@/lib/format";
import { SLOT_TIMES } from "@/lib/schedule";
import { useStore } from "@/lib/store";

function Form() {
  const params = useSearchParams();
  const offerId = params?.get("id") || "1";
  const offer = useMemo(() => BANNER_OFFERS.find((o) => o.id === offerId) ?? BANNER_OFFERS[0]!, [offerId]);
  const { ready, session } = useStore();
  const [name, setName] = useState(session.name !== "Misafir" ? session.name : "Demo Müşteri");
  const [phone, setPhone] = useState("05551234567");
  const [email, setEmail] = useState("demo@elitdetailing.com");
  const [plate, setPlate] = useState("06 ELT 01");
  const [vehicle, setVehicle] = useState("2021 BMW 5.20i");
  const [date, setDate] = useState(todayISO());
  const [time, setTime] = useState("11:00");
  const [pending, setPending] = useState(false);

  if (!ready) return <LoadingBlock />;

  async function pay(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    const conversationId = uid("CHK");
    try {
      await startIyzicoCheckout({
        conversationId,
        amount: offer.price,
        title: `${offer.title} (${offer.code})`,
        buyerName: name,
        buyerPhone: phone,
        buyerEmail: email,
        basketItems: [
          {
            id: `cmp-${offer.id}`,
            name: `${offer.title} · ${offer.highlight}`,
            category1: "Kampanya",
            price: offer.price,
          },
        ],
        draft: {
          conversationId,
          kind: "kampanya",
          amount: offer.price,
          title: offer.title,
          buyerName: name,
          buyerPhone: phone,
          buyerEmail: email,
          createdAt: new Date().toISOString(),
          payload: {
            serviceId: offer.serviceId,
            plate,
            vehicle,
            date,
            time,
            notes: `Banner kampanya ${offer.code}`,
            campaignCode: offer.code,
            campaignId: offer.id,
          },
        },
      });
    } catch (err) {
      setPending(false);
      toast.error(err instanceof Error ? err.message : "Ödeme başlatılamadı");
    }
  }

  return (
    <form onSubmit={pay} className="mx-auto grid max-w-xl gap-4 px-4 py-12">
      <p className="text-[11px] tracking-[0.25em] text-amber-300 uppercase">Kampanya · yalnızca iyzico</p>
      <h1 className="font-[family-name:var(--font-display)] text-3xl uppercase">{offer.title}</h1>
      <p className="text-sm text-zinc-400">{offer.desc}</p>
      <div className="rounded-xl border border-amber-500/30 bg-zinc-900/50 p-4 text-sm">
        <p className="text-zinc-500 line-through">{tryFormat(offer.listPrice)}</p>
        <p className="text-2xl text-amber-200">{tryFormat(offer.price)}</p>
        <p className="mt-1 text-xs text-zinc-500">{offer.code} · {offer.highlight}</p>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label>Ad soyad</Label>
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
          <Label>Plaka</Label>
          <Input className="plate" value={plate} onChange={(e) => setPlate(e.target.value)} required />
        </div>
        <div className="grid gap-2">
          <Label>Araç</Label>
          <Input value={vehicle} onChange={(e) => setVehicle(e.target.value)} />
        </div>
        <div className="grid gap-2">
          <Label>Tarih</Label>
          <Input type="date" min={todayISO()} max={addDaysISO(14)} value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="grid gap-2 sm:col-span-2">
          <Label>Saat</Label>
          <select
            className="h-9 w-full rounded-lg border border-input bg-input/30 px-2.5 text-sm"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          >
            {SLOT_TIMES.map((t) => (
              <option key={t} value={t} style={{ color: "#111", backgroundColor: "#fff" }}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>
      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "iyzico’ya yönlendiriliyor…" : `iyzico ile ${tryFormat(offer.price)} öde`}
      </Button>
    </form>
  );
}

export default function KampanyaOdemePage() {
  return (
    <PublicShell>
      <Suspense fallback={<LoadingBlock />}>
        <Form />
      </Suspense>
    </PublicShell>
  );
}
