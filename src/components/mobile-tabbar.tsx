"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Home, LayoutGrid, Radar, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/", label: "Ana", icon: Home },
  { href: "/hizmetler", label: "Hizmetler", icon: LayoutGrid },
  { href: "/randevu", label: "Randevu", icon: CalendarDays },
  { href: "/takip", label: "Takip", icon: Radar },
  { href: "/profil", label: "Profil", icon: UserRound },
];

export function MobileTabBar() {
  const path = usePathname();
  if (path.startsWith("/panel") || path.startsWith("/yonetici") || path.startsWith("/yönetici")) return null;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[#0b0c0e]/95 backdrop-blur-md md:hidden pb-[env(safe-area-inset-bottom)]">
      <ul className="grid grid-cols-5">
        {tabs.map((t) => {
          const on = t.href === "/" ? path === "/" : path.startsWith(t.href);
          return (
            <li key={t.href}>
              <Link
                href={t.href}
                className={cn(
                  "flex flex-col items-center gap-0.5 py-2.5 text-[10px] tracking-wide uppercase",
                  on ? "text-amber-300" : "text-zinc-500",
                )}
              >
                <t.icon className="size-5" />
                {t.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
