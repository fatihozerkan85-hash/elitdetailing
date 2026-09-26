"use client";

import { useState } from "react";
import { toast } from "sonner";
import { PanelShell } from "@/components/panel-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStore } from "@/lib/store";

export default function PanelKuponlar() {
  const { coupons, createOwnerCoupon, deleteCoupon } = useStore();
  const [code, setCode] = useState("");
  const [title, setTitle] = useState("");
  const [rule, setRule] = useState("");
  const [expires, setExpires] = useState("31 Aralık 2026");

  return (
    <PanelShell>
      <h1 className="font-[family-name:var(--font-display)] text-3xl uppercase">Kuponlar</h1>
      <form
        className="mt-6 grid max-w-2xl gap-3 rounded-xl border border-white/10 p-4 sm:grid-cols-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (!code.trim() || !title.trim()) {
            toast.error("Kod ve başlık gerekli");
            return;
          }
          createOwnerCoupon({ code, title, rule, expires });
          toast.success("Kupon oluşturuldu");
          setCode("");
          setTitle("");
          setRule("");
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
          <Label>Son kullanma</Label>
          <Input value={expires} onChange={(e) => setExpires(e.target.value)} />
        </div>
        <div className="flex items-end">
          <Button type="submit">Kupon ekle</Button>
        </div>
      </form>

      <div className="mt-8 overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="bg-white/5 text-zinc-500">
            <tr>
              <th className="px-3 py-2">Kod</th>
              <th className="px-3 py-2">Başlık</th>
              <th className="px-3 py-2">Müşteri</th>
              <th className="px-3 py-2">Durum</th>
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c.id} className="border-t border-white/10">
                <td className="px-3 py-3 font-mono text-amber-200">{c.code}</td>
                <td className="px-3 py-3">{c.title}</td>
                <td className="px-3 py-3 text-zinc-500">{c.customerId}</td>
                <td className="px-3 py-3">
                  <Badge variant="secondary">{c.status}</Badge>
                </td>
                <td className="px-3 py-3 text-right">
                  <Button size="sm" variant="destructive" onClick={() => deleteCoupon(c.id)}>
                    Sil
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PanelShell>
  );
}
