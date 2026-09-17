"use client";

import Link from "next/link";
import { PublicShell } from "@/components/public-shell";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CATEGORY_LABEL, SERVICES } from "@/lib/catalog";
import { tryFormat } from "@/lib/format";
import { cn } from "@/lib/utils";

export default function HizmetlerPage() {
  const groups = Array.from(new Set(SERVICES.map((s) => s.category)));

  return (
    <PublicShell>
      <div className="mx-auto max-w-6xl px-4 py-12">
        <p className="text-[11px] tracking-[0.3em] text-amber-300 uppercase">Katalog</p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl uppercase">Hizmetler</h1>
        <p className="mt-3 max-w-2xl text-sm text-zinc-400">
          Uygulamanın desteklediği tüm işler. Süreler tipik atölye süreleridir; fiyatlar başlangıç tutarıdır. İnsan
          temsilcisine bağlanmadan yapılabilecekler her kartta listelenir.
        </p>

        {groups.map((g) => (
          <section key={g} id={g} className="mt-12 scroll-mt-24">
            <h2 className="font-[family-name:var(--font-display)] text-2xl tracking-wide text-amber-200 uppercase">
              {CATEGORY_LABEL[g]}
            </h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {SERVICES.filter((s) => s.category === g).map((s) => (
                <Card key={s.id} className="border-white/10 bg-zinc-900/50">
                  <CardHeader>
                    <CardTitle>{s.name}</CardTitle>
                    <CardDescription>{s.short}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-zinc-400">
                    <p>{s.description}</p>
                    <p className="text-zinc-300">
                      Tipik süre <span className="text-amber-200">{s.durationMin} dk</span> · {tryFormat(s.fromPrice)}{" "}
                      itibaren
                    </p>
                    <div>
                      <p className="text-[11px] tracking-widest text-zinc-500 uppercase">Temsilcisiz</p>
                      <ul className="mt-1 list-disc space-y-1 pl-4">
                        {s.selfService.map((x) => (
                          <li key={x}>{x}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex gap-2 pt-1">
                      {s.category === "yol-yardim" ? (
                        <Link href="/yol-yardim" className={cn(buttonVariants({ size: "sm" }))}>
                          Yol yardım iste
                        </Link>
                      ) : s.category === "aksesuar" ? (
                        <Link href="/aksesuar" className={cn(buttonVariants({ size: "sm" }))}>
                          Aksesuar
                        </Link>
                      ) : (
                        <Link href={`/randevu?hizmet=${s.id}`} className={cn(buttonVariants({ size: "sm" }))}>
                          Randevu
                        </Link>
                      )}
                      <Link href="/sss" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
                        SSS
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        ))}
      </div>
    </PublicShell>
  );
}
