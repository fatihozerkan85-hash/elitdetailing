"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ProfileVehicleFields, useMe } from "@/components/customer-panel";
import { PublicShell } from "@/components/public-shell";
import { GeoLink } from "@/components/geo-link";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatCoords } from "@/lib/format";
import { useStore } from "@/lib/store";
import { textMap } from "@/lib/site-cms";
import type { Urgency } from "@/lib/types";

type GeoState = "idle" | "loading" | "ok" | "denied" | "unsupported";

export default function YolYardimPage() {
  const { createRoadside, cms } = useStore();
  const me = useMe();
  const loggedIn = Boolean(me);
  const formDef = cms.forms.find((f) => f.id === "form-yol");
  const fieldOn = (key: string) =>
    !formDef || (formDef.enabled && (formDef.fields.find((f) => f.key === key)?.enabled ?? true));
  const fieldReq = (key: string) => formDef?.fields.find((f) => f.key === key)?.required ?? false;
  const fieldLabel = (key: string, fallback: string) =>
    formDef?.fields.find((f) => f.key === key)?.label || fallback;
  const lead = textMap(cms.texts)["yol.lead"];
  const router = useRouter();
  const [name, setName] = useState(me?.name || "");
  const [phone, setPhone] = useState(me?.phone || "");
  const [plate, setPlate] = useState(me?.plate || "");
  const [vehicle, setVehicle] = useState(me?.vehicle || "");
  const [vehicleId, setVehicleId] = useState(me?.activeVehicleId || "");
  const [location, setLocation] = useState("");
  const [issue, setIssue] = useState("Akü takviye");
  const [urgency, setUrgency] = useState<Urgency>("yuksek");
  const [error, setError] = useState("");
  const [geo, setGeo] = useState<GeoState>("idle");
  const [coords, setCoords] = useState<{ lat: number; lng: number; accuracyM?: number } | null>(null);

  useEffect(() => {
    if (!me) return;
    setName(me.name);
    setPhone(me.phone);
    setPlate(me.plate);
    setVehicle(me.vehicle);
    setVehicleId(me.activeVehicleId || me.vehicles[0]?.id || "");
  }, [me]);

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
    if (!name.trim() || !phone.trim() || !plate.trim()) {
      setError("Ad, telefon ve plaka zorunlu.");
      return;
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
      <div className="customer-panel mx-auto max-w-3xl px-4 py-12">
        <p className="customer-kicker">Acil</p>
        <h1 className="customer-title">Yol yardım</h1>
        <p className="customer-lead">
          {lead || "Canlı konumunuzu gönderin; cadde / kat notunu da ekleyin. Ekip panodan pin ve notu görür."}
        </p>
        <form onSubmit={submit} className="mt-8 space-y-4">
          {!loggedIn ? (
            <p className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-[14px] text-[#f0e6c8]/75">
              <Link href="/giris?next=/yol-yardim" className="text-amber-300 hover:underline">
                Giriş yapın
              </Link>{" "}
              — ad, telefon ve plaka otomatik gelsin.
            </p>
          ) : null}
          <ProfileVehicleFields
            vehicleId={vehicleId}
            onVehicleChange={(id, p, label) => {
              setVehicleId(id);
              setPlate(p);
              setVehicle(label);
            }}
            showGuestFields={!loggedIn}
            name={name}
            phone={phone}
            plate={plate}
            vehicle={vehicle}
            onName={setName}
            onPhone={setPhone}
            onPlate={setPlate}
            onVehicle={setVehicle}
          />
          {fieldOn("gps") ? (
            <div className="grid gap-2">
              <Label>Konum</Label>
              <div className="flex flex-col gap-3 rounded-xl border border-white/10 bg-zinc-900/40 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 text-[15px]">
                  {geo === "ok" && coords ? (
                    <>
                      <p className="text-[#f0e6c8]">Konum alındı</p>
                      <GeoLink lat={coords.lat} lng={coords.lng} accuracyM={coords.accuracyM} />
                    </>
                  ) : geo === "loading" ? (
                    <p className="text-[#f0e6c8]/6">Konum isteniyor…</p>
                  ) : (
                    <p className="text-[#f0e6c8]/6">Ekibin sizi haritada görmesi için konumunuzu paylaşın.</p>
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
                className="text-base"
                required={fieldReq("location") && !coords}
              />
            </div>
          ) : null}
          {fieldOn("issue") ? (
            <div className="grid gap-2">
              <Label>{fieldLabel("issue", "Sorun")}</Label>
              <select
                className="h-11 w-full rounded-lg border border-input bg-input/30 px-2.5 text-[15px]"
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
                    className={`cursor-pointer rounded-lg border px-3 py-2.5 text-[14px] ${urgency === v ? "border-amber-400 bg-amber-400/10" : "border-white/10"}`}
                  >
                    <input type="radio" className="sr-only" checked={urgency === v} onChange={() => setUrgency(v)} />
                    {l}
                  </label>
                ))}
              </div>
            </fieldset>
          ) : null}
          {error ? <p className="text-[14px] text-red-300">{error}</p> : null}
          <Button type="submit" variant="destructive" size="lg" className="h-12 text-[15px]">
            Yardım iste
          </Button>
          <p className="text-[13px] text-[#f0e6c8]/4">
            Trafikte güvenli alana çekin. Bu ekran 112 yerine geçmez; can kaybı / yangın için acil çağrı kullanın.
          </p>
        </form>
      </div>
    </PublicShell>
  );
}
