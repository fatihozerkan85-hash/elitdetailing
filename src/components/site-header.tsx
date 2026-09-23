"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Shield, Siren } from "lucide-react";
import type { ReactNode } from "react";
import { buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { BRAND } from "@/lib/catalog";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const links = [
  { href: "/hizmetler", label: "Hizmetler" },
  { href: "/randevu", label: "Randevu" },
  { href: "/yol-yardim", label: "Yol yardım" },
  { href: "/takip", label: "Takip" },
  { href: "/aksesuar", label: "Aksesuar" },
  { href: "/kampanyalar", label: "Kampanyalar" },
  { href: "/kuponlar", label: "Kuponlar" },
  { href: "/taleplerim", label: "Taleplerim" },
  { href: "/sss", label: "SSS" },
];

export function BrandMark({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-md border border-amber-500/40 bg-gradient-to-br from-zinc-600 via-zinc-800 to-black text-[11px] font-semibold tracking-[0.18em] text-amber-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]">
        {BRAND.short}
      </span>
      <span className="flex min-w-0 flex-col leading-none">
        <span className="font-[family-name:var(--font-display)] truncate text-sm tracking-[0.22em] text-zinc-100 uppercase">
          {BRAND.name}
        </span>
        <span className="mt-1 text-[10px] tracking-widest text-zinc-500 uppercase">Ankara · detailing</span>
      </span>
    </Link>
  );
}

export function SiteHeader({ variant = "public" }: { variant?: "public" | "panel" }) {
  const path = usePathname();
  const { session, inbox, notifications } = useStore();
  const unreadInbox = inbox.filter((i) => {
    if (!i.unread) return false;
    if (session.role === "customer") return i.customerId === session.customerId;
    return true;
  }).length;
  const unreadN = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0b0c0e]/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
        <BrandMark href={variant === "panel" ? "/panel" : "/"} />

        {variant === "public" && (
          <nav className="hidden items-center gap-0.5 lg:flex">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "rounded-md px-2 py-1.5 text-[11px] tracking-wide text-zinc-400 uppercase transition hover:bg-white/5 hover:text-zinc-100",
                  path === l.href && "bg-white/8 text-amber-200",
                )}
              >
                {l.label}
                {l.href === "/taleplerim" && unreadInbox > 0 ? (
                  <span className="ml-1 rounded-full bg-amber-400 px-1.5 text-[10px] text-black">{unreadInbox}</span>
                ) : null}
              </Link>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-2">
          {variant === "public" && (
            <>
              <Link
                href="/yol-yardim"
                className={cn(buttonVariants({ variant: "destructive", size: "sm" }), "hidden sm:inline-flex")}
              >
                <Siren className="size-3.5" />
                Acil
              </Link>
              <Link
                href={session.role === "owner" ? "/panel" : "/giris"}
                className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
              >
                <Shield className="size-3.5" />
                {session.role === "owner" ? "Panel" : session.role === "customer" ? session.name.split(" ")[0] : "Giriş"}
              </Link>
              <Sheet>
                <SheetTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "lg:hidden")}>
                  <Menu />
                </SheetTrigger>
                <SheetContent side="right" className="bg-[#111214] text-zinc-100">
                  <SheetHeader>
                    <SheetTitle>Menü</SheetTitle>
                  </SheetHeader>
                  <div className="mt-4 flex flex-col gap-1 px-2">
                    {links.map((l) => (
                      <Link key={l.href} href={l.href} className="rounded-md px-3 py-2 text-sm hover:bg-white/5">
                        {l.label}
                      </Link>
                    ))}
                    <Link href="/bildirimler" className="rounded-md px-3 py-2 text-sm hover:bg-white/5">
                      Bildirimler
                    </Link>
                    <Link href="/profil" className="rounded-md px-3 py-2 text-sm hover:bg-white/5">
                      Profil
                    </Link>
                    <Link href="/giris" className="rounded-md px-3 py-2 text-sm hover:bg-white/5">
                      Giriş / panel
                    </Link>
                  </div>
                </SheetContent>
              </Sheet>
            </>
          )}
          {variant === "panel" && (
            <>
              <Link href="/panel/bildirimler" className="text-xs text-amber-300">
                {unreadN > 0 ? `${unreadN} bildirim` : "Bildirimler"}
              </Link>
              <Link href="/" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
                Müşteri sitesi
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-[#08090b]">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-zinc-500 md:flex-row md:justify-between">
        <div>
          <p className="font-[family-name:var(--font-display)] tracking-[0.2em] text-zinc-300 uppercase">{BRAND.name}</p>
          <p className="mt-2 max-w-md text-xs leading-relaxed">{BRAND.note}</p>
        </div>
        <div className="space-y-1 text-xs">
          <p>{BRAND.hours}</p>
          <a className="text-amber-400/90 hover:underline" href={BRAND.instagram} target="_blank" rel="noreferrer">
            Instagram {BRAND.instagramHandle}
          </a>
          <p className="text-zinc-600">Demo veri tarayıcıda saklanır.</p>
        </div>
      </div>
    </footer>
  );
}

export function EmptyState({
  title,
  hint,
  action,
}: {
  title: string;
  hint: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-dashed border-white/15 bg-white/3 px-6 py-12 text-center">
      <p className="text-sm font-medium text-zinc-200">{title}</p>
      <p className="mt-2 text-sm text-zinc-500">{hint}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export function LoadingBlock() {
  return (
    <div className="animate-pulse space-y-3 py-8">
      <div className="h-6 w-40 rounded bg-white/10" />
      <div className="h-24 rounded-xl bg-white/5" />
      <div className="h-24 rounded-xl bg-white/5" />
    </div>
  );
}
