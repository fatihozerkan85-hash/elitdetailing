"use client";

import "@/app/globals.css";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Bell,
  CalendarDays,
  LayoutDashboard,
  LifeBuoy,
  Megaphone,
  Package,
  Ticket,
  UserCog,
  Users,
  Wallet,
  Wrench,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ADMIN_PATH, DEMO } from "@/lib/catalog";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const nav = [
  { href: ADMIN_PATH, label: "Pano", icon: LayoutDashboard },
  { href: `${ADMIN_PATH}/isler`, label: "İşler", icon: Wrench },
  { href: `${ADMIN_PATH}/randevular`, label: "Randevular", icon: CalendarDays },
  { href: `${ADMIN_PATH}/yol-yardim`, label: "Yol yardım", icon: LifeBuoy },
  { href: `${ADMIN_PATH}/musteriler`, label: "Müşteriler", icon: Users },
  { href: `${ADMIN_PATH}/personel`, label: "Personel", icon: UserCog },
  { href: `${ADMIN_PATH}/stok`, label: "Stok", icon: Package },
  { href: `${ADMIN_PATH}/kampanyalar`, label: "Kampanyalar", icon: Megaphone },
  { href: `${ADMIN_PATH}/kuponlar`, label: "Kuponlar", icon: Ticket },
  { href: `${ADMIN_PATH}/gelir`, label: "Gelir", icon: Wallet },
  { href: `${ADMIN_PATH}/bildirimler`, label: "Bildirimler", icon: Bell },
];

function AdminPinForm() {
  const { loginOwner, ready } = useStore();
  const [pin, setPin] = useState("");
  const [err, setErr] = useState("");

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-[#0b0c0e] px-4 text-zinc-100">
      <form
        className="w-full max-w-sm space-y-4 rounded-xl border border-amber-500/20 bg-amber-500/5 p-6"
        onSubmit={(e) => {
          e.preventDefault();
          if (!ready) {
            setErr("Oturum henüz hazır değil, bir saniye sonra tekrar deneyin.");
            return;
          }
          if (!loginOwner(pin)) {
            setErr("PIN hatalı.");
            return;
          }
        }}
      >
        <p className="text-[11px] tracking-[0.25em] text-amber-300/80 uppercase">Yönetici</p>
        <h1 className="text-xl font-semibold">İşletme paneli</h1>
        <p className="text-sm text-zinc-500">Bu adres kamu sitede yayınlanmaz.</p>
        <div className="grid gap-2">
          <Label>PIN</Label>
          <Input type="password" value={pin} onChange={(e) => setPin(e.target.value)} autoFocus />
        </div>
        {err ? <p className="text-sm text-red-300">{err}</p> : null}
        <Button type="submit" className="w-full">
          Giriş
        </Button>
        <p className="text-xs text-zinc-600">Demo PIN: {DEMO.ownerPin}</p>
      </form>
    </div>
  );
}

export function PanelShell({ children }: { children: React.ReactNode }) {
  const { session, ready, logout } = useStore();
  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    if (!ready) return;
    if (session.role !== "owner" && path.startsWith("/panel")) {
      router.replace(ADMIN_PATH);
    }
  }, [ready, session.role, path, router]);

  if (!ready) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#0b0c0e] text-zinc-400">Yükleniyor…</div>
    );
  }

  if (session.role !== "owner") {
    return <AdminPinForm />;
  }

  return (
    <div className="flex min-h-dvh flex-col bg-[#0b0c0e] text-zinc-100">
      <SiteHeader variant="panel" />
      <div className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col lg:flex-row">
        <aside className="border-b border-white/10 lg:w-56 lg:border-r lg:border-b-0">
          <nav className="flex gap-1 overflow-x-auto p-3 lg:flex-col">
            {nav.map((n) => {
              const internal = n.href.replace(ADMIN_PATH, "/panel");
              const active =
                n.href === ADMIN_PATH
                  ? path === ADMIN_PATH || path === "/panel" || path === "/yönetici"
                  : path.startsWith(n.href) || path.startsWith(internal);
              return (
              <Link
                key={n.href}
                href={n.href}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm whitespace-nowrap text-zinc-400 hover:bg-white/5 hover:text-zinc-100",
                  active && "bg-amber-400/10 text-amber-200",
                )}
              >
                <n.icon className="size-4 shrink-0" />
                {n.label}
              </Link>
              );
            })}
            <Button
              variant="ghost"
              className="mt-2 justify-start text-zinc-500"
              onClick={() => {
                logout();
                router.push("/");
              }}
            >
              Çıkış
            </Button>
          </nav>
        </aside>
        <div className="flex-1 overflow-x-auto p-4 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
