"use client";

import { ThemeProvider } from "next-themes";
import { StoreProvider } from "@/lib/store";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <StoreProvider>
        {children}
        <Toaster position="top-right" theme="dark" />
      </StoreProvider>
    </ThemeProvider>
  );
}
