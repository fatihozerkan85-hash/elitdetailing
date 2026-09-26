"use client";

import { PanelShell } from "@/components/panel-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStore } from "@/lib/store";

export default function SiteFormlarPage() {
  const { cms, patchCms } = useStore();
  const forms = cms.forms;

  return (
    <PanelShell>
      <h1 className="font-[family-name:var(--font-display)] text-3xl uppercase">Formlar</h1>
      <p className="mt-2 text-sm text-zinc-400">Formu tamamen kapatabilir veya alanları tek tek açıp kapatabilirsiniz.</p>
      <div className="mt-6 space-y-6">
        {forms.map((f) => (
          <div key={f.id} className="rounded-xl border border-white/10 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-medium">{f.name}</p>
                <p className="text-xs text-zinc-500">{f.path}</p>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={f.enabled}
                  onChange={(e) =>
                    patchCms({ forms: forms.map((x) => (x.id === f.id ? { ...x, enabled: e.target.checked } : x)) })
                  }
                />
                Form aktif
              </label>
            </div>
            <div className="mt-4 space-y-2">
              {f.fields.map((field) => (
                <div key={field.key} className="grid gap-2 rounded-lg border border-white/5 p-2 sm:grid-cols-[1fr_1fr_auto_auto] sm:items-center">
                  <div className="grid gap-1">
                    <Label className="text-xs">Alan anahtarı</Label>
                    <Input value={field.key} disabled className="opacity-70" />
                  </div>
                  <div className="grid gap-1">
                    <Label className="text-xs">Etiket</Label>
                    <Input
                      value={field.label}
                      onChange={(e) =>
                        patchCms({
                          forms: forms.map((x) =>
                            x.id === f.id
                              ? {
                                  ...x,
                                  fields: x.fields.map((ff) =>
                                    ff.key === field.key ? { ...ff, label: e.target.value } : ff,
                                  ),
                                }
                              : x,
                          ),
                        })
                      }
                    />
                  </div>
                  <label className="flex items-center gap-2 text-xs">
                    <input
                      type="checkbox"
                      checked={field.enabled}
                      onChange={(e) =>
                        patchCms({
                          forms: forms.map((x) =>
                            x.id === f.id
                              ? {
                                  ...x,
                                  fields: x.fields.map((ff) =>
                                    ff.key === field.key ? { ...ff, enabled: e.target.checked } : ff,
                                  ),
                                }
                              : x,
                          ),
                        })
                      }
                    />
                    Göster
                  </label>
                  <label className="flex items-center gap-2 text-xs">
                    <input
                      type="checkbox"
                      checked={field.required}
                      onChange={(e) =>
                        patchCms({
                          forms: forms.map((x) =>
                            x.id === f.id
                              ? {
                                  ...x,
                                  fields: x.fields.map((ff) =>
                                    ff.key === field.key ? { ...ff, required: e.target.checked } : ff,
                                  ),
                                }
                              : x,
                          ),
                        })
                      }
                    />
                    Zorunlu
                  </label>
                </div>
              ))}
            </div>
            <Button
              className="mt-3"
              size="sm"
              variant="outline"
              onClick={() =>
                patchCms({
                  forms: forms.map((x) =>
                    x.id === f.id
                      ? {
                          ...x,
                          fields: [
                            ...x.fields,
                            { key: `alan_${x.fields.length + 1}`, label: "Yeni alan", enabled: true, required: false },
                          ],
                        }
                      : x,
                  ),
                })
              }
            >
              Alan ekle
            </Button>
          </div>
        ))}
      </div>
    </PanelShell>
  );
}
