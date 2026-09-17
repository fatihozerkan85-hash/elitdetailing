"use client";

import { SiteFooter, SiteHeader } from "@/components/site-header";

export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col bg-[#0b0c0e] text-zinc-100">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
