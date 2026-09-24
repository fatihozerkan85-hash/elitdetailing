"use client";

import Image from "next/image";
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
    <Link href={href} className="flex shrink-0 items-center">
      <Image
        src="/branding/elit-logo-tr.png"
        alt="ELIT OTO DETAILING"
        width={1254}
        height={1254}
        className="h-14 w-auto object-contain sm:h-16"
        priority
      />
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
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0b0c0e]/90 backdrop-blur-md">
      <div className="mx-auto flex h-[4.75rem] max-w-6xl items-center justify-between gap-3 px-4 sm:h-20">
        <BrandMark href={variant === "panel" ? "/yonetici" : "/"} />

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
                href={session.role === "customer" ? "/profil" : "/giris"}
                className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
              >
                <Shield className="size-3.5" />
                {session.role === "customer" ? session.name.split(" ")[0] : "Giriş"}
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
                      Giriş
                    </Link>
                  </div>
                </SheetContent>
              </Sheet>
            </>
          )}
          {variant === "panel" && (
            <>
              <Link href="/yonetici/bildirimler" className="text-xs text-amber-300">
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
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 text-sm text-zinc-500 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="/branding/elit-logo-tr.png"
            alt="ELIT OTO DETAILING"
            width={1254}
            height={1254}
            className="h-24 w-auto object-contain"
          />
          <div>
            <p className="mt-2 max-w-md text-xs leading-relaxed">{BRAND.note}</p>
            <p className="mt-2 text-xs">{BRAND.hours}</p>
            <a className="text-xs text-amber-400/90 hover:underline" href={BRAND.instagram} target="_blank" rel="noreferrer">
              Instagram {BRAND.instagramHandle}
            </a>
          </div>
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
