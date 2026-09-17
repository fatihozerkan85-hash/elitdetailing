"use client";

import { PublicShell } from "@/components/public-shell";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <PublicShell>
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="font-[family-name:var(--font-display)] text-3xl uppercase">Bir şey ters gitti</h1>
        <p className="mt-3 text-sm text-zinc-400">{error.message || "Beklenmeyen hata."}</p>
        <Button className="mt-6" onClick={reset}>
          Yeniden dene
        </Button>
      </div>
    </PublicShell>
  );
}
