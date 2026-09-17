"use client";

import { PanelShell } from "@/components/panel-shell";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useStore } from "@/lib/store";

export default function MusterilerPage() {
  const { customers, jobs, appointments, roadside } = useStore();
  return (
    <PanelShell>
      <h1 className="font-[family-name:var(--font-display)] text-3xl uppercase">Müşteriler</h1>
      <p className="mt-1 text-sm text-zinc-500">Plaka ve iletişim. Demo kayıtlar + yeni taleplerden gelen isimler.</p>
      <div className="mt-6 overflow-x-auto rounded-xl border border-white/10">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ad</TableHead>
              <TableHead>Telefon</TableHead>
              <TableHead>Plaka</TableHead>
              <TableHead>Araç</TableHead>
              <TableHead>İş / randevu / YY</TableHead>
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
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </PanelShell>
  );
}
