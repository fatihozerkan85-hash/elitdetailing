"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CustomerCard, CustomerPanel } from "@/components/customer-panel";
import { LoadingBlock } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";

function Form() {
  const { verifyEmail, ready } = useStore();
  const params = useSearchParams();
  const token = params.get("token") || "";
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  useEffect(() => {
    if (!ready) return;
    if (!token) {
      setResult({ ok: false, message: "Geçersiz bağlantı" });
      return;
    }
    setResult(verifyEmail(token));
    // verify once per token
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, token]);

  if (!token) {
    return (
      <CustomerCard>
        <p className="text-[15px] text-[#f0e6c8]/7">Geçersiz bağlantı.</p>
        <Link href="/profil" className="mt-3 inline-block text-amber-300 hover:underline">
          Profile dön
        </Link>
      </CustomerCard>
    );
  }

  if (!result) return <LoadingBlock />;

  return (
    <CustomerCard>
      <p className={`text-[15px] ${result.ok ? "text-emerald-300" : "text-red-300"}`}>{result.message}</p>
      <Link href={result.ok ? "/profil" : "/giris"}>
        <Button className="mt-4 h-11 w-full">{result.ok ? "Profile git" : "Girişe dön"}</Button>
      </Link>
    </CustomerCard>
  );
}

export default function EpostaDogrulaPage() {
  return (
    <CustomerPanel title="E-posta doğrula" lead="Kayıt sonrası gönderilen link bu sayfayı açar.">
      <Suspense fallback={<LoadingBlock />}>
        <Form />
      </Suspense>
    </CustomerPanel>
  );
}
