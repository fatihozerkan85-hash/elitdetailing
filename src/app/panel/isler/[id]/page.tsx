"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { PanelShell } from "@/components/panel-shell";
import { GeoLink } from "@/components/geo-link";
import { EmptyState } from "@/components/site-header";
import { JobPipeline, StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { JOB_FLOW, JOB_STATUS_LABEL, ROADSIDE_STATUS_LABEL } from "@/lib/catalog";
import { formatDateTime, tryFormat } from "@/lib/format";
import { jobClock } from "@/lib/process";
import { useStore } from "@/lib/store";
import type { JobStatus, RoadsideStatus } from "@/lib/types";

const RS_FLOW: RoadsideStatus[] = ["alindi", "yonlendirildi", "yolda", "yerinde", "tamamlandi"];

export default function IsDetayPage() {
  const { id } = useParams<{ id: string }>();
  const { jobs, roadside, technicians, customers, updateJobStatus, updateRoadsideStatus, checkInJob } = useStore();
  const job = jobs.find((j) => j.id === id);
  const call = roadside.find((r) => r.id === id);

  if (!job && !call) {
    return (
      <PanelShell>
        <EmptyState title="Kayıt yok" hint="Kod bulunamadı." action={<Link href="/yonetici/isler">Liste</Link>} />
      </PanelShell>
    );
  }

  const tech = technicians.find((t) => t.id === (job?.technicianId ?? call?.technicianId));
  const customer = customers.find((c) => c.id === (job?.customerId ?? call?.customerId));

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
            <span className="text-zinc-500">{job?.phone ?? call?.phone}</span>
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
          <dt className="text-zinc-500">Personel</dt>
          <dd>{tech?.name ?? "Atanmadı"}</dd>
        </div>
      </dl>
      {customer ? <p className="mt-2 text-xs text-zinc-600">Kayıtlı müşteri: {customer.name}</p> : null}

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
          <p className="mt-4 text-xs tracking-widest text-zinc-500 uppercase">Durum ilerlet</p>
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
