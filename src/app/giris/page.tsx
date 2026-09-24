"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { PublicShell } from "@/components/public-shell";
import { LoadingBlock } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DEMO } from "@/lib/catalog";
import { useStore } from "@/lib/store";

function LoginInner() {
  const { loginCustomer, session, logout } = useStore();
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") ?? "/taleplerim";
  const [phone, setPhone] = useState(DEMO.customerPhone);

  return (
    <div className="max-w-md">
      <form
        className="space-y-4 rounded-xl border border-white/10 p-6"
        onSubmit={(e) => {
          e.preventDefault();
          loginCustomer(phone);
          router.push(next.startsWith("/") && !next.startsWith("/yonetici") && !next.startsWith("/panel") ? next : "/taleplerim");
        }}
      >
        <h2 className="font-[family-name:var(--font-display)] text-xl uppercase">Müşteri</h2>
        <p className="text-sm text-zinc-500">Kayıtlı telefon veya herhangi bir numara (demo müşteriye bağlanır).</p>
        <div className="grid gap-2">
          <Label>Telefon</Label>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <Button type="submit">Müşteri olarak gir</Button>
        <p className="text-xs text-zinc-600">Örnek: {DEMO.customerPhone}</p>
      </form>
      {session.role === "customer" ? (
        <p className="mt-4 text-sm text-zinc-500">
          Şu an: {session.name}{" "}
          <button className="text-amber-300" type="button" onClick={logout}>
            çıkış
          </button>
        </p>
      ) : null}
    </div>
  );
}

export default function GirisPage() {
  return (
    <PublicShell>
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="font-[family-name:var(--font-display)] text-4xl uppercase">Giriş</h1>
        <p className="mt-2 text-sm text-zinc-400">Müşteri oturumu. Yönetici paneli bu sayfada yoktur.</p>
        <div className="mt-8">
          <Suspense fallback={<LoadingBlock />}>
            <LoginInner />
          </Suspense>
        </div>
      </div>
    </PublicShell>
  );
}
