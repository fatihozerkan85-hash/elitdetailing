"use client";

import { PanelShell } from "@/components/panel-shell";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ORDER_STATUS_LABEL } from "@/lib/catalog";
import { tryFormat } from "@/lib/format";
import { useStore } from "@/lib/store";

export default function GelirPage() {
  const { jobs, accessoryOrders, updateOrderStatus } = useStore();
  const delivered = jobs.filter((j) => j.status === "teslim");
  const open = jobs.filter((j) => j.status !== "teslim" && j.status !== "iptal");
  const accRev = accessoryOrders.filter((o) => o.status === "teslim").reduce((s, o) => s + o.total, 0);
  const jobRev = delivered.reduce((s, j) => s + j.estimate, 0);

  return (
    <PanelShell>
      <h1 className="font-[family-name:var(--font-display)] text-3xl uppercase">Gelir & aksesuar</h1>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <Card className="border-white/10">
          <CardHeader>
            <p className="text-xs text-zinc-500">Teslim atölye</p>
            <CardTitle className="text-amber-200">{tryFormat(jobRev)}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-white/10">
          <CardHeader>
            <p className="text-xs text-zinc-500">Açık iş tahmini</p>
            <CardTitle>{tryFormat(open.reduce((s, j) => s + j.estimate, 0))}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-white/10">
          <CardHeader>
            <p className="text-xs text-zinc-500">Aksesuar teslim</p>
            <CardTitle>{tryFormat(accRev)}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <h2 className="mt-10 text-sm tracking-widest text-zinc-500 uppercase">Aksesuar siparişleri (stok benzeri)</h2>
      <div className="mt-3 overflow-x-auto rounded-xl border border-white/10">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kod</TableHead>
              <TableHead>Ürün</TableHead>
              <TableHead>Müşteri</TableHead>
              <TableHead>Tutar</TableHead>
              <TableHead>Durum</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accessoryOrders.map((o) => (
              <TableRow key={o.id}>
                <TableCell>{o.id}</TableCell>
                <TableCell>
                  {o.accessoryName} ×{o.qty}
                </TableCell>
                <TableCell>{o.customerName}</TableCell>
                <TableCell>{tryFormat(o.total)}</TableCell>
                <TableCell>
                  <select
                    className="h-8 rounded-md border border-input bg-transparent px-2 text-xs"
                    value={o.status}
                    onChange={(e) => updateOrderStatus(o.id, e.target.value as typeof o.status)}
                  >
                    {Object.entries(ORDER_STATUS_LABEL).map(([k, v]) => (
                      <option key={k} value={k} style={{ color: "#111", backgroundColor: "#fff" }}>
                        {v}
                      </option>
                    ))}
                  </select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </PanelShell>
  );
}
