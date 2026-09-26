"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PublicShell } from "@/components/public-shell";
import { GeoLink } from "@/components/geo-link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatCoords } from "@/lib/format";
import { useStore } from "@/lib/store";
import { textMap } from "@/lib/site-cms";
import type { Urgency } from "@/lib/types";

type GeoState = "idle" | "loading" | "ok" | "denied" | "unsupported";

export default function YolYardimPage() {
  const { createRoadside, session, cms } = useStore();
  const formDef = cms.forms.find((f) => f.id === "form-yol");
  const fieldOn = (key: string) =>
    !formDef || (formDef.enabled && (formDef.fields.find((f) => f.key === key)?.enabled ?? true));
  const fieldReq = (key: string) => formDef?.fields.find((f) => f.key === key)?.required ?? false;
  const fieldLabel = (key: string, fallback: string) =>
    formDef?.fields.find((f) => f.key === key)?.label || fallback;
  const lead = textMap(cms.texts)["yol.lead"];
  const router = useRouter();
  const [name, setName] = useState(session.name !== "Misafir" ? session.name : "Demo Müşteri");
  const [phone, setPhone] = useState("05551234567");
  const [plate, setPlate] = useState("06 ELT 01");
  const [vehicle, setVehicle] = useState("2021 BMW 5.20i");
  const [location, setLocation] = useState("");
  const [issue, setIssue] = useState("Akü takviye");
  const [urgency, setUrgency] = useState<Urgency>("yuksek");
  const [error, setError] = useState("");
  const [geo, setGeo] = useState<GeoState>("idle");
  const [coords, setCoords] = useState<{ lat: number; lng: number; accuracyM?: number } | null>(null);

  function shareLocation() {
    if (!navigator.geolocation) {
      setGeo("unsupported");
      setError("Bu tarayıcı konum paylaşımını desteklemiyor. Konum notunu yazın.");
      return;
    }
    setError("");
    setGeo("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracyM: pos.coords.accuracy,
        });
        setGeo("ok");
      },
      (err) => {
        setGeo("denied");
        setError(
          err.code === err.PERMISSION_DENIED
            ? "Konum izni verilmedi. Ayarlardan izin verin veya cadde / km notunu yazın."
            : "Konum alınamadı. Notu yazarak devam edebilirsiniz.",
        );
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    );
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const note = location.trim();
    if (fieldOn("name") && fieldReq("name") && !name.trim()) {
      setError("Ad zorunlu.");
      return;
    }
    if (fieldOn("phone") && fieldReq("phone") && !phone.trim()) {
      setError("Telefon zorunlu.");
      return;
    }
    if (fieldOn("plate") && (!plate.trim() || fieldReq("plate"))) {
      if (!plate.trim()) {
        setError("Plaka zorunlu.");
        return;
      }
    }
    if (!note && !coords) {
      setError("Konum gönderin veya konum notu yazın.");
      return;
    }
    if (fieldOn("location") && fieldReq("location") && !note && !coords) {
      setError("Konum notu zorunlu.");
      return;
    }
    const locationText = note || `GPS ${formatCoords(coords!.lat, coords!.lng, coords!.accuracyM)}`;
    const call = createRoadside({
      name,
      phone,
      plate,
      vehicle,
      location: locationText,
      lat: coords?.lat,
      lng: coords?.lng,
      accuracyM: coords?.accuracyM,
      issue,
      urgency,
    });
    toast.success("Yol yardım talebi alındı", {
      description: coords ? `${call.id} · GPS gönderildi` : call.id,
    });
    router.push(`/takip/${call.id}`);
  }

  if (formDef && !formDef.enabled) {
    return (
      <PublicShell>
        <div className="mx-auto max-w-3xl px-4 py-12">
          <p className="text-sm text-zinc-400">Yol yardım formu şu an kapalı. Acil durumda 112’yi arayın.</p>
        </div>
      </PublicShell>
    );
  }

  return (
    <PublicShell>
      <div className="mx-auto max-w-3xl px-4 py-12">
        <p className="text-[11px] tracking-[0.3em] text-red-300 uppercase">Acil</p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl uppercase">Yol yardım</h1>
        <p className="mt-2 text-sm text-zinc-400">
          {lead || "Canlı konumunuzu gönderin; cadde / kat notunu da ekleyin. Ekip panodan pin ve notu görür."}
        </p>
        <form onSubmit={submit} className="mt-8 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {fieldOn("name") ? (
              <div className="grid gap-2">
                <Label>{fieldLabel("name", "Ad")}</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} required={fieldReq("name")} />
              </div>
            ) : null}
            {fieldOn("phone") ? (
              <div className="grid gap-2">
                <Label>{fieldLabel("phone", "Telefon")}</Label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} required={fieldReq("phone")} />
              </div>
            ) : null}
            {fieldOn("plate") ? (
              <div className="grid gap-2">
                <Label>{fieldLabel("plate", "Plaka")}</Label>
                <Input className="plate" value={plate} onChange={(e) => setPlate(e.target.value)} required />
              </div>
            ) : null}
            {fieldOn("vehicle") ? (
              <div className="grid gap-2">
                <Label>{fieldLabel("vehicle", "Araç")}</Label>
                <Input value={vehicle} onChange={(e) => setVehicle(e.target.value)} />
              </div>
            ) : null}
          </div>
          {fieldOn("gps") ? (
            <div className="grid gap-2">
              <Label>Konum</Label>
              <div className="flex flex-col gap-3 rounded-xl border border-white/10 bg-zinc-900/40 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 text-sm">
                  {geo === "ok" && coords ? (
                    <>
                      <p className="text-zinc-200">Konum alındı</p>
                      <GeoLink lat={coords.lat} lng={coords.lng} accuracyM={coords.accuracyM} />
                    </>
                  ) : geo === "loading" ? (
                    <p className="text-zinc-400">Konum isteniyor…</p>
                  ) : (
                    <p className="text-zinc-400">Ekibin sizi haritada görmesi için konumunuzu paylaşın.</p>
                  )}
                </div>
                <Button type="button" variant={geo === "ok" ? "outline" : "default"} onClick={shareLocation} disabled={geo === "loading"}>
                  {geo === "ok" ? "Konumu yenile" : geo === "loading" ? "Alınıyor…" : "Konumumu gönder"}
                </Button>
              </div>
            </div>
          ) : null}
          {fieldOn("location") ? (
            <div className="grid gap-2">
              <Label>{fieldLabel("location", "Konum notu (cadde, km, kat / ada)")}</Label>
              <Textarea
                placeholder="Örn. Konya yolu 18. km, sağ şerit, beyaz Passat. AVM kat −2 C-214."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                rows={3}
                required={fieldReq("location") && !coords}
              />
            </div>
          ) : null}
          {fieldOn("issue") ? (
            <div className="grid gap-2">
              <Label>{fieldLabel("issue", "Sorun")}</Label>
              <select
                className="h-9 w-full rounded-lg border border-input bg-input/30 px-2.5 text-sm"
                value={issue}
                onChange={(e) => setIssue(e.target.value)}
              >
                <option style={{ color: "#111", backgroundColor: "#fff" }}>Akü takviye</option>
                <option style={{ color: "#111", backgroundColor: "#fff" }}>Yolda lastik / stepne</option>
                <option style={{ color: "#111", backgroundColor: "#fff" }}>Çekici</option>
                <option style={{ color: "#111", backgroundColor: "#fff" }}>Yakıt bitti</option>
                <option style={{ color: "#111", backgroundColor: "#fff" }}>Diğer — notta belirtildi</option>
              </select>
            </div>
          ) : null}
          {fieldOn("urgency") ? (
            <fieldset className="grid gap-2">
              <Label>{fieldLabel("urgency", "Aciliyet")}</Label>
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
          ) : null}
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
