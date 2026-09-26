"use client";

import { useState } from "react";
import { toast } from "sonner";
import { PanelShell } from "@/components/panel-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ACCESSORIES } from "@/lib/catalog";
import { tryFormat } from "@/lib/format";
import { useStore } from "@/lib/store";
import type { Accessory } from "@/lib/types";

const empty = { name: "", category: "İç aksesuar", price: 0, stock: 0, description: "" };

export default function PanelStok() {
  const { accessories, saveAccessory, deleteAccessory, setAccessoryStock } = useStore();
  const list = accessories.length ? accessories : ACCESSORIES;
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<string | null>(null);

  function startEdit(a: Accessory) {
    setEditing(a.id);
    setForm({
      name: a.name,
      category: a.category,
      price: a.price,
      stock: a.stock,
      description: a.description,
    });
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Ürün adı gerekli");
      return;
    }
    saveAccessory({
      id: editing || undefined,
      name: form.name,
      category: form.category,
      price: Number(form.price) || 0,
      stock: Number(form.stock) || 0,
      description: form.description,
    });
    toast.success(editing ? "Ürün güncellendi" : "Ürün eklendi");
    setEditing(null);
    setForm(empty);
  }

  return (
    <PanelShell>
      <h1 className="font-[family-name:var(--font-display)] text-3xl uppercase">Stok</h1>
      <p className="mt-1 text-sm text-zinc-500">Sipariş ödenince stok düşer; iptalde geri eklenir.</p>

      <form
        onSubmit={submit}
        className="mt-6 grid max-w-3xl gap-3 rounded-xl border border-white/10 p-4 sm:grid-cols-2"
      >
        <p className="sm:col-span-2 text-sm text-zinc-400">{editing ? "Ürün düzenle" : "Yeni ürün"}</p>
        <div className="grid gap-1">
          <Label>Ad</Label>
          <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
        </div>
        <div className="grid gap-1">
          <Label>Kategori</Label>
          <Input value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} />
        </div>
        <div className="grid gap-1">
          <Label>Fiyat ₺</Label>
          <Input
            type="number"
            value={form.price}
            onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))}
          />
        </div>
        <div className="grid gap-1">
          <Label>Stok</Label>
          <Input
            type="number"
            value={form.stock}
            onChange={(e) => setForm((f) => ({ ...f, stock: Number(e.target.value) }))}
          />
        </div>
        <div className="grid gap-1 sm:col-span-2">
          <Label>Açıklama</Label>
          <Input
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          />
        </div>
        <div className="flex gap-2 sm:col-span-2">
          <Button type="submit">{editing ? "Kaydet" : "Ekle"}</Button>
          {editing ? (
            <Button type="button" variant="outline" onClick={() => { setEditing(null); setForm(empty); }}>
              İptal
            </Button>
          ) : null}
        </div>
      </form>

      <div className="mt-6 overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-white/5 text-zinc-500">
            <tr>
              <th className="px-3 py-2">Ürün</th>
              <th className="px-3 py-2">Kategori</th>
              <th className="px-3 py-2">Fiyat</th>
              <th className="px-3 py-2">Stok</th>
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody>
            {list.map((a) => (
              <tr key={a.id} className="border-t border-white/10">
                <td className="px-3 py-3">
                  <p>{a.name}</p>
                  <p className="text-xs text-zinc-500">{a.description}</p>
                </td>
                <td className="px-3 py-3 text-zinc-500">{a.category}</td>
                <td className="px-3 py-3">{tryFormat(a.price)}</td>
                <td className="px-3 py-3">
                  <Input
                    type="number"
                    className={`w-24 ${a.stock < 5 ? "border-amber-400/50 text-amber-200" : ""}`}
                    value={a.stock}
                    onChange={(e) => setAccessoryStock(a.id, Number(e.target.value))}
                  />
                </td>
                <td className="space-x-2 px-3 py-3 text-right">
                  <Button size="sm" variant="outline" onClick={() => startEdit(a)}>
                    Düzenle
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      deleteAccessory(a.id);
                      toast.success("Silindi");
                    }}
                  >
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
