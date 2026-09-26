"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useStore } from "@/lib/store";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function LogoutConfirmDialog({ open, onOpenChange }: Props) {
  const { logout } = useStore();
  const router = useRouter();

  function confirm() {
    logout();
    onOpenChange(false);
    router.push("/");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border border-white/10 bg-[#12141a] text-zinc-100" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="text-zinc-50">Çıkış yapmak istediğinize emin misiniz?</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Oturumunuz kapanır; tekrar işlem için giriş yapmanız gerekir.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="border-white/10 bg-transparent">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Vazgeç
          </Button>
          <Button type="button" variant="destructive" onClick={confirm}>
            Evet, çıkış yap
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/** Hook: open confirm dialog, then logout + home */
export function useLogoutConfirm() {
  const [open, setOpen] = useState(false);
  return {
    open,
    setOpen,
    requestLogout: () => setOpen(true),
    dialog: <LogoutConfirmDialog open={open} onOpenChange={setOpen} />,
  };
}
