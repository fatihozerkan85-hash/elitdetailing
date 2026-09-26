"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { PanelShell } from "@/components/panel-shell";
import { GeoLink } from "@/components/geo-link";
import { EmptyState } from "@/components/site-header";
import { JobPipeline, StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { JOB_FLOW, JOB_STATUS_LABEL, PAYMENT_STATUS_LABEL, ROADSIDE_STATUS_LABEL } from "@/lib/catalog";
import { formatDateTime, tryFormat } from "@/lib/format";
import { jobClock } from "@/lib/process";
import { useStore } from "@/lib/store";
import type { JobStatus, RoadsideStatus } from "@/lib/types";

const RS_FLOW: RoadsideStatus[] = ["alindi", "yonlendirildi", "yolda", "yerinde", "tamamlandi"];

export default function IsDetayPage() {
  const { id } = useParams<{ id: string }>();
  const {
    jobs,
    roadside,
    technicians,
    customers,
    updateJobStatus,
    updateRoadsideStatus,
    checkInJob,
    assignTechnician,
    updateJobEstimate,
    enqueueWhatsApp,
  } = useStore();
  const job = jobs.find((j) => j.id === id);
  const call = roadside.find((r) => r.id === id);
  const [payAmount, setPayAmount] = useState(job?.estimate || call?.amount || 650);
  const [notes, setNotes] = useState(job?.notes || "");

  if (!job && !call) {
    return (
      <PanelShell>
        <EmptyState title="Kayıt yok" hint="Kod bulunamadı." action={<Link href="/yonetici/isler">Liste</Link>} />
      </PanelShell>
    );
  }

  const techId = job?.technicianId ?? call?.technicianId ?? "";
  const tech = technicians.find((t) => t.id === techId);
  const customer = customers.find((c) => c.id === (job?.customerId ?? call?.customerId));
  const phone = job?.phone ?? call!.phone;
  const paymentStatus = job?.paymentStatus ?? call!.paymentStatus;

  function sendPayLink() {
    const kind = call ? "yol-yardim" : "teklif";
    const ref = call?.id ?? job?.appointmentId ?? job!.id;
    const url = `${window.location.origin}/odeme/link?kind=${kind}&refId=${encodeURIComponent(ref)}&amount=${payAmount}`;
    const text = `Elit Detailing ödeme linki (${tryFormat(payAmount)}): ${url}`;
    enqueueWhatsApp({ phone, text, jobId: id, open: true });
    toast.success("Ödeme linki WhatsApp kuyruğuna yazıldı");
  }

  return (
    <PanelShell>
      <Link href="/yonetici/isler" className="text-xs text-zinc-500">
        ← İşler
      </Link>
      <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs text-zinc-500">{job ? job.kind : "yol-yardim"} · {id}</p>
          <h1 className="plate font-[family-name:var(--font-display)] text-3xl">{job?.plate ?? call?.plate}</h1>
          <p className="text-sm text-zinc-400">{job?.serviceName ?? call?.issue}</p>
        </div>
        <StatusBadge status={(job ?? call)!.status} />
      </div>

      <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-sm">
        <div>
          <dt className="text-zinc-500">Müşteri</dt>
          <dd>
            {job?.customerName ?? call?.customerName}
            <br />
            <span className="text-zinc-500">{phone}</span>
          </dd>
        </div>
        <div>
          <dt className="text-zinc-500">Araç</dt>
          <dd>{job?.vehicle ?? call?.vehicle}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">{job ? "Tahmini" : "Aciliyet"}</dt>
          <dd>{job ? tryFormat(job.estimate) : call?.urgency}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">Ödeme</dt>
          <dd>{PAYMENT_STATUS_LABEL[paymentStatus] ?? paymentStatus}</dd>
        </div>
      </dl>

      <div className="mt-4 flex flex-wrap items-end gap-3">
        <div className="grid gap-1">
          <Label className="text-xs text-zinc-500">Personel</Label>
          <select
            className="h-9 rounded-lg border border-input bg-input/30 px-2 text-sm"
            value={techId}
            onChange={(e) => {
              assignTechnician(id, e.target.value);
              toast.success("Personel atandı");
            }}
          >
            <option value="" style={{ color: "#111", backgroundColor: "#fff" }}>
              Seçilmedi
            </option>
            {technicians.map((t) => (
              <option key={t.id} value={t.id} style={{ color: "#111", backgroundColor: "#fff" }}>
                {t.name} · {t.role}
              </option>
            ))}
          </select>
        </div>
        {tech ? <p className="text-xs text-zinc-600">Aktif: {tech.name}</p> : null}
        {customer ? <p className="text-xs text-zinc-600">Kayıtlı müşteri: {customer.name}</p> : null}
      </div>

      {job ? (
        <div className="mt-4 grid max-w-xl gap-2 rounded-xl border border-white/10 p-4">
          <Label className="text-xs text-zinc-500">Tahmini tutar / not</Label>
          <div className="flex flex-wrap gap-2">
            <Input
              type="number"
              className="w-36"
              value={payAmount}
              onChange={(e) => setPayAmount(Number(e.target.value))}
            />
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                updateJobEstimate(job.id, payAmount, notes);
                toast.success("Tahmin kaydedildi");
              }}
            >
              Kaydet
            </Button>
          </div>
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
        </div>
      ) : (
        <div className="mt-4 flex flex-wrap items-end gap-2">
          <div>
            <Label className="text-xs text-zinc-500">Teklif tutarı ₺</Label>
            <Input
              type="number"
              className="mt-1 w-36"
              value={payAmount}
              onChange={(e) => setPayAmount(Number(e.target.value))}
            />
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              updateJobEstimate(call!.id, payAmount);
              toast.success("Tutar kaydedildi");
            }}
          >
            Tutarı kaydet
          </Button>
        </div>
      )}

      {paymentStatus !== "odendi" ? (
        <div className="mt-6 flex flex-wrap items-end gap-2 rounded-xl border border-amber-500/25 bg-zinc-900/40 p-4">
          <div>
            <p className="text-xs text-zinc-500">iyzico ödeme linki (₺)</p>
            <Input
              type="number"
              className="mt-1 w-36"
              value={payAmount}
              onChange={(e) => setPayAmount(Number(e.target.value))}
            />
          </div>
          <Button onClick={sendPayLink}>WhatsApp ile ödeme linki gönder</Button>
          <p className="w-full text-xs text-zinc-500">
            Yol yardımda ödeme çıkışı engellemez. Keşif/teklif sonrası link gönderin. (iyzico mock)
          </p>
        </div>
      ) : null}

      {job ? (
        <>
          <div className="mt-6">
            <JobPipeline job={job} current={job.status} />
          </div>
          {job.startedAt ? (
            <p className="mt-3 text-sm text-zinc-400">
              Şu an: {jobClock(job).title}
              {jobClock(job).done ? " — tamam" : ` · kalan ~${Math.ceil(jobClock(job).remaining)} dk`}
            </p>
          ) : (
            <p className="mt-3 text-sm text-amber-200/90">Sayaç kapalı. Randevu saati süreci başlatmaz — girişi onaylayın.</p>
          )}
          {!job.startedAt && job.status !== "iptal" && job.status !== "teslim" ? (
            <Button className="mt-4" onClick={() => checkInJob(job.id)}>
              Müşteri girişini onayla
            </Button>
          ) : null}
          <p className="mt-4 text-xs tracking-widest text-zinc-500 uppercase">Durum ilerlet (WhatsApp gider)</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {JOB_FLOW.map((s) => (
              <Button
                key={s}
                size="sm"
                variant={job.status === s ? "default" : "outline"}
                disabled={job.status === "teslim" && s !== "teslim"}
                onClick={() => updateJobStatus(job.id, s as JobStatus, `${JOB_STATUS_LABEL[s]} — pano`)}
              >
                {JOB_STATUS_LABEL[s]}
              </Button>
            ))}
            <Button size="sm" variant="destructive" onClick={() => updateJobStatus(job.id, "iptal", "İptal")}>
              İptal
            </Button>
          </div>
          {job.notes ? <p className="mt-4 rounded-lg border border-white/10 p-3 text-sm text-zinc-400">{job.notes}</p> : null}
          <ol className="mt-8 space-y-3 border-l border-white/10 pl-4 text-sm">
            {job.timeline.map((e, i) => (
              <li key={i}>
                <p className="text-xs text-zinc-500">{formatDateTime(e.at)}</p>
                <p>{e.note}</p>
              </li>
            ))}
          </ol>
        </>
      ) : (
        <>
          <p className="mt-6 rounded-lg border border-white/10 p-3 text-sm">{call!.location}</p>
          <div className="mt-2">
            <GeoLink lat={call!.lat} lng={call!.lng} accuracyM={call!.accuracyM} />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {RS_FLOW.map((s) => (
              <Button
                key={s}
                size="sm"
                variant={call!.status === s ? "default" : "outline"}
                onClick={() => updateRoadsideStatus(call!.id, s, ROADSIDE_STATUS_LABEL[s])}
              >
                {ROADSIDE_STATUS_LABEL[s]}
              </Button>
            ))}
            <Button size="sm" variant="destructive" onClick={() => updateRoadsideStatus(call!.id, "iptal", "İptal")}>
              İptal
            </Button>
          </div>
          <ol className="mt-8 space-y-3 border-l border-white/10 pl-4 text-sm">
            {call!.timeline.map((e, i) => (
              <li key={i}>
                <p className="text-xs text-zinc-500">{formatDateTime(e.at)}</p>
                <p>{e.note}</p>
              </li>
            ))}
          </ol>
        </>
      )}
    </PanelShell>
  );
}
