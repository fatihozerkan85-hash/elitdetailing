"use client";

import { toast } from "sonner";
import { PublicShell } from "@/components/public-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingBlock } from "@/components/site-header";
import { useStore } from "@/lib/store";

export default function KampanyalarPage() {
  const { claimCoupon, cms, ready, session } = useStore();
  if (!ready) return <PublicShell><LoadingBlock /></PublicShell>;
  const list = cms.campaigns.filter((c) => c.active);

  return (
    <PublicShell>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
        <p className="text-[11px] tracking-[0.3em] text-amber-300 uppercase">Teklifler</p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl uppercase sm:text-4xl">Kampanyalar</h1>
        <p className="mt-3 max-w-xl text-sm text-zinc-400">Kuponu alın, randevuda kullanın. İçerik yönetici panelinden güncellenir.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {list.map((c) => (
            <Card key={c.id} className="border-amber-500/20 bg-zinc-900/60">
              <CardHeader>
                <CardTitle className="text-lg">{c.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-zinc-400">
                <p>{c.blurb}</p>
                <p className="text-xs text-zinc-500">
                  {c.couponCode} · {c.ends} · {c.audience}
                </p>
                <Button
                  size="sm"
                  onClick={() => {
                    if (session.role !== "customer") {
                      toast.message("Kupon almak için giriş yapın");
                      return;
                    }
                    const res = claimCoupon(c.couponCode);
                    if (res.ok) toast.success(res.message, { description: c.couponCode });
                    else toast.error(res.message);
                  }}
                >
                  Kuponu al
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PublicShell>
  );
}
