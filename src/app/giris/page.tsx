"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { CustomerCard, CustomerPanel } from "@/components/customer-panel";
import { LogoutConfirmDialog } from "@/components/logout-confirm";
import { LoadingBlock } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DEMO_CUSTOMER_PASSWORD } from "@/lib/auth";
import { DEMO } from "@/lib/catalog";
import { useStore } from "@/lib/store";

function safeNext(raw: string | null) {
  if (!raw) return "/profil";
  if (!raw.startsWith("/") || raw.startsWith("/yonetici") || raw.startsWith("/panel")) return "/profil";
  return raw;
}

function LoginInner() {
  const { loginCustomer, registerCustomer, session, customers } = useStore();
  const router = useRouter();
  const params = useSearchParams();
  const next = safeNext(params.get("next"));
  const [mode, setMode] = useState<"giris" | "kayit">("giris");
  const [phone, setPhone] = useState(DEMO.customerPhone);
  const [password, setPassword] = useState(DEMO_CUSTOMER_PASSWORD);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regPassword2, setRegPassword2] = useState("");
  const [plate, setPlate] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [logoutOpen, setLogoutOpen] = useState(false);

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
          <Button className="h-11" variant="outline" onClick={() => setLogoutOpen(true)}>
            Çıkış
          </Button>
        </div>
        <LogoutConfirmDialog open={logoutOpen} onOpenChange={setLogoutOpen} />
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
              const ok = loginCustomer(phone, password);
              if (!ok) {
                toast.error("Giriş başarısız", {
                  description: "Telefon/e-posta veya şifre hatalı. Kayıtlı değil misiniz?",
                });
                return;
              }
              toast.success("Hoş geldiniz");
              goIn();
            }}
          >
            <p className="text-[15px] leading-relaxed text-[#f0e6c8]/7">
              Telefon veya e-posta + şifre. Bilgileriniz sonraki işlemlerde otomatik gelir.
            </p>
            <div className="grid gap-1.5">
              <Label className="text-[13px]">Telefon veya e-posta</Label>
              <Input
                className="h-11 text-base"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="username"
              />
            </div>
            <div className="grid gap-1.5">
              <Label className="text-[13px]">Şifre</Label>
              <Input
                className="h-11 text-base"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
            <Button type="submit" className="h-11 w-full">
              Giriş yap
            </Button>
            <Link href="/sifremi-unuttum" className="block text-center text-[14px] text-amber-300 hover:underline">
              Şifremi unuttum
            </Link>
            <p className="text-[13px] text-[#f0e6c8]/4">
              Demo: {DEMO.customerPhone} / {DEMO_CUSTOMER_PASSWORD}
            </p>
          </form>
        </CustomerCard>
      ) : (
        <CustomerCard>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (!name.trim() || !phone.trim() || !email.trim() || !plate.trim()) {
                toast.error("Ad, telefon, e-posta ve plaka zorunlu");
                return;
              }
              if (!email.includes("@")) {
                toast.error("Geçerli bir e-posta girin");
                return;
              }
              if (regPassword.length < 6) {
                toast.error("Şifre en az 6 karakter olmalı");
                return;
              }
              if (regPassword !== regPassword2) {
                toast.error("Şifreler eşleşmiyor");
                return;
              }
              const exists = customers.some(
                (c) => c.phone.replace(/\D/g, "") === phone.replace(/\D/g, ""),
              );
              if (exists) {
                toast.message("Bu telefon zaten kayıtlı — girişe geçin");
                setMode("giris");
                return;
              }
              registerCustomer({
                name,
                phone,
                email,
                password: regPassword,
                plate,
                vehicle: vehicle || plate,
              });
              toast.success("Hesabınız hazır", {
                description: "Hoş geldin e-postası gönderildi (mock).",
              });
              goIn();
            }}
          >
            <p className="text-[15px] leading-relaxed text-[#f0e6c8]/7">
              Bir kez doldurun. Hoş geldin mesajı e-posta ile gelir; süreç bildirimleri WhatsApp’tan.
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
                <Label className="text-[13px]">E-posta</Label>
                <Input className="h-11 text-base" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
              </div>
              <div className="grid gap-1.5 sm:grid-cols-2 sm:gap-3">
                <div className="grid gap-1.5">
                  <Label className="text-[13px]">Şifre</Label>
                  <Input
                    className="h-11 text-base"
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label className="text-[13px]">Şifre tekrar</Label>
                  <Input
                    className="h-11 text-base"
                    type="password"
                    value={regPassword2}
                    onChange={(e) => setRegPassword2(e.target.value)}
                    autoComplete="new-password"
                  />
                </div>
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
      lead="Tek hesap. Makbuz ve hesap mailleri e-posta; süreç adımları WhatsApp."
    >
      <Suspense fallback={<LoadingBlock />}>
        <LoginInner />
      </Suspense>
    </CustomerPanel>
  );
}
