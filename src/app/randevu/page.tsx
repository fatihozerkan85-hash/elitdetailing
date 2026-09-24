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
import { addDaysISO, todayISO } from "@/lib/format";
import { occupancyMin } from "@/lib/process";
import { SLOT_TIMES, slotConflicts } from "@/lib/schedule";
import { useStore } from "@/lib/store";
import { Suspense } from "react";

function Form() {
  const params = useSearchParams();
  const preset = params.get("hizmet") ?? "ic-dis-yikama";
  const bookable = SERVICES.filter((s) => s.category !== "yol-yardim");
  const { ready, session, createAppointment, appointments } = useStore();
  const router = useRouter();
  const [serviceId, setServiceId] = useState(bookable.some((s) => s.id === preset) ? preset : "ic-dis-yikama");
  const [name, setName] = useState(session.name !== "Misafir" ? session.name : "Demo Müşteri");
  const [phone, setPhone] = useState("05551234567");
  const [plate, setPlate] = useState("06 ELT 01");
  const [vehicle, setVehicle] = useState("2021 BMW 5.20i");
  const [date, setDate] = useState(todayISO());
  const [time, setTime] = useState("16:30");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const svc = useMemo(() => SERVICES.find((s) => s.id === serviceId), [serviceId]);

  if (!ready) return <LoadingBlock />;

  function submit(e: React.FormEvent) {
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
    const appt = createAppointment({ name, phone, plate, vehicle, serviceId, date, time, notes });
    toast.success("Randevu talebi alındı", { description: `${appt.id} · ${date} ${time}` });
    router.push("/taleplerim");
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
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="name">Ad soyad</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Telefon</Label>
            <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="plate">Plaka</Label>
            <Input id="plate" className="plate" value={plate} onChange={(e) => setPlate(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="vehicle">Araç</Label>
            <Input id="vehicle" value={vehicle} onChange={(e) => setVehicle(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="date">Tarih</Label>
            <Input id="date" type="date" min={todayISO()} max={addDaysISO(14)} value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
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
                  <option key={t} value={t} disabled={busy}>
                    {t} {busy ? "— dolu" : "— boş"}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="notes">Not (leke, çocuk koltuğu, ebat…)</Label>
          <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} />
        </div>
        {error ? <p className="text-sm text-red-300">{error}</p> : null}
        <Button type="submit" disabled={pending} size="lg">
          {pending ? "Gönderiliyor…" : "Randevu talep et"}
        </Button>
      </div>
      <aside className="rounded-xl border border-white/10 bg-zinc-900/50 p-5 text-sm text-zinc-400 md:col-span-2">
        <p className="text-[11px] tracking-widest text-amber-300 uppercase">Ne olur?</p>
        <ol className="mt-3 list-decimal space-y-2 pl-4">
          <li>Talep Taleplerim kutusuna düşer.</li>
          <li>Randevu onayı slotu kilitler; saat gelince süreç başlamaz.</li>
          <li>Yönetici girişi onaylayınca tahmini adımlar ve bildirimler başlar.</li>
        </ol>
        {svc ? (
          <div className="mt-4 space-y-2 text-zinc-300">
            <p>
              {svc.name}: ~{svc.durationMin} dk + {svc.bufferMin} dk tampon (defterde {occupancyMin(svc)} dk)
            </p>
            <ul className="space-y-1 text-xs text-zinc-500">
              {svc.segments.map((seg) => (
                <li key={seg.title}>
                  {seg.title} · {seg.minutes} dk
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        <p className="mt-3 text-xs text-zinc-600">Acil yolda kaldıysanız bu form değil, Yol yardım sayfasını kullanın.</p>
      </aside>
    </form>
  );
}

export default function RandevuPage() {
  return (
    <PublicShell>
      <div className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="font-[family-name:var(--font-display)] text-4xl uppercase">Randevu</h1>
        <p className="mt-2 max-w-xl text-sm text-zinc-400">Hizmet süresine göre boş / dolu saat. Süreç, randevu saatiyle değil giriş onayıyla başlar.</p>
        <div className="mt-8">
          <Suspense fallback={<LoadingBlock />}>
            <Form />
          </Suspense>
        </div>
      </div>
    </PublicShell>
  );
}
