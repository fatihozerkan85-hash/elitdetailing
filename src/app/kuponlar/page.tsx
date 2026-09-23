"use client";

import { PublicShell } from "@/components/public-shell";
import { EmptyState } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStore } from "@/lib/store";

export default function KuponlarPage() {
  const { coupons, session } = useStore();
  const mine = coupons.filter((c) => !session.customerId || c.customerId === session.customerId || c.customerId === "c-demo");
  const by = (st: string) => mine.filter((c) => c.status === st);

  return (
    <PublicShell>
      <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
        <h1 className="font-[family-name:var(--font-display)] text-3xl uppercase">Kuponlarım</h1>
        <Tabs defaultValue="aktif" className="mt-6">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="aktif">Aktif</TabsTrigger>
            <TabsTrigger value="kullanildi">Kullanıldı</TabsTrigger>
            <TabsTrigger value="doldu">Süresi doldu</TabsTrigger>
          </TabsList>
          {(["aktif", "kullanildi", "doldu"] as const).map((tab) => (
            <TabsContent key={tab} value={tab} className="mt-4 space-y-3">
              {by(tab).length === 0 ? (
                <EmptyState title="Kupon yok" hint="Kampanyalar sayfasından kupon alın." />
              ) : (
                by(tab).map((c) => (
                  <div
                    key={c.id}
                    className="rounded-xl border border-dashed border-amber-500/40 bg-zinc-900/50 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-[family-name:var(--font-display)] text-xl tracking-widest text-amber-200">
                          {c.code}
                        </p>
                        <p className="mt-1 text-sm text-zinc-300">{c.title}</p>
                        <p className="text-xs text-zinc-500">{c.rule}</p>
                      </div>
                      <Badge variant="secondary">{c.expires}</Badge>
                    </div>
                  </div>
                ))
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </PublicShell>
  );
}
