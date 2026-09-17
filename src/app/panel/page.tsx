"use client";

import Link from "next/link";
import { PanelShell } from "@/components/panel-shell";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { APPT_STATUS_LABEL } from "@/lib/catalog";
import { todayISO, tryFormat } from "@/lib/format";
import { useStore } from "@/lib/store";

export default function PanelHome() {
  const { appointments, jobs, roadside, notifications, updateAppointmentStatus, reset } = useStore();
  const today = todayISO();
  const todaysAppt = appointments.filter((a) => a.date === today);
  const live = jobs.filter((j) => j.status !== "teslim" && j.status !== "iptal");
  const openRs = roadside.filter((r) => r.status !== "tamamlandi" && r.status !== "iptal");
  const revenue = jobs.filter((j) => j.status === "teslim").reduce((s, j) => s + j.estimate, 0);
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <PanelShell>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl uppercase">Bugünün panosu</h1>
          <p className="mt-1 text-sm text-zinc-500">Randevu, canlı iş, yol yardım ve tahsilat özeti.</p>
        </div>
        <Button variant="outline" size="sm" onClick={reset}>
          Demo veriyi sıfırla
        </Button>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Bugünkü randevu", String(todaysAppt.length)],
          ["Canlı iş", String(live.length)],
          ["Açık yol yardım", String(openRs.length)],
          ["Teslim geliri (demo)", tryFormat(revenue)],
        ].map(([k, v]) => (
          <Card key={k} className="border-white/10 bg-zinc-900/50">
            <CardHeader>
              <p className="text-xs text-zinc-500">{k}</p>
              <CardTitle className="font-[family-name:var(--font-display)] text-2xl text-amber-200">{v}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
      {unread > 0 ? (
        <p className="mt-4 text-sm">
          <Link href="/panel/bildirimler" className="text-amber-300 hover:underline">
            {unread} okunmamış bildirim
          </Link>
        </p>
      ) : null}

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <Card className="border-white/10 bg-zinc-900/40 lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Randevular</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {todaysAppt.length === 0 ? <p className="text-sm text-zinc-500">Bugün randevu yok.</p> : null}
            {todaysAppt.map((a) => (
              <div key={a.id} className="rounded-lg border border-white/10 p-3 text-sm">
                <div className="flex justify-between gap-2">
                  <span className="plate">{a.time}</span>
                  <StatusBadge status={a.status} />
                </div>
                <p className="mt-1">
                  {a.customerName} · {a.serviceName}
                </p>
                <p className="plate text-xs text-zinc-500">{a.plate}</p>
                {a.status === "bekliyor" ? (
                  <Button className="mt-2" size="sm" onClick={() => updateAppointmentStatus(a.id, "onaylandi")}>
                    Onayla
                  </Button>
                ) : null}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-zinc-900/40">
          <CardHeader>
            <CardTitle className="text-base">Canlı yıkama / detailing / lastik</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {live.length === 0 ? <p className="text-sm text-zinc-500">Açık iş yok.</p> : null}
            {live.map((j) => (
              <Link key={j.id} href={`/panel/isler/${j.id}`} className="block rounded-lg border border-white/10 p-3 text-sm hover:border-amber-400/30">
                <div className="flex justify-between">
                  <span className="plate">{j.plate}</span>
                  <StatusBadge status={j.status} />
                </div>
                <p className="mt-1 text-zinc-400">{j.serviceName}</p>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-zinc-900/40">
          <CardHeader>
            <CardTitle className="text-base">Açık yol yardım</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {openRs.length === 0 ? <p className="text-sm text-zinc-500">Açık çağrı yok.</p> : null}
            {openRs.map((r) => (
              <Link key={r.id} href={`/panel/isler/${r.id}`} className="block rounded-lg border border-white/10 p-3 text-sm hover:border-amber-400/30">
                <div className="flex justify-between">
                  <span>{r.id}</span>
                  <StatusBadge status={r.urgency} />
                </div>
                <p className="mt-1 plate">{r.plate}</p>
                <p className="line-clamp-2 text-xs text-zinc-500">{r.location}</p>
                <StatusBadge status={r.status} />
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
      <p className="mt-6 hidden text-xs text-zinc-600">{APPT_STATUS_LABEL.onaylandi}</p>
    </PanelShell>
  );
}
