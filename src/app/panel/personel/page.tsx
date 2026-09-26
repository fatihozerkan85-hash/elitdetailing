"use client";

import { useState } from "react";
import { toast } from "sonner";
import { PanelShell } from "@/components/panel-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useStore } from "@/lib/store";
import type { Technician } from "@/lib/types";

const empty = { name: "", role: "", shift: "08:30–17:00" };

export default function PersonelPage() {
  const { technicians, jobs, roadside, saveTechnician, deleteTechnician } = useStore();
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<string | null>(null);

  function startEdit(t: Technician) {
    setEditing(t.id);
    setForm({ name: t.name, role: t.role, shift: t.shift });
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.role.trim()) {
      toast.error("Ad ve rol zorunlu");
      return;
    }
    saveTechnician({
      id: editing || undefined,
      name: form.name,
      role: form.role,
      shift: form.shift,
    });
    toast.success(editing ? "Personel güncellendi" : "Personel eklendi");
    setEditing(null);
    setForm(empty);
  }

  return (
    <PanelShell>
      <h1 className="font-[family-name:var(--font-display)] text-3xl uppercase">Personel</h1>
      <p className="mt-1 text-sm text-zinc-500">Yük açık iş ve saha çağrılarına göre hesaplanır. Atama iş detayından yapılır.</p>

      <form
        onSubmit={submit}
        className="mt-6 grid max-w-2xl gap-3 rounded-xl border border-white/10 p-4 sm:grid-cols-3"
      >
        <div className="grid gap-1">
          <Label>Ad</Label>
          <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
        </div>
        <div className="grid gap-1">
          <Label>Rol</Label>
          <Input value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))} />
        </div>
        <div className="grid gap-1">
          <Label>Vardiya</Label>
          <Input value={form.shift} onChange={(e) => setForm((f) => ({ ...f, shift: e.target.value }))} />
        </div>
        <div className="flex gap-2 sm:col-span-3">
          <Button type="submit">{editing ? "Kaydet" : "Ekle"}</Button>
          {editing ? (
            <Button type="button" variant="outline" onClick={() => { setEditing(null); setForm(empty); }}>
              İptal
            </Button>
          ) : null}
        </div>
      </form>

      <ul className="mt-8 space-y-5">
        {technicians.map((t) => {
          const openJobs = jobs.filter((j) => j.technicianId === t.id && j.status !== "teslim" && j.status !== "iptal").length;
          const openRs = roadside.filter((r) => r.technicianId === t.id && r.status !== "tamamlandi" && r.status !== "iptal").length;
          const load = Math.min(100, (openJobs + openRs) * 28 + 12);
          return (
            <li key={t.id} className="rounded-xl border border-white/10 p-4">
              <div className="flex flex-wrap justify-between gap-2 text-sm">
                <div>
                  <p className="font-medium">{t.name}</p>
                  <p className="text-zinc-500">
                    {t.role} · {t.shift}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-amber-200">
                    {openJobs} iş · {openRs} çağrı
                  </p>
                  <Button size="sm" variant="outline" onClick={() => startEdit(t)}>
                    Düzenle
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      deleteTechnician(t.id);
                      toast.success("Silindi");
                    }}
                  >
                    Sil
                  </Button>
                </div>
              </div>
              <Progress value={load} className="mt-3" />
            </li>
          );
        })}
      </ul>
    </PanelShell>
  );
}
