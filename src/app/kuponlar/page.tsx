"use client";

import Link from "next/link";
import { CustomerCard, CustomerPanel, useMe } from "@/components/customer-panel";
import { EmptyState } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function KuponlarPage() {
  const { coupons, session } = useStore();
  const me = useMe();
  const mine = coupons.filter((c) =>
    session.role === "customer" && session.customerId ? c.customerId === session.customerId : false,
  );
  const by = (st: string) => mine.filter((c) => c.status === st);

  return (
    <CustomerPanel
      title="Kuponlarım"
      lead="Aktif kodlar randevu ve aksesuar ödemesinde otomatik uygulanabilir."
      className="sm:max-w-2xl"
    >
      {session.role !== "customer" ? (
        <CustomerCard>
          <p className="text-[15px] text-[#f0e6c8]/7">Kuponlarınızı görmek için giriş yapın.</p>
          <Link href="/giris?next=/kuponlar" className={cn(buttonVariants(), "mt-4 inline-flex h-11")}>
            Giriş yap
          </Link>
        </CustomerCard>
      ) : null}

      <Tabs defaultValue="aktif">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="aktif">Aktif</TabsTrigger>
          <TabsTrigger value="kullanildi">Kullanıldı</TabsTrigger>
          <TabsTrigger value="doldu">Süresi doldu</TabsTrigger>
        </TabsList>
        {(["aktif", "kullanildi", "doldu"] as const).map((tab) => (
          <TabsContent key={tab} value={tab} className="mt-4 space-y-3">
            {by(tab).length === 0 ? (
              <EmptyState
                title="Kupon yok"
                hint="Kampanyalar sayfasından kupon alabilirsiniz."
                action={
                  <Link href="/kampanyalar" className={cn(buttonVariants({ variant: "outline" }))}>
                    Kampanyalar
                  </Link>
                }
              />
            ) : (
              by(tab).map((c) => (
                <CustomerCard key={c.id} className="border-dashed border-amber-500/35">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-display text-[22px] tracking-[0.12em] text-amber-200">{c.code}</p>
                      <p className="mt-1 text-[16px] text-[#f0e6c8]">{c.title}</p>
                      <p className="mt-1 text-[14px] leading-relaxed text-[#f0e6c8]/55">{c.rule}</p>
                    </div>
                    <Badge variant="secondary">{c.expires}</Badge>
                  </div>
                </CustomerCard>
              ))
            )}
          </TabsContent>
        ))}
      </Tabs>

      {me ? (
        <Link href="/profil" className="customer-nav-link">
          <span>Profilime dön</span>
          <span className="hint">Araçlar</span>
        </Link>
      ) : null}
    </CustomerPanel>
  );
}
