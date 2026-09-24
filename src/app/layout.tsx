import type { Metadata, Viewport } from "next";
import { Providers } from "@/components/providers";
import "@/index.css";

export const metadata: Metadata = {
  title: "Elit Detailing",
  description:
    "Profesyonel detailing, seramik kaplama ve premium bakım hizmetleri.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#080808",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="tr">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
