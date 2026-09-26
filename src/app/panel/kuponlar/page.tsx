"use client";

import { useState } from "react";
import { toast } from "sonner";
import { PanelShell } from "@/components/panel-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStore } from "@/lib/store";

export default function PanelKuponlar() {
  const { coupons, customers, createOwnerCoupon, deleteCoupon, updateCouponStatus } = useStore();
  const [code, setCode] = useState("");
  const [title, setTitle] = useState("");
  const [rule, setRule] = useState("%10 indirim");
  const [expires, setExpires] = useState("31 Aralık 2026");
  const [customerId, setCustomerId] = useState("c-demo");
  const [discountPercent, setDiscountPercent] = useState(10);

  return (
    <PanelShell>
      <h1 className="font-[family-name:var(--font-display)] text-3xl uppercase">Kuponlar</h1>
      <p className="mt-1 text-sm text-zinc-500">Müşteriye atanır; randevu / aksesuar ödemesinde kod ile kullanılır.</p>
      <form
        className="mt-6 grid max-w-2xl gap-3 rounded-xl border border-white/10 p-4 sm:grid-cols-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (!code.trim() || !title.trim()) {
            toast.error("Kod ve başlık gerekli");
            return;
          }
          createOwnerCoupon({
            code,
            title,
            rule,
            expires,
            customerId,
            discountPercent: Number(discountPercent) || undefined,
          });
          toast.success("Kupon oluşturuldu");
          setCode("");
          setTitle("");
          setRule("%10 indirim");
        }}
      >
        <div className="grid gap-1 sm:col-span-2">
          <p className="text-sm text-zinc-400">Yeni kupon oluştur</p>
        </div>
        <div className="grid gap-1">
          <Label>Kod</Label>
          <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="ELIT20" />
        </div>
        <div className="grid gap-1">
          <Label>Başlık</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="grid gap-1 sm:col-span-2">
          <Label>Kural</Label>
          <Input value={rule} onChange={(e) => setRule(e.target.value)} />
        </div>
        <div className="grid gap-1">
          <Label>İndirim %</Label>
          <Input
            type="number"
            min={0}
            max={90}
            value={discountPercent}
            onChange={(e) => setDiscountPercent(Number(e.target.value))}
          />
        </div>
        <div className="grid gap-1">
          <Label>Son kullanma</Label>
          <Input value={expires} onChange={(e) => setExpires(e.target.value)} />
        </div>
        <div className="grid gap-1 sm:col-span-2">
          <Label>Müşteri</Label>
          <select
            className="h-9 rounded-lg border border-input bg-input/30 px-2 text-sm"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
          >
            {customers.map((c) => (
              <option key={c.id} value={c.id} style={{ color: "#111", backgroundColor: "#fff" }}>
                {c.name} · {c.phone}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <Button type="submit">Kupon ekle</Button>
        </div>
      </form>

      <div className="mt-8 overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-white/5 text-zinc-500">
            <tr>
              <th className="px-3 py-2">Kod</th>
              <th className="px-3 py-2">Başlık</th>
              <th className="px-3 py-2">Müşteri</th>
              <th className="px-3 py-2">İndirim</th>
              <th className="px-3 py-2">Durum</th>
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody>
            {coupons.map((c) => {
              const cust = customers.find((x) => x.id === c.customerId);
              return (
                <tr key={c.id} className="border-t border-white/10">
                  <td className="px-3 py-3 font-mono text-amber-200">{c.code}</td>
                  <td className="px-3 py-3">{c.title}</td>
                  <td className="px-3 py-3 text-zinc-500">{cust?.name ?? c.customerId}</td>
                  <td className="px-3 py-3 text-zinc-400">
                    {c.discountPercent != null
                      ? `%${c.discountPercent}`
                      : c.discountAmount != null
                        ? `${c.discountAmount} ₺`
                        : "—"}
                  </td>
                  <td className="px-3 py-3">
                    <select
                      className="h-8 rounded-md border border-input bg-transparent px-2 text-xs"
                      value={c.status}
                      onChange={(e) => updateCouponStatus(c.id, e.target.value as typeof c.status)}
                    >
                      {(["aktif", "kullanildi", "doldu"] as const).map((st) => (
                        <option key={st} value={st} style={{ color: "#111", backgroundColor: "#fff" }}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-3 text-right">
                    <Button size="sm" variant="destructive" onClick={() => deleteCoupon(c.id)}>
                      Sil
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </PanelShell>
  );
}
