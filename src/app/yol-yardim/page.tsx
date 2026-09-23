"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PublicShell } from "@/components/public-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useStore } from "@/lib/store";
import type { Urgency } from "@/lib/types";

export default function YolYardimPage() {
  const { createRoadside, session } = useStore();
  const router = useRouter();
  const [name, setName] = useState(session.name !== "Misafir" ? session.name : "Demo Müşteri");
  const [phone, setPhone] = useState("05551234567");
  const [plate, setPlate] = useState("06 ELT 01");
  const [vehicle, setVehicle] = useState("2021 BMW 5.20i");
  const [location, setLocation] = useState("");
  const [issue, setIssue] = useState("Akü takviye");
  const [urgency, setUrgency] = useState<Urgency>("yuksek");
  const [error, setError] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!location.trim() || !plate.trim()) {
      setError("Konum notu ve plaka zorunlu.");
      return;
    }
    const call = createRoadside({ name, phone, plate, vehicle, location, issue, urgency });
    toast.success("Yol yardım talebi alındı", { description: call.id });
    router.push(`/takip/${call.id}`);
  }

  return (
    <PublicShell>
      <div className="mx-auto max-w-3xl px-4 py-12">
        <p className="text-[11px] tracking-[0.3em] text-red-300 uppercase">Acil</p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl uppercase">Yol yardım</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Konum notu yazın (cadde, km, kat/ada). Ekip panodan yönlendirilir; siz Taleplerim ve takip ekranından izlersiniz.
        </p>
        <form onSubmit={submit} className="mt-8 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label>Ad</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label>Telefon</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label>Plaka</Label>
              <Input className="plate" value={plate} onChange={(e) => setPlate(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label>Araç</Label>
              <Input value={vehicle} onChange={(e) => setVehicle(e.target.value)} />
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Konum notu</Label>
            <Textarea
              placeholder="Örn. Konya yolu 18. km, sağ şerit, beyaz Passat. AVM kat −2 C-214."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              rows={3}
            />
          </div>
          <div className="grid gap-2">
            <Label>Sorun</Label>
            <select
              className="h-9 w-full rounded-lg border border-input bg-input/30 px-2.5 text-sm"
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
            >
              <option>Akü takviye</option>
              <option>Yolda lastik / stepne</option>
              <option>Çekici</option>
              <option>Yakıt bitti</option>
              <option>Diğer — notta belirtildi</option>
            </select>
          </div>
          <fieldset className="grid gap-2">
            <Label>Aciliyet</Label>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  ["normal", "Normal"],
                  ["yuksek", "Yüksek"],
                  ["kritik", "Kritik (yol üstü / çocuk)"],
                ] as const
              ).map(([v, l]) => (
                <label
                  key={v}
                  className={`cursor-pointer rounded-lg border px-3 py-2 text-sm ${urgency === v ? "border-amber-400 bg-amber-400/10" : "border-white/10"}`}
                >
                  <input type="radio" className="sr-only" checked={urgency === v} onChange={() => setUrgency(v)} />
                  {l}
                </label>
              ))}
            </div>
          </fieldset>
          {error ? <p className="text-sm text-red-300">{error}</p> : null}
          <Button type="submit" variant="destructive" size="lg">
            Yardım iste
          </Button>
          <p className="text-xs text-zinc-600">
            Trafikte güvenli alana çekin. Bu ekran 112 yerine geçmez; can kaybı / yangın için acil çağrı kullanın.
          </p>
        </form>
      </div>
    </PublicShell>
  );
}
