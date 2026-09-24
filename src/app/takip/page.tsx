"use client";

import Link from "next/link";
import { PublicShell } from "@/components/public-shell";
import { EmptyState, LoadingBlock } from "@/components/site-header";
import { JobPipeline, StatusBadge } from "@/components/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatDateTime } from "@/lib/format";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";

export default function TakipPage() {
  const { jobs, roadside, ready } = useStore();
  const [q, setQ] = useState("");
  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const j = jobs.map((x) => ({ type: "is" as const, ...x }));
    const r = roadside.map((x) => ({ type: "yy" as const, serviceName: x.issue, estimate: 0, ...x }));
    return [...j, ...r].filter((row) => {
      if (!needle) return true;
      return `${row.id} ${row.plate} ${row.customerName}`.toLowerCase().includes(needle);
    });
  }, [jobs, roadside, q]);

  return (
    <PublicShell>
      <div className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="font-[family-name:var(--font-display)] text-4xl uppercase">İş takibi</h1>
        <p className="mt-2 text-sm text-zinc-400">Plaka veya iş kodu ile yıkama, detailing, lastik ve yol yardım durumunu görün.</p>
        <Input className="mt-6 max-w-md" placeholder="Plaka veya kod (IS-… / YY-…)" value={q} onChange={(e) => setQ(e.target.value)} />
        {!ready ? (
          <LoadingBlock />
        ) : list.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              title="Kayıt yok"
              hint="Henüz iş yok veya arama eşleşmedi. Randevu veya yol yardım oluşturun."
              action={
                <Link href="/randevu" className={cn(buttonVariants())}>
                  Randevu al
                </Link>
              }
            />
          </div>
        ) : (
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {list.map((row) => (
              <Link key={row.id} href={`/takip/${row.id}`}>
                <Card className="h-full border-white/10 bg-zinc-900/50 transition hover:border-amber-400/30">
                  <CardHeader className="flex flex-row items-start justify-between">
                    <div>
                      <p className="plate text-xs text-zinc-500">{row.id}</p>
                      <CardTitle className="plate mt-1 text-lg">{row.plate}</CardTitle>
                    </div>
                    <StatusBadge status={row.status} />
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-zinc-400">
                    <p>
                      {row.serviceName} · {row.customerName}
                    </p>
                    {row.type === "is" ? <JobPipeline job={row} current={row.status} /> : null}
                    <p className="text-xs">{formatDateTime(row.createdAt)}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </PublicShell>
  );
}
