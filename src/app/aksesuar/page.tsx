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
import { textMap } from "@/lib/site-cms";

export default function AksesuarPage() {
  const { cart, addToCart, setCartQty, removeFromCart, session, accessories, cms, redeemCoupon } = useStore();
  const list = accessories.length ? accessories : ACCESSORIES;
  const formDef = cms.forms.find((f) => f.id === "form-aksesuar");
  const fieldOn = (key: string) =>
    !formDef || (formDef.enabled && (formDef.fields.find((f) => f.key === key)?.enabled ?? true));
  const fieldReq = (key: string) => formDef?.fields.find((f) => f.key === key)?.required ?? true;
  const fieldLabel = (key: string, fallback: string) =>
    formDef?.fields.find((f) => f.key === key)?.label || fallback;
  const lead = textMap(cms.texts)["aksesuar.lead"];
  const [name, setName] = useState(session.name !== "Misafir" ? session.name : "Demo Müşteri");
  const [phone, setPhone] = useState("05551234567");
  const [email, setEmail] = useState("demo@elitdetailing.com");
  const [notes, setNotes] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [pending, setPending] = useState(false);

  const lines = useMemo(
    () =>
      cart
        .map((c) => {
          const acc = list.find((a) => a.id === c.accessoryId);
          return acc ? { ...c, acc } : null;
        })
        .filter(Boolean) as { accessoryId: string; qty: number; acc: (typeof list)[number] }[],
    [cart, list],
  );
  const subtotal = lines.reduce((s, l) => s + l.acc.price * l.qty, 0);
  const redeem = couponCode.trim() ? redeemCoupon(couponCode.trim(), subtotal) : null;
  const total = redeem ? redeem.amount : subtotal;

  if (formDef && !formDef.enabled) {
    return (
      <PublicShell>
        <div className="mx-auto max-w-6xl px-4 py-12">
          <p className="text-sm text-zinc-400">Aksesuar siparişi şu an kapalı.</p>
        </div>
      </PublicShell>
    );
  }

  async function checkout(e: React.FormEvent) {
    e.preventDefault();
    if (!lines.length) {
      toast.error("Sepet boş");
      return;
    }
    for (const l of lines) {
      if (l.qty > l.acc.stock) {
        toast.error("Stok yetersiz", { description: l.acc.name });
        return;
      }
    }
    if (couponCode.trim() && !redeem) {
      toast.error("Kupon geçersiz veya kullanılmış");
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
            couponCode: redeem?.coupon.code,
            couponId: redeem?.coupon.id,
            discount: redeem?.discount,
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
        <p className="mt-2 max-w-xl text-sm text-zinc-400">
          {lead || "Sepete ekleyin, iyzico ile tam ödeme. Nakit yok."}
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((a) => (
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
              <div className="grid gap-2 sm:max-w-xs">
                <Label>Kupon kodu</Label>
                <Input
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="ELIT20"
                />
                {redeem ? (
                  <p className="text-xs text-emerald-300">
                    −{tryFormat(redeem.discount)} uygulandı
                  </p>
                ) : couponCode.trim() ? (
                  <p className="text-xs text-red-300">Kupon bulunamadı</p>
                ) : null}
              </div>
              <p className="text-lg text-amber-200">
                {redeem && redeem.discount > 0 ? (
                  <>
                    <span className="mr-2 text-sm text-zinc-500 line-through">{tryFormat(subtotal)}</span>
                    {tryFormat(total)}
                  </>
                ) : (
                  <>Toplam {tryFormat(total)}</>
                )}
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                {fieldOn("name") ? (
                  <div className="grid gap-2">
                    <Label>{fieldLabel("name", "Ad")}</Label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} required={fieldReq("name")} />
                  </div>
                ) : null}
                {fieldOn("phone") ? (
                  <div className="grid gap-2">
                    <Label>{fieldLabel("phone", "Telefon")}</Label>
                    <Input value={phone} onChange={(e) => setPhone(e.target.value)} required={fieldReq("phone")} />
                  </div>
                ) : null}
                {fieldOn("email") ? (
                  <div className="grid gap-2">
                    <Label>{fieldLabel("email", "E-posta")}</Label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required={fieldReq("email")}
                    />
                  </div>
                ) : null}
              </div>
              {fieldOn("notes") ? (
                <div className="grid gap-2">
                  <Label>{fieldLabel("notes", "Not (model, renk, montaj)")}</Label>
                  <Input value={notes} onChange={(e) => setNotes(e.target.value)} />
                </div>
              ) : null}
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
