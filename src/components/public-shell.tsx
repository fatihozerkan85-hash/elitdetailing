"use client";

import { MobileTabBar } from "@/components/mobile-tabbar";
import { SiteFooter, SiteHeader } from "@/components/site-header";

export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-[#0b0c0e] text-zinc-100">
      <SiteHeader />
      <main className="public-main flex-1">{children}</main>
      <SiteFooter />
      <MobileTabBar />
    </div>
  );
}
