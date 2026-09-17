import { PublicShell } from "@/components/public-shell";
import { EmptyState } from "@/components/site-header";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <PublicShell>
      <div className="mx-auto max-w-lg px-4 py-20">
        <EmptyState
          title="Sayfa yok"
          hint="Adres hatalı. Hizmetler veya panoya dönün."
          action={
            <Link href="/" className={cn(buttonVariants())}>
              Ana sayfa
            </Link>
          }
        />
      </div>
    </PublicShell>
  );
}
