"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { PublicShell } from "@/components/public-shell";
import { GeoLink } from "@/components/geo-link";
import { EmptyState, LoadingBlock } from "@/components/site-header";
import { JobPipeline, StatusBadge } from "@/components/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { formatDateTime, tryFormat } from "@/lib/format";
import { jobClock } from "@/lib/process";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function TakipDetayPage() {
  const { id } = useParams<{ id: string }>();
  const { jobs, roadside, technicians, ready } = useStore();
  const job = jobs.find((j) => j.id === id);
  const call = roadside.find((r) => r.id === id);

  if (!ready) {
    return (
      <PublicShell>
        <div className="mx-auto max-w-3xl px-4 py-12">
          <LoadingBlock />
        </div>
      </PublicShell>
    );
  }

  if (!job && !call) {
    return (
      <PublicShell>
        <div className="mx-auto max-w-3xl px-4 py-12">
          <EmptyState
            title="Kayıt bulunamadı"
            hint="Kod hatalı olabilir veya veri sıfırlanmış olabilir."
            action={
              <Link href="/takip" className={cn(buttonVariants())}>
                Listeye dön
              </Link>
            }
          />
        </div>
      </PublicShell>
    );
  }

  const tech = technicians.find((t) => t.id === (job?.technicianId ?? call?.technicianId));

  return (
    <PublicShell>
      <div className="mx-auto max-w-3xl px-4 py-12">
        <Link href="/takip" className="text-xs text-zinc-500 hover:text-amber-300">
          ← Tüm işler
        </Link>
        <div className="mt-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs text-zinc-500">{job ? "Atölye işi" : "Yol yardım"}</p>
            <h1 className="plate mt-1 font-[family-name:var(--font-display)] text-3xl">{job?.plate ?? call?.plate}</h1>
            <p className="mt-1 text-sm text-zinc-400">{job?.serviceName ?? call?.issue}</p>
          </div>
          <StatusBadge status={(job ?? call)!.status} />
        </div>

        {job ? (
          <div className="mt-6">
            <JobPipeline job={job} current={job.status} />
            {!job.startedAt ? (
              <p className="mt-4 rounded-lg border border-amber-400/20 bg-amber-400/5 p-3 text-sm text-amber-100">
                Randevu saati geldi diye süreç başlamaz. Tesise giriş yönetici tarafından onaylanınca adımlar ve bildirimler açılır.
              </p>
            ) : (
              <p className="mt-4 text-sm text-zinc-300">
                {jobClock(job).done
                  ? "Tahmini süreç tamamlandı — teslim."
                  : `Şu an: ${jobClock(job).title} · kalan ~${Math.ceil(jobClock(job).remaining)} dk`}
              </p>
            )}
            <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-zinc-500">Müşteri</dt>
                <dd>{job.customerName}</dd>
              </div>
              <div>
                <dt className="text-zinc-500">Tahmini</dt>
                <dd>{tryFormat(job.estimate)}</dd>
              </div>
              <div>
                <dt className="text-zinc-500">Teknisyen</dt>
                <dd>{tech?.name ?? "Atama bekleniyor"}</dd>
              </div>
              <div>
                <dt className="text-zinc-500">Kod</dt>
                <dd>{job.id}</dd>
              </div>
            </dl>
            {job.notes ? <p className="mt-4 rounded-lg border border-white/10 p-3 text-sm text-zinc-400">{job.notes}</p> : null}
            <ol className="mt-8 space-y-3 border-l border-white/10 pl-4">
              {job.timeline.map((e, i) => (
                <li key={i}>
                  <p className="text-xs text-zinc-500">{formatDateTime(e.at)}</p>
                  <p className="text-sm">{e.note}</p>
                </li>
              ))}
            </ol>
          </div>
        ) : (
          <div className="mt-6 space-y-4 text-sm">
            <p className="rounded-lg border border-white/10 p-3 text-zinc-300">{call!.location}</p>
            <GeoLink lat={call!.lat} lng={call!.lng} accuracyM={call!.accuracyM} />
            <p className="text-zinc-400">Ekip: {tech?.name ?? "Yönlendirme bekleniyor"}</p>
            <ol className="space-y-3 border-l border-white/10 pl-4">
              {call!.timeline.map((e, i) => (
                <li key={i}>
                  <p className="text-xs text-zinc-500">{formatDateTime(e.at)}</p>
                  <p>{e.note}</p>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </PublicShell>
  );
}
