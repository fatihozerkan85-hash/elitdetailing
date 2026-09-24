import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Elit Detailing — Yıkama, lastik, yol yardım",
  description:
    "Elit Detailing self-servis: randevu, acil yol yardım, iş takibi, kupon ve işletme paneli. Tamamen responsive.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0b0c0e",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="tr"
      className={`dark ${inter.variable} h-full antialiased`}
      style={{ ["--font-display" as string]: "var(--font-sans)" }}
    >
      <body className={`${inter.className} min-h-full bg-[#0b0c0e] font-sans text-zinc-100`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
