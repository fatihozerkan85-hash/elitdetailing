"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { PublicShell } from "@/components/public-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStore } from "@/lib/store";
import { hydrateCustomer } from "@/lib/ops";
import { cn } from "@/lib/utils";
import type { Customer, Vehicle } from "@/lib/types";

export function useMe(): Customer | null {
  const { session, customers } = useStore();
  if (session.role !== "customer" || !session.customerId) return null;
  const raw = customers.find((c) => c.id === session.customerId);
  return raw ? hydrateCustomer(raw) : null;
}

export function CustomerPanel({
  children,
  title,
  lead,
  className,
}: {
  children: React.ReactNode;
  title: string;
  lead?: string;
  className?: string;
}) {
  return (
    <PublicShell>
      <div className={cn("customer-panel mx-auto max-w-lg px-4 py-8 sm:max-w-xl sm:py-10", className)}>
        <p className="customer-kicker">Müşteri paneli</p>
        <h1 className="customer-title">{title}</h1>
        {lead ? <p className="customer-lead">{lead}</p> : null}
        <div className="mt-6 space-y-4">{children}</div>
      </div>
    </PublicShell>
  );
}

export function CustomerCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("customer-card", className)}>{children}</div>;
}

export function VehicleManager({ me }: { me: Customer }) {
  const { addVehicle, removeVehicle, setActiveVehicle } = useStore();
  const [open, setOpen] = useState(false);
  const [plate, setPlate] = useState("");
  const [label, setLabel] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!plate.trim()) {
      toast.error("Plaka gerekli");
      return;
    }
    const v = addVehicle({ plate, label: label || plate });
    if (v) {
      toast.success("Araç eklendi", { description: v.plate });
      setPlate("");
      setLabel("");
      setOpen(false);
    }
  }

  return (
    <CustomerCard>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="customer-section-label">Araçlarım</p>
          <p className="mt-1 text-[15px] leading-snug text-[#f0e6c8]/80">
            Randevu ve yol yardımda seçili araç otomatik gelir.
          </p>
        </div>
        <Button type="button" size="sm" onClick={() => setOpen((v) => !v)}>
          {open ? "Kapat" : "Araç ekle"}
        </Button>
      </div>

      <ul className="mt-4 space-y-2">
        {me.vehicles.map((v) => (
          <VehicleRow
            key={v.id}
            vehicle={v}
            active={v.id === me.activeVehicleId}
            canDelete={me.vehicles.length > 1}
            onSelect={() => setActiveVehicle(v.id)}
            onDelete={() => {
              removeVehicle(v.id);
              toast.success("Araç silindi");
            }}
          />
        ))}
      </ul>

      {open ? (
        <form onSubmit={submit} className="mt-4 grid gap-3 rounded-xl border border-[rgba(201,168,76,0.2)] bg-black/30 p-3">
          <div className="grid gap-1.5">
            <Label className="text-[13px] text-[#f0e6c8]/70">Plaka</Label>
            <Input className="plate h-11 text-base" value={plate} onChange={(e) => setPlate(e.target.value)} placeholder="06 ELT 01" />
          </div>
          <div className="grid gap-1.5">
            <Label className="text-[13px] text-[#f0e6c8]/70">Araç (yıl / marka / model)</Label>
            <Input className="h-11 text-base" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="2021 BMW 5.20i" />
          </div>
          <Button type="submit" className="h-11">
            Kaydet
          </Button>
        </form>
      ) : null}
    </CustomerCard>
  );
}

function VehicleRow({
  vehicle,
  active,
  canDelete,
  onSelect,
  onDelete,
}: {
  vehicle: Vehicle;
  active: boolean;
  canDelete: boolean;
  onSelect: () => void;
  onDelete: () => void;
}) {
  return (
    <li
      className={cn(
        "flex items-center justify-between gap-3 rounded-xl border px-3 py-3 transition",
        active ? "border-[rgba(201,168,76,0.55)] bg-[rgba(201,168,76,0.08)]" : "border-white/10 bg-black/20",
      )}
    >
      <button type="button" className="min-w-0 flex-1 text-left" onClick={onSelect}>
        <p className="plate text-[17px] tracking-wide text-amber-200">{vehicle.plate}</p>
        <p className="mt-0.5 truncate text-[14px] text-[#f0e6c8]/65">{vehicle.label}</p>
        {active ? <p className="mt-1 text-[11px] font-medium tracking-wide text-amber-300/90 uppercase">Seçili</p> : null}
      </button>
      {canDelete ? (
        <Button type="button" size="sm" variant="ghost" className="text-zinc-500" onClick={onDelete}>
          Sil
        </Button>
      ) : null}
    </li>
  );
}

/** Prefill + vehicle select for booking forms when logged in */
export function ProfileVehicleFields({
  vehicleId,
  onVehicleChange,
  showGuestFields,
  name,
  phone,
  plate,
  vehicle,
  onName,
  onPhone,
  onPlate,
  onVehicle,
}: {
  vehicleId: string;
  onVehicleChange: (id: string, plate: string, label: string) => void;
  showGuestFields: boolean;
  name: string;
  phone: string;
  plate: string;
  vehicle: string;
  onName: (v: string) => void;
  onPhone: (v: string) => void;
  onPlate: (v: string) => void;
  onVehicle: (v: string) => void;
}) {
  const me = useMe();
  const { setActiveVehicle } = useStore();

  if (me && !showGuestFields) {
    return (
      <div className="space-y-3 rounded-xl border border-[rgba(201,168,76,0.22)] bg-[rgba(201,168,76,0.05)] p-4">
        <div>
          <p className="text-[12px] tracking-[0.14em] text-amber-300/80 uppercase">Kayıtlı bilgiler</p>
          <p className="mt-1 text-[17px] font-medium text-[#f0e6c8]">{me.name}</p>
          <p className="text-[15px] text-[#f0e6c8]/65">{me.phone}</p>
        </div>
        <div className="grid gap-1.5">
          <Label className="text-[13px] text-[#f0e6c8]/70">Araç seç</Label>
          <select
            className="h-11 w-full rounded-lg border border-input bg-input/30 px-3 text-[15px]"
            value={vehicleId || me.activeVehicleId || me.vehicles[0]?.id || ""}
            onChange={(e) => {
              const v = me.vehicles.find((x) => x.id === e.target.value);
              if (!v) return;
              setActiveVehicle(v.id);
              onVehicleChange(v.id, v.plate, v.label);
            }}
          >
            {me.vehicles.map((v) => (
              <option key={v.id} value={v.id} style={{ color: "#111", backgroundColor: "#fff" }}>
                {v.plate} — {v.label}
              </option>
            ))}
          </select>
        </div>
        <Link href="/profil" className="inline-block text-[14px] text-amber-300 hover:underline">
          Yeni araç ekle →
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="grid gap-2">
        <Label>Ad soyad</Label>
        <Input value={name} onChange={(e) => onName(e.target.value)} className="h-11 text-base" />
      </div>
      <div className="grid gap-2">
        <Label>Telefon</Label>
        <Input value={phone} onChange={(e) => onPhone(e.target.value)} className="h-11 text-base" inputMode="tel" />
      </div>
      <div className="grid gap-2">
        <Label>Plaka</Label>
        <Input className="plate h-11 text-base" value={plate} onChange={(e) => onPlate(e.target.value)} />
      </div>
      <div className="grid gap-2">
        <Label>Araç</Label>
        <Input value={vehicle} onChange={(e) => onVehicle(e.target.value)} className="h-11 text-base" />
      </div>
    </div>
  );
}
