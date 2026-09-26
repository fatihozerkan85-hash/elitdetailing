"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { PublicShell } from "@/components/public-shell";
import { EmptyState } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ACCESSORIES } from "@/lib/catalog";
import { startIyzicoCheckout } from "@/lib/checkout-draft";
import { tryFormat, uid } from "@/lib/format";
import { useStore } from "@/lib/store";

export default function AksesuarPage() {
  const { cart, addToCart, setCartQty, removeFromCart, session } = useStore();
  const [name, setName] = useState(session.name !== "Misafir" ? session.name : "Demo Müşteri");
  const [phone, setPhone] = useState("05551234567");
  const [email, setEmail] = useState("demo@elitdetailing.com");
  const [notes, setNotes] = useState("");
  const [pending, setPending] = useState(false);

  const lines = useMemo(
    () =>
      cart
        .map((c) => {
          const acc = ACCESSORIES.find((a) => a.id === c.accessoryId);
          return acc ? { ...c, acc } : null;
        })
        .filter(Boolean) as { accessoryId: string; qty: number; acc: (typeof ACCESSORIES)[number] }[],
    [cart],
  );
  const total = lines.reduce((s, l) => s + l.acc.price * l.qty, 0);

  async function checkout(e: React.FormEvent) {
    e.preventDefault();
    if (!lines.length) {
      toast.error("Sepet boş");
      return;
    }
    setPending(true);
    const conversationId = uid("CHK");
    try {
      await startIyzicoCheckout({
        conversationId,
        amount: total,
        title: `Aksesuar (${lines.length} kalem)`,
        buyerName: name,
        buyerPhone: phone,
        buyerEmail: email,
        basketItems: lines.map((l) => ({
          id: l.accessoryId,
          name: l.acc.name,
          category1: "Aksesuar",
          price: l.acc.price * l.qty,
        })),
        draft: {
          conversationId,
          kind: "aksesuar",
          amount: total,
          title: "Aksesuar sepeti",
          buyerName: name,
          buyerPhone: phone,
          buyerEmail: email,
          createdAt: new Date().toISOString(),
          payload: {
            notes,
            lines: lines.map((l) => ({ accessoryId: l.accessoryId, qty: l.qty })),
          },
        },
      });
    } catch (err) {
      setPending(false);
      toast.error(err instanceof Error ? err.message : "Ödeme başlatılamadı");
    }
  }

  return (
    <PublicShell>
      <div className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="font-[family-name:var(--font-display)] text-4xl uppercase">Aksesuar</h1>
        <p className="mt-2 max-w-xl text-sm text-zinc-400">Sepete ekleyin, iyzico ile tam ödeme. Nakit yok.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ACCESSORIES.map((a) => (
            <Card key={a.id} className="border-white/10 bg-zinc-900/50">
              <CardHeader>
                <CardTitle className="text-base">{a.name}</CardTitle>
                <CardDescription>{a.category}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-zinc-400">
                <p>{a.description}</p>
                <p className="text-zinc-200">
                  {tryFormat(a.price)} · stok {a.stock}
                </p>
                <Button
                  size="sm"
                  disabled={a.stock === 0}
                  onClick={() => {
                    addToCart(a.id, 1);
                    toast.success("Sepete eklendi", { description: a.name });
                  }}
                >
                  Sepete ekle
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-10 rounded-xl border border-white/10 p-5">
          <h2 className="text-sm tracking-widest text-amber-300 uppercase">Sepet</h2>
          {!lines.length ? (
            <div className="mt-4">
              <EmptyState title="Sepet boş" hint="Ürün kartından sepete ekleyin." />
            </div>
          ) : (
            <form onSubmit={checkout} className="mt-4 space-y-4">
              <ul className="space-y-3">
                {lines.map((l) => (
                  <li key={l.accessoryId} className="flex flex-wrap items-center justify-between gap-2 text-sm">
                    <span>
                      {l.acc.name} · {tryFormat(l.acc.price)}
                    </span>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min={1}
                        max={l.acc.stock}
                        className="w-20"
                        value={l.qty}
                        onChange={(e) => setCartQty(l.accessoryId, Number(e.target.value))}
                      />
                      <Button type="button" size="sm" variant="outline" onClick={() => removeFromCart(l.accessoryId)}>
                        Sil
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="text-lg text-amber-200">Toplam {tryFormat(total)}</p>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="grid gap-2">
                  <Label>Ad</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="grid gap-2">
                  <Label>Telefon</Label>
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} required />
                </div>
                <div className="grid gap-2">
                  <Label>E-posta</Label>
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Not (model, renk, montaj)</Label>
                <Input value={notes} onChange={(e) => setNotes(e.target.value)} />
              </div>
              <Button type="submit" size="lg" disabled={pending}>
                {pending ? "iyzico’ya yönlendiriliyor…" : `iyzico ile ${tryFormat(total)} öde`}
              </Button>
            </form>
          )}
        </div>
      </div>
    </PublicShell>
  );
}
