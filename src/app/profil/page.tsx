"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
  CustomerCard,
  CustomerPanel,
  VehicleManager,
  useMe,
} from "@/components/customer-panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStore } from "@/lib/store";

export default function ProfilPage() {
  const me = useMe();
  const {
    session,
    coupons,
    inbox,
    campaignNotif,
    couponNotif,
    setNotifPrefs,
    updateCustomerProfile,
    changePassword,
    logout,
  } = useStore();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(me?.name || "");
  const [phone, setPhone] = useState(me?.phone || "");
  const [email, setEmail] = useState(me?.email || "");
  const [pwOpen, setPwOpen] = useState(false);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [newPw2, setNewPw2] = useState("");

  if (session.role !== "customer" || !me) {
    return (
      <CustomerPanel
        title="Profil"
        lead="Randevu ve talepleriniz için bir kez kayıt olun. Bilgileriniz sonraki işlemlerde otomatik gelir."
      >
        <CustomerCard>
          <p className="text-[15px] text-[#f0e6c8]/75">
            Henüz giriş yapmadınız. Telefonunuzla girin veya yeni hesap oluşturun.
          </p>
          <Button className="mt-4 h-11 w-full" onClick={() => router.push("/giris")}>
            Giriş / kayıt
          </Button>
        </CustomerCard>
      </CustomerPanel>
    );
  }

  const aktifKupon = coupons.filter((c) => c.customerId === me.id && c.status === "aktif").length;
  const unread = inbox.filter((i) => i.customerId === me.id && i.unread).length;

  return (
    <CustomerPanel
      title={me.name.split(" ")[0] || "Profil"}
      lead="Bilgileriniz kayıtlı. Yeni araç için yalnızca plaka ve model eklemeniz yeterli."
    >
      <CustomerCard>
        {!editing ? (
          <>
            <p className="customer-section-label">Hesabım</p>
            <p className="mt-2 text-[20px] font-medium leading-tight text-[#f0e6c8]">{me.name}</p>
            <p className="mt-1 text-[15px] text-[#f0e6c8]/65">{me.phone}</p>
            {me.email ? <p className="text-[14px] text-[#f0e6c8]/5">{me.email}</p> : null}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => {
                setName(me.name);
                setPhone(me.phone);
                setEmail(me.email || "");
                setEditing(true);
              }}
            >
              Bilgileri düzenle
            </Button>
          </>
        ) : (
          <form
            className="grid gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              if (!name.trim() || !phone.trim()) {
                toast.error("Ad ve telefon zorunlu");
                return;
              }
              updateCustomerProfile({ name, phone, email });
              toast.success("Profil güncellendi", {
                description: "Değişiklik onay e-postası gönderildi (mock).",
              });
              setEditing(false);
            }}
          >
            <p className="customer-section-label">Bilgileri düzenle</p>
            <div className="grid gap-1.5">
              <Label className="text-[13px]">Ad soyad</Label>
              <Input className="h-11 text-base" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="grid gap-1.5">
              <Label className="text-[13px]">Telefon</Label>
              <Input className="h-11 text-base" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="grid gap-1.5">
              <Label className="text-[13px]">E-posta</Label>
              <Input className="h-11 text-base" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="h-11 flex-1">
                Kaydet
              </Button>
              <Button type="button" variant="outline" className="h-11" onClick={() => setEditing(false)}>
                Vazgeç
              </Button>
            </div>
          </form>
        )}
      </CustomerCard>

      <CustomerCard>
        <p className="customer-section-label">Şifre</p>
        {!pwOpen ? (
          <>
            <p className="mt-2 text-[14px] text-[#f0e6c8]/55">
              Değişince onay e-postası gider. Unuttuysanız e-posta ile sıfırlayın.
            </p>
            <Button type="button" variant="outline" size="sm" className="mt-4" onClick={() => setPwOpen(true)}>
              Şifre değiştir
            </Button>
          </>
        ) : (
          <form
            className="mt-3 grid gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              if (newPw !== newPw2) {
                toast.error("Yeni şifreler eşleşmiyor");
                return;
              }
              const res = changePassword(currentPw, newPw);
              if (!res.ok) {
                toast.error(res.message);
                return;
              }
              toast.success(res.message, { description: "Onay e-postası gönderildi." });
              setCurrentPw("");
              setNewPw("");
              setNewPw2("");
              setPwOpen(false);
            }}
          >
            <div className="grid gap-1.5">
              <Label className="text-[13px]">Mevcut şifre</Label>
              <Input
                className="h-11 text-base"
                type="password"
                value={currentPw}
                onChange={(e) => setCurrentPw(e.target.value)}
                autoComplete="current-password"
              />
            </div>
            <div className="grid gap-1.5">
              <Label className="text-[13px]">Yeni şifre</Label>
              <Input
                className="h-11 text-base"
                type="password"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                autoComplete="new-password"
              />
            </div>
            <div className="grid gap-1.5">
              <Label className="text-[13px]">Yeni şifre tekrar</Label>
              <Input
                className="h-11 text-base"
                type="password"
                value={newPw2}
                onChange={(e) => setNewPw2(e.target.value)}
                autoComplete="new-password"
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="h-11 flex-1">
                Kaydet
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-11"
                onClick={() => {
                  setPwOpen(false);
                  setCurrentPw("");
                  setNewPw("");
                  setNewPw2("");
                }}
              >
                Vazgeç
              </Button>
            </div>
          </form>
        )}
      </CustomerCard>

      <VehicleManager me={me} />

      <div className="grid gap-2">
        <Link href="/taleplerim" className="customer-nav-link">
          <span>Taleplerim</span>
          <span className="hint">{unread > 0 ? `${unread} yeni` : "Mesajlar"}</span>
        </Link>
        <Link href="/takip" className="customer-nav-link">
          <span>İş takibi</span>
          <span className="hint">Canlı durum</span>
        </Link>
        <Link href="/kuponlar" className="customer-nav-link">
          <span>Kuponlarım</span>
          <span className="hint">{aktifKupon} aktif</span>
        </Link>
        <Link href="/randevu" className="customer-nav-link">
          <span>Yeni randevu</span>
          <span className="hint">Kayıtlı araçla</span>
        </Link>
        <Link href="/bildirimler" className="customer-nav-link">
          <span>Bildirimler</span>
          <span className="hint">Kampanya & kupon</span>
        </Link>
      </div>

      <CustomerCard>
        <p className="customer-section-label">Bildirim tercihleri</p>
        <p className="mt-2 text-[13px] leading-relaxed text-[#f0e6c8]/45">
          Süreç adımları her zaman WhatsApp. Makbuz ve hesap mailleri e-posta.
        </p>
        <label className="mt-3 flex items-center justify-between gap-3 text-[15px]">
          Kampanya e-postaları
          <input
            type="checkbox"
            className="size-4 accent-amber-400"
            checked={campaignNotif}
            onChange={(e) => setNotifPrefs({ campaignNotif: e.target.checked })}
          />
        </label>
        <label className="mt-3 flex items-center justify-between gap-3 text-[15px]">
          Kupon e-postaları
          <input
            type="checkbox"
            className="size-4 accent-amber-400"
            checked={couponNotif}
            onChange={(e) => setNotifPrefs({ couponNotif: e.target.checked })}
          />
        </label>
      </CustomerCard>

      <Button
        className="h-11 w-full"
        variant="outline"
        onClick={() => {
          if (!window.confirm("Çıkış yapmak istediğinize emin misiniz?")) return;
          logout();
          router.push("/");
        }}
      >
        Çıkış yap
      </Button>
    </CustomerPanel>
  );
}
