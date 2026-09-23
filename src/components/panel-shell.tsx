"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
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
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/panel", label: "Pano", icon: LayoutDashboard },
  { href: "/panel/isler", label: "İşler", icon: Wrench },
  { href: "/panel/randevular", label: "Randevular", icon: CalendarDays },
  { href: "/panel/yol-yardim", label: "Yol yardım", icon: LifeBuoy },
  { href: "/panel/musteriler", label: "Müşteriler", icon: Users },
  { href: "/panel/personel", label: "Personel", icon: UserCog },
  { href: "/panel/stok", label: "Stok", icon: Package },
  { href: "/panel/kampanyalar", label: "Kampanyalar", icon: Megaphone },
  { href: "/panel/kuponlar", label: "Kuponlar", icon: Ticket },
  { href: "/panel/gelir", label: "Gelir", icon: Wallet },
  { href: "/panel/bildirimler", label: "Bildirimler", icon: Bell },
];

export function PanelShell({ children }: { children: React.ReactNode }) {
  const { session, ready, logout } = useStore();
  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    if (ready && session.role !== "owner") router.replace("/giris?next=/panel");
  }, [ready, session.role, router]);

  if (!ready || session.role !== "owner") {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#0b0c0e] text-zinc-400">Yükleniyor…</div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col bg-[#0b0c0e] text-zinc-100">
      <SiteHeader variant="panel" />
      <div className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col lg:flex-row">
        <aside className="border-b border-white/10 lg:w-56 lg:border-r lg:border-b-0">
          <nav className="flex gap-1 overflow-x-auto p-3 lg:flex-col">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm whitespace-nowrap text-zinc-400 hover:bg-white/5 hover:text-zinc-100",
                  (n.href === "/panel" ? path === "/panel" : path.startsWith(n.href)) && "bg-amber-400/10 text-amber-200",
                )}
              >
                <n.icon className="size-4 shrink-0" />
                {n.label}
              </Link>
            ))}
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
