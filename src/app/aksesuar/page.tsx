"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PublicShell } from "@/components/public-shell";
import { EmptyState } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ACCESSORIES } from "@/lib/catalog";
import { tryFormat } from "@/lib/format";
import { useStore } from "@/lib/store";

export default function AksesuarPage() {
  const { createAccessoryOrder, session } = useStore();
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [name, setName] = useState(session.name !== "Misafir" ? session.name : "Demo Müşteri");
  const [phone, setPhone] = useState("05551234567");
  const [notes, setNotes] = useState("");
  const acc = ACCESSORIES.find((a) => a.id === selected);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) return;
    const order = createAccessoryOrder({ name, phone, accessoryId: selected, qty, notes });
    if (!order) return;
    toast.success("Aksesuar talebi alındı", { description: order.id });
    router.push("/taleplerim");
  }

  return (
    <PublicShell>
      <div className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="font-[family-name:var(--font-display)] text-4xl uppercase">Aksesuar</h1>
        <p className="mt-2 max-w-xl text-sm text-zinc-400">
          Stoktan talep / sipariş. Montaj notunu yazın; hazır olunca Taleplerim güncellenir.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ACCESSORIES.map((a) => (
            <Card
              key={a.id}
              className={`cursor-pointer border-white/10 bg-zinc-900/50 ${selected === a.id ? "border-amber-400/50" : ""}`}
              onClick={() => setSelected(a.id)}
            >
              <CardHeader>
                <CardTitle className="text-base">{a.name}</CardTitle>
                <CardDescription>{a.category}</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-zinc-400">
                <p>{a.description}</p>
                <p className="mt-3 text-zinc-200">
                  {tryFormat(a.price)} · stok {a.stock}
                </p>
                {a.stock === 0 ? <p className="mt-1 text-red-300">Tükendi — sipariş üzerine</p> : null}
              </CardContent>
            </Card>
          ))}
        </div>
        {!selected ? (
          <div className="mt-8">
            <EmptyState title="Ürün seçin" hint="Kartlara dokunun, sonra talep formunu doldurun." />
          </div>
        ) : (
          <form onSubmit={submit} className="mt-8 max-w-lg space-y-4 rounded-xl border border-white/10 p-5">
            <p className="text-sm text-amber-200">Seçilen: {acc?.name}</p>
            <div className="grid gap-2">
              <Label>Ad</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label>Telefon</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label>Adet</Label>
              <Input type="number" min={1} max={acc?.stock ?? 1} value={qty} onChange={(e) => setQty(Number(e.target.value))} />
            </div>
            <div className="grid gap-2">
              <Label>Not (model, renk, montaj)</Label>
              <Input value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
            <Button type="submit">Talep gönder</Button>
          </form>
        )}
      </div>
    </PublicShell>
  );
}
