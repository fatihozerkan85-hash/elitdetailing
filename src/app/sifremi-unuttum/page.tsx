"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { CustomerCard, CustomerPanel } from "@/components/customer-panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStore } from "@/lib/store";

export default function SifremiUnuttumPage() {
  const { requestPasswordReset } = useStore();
  const [login, setLogin] = useState("");
  const [sent, setSent] = useState(false);
  const [demoUrl, setDemoUrl] = useState<string | null>(null);

  return (
    <CustomerPanel
      title="Şifremi unuttum"
      lead="Sıfırlama linki yalnızca e-posta ile gönderilir. WhatsApp kullanılmaz."
    >
      <CustomerCard>
        {sent ? (
          <div className="space-y-3">
            <p className="text-[15px] leading-relaxed text-[#f0e6c8]/8">
              Link e-posta kutunuza gönderildi (demo ortamında mock). 30 dakika geçerlidir.
            </p>
            {demoUrl ? (
              <p className="rounded-lg border border-amber-400/25 bg-amber-400/5 p-3 text-[13px] leading-relaxed text-[#f0e6c8]/7">
                Demo: SMTP yok —{" "}
                <Link href={demoUrl} className="text-amber-300 hover:underline">
                  sıfırlama sayfasını aç
                </Link>
              </p>
            ) : null}
            <Link href="/giris" className="text-[14px] text-amber-300 hover:underline">
              Girişe dön
            </Link>
          </div>
        ) : (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              const res = requestPasswordReset(login);
              if (!res.ok) {
                toast.error(res.message);
                return;
              }
              toast.success(res.message);
              setDemoUrl(res.demoUrl || null);
              setSent(true);
            }}
          >
            <div className="grid gap-1.5">
              <Label className="text-[13px]">Telefon veya e-posta</Label>
              <Input
                className="h-11 text-base"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                placeholder="demo@elitdetailing.com"
              />
            </div>
            <Button type="submit" className="h-11 w-full">
              Sıfırlama linki gönder
            </Button>
            <Link href="/giris" className="block text-center text-[14px] text-[#f0e6c8]/5 hover:text-amber-300">
              Girişe dön
            </Link>
          </form>
        )}
      </CustomerCard>
    </CustomerPanel>
  );
}
