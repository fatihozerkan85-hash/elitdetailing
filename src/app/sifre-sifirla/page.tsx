"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { CustomerCard, CustomerPanel } from "@/components/customer-panel";
import { LoadingBlock } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStore } from "@/lib/store";

function Form() {
  const { resetPassword } = useStore();
  const params = useSearchParams();
  const token = params.get("token") || "";
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  if (!token) {
    return (
      <CustomerCard>
        <p className="text-[15px] text-[#f0e6c8]/7">Geçersiz bağlantı.</p>
        <Link href="/sifremi-unuttum" className="mt-3 inline-block text-amber-300 hover:underline">
          Yeni link iste
        </Link>
      </CustomerCard>
    );
  }

  return (
    <CustomerCard>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (password !== password2) {
            toast.error("Şifreler eşleşmiyor");
            return;
          }
          const res = resetPassword(token, password);
          if (!res.ok) {
            toast.error(res.message);
            return;
          }
          toast.success(res.message, { description: "Onay e-postası gönderildi." });
          router.push("/giris");
        }}
      >
        <p className="text-[15px] text-[#f0e6c8]/7">Yeni şifrenizi belirleyin (en az 6 karakter).</p>
        <div className="grid gap-1.5">
          <Label className="text-[13px]">Yeni şifre</Label>
          <Input
            className="h-11 text-base"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
        </div>
        <div className="grid gap-1.5">
          <Label className="text-[13px]">Tekrar</Label>
          <Input
            className="h-11 text-base"
            type="password"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            autoComplete="new-password"
          />
        </div>
        <Button type="submit" className="h-11 w-full">
          Şifreyi kaydet
        </Button>
      </form>
    </CustomerCard>
  );
}

export default function SifreSifirlaPage() {
  return (
    <CustomerPanel title="Yeni şifre" lead="Bu adım e-posta linki ile açılır.">
      <Suspense fallback={<LoadingBlock />}>
        <Form />
      </Suspense>
    </CustomerPanel>
  );
}
