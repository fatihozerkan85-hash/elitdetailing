"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { PublicShell } from "@/components/public-shell";
import { LoadingBlock } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SERVICES } from "@/lib/catalog";
import { startIyzicoCheckout } from "@/lib/checkout-draft";
import { addDaysISO, todayISO, tryFormat, uid } from "@/lib/format";
import { occupancyMin } from "@/lib/process";
import { SLOT_TIMES, slotConflicts } from "@/lib/schedule";
import { useStore } from "@/lib/store";
import { textMap } from "@/lib/site-cms";
import { Suspense } from "react";

function Form() {
  const params = useSearchParams();
  const preset = params?.get("hizmet") ?? "ic-dis-yikama";
  const { ready, session, createAppointment, appointments, cms } = useStore();
  const bookable = cms.services.filter((s) => s.active && s.category !== "yol-yardim");
  const texts = textMap(cms.texts);
  const formDef = cms.forms.find((f) => f.id === "form-randevu");
  const fieldOn = (key: string) => !formDef || (formDef.enabled && (formDef.fields.find((f) => f.key === key)?.enabled ?? true));
  const router = useRouter();
  const [serviceId, setServiceId] = useState(bookable.some((s) => s.id === preset) ? preset : bookable[0]?.id || "ic-dis-yikama");
  const [name, setName] = useState(session.name !== "Misafir" ? session.name : "Demo Müşteri");
  const [phone, setPhone] = useState("05551234567");
  const [email, setEmail] = useState("demo@elitdetailing.com");
  const [plate, setPlate] = useState("06 ELT 01");
  const [vehicle, setVehicle] = useState("2021 BMW 5.20i");
  const [date, setDate] = useState(todayISO());
  const [time, setTime] = useState("16:30");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const svc = useMemo(() => cms.services.find((s) => s.id === serviceId) || SERVICES.find((s) => s.id === serviceId), [cms.services, serviceId]);
  const discovery = Boolean(svc && "discovery" in svc ? svc.discovery : svc?.id === "boya-koruma");

  if (!ready) return <LoadingBlock />;
  if (formDef && !formDef.enabled) {
    return <p className="text-sm text-zinc-400">Randevu formu şu an kapalı. Lütfen daha sonra deneyin.</p>;
  }
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!name.trim() || !phone.trim() || !plate.trim()) {
      setError("Ad, telefon ve plaka zorunlu.");
      return;
    }
    if (svc && slotConflicts(date, time, svc.id, appointments)) {
      setError("Bu saat dolu. Boş bir aralık seçin.");
      return;
    }
    setPending(true);

    if (discovery) {
      const appt = createAppointment({
        name,
        phone,
        plate,
        vehicle,
        serviceId,
        date,
        time,
        notes,
        discovery: true,
      });
      toast.success("Keşif randevusu alındı", { description: `${appt.id} · ödeme keşif sonrası` });
      router.push("/taleplerim");
      return;
    }

    if (!svc) {
      setPending(false);
      return;
    }

    const conversationId = uid("CHK");
    try {
      await startIyzicoCheckout({
        conversationId,
        amount: svc.fromPrice,
        title: svc.name,
        buyerName: name,
        buyerPhone: phone,
        buyerEmail: email,
        basketItems: [{ id: svc.id, name: svc.name, category1: "Hizmet", price: svc.fromPrice }],
        draft: {
          conversationId,
          kind: "randevu",
          amount: svc.fromPrice,
          title: svc.name,
          buyerName: name,
          buyerPhone: phone,
          buyerEmail: email,
          createdAt: new Date().toISOString(),
          payload: { serviceId, plate, vehicle, date, time, notes },
        },
      });
    } catch (err) {
      setPending(false);
      setError(err instanceof Error ? err.message : "Ödeme başlatılamadı");
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-8 md:grid-cols-5">
      <div className="space-y-4 md:col-span-3">
        <div className="grid gap-2">
          <Label htmlFor="hizmet">Hizmet</Label>
          <select
            id="hizmet"
            className="h-9 w-full rounded-lg border border-input bg-input/30 px-2.5 text-sm"
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
          >
            {bookable.map((s) => (
              <option key={s.id} value={s.id} style={{ color: "#111", backgroundColor: "#fff" }}>
                {s.name}
                {s.discovery ? " (keşif)" : ` — ${tryFormat(s.fromPrice)}`}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {fieldOn("name") ? (
          <div className="grid gap-2">
            <Label htmlFor="name">Ad soyad</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          ) : null}
          {fieldOn("phone") ? (
          <div className="grid gap-2">
            <Label htmlFor="phone">Telefon</Label>
            <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" />
          </div>
          ) : null}
          {fieldOn("email") ? (
          <div className="grid gap-2">
            <Label htmlFor="email">E-posta</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          ) : null}
          {fieldOn("plate") ? (
          <div className="grid gap-2">
            <Label htmlFor="plate">Plaka</Label>
            <Input id="plate" className="plate" value={plate} onChange={(e) => setPlate(e.target.value)} />
          </div>
          ) : null}
          {fieldOn("vehicle") ? (
          <div className="grid gap-2">
            <Label htmlFor="vehicle">Araç</Label>
            <Input id="vehicle" value={vehicle} onChange={(e) => setVehicle(e.target.value)} />
          </div>
          ) : null}
          {fieldOn("date") ? (
          <div className="grid gap-2">
            <Label htmlFor="date">Tarih</Label>
            <Input id="date" type="date" min={todayISO()} max={addDaysISO(14)} value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          ) : null}
          {fieldOn("time") ? (
          <div className="grid gap-2">
            <Label htmlFor="time">Saat</Label>
            <select
              id="time"
              className="h-9 w-full rounded-lg border border-input bg-input/30 px-2.5 text-sm"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            >
              {SLOT_TIMES.map((t) => {
                const busy = svc ? slotConflicts(date, t, svc.id, appointments) : false;
                return (
                  <option key={t} value={t} disabled={busy} style={{ color: "#111", backgroundColor: "#fff" }}>
                    {t} {busy ? "— dolu" : "— boş"}
                  </option>
                );
              })}
            </select>
          </div>
          ) : null}
        </div>
        {fieldOn("notes") ? (
        <div className="grid gap-2">
          <Label htmlFor="notes">Not (leke, çocuk koltuğu, ebat…)</Label>
          <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} />
        </div>
        ) : null}
        {error ? <p className="text-sm text-red-300">{error}</p> : null}
        <Button type="submit" disabled={pending} size="lg">
          {pending
            ? "İşleniyor…"
            : discovery
              ? "Keşif randevusu oluştur"
              : svc
                ? `iyzico ile ${tryFormat(svc.fromPrice)} öde`
                : "Öde"}
        </Button>
      </div>
      <aside className="rounded-xl border border-white/10 bg-zinc-900/50 p-5 text-sm text-zinc-400 md:col-span-2">
        <p className="text-[11px] tracking-widest text-amber-300 uppercase">Ödeme</p>
        <ol className="mt-3 list-decimal space-y-2 pl-4">
          {discovery ? (
            <>
              <li>Keşif randevusu ücretsiz oluşturulur (slot kilitlenmez gibi işlenir).</li>
              <li>Teklif sonrası yönetici iyzico linki gönderir.</li>
              <li>Ödeme tamamlanınca randevu onaylanır.</li>
            </>
          ) : (
            <>
              <li>Tam tutar iyzico ile tahsil edilir — nakit yok.</li>
              <li>3D başarısızsa randevu yazılmaz.</li>
              <li>Süreç yine giriş onayından sonra başlar.</li>
            </>
          )}
        </ol>
        {svc ? (
          <div className="mt-4 space-y-2 text-zinc-300">
            <p>
              {svc.name}: ~{svc.durationMin} dk + {svc.bufferMin} dk tampon (defterde {occupancyMin(svc)} dk)
            </p>
            {!discovery ? <p className="text-amber-200">{tryFormat(svc.fromPrice)}</p> : <p className="text-amber-200">Keşif — fiyat sonra</p>}
            <ul className="space-y-1 text-xs text-zinc-500">
              {svc.segments.map((seg) => (
                <li key={seg.title}>
                  {seg.title} · {seg.minutes} dk
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        <p className="mt-3 text-xs text-zinc-600">Kampanya bannerı ayrı sayfada, her zaman iyzico.</p>
      </aside>
    </form>
  );
}

export default function RandevuPage() {
  const { cms } = useStore();
  const lead = textMap(cms.texts)["randevu.lead"];
  return (
    <PublicShell>
      <div className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="font-[family-name:var(--font-display)] text-4xl uppercase">Randevu</h1>
        <p className="mt-2 max-w-xl text-sm text-zinc-400">
          {lead ||
            "Sabit fiyatlı hizmetler iyzico ile peşin. Seramik / boya koruma keşif sonrası ödenir."}
        </p>
        <div className="mt-8">
          <Suspense fallback={<LoadingBlock />}>
            <Form />
          </Suspense>
        </div>
      </div>
    </PublicShell>
  );
}
