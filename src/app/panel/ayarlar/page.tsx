"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PanelShell } from "@/components/panel-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStore } from "@/lib/store";

type StatusPayload = {
  email: "mock" | "resend" | "unknown";
  whatsapp: "link" | "cloud" | "unknown";
  iyzico: "mock" | "live" | "unknown";
};

export default function PanelAyarlarPage() {
  const { setOwnerPin, emailOutbox, whatsappOutbox, reset } = useStore();
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [newPin2, setNewPin2] = useState("");
  const [status, setStatus] = useState<StatusPayload | null>(null);

  useEffect(() => {
    fetch("/api/status")
      .then((r) => r.json())
      .then((j) => setStatus(j as StatusPayload))
      .catch(() => setStatus({ email: "unknown", whatsapp: "unknown", iyzico: "unknown" }));
  }, []);

  return (
    <PanelShell>
      <h1 className="font-[family-name:var(--font-display)] text-3xl uppercase">Sistem</h1>
      <p className="mt-2 max-w-2xl text-sm text-zinc-400">
        Canlı anahtarlar Vercel Environment Variables ile eklenir. Anahtar yoksa e-posta/WhatsApp mock veya
        wa.me linki ile çalışır; iyzico mock ödeme ekranı açılır.
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        {[
          ["E-posta", status?.email ?? "…", "RESEND_API_KEY + EMAIL_FROM"],
          ["WhatsApp", status?.whatsapp ?? "…", "WHATSAPP_TOKEN + WHATSAPP_PHONE_NUMBER_ID"],
          ["iyzico", status?.iyzico ?? "…", "IYZICO_API_KEY + IYZICO_SECRET_KEY"],
        ].map(([k, v, hint]) => (
          <div key={k} className="rounded-xl border border-white/10 bg-zinc-900/40 p-4">
            <p className="text-xs text-zinc-500">{k}</p>
            <p className="mt-1 font-medium text-amber-200">{v}</p>
            <p className="mt-2 text-[11px] text-zinc-600">{hint}</p>
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs text-zinc-500">
        Kuyruk: {emailOutbox.length} e-posta · {whatsappOutbox.length} WhatsApp (bu tarayıcı)
      </p>

      <form
        className="mt-10 max-w-md space-y-3 rounded-xl border border-white/10 p-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (newPin !== newPin2) {
            toast.error("Yeni PIN’ler eşleşmiyor");
            return;
          }
          const res = setOwnerPin(currentPin, newPin);
          if (!res.ok) {
            toast.error(res.message);
            return;
          }
          toast.success(res.message);
          setCurrentPin("");
          setNewPin("");
          setNewPin2("");
        }}
      >
        <p className="text-sm font-medium text-zinc-200">Yönetici PIN değiştir</p>
        <div className="grid gap-1.5">
          <Label>Mevcut PIN</Label>
          <Input type="password" value={currentPin} onChange={(e) => setCurrentPin(e.target.value)} />
        </div>
        <div className="grid gap-1.5">
          <Label>Yeni PIN</Label>
          <Input type="password" value={newPin} onChange={(e) => setNewPin(e.target.value)} />
        </div>
        <div className="grid gap-1.5">
          <Label>Yeni PIN tekrar</Label>
          <Input type="password" value={newPin2} onChange={(e) => setNewPin2(e.target.value)} />
        </div>
        <Button type="submit">PIN kaydet</Button>
      </form>

      <div className="mt-8">
        <Button
          variant="destructive"
          onClick={() => {
            if (!window.confirm("Tüm demo veriyi sıfırlamak istediğinize emin misiniz?")) return;
            reset();
            toast.success("Demo veri sıfırlandı");
          }}
        >
          Demo veriyi sıfırla
        </Button>
      </div>
    </PanelShell>
  );
}
