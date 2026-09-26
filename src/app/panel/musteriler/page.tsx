"use client";

import { useState } from "react";
import { toast } from "sonner";
import { PanelShell } from "@/components/panel-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useStore } from "@/lib/store";
import type { Customer } from "@/lib/types";

const empty = { name: "", phone: "", plate: "", vehicle: "" };

export default function MusterilerPage() {
  const { customers, jobs, appointments, roadside, saveCustomer, deleteCustomer } = useStore();
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<string | null>(null);

  function startEdit(c: Customer) {
    setEditing(c.id);
    setForm({ name: c.name, phone: c.phone, plate: c.plate, vehicle: c.vehicle });
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error("Ad ve telefon zorunlu");
      return;
    }
    saveCustomer({
      id: editing || undefined,
      name: form.name,
      phone: form.phone,
      plate: form.plate,
      vehicle: form.vehicle,
    });
    toast.success(editing ? "Müşteri güncellendi" : "Müşteri eklendi");
    setEditing(null);
    setForm(empty);
  }

  return (
    <PanelShell>
      <h1 className="font-[family-name:var(--font-display)] text-3xl uppercase">Müşteriler</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Yeni taleplerden otomatik kaydedilir. Buradan da ekleyip düzenleyebilirsiniz.
      </p>

      <form
        onSubmit={submit}
        className="mt-6 grid max-w-3xl gap-3 rounded-xl border border-white/10 p-4 sm:grid-cols-2"
      >
        <p className="sm:col-span-2 text-sm text-zinc-400">
          {editing ? `Düzenleniyor: ${editing}` : "Yeni müşteri"}
        </p>
        {(
          [
            ["name", "Ad soyad"],
            ["phone", "Telefon"],
            ["plate", "Plaka"],
            ["vehicle", "Araç"],
          ] as const
        ).map(([key, label]) => (
          <div key={key} className="grid gap-1">
            <Label>{label}</Label>
            <Input
              className={key === "plate" ? "plate" : undefined}
              value={form[key]}
              onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
            />
          </div>
        ))}
        <div className="flex flex-wrap gap-2 sm:col-span-2">
          <Button type="submit">{editing ? "Kaydet" : "Ekle"}</Button>
          {editing ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setEditing(null);
                setForm(empty);
              }}
            >
              İptal
            </Button>
          ) : null}
        </div>
      </form>

      <div className="mt-6 overflow-x-auto rounded-xl border border-white/10">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ad</TableHead>
              <TableHead>Telefon</TableHead>
              <TableHead>Plaka</TableHead>
              <TableHead>Araç</TableHead>
              <TableHead>İş / randevu / YY</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((c) => {
              const jc = jobs.filter((j) => j.customerId === c.id || j.phone === c.phone).length;
              const ac = appointments.filter((a) => a.customerId === c.id || a.phone === c.phone).length;
              const rc = roadside.filter((a) => a.customerId === c.id || a.phone === c.phone).length;
              return (
                <TableRow key={c.id}>
                  <TableCell>{c.name}</TableCell>
                  <TableCell>{c.phone}</TableCell>
                  <TableCell className="plate">{c.plate}</TableCell>
                  <TableCell>{c.vehicle}</TableCell>
                  <TableCell className="text-zinc-500">
                    {jc} iş · {ac} rdv · {rc} yy
                  </TableCell>
                  <TableCell className="space-x-2 text-right">
                    <Button size="sm" variant="outline" onClick={() => startEdit(c)}>
                      Düzenle
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        deleteCustomer(c.id);
                        toast.success("Silindi");
                      }}
                    >
                      Sil
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </PanelShell>
  );
}
