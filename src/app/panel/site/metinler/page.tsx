"use client";

import { toast } from "sonner";
import { PanelShell } from "@/components/panel-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { uid } from "@/lib/format";
import { useStore } from "@/lib/store";

export default function SiteMetinlerPage() {
  const { cms, patchCms } = useStore();
  const texts = cms.texts;
  const groups = Array.from(new Set(texts.map((t) => t.group)));

  return (
    <PanelShell>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl uppercase">Site metinleri</h1>
          <p className="mt-1 text-sm text-zinc-400">Hero, hakkımızda, iletişim ve form açıklamaları.</p>
        </div>
        <Button
          onClick={() => {
            patchCms({
              texts: [
                ...texts,
                { id: uid("txt").toLowerCase(), group: "Özel", label: "Yeni metin", value: "" },
              ],
            });
            toast.success("Metin bloğu eklendi");
          }}
        >
          Metin ekle
        </Button>
      </div>
      {groups.map((g) => (
        <section key={g} className="mt-8">
          <h2 className="text-sm tracking-widest text-amber-200/80 uppercase">{g}</h2>
          <div className="mt-3 space-y-3">
            {texts
              .filter((t) => t.group === g)
              .map((t) => (
                <div key={t.id} className="rounded-xl border border-white/10 p-3">
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    <div className="grid flex-1 gap-2 sm:grid-cols-2">
                      <div className="grid gap-1">
                        <Label>Etiket</Label>
                        <Input
                          value={t.label}
                          onChange={(e) =>
                            patchCms({ texts: texts.map((x) => (x.id === t.id ? { ...x, label: e.target.value } : x)) })
                          }
                        />
                      </div>
                      <div className="grid gap-1">
                        <Label>Anahtar (id)</Label>
                        <Input
                          value={t.id}
                          onChange={(e) =>
                            patchCms({ texts: texts.map((x) => (x.id === t.id ? { ...x, id: e.target.value } : x)) })
                          }
                        />
                      </div>
                    </div>
                    <Button size="sm" variant="destructive" onClick={() => patchCms({ texts: texts.filter((x) => x.id !== t.id) })}>
                      Sil
                    </Button>
                  </div>
                  <Textarea
                    value={t.value}
                    rows={t.value.length > 80 ? 3 : 2}
                    onChange={(e) =>
                      patchCms({ texts: texts.map((x) => (x.id === t.id ? { ...x, value: e.target.value } : x)) })
                    }
                  />
                </div>
              ))}
          </div>
        </section>
      ))}
    </PanelShell>
  );
}
