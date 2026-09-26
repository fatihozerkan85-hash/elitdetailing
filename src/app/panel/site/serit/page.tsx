"use client";

import { toast } from "sonner";
import { PanelShell } from "@/components/panel-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uid } from "@/lib/format";
import { useStore } from "@/lib/store";

export default function SiteSeritPage() {
  const { cms, patchCms } = useStore();
  const ticker = cms.ticker;

  return (
    <PanelShell>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl uppercase">Kayan şerit</h1>
          <p className="mt-1 text-sm text-zinc-400">Header altındaki küçük duyuru bandı.</p>
        </div>
        <Button
          onClick={() => {
            patchCms({
              ticker: [...ticker, { id: uid("tk").toLowerCase(), emoji: "✦", text: "Yeni duyuru metni", active: true }],
            });
            toast.success("Satır eklendi");
          }}
        >
          Satır ekle
        </Button>
      </div>
      <div className="mt-6 space-y-3">
        {ticker.map((t) => (
          <div key={t.id} className="grid gap-2 rounded-xl border border-white/10 p-3 sm:grid-cols-[auto_4rem_1fr_auto] sm:items-center">
            <label className="flex items-center gap-2 text-xs text-zinc-400">
              <input
                type="checkbox"
                checked={t.active}
                onChange={(e) =>
                  patchCms({ ticker: ticker.map((x) => (x.id === t.id ? { ...x, active: e.target.checked } : x)) })
                }
              />
              Aktif
            </label>
            <div>
              <Label className="sr-only">Emoji</Label>
              <Input
                value={t.emoji}
                onChange={(e) => patchCms({ ticker: ticker.map((x) => (x.id === t.id ? { ...x, emoji: e.target.value } : x)) })}
              />
            </div>
            <Input
              value={t.text}
              onChange={(e) => patchCms({ ticker: ticker.map((x) => (x.id === t.id ? { ...x, text: e.target.value } : x)) })}
            />
            <Button
              size="sm"
              variant="destructive"
              onClick={() => patchCms({ ticker: ticker.filter((x) => x.id !== t.id) })}
            >
              Sil
            </Button>
          </div>
        ))}
      </div>
    </PanelShell>
  );
}
