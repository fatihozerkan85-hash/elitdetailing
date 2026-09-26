"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { CustomerCard, CustomerPanel } from "@/components/customer-panel";
import { LoadingBlock } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DEMO } from "@/lib/catalog";
import { useStore } from "@/lib/store";

function safeNext(raw: string | null) {
  if (!raw) return "/profil";
  if (!raw.startsWith("/") || raw.startsWith("/yonetici") || raw.startsWith("/panel")) return "/profil";
  return raw;
}

function LoginInner() {
  const { loginCustomer, registerCustomer, session, logout, customers } = useStore();
  const router = useRouter();
  const params = useSearchParams();
  const next = safeNext(params.get("next"));
  const [mode, setMode] = useState<"giris" | "kayit">("giris");
  const [phone, setPhone] = useState(DEMO.customerPhone);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [plate, setPlate] = useState("");
  const [vehicle, setVehicle] = useState("");

  function goIn() {
    router.push(next);
  }

  if (session.role === "customer") {
    return (
      <CustomerCard>
        <p className="text-[15px] text-[#f0e6c8]/8">
          Oturum açık: <span className="text-[#f0e6c8]">{session.name}</span>
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button className="h-11" onClick={goIn}>
            Panele git
          </Button>
          <Button className="h-11" variant="outline" onClick={logout}>
            Çıkış
          </Button>
        </div>
      </CustomerCard>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2 rounded-xl border border-white/10 p-1">
        <button
          type="button"
          className={`h-10 rounded-lg text-[14px] font-medium ${mode === "giris" ? "bg-[rgba(201,168,76,0.18)] text-amber-200" : "text-[#f0e6c8]/55"}`}
          onClick={() => setMode("giris")}
        >
          Giriş
        </button>
        <button
          type="button"
          className={`h-10 rounded-lg text-[14px] font-medium ${mode === "kayit" ? "bg-[rgba(201,168,76,0.18)] text-amber-200" : "text-[#f0e6c8]/55"}`}
          onClick={() => setMode("kayit")}
        >
          Kayıt ol
        </button>
      </div>

      {mode === "giris" ? (
        <CustomerCard>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              const ok = loginCustomer(phone);
              if (!ok) {
                toast.error("Bu telefon kayıtlı değil", {
                  description: "Kayıt ol sekmesinden hesap oluşturun.",
                });
                setMode("kayit");
                return;
              }
              toast.success("Hoş geldiniz");
              goIn();
            }}
          >
            <p className="text-[15px] leading-relaxed text-[#f0e6c8]/7">
              Kayıtlı telefonunuzla girin. Ad, plaka ve araç bilgileriniz otomatik gelir.
            </p>
            <div className="grid gap-1.5">
              <Label className="text-[13px]">Telefon</Label>
              <Input
                className="h-11 text-base"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                inputMode="tel"
                autoComplete="tel"
              />
            </div>
            <Button type="submit" className="h-11 w-full">
              Giriş yap
            </Button>
            <p className="text-[13px] text-[#f0e6c8]/4">Demo: {DEMO.customerPhone}</p>
          </form>
        </CustomerCard>
      ) : (
        <CustomerCard>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (!name.trim() || !phone.trim() || !plate.trim()) {
                toast.error("Ad, telefon ve plaka zorunlu");
                return;
              }
              const exists = customers.some(
                (c) => c.phone.replace(/\D/g, "") === phone.replace(/\D/g, ""),
              );
              if (exists) {
                toast.message("Bu telefon zaten kayıtlı — girişe yönlendiriliyor");
                loginCustomer(phone);
                goIn();
                return;
              }
              registerCustomer({
                name,
                phone,
                email: email || undefined,
                plate,
                vehicle: vehicle || plate,
              });
              toast.success("Hesabınız hazır", { description: "Bilgileriniz sonraki işlemlerde hazır." });
              goIn();
            }}
          >
            <p className="text-[15px] leading-relaxed text-[#f0e6c8]/7">
              Bir kez doldurun. Sonraki randevularda yalnızca araç seçersiniz; yeni araç için profilde “Araç ekle” kullanın.
            </p>
            <div className="grid gap-3">
              <div className="grid gap-1.5">
                <Label className="text-[13px]">Ad soyad</Label>
                <Input className="h-11 text-base" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
              </div>
              <div className="grid gap-1.5">
                <Label className="text-[13px]">Telefon</Label>
                <Input className="h-11 text-base" value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" autoComplete="tel" />
              </div>
              <div className="grid gap-1.5">
                <Label className="text-[13px]">E-posta (isteğe bağlı)</Label>
                <Input className="h-11 text-base" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
              </div>
              <div className="grid gap-1.5 sm:grid-cols-2 sm:gap-3">
                <div className="grid gap-1.5">
                  <Label className="text-[13px]">İlk araç plakası</Label>
                  <Input className="plate h-11 text-base" value={plate} onChange={(e) => setPlate(e.target.value)} />
                </div>
                <div className="grid gap-1.5">
                  <Label className="text-[13px]">Araç</Label>
                  <Input
                    className="h-11 text-base"
                    value={vehicle}
                    onChange={(e) => setVehicle(e.target.value)}
                    placeholder="2021 BMW 5.20i"
                  />
                </div>
              </div>
            </div>
            <Button type="submit" className="h-11 w-full">
              Kayıt ol
            </Button>
          </form>
        </CustomerCard>
      )}
    </div>
  );
}

export default function GirisPage() {
  return (
    <CustomerPanel
      title="Giriş"
      lead="Tek hesap. Randevu, yol yardım ve aksesuar formlarında bilgilerinizi bir daha yazmazsınız."
    >
      <Suspense fallback={<LoadingBlock />}>
        <LoginInner />
      </Suspense>
    </CustomerPanel>
  );
}
