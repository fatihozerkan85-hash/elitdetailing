import type { Metadata } from "next";
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
  title: "Elit Otomotiv — Self-servis & operasyon",
  description:
    "Oto yıkama, lastik, aksesuar, acil yol yardım ve detailing randevu, takip ve işletme paneli.",
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
