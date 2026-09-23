import type { Metadata, Viewport } from "next";
import { Oswald, Source_Sans_3 } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const display = Oswald({
  variable: "--font-display",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
});

const sans = Source_Sans_3({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
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
    <html lang="tr" className={`dark ${display.variable} ${sans.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#0b0c0e] font-sans text-zinc-100">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
