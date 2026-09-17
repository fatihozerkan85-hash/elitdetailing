"use client";

import Link from "next/link";
import { PublicShell } from "@/components/public-shell";
import { FAQ } from "@/lib/catalog";

export default function SssPage() {
  return (
    <PublicShell>
      <div className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="font-[family-name:var(--font-display)] text-4xl uppercase">Sık sorulanlar</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Temsilciye yazmadan önce burası. Cevap yoksa Taleplerim’den iş koduyla takip edin.
        </p>
        <div className="mt-8 space-y-3">
          {FAQ.map((f) => (
            <details key={f.q} className="rounded-xl border border-white/10 bg-zinc-900/40 px-4 py-3">
              <summary className="cursor-pointer text-sm font-medium text-zinc-100">{f.q}</summary>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{f.a}</p>
            </details>
          ))}
        </div>
        <p className="mt-8 text-sm text-zinc-500">
          Hâlâ emin değil misiniz?{" "}
          <Link className="text-amber-300 hover:underline" href="/randevu">
            Randevu
          </Link>{" "}
          veya{" "}
          <Link className="text-amber-300 hover:underline" href="/yol-yardim">
            yol yardım
          </Link>
          .
        </p>
      </div>
    </PublicShell>
  );
}
