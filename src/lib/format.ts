export function tryFormat(n: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(n);
}

export function formatDateTime(iso: string) {
  return new Intl.DateTimeFormat("tr-TR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(iso));
}

export function formatTime(iso: string) {
  return new Intl.DateTimeFormat("tr-TR", { timeStyle: "short" }).format(new Date(iso));
}

export function todayISO() {
  const d = new Date();
  const z = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`;
}

export function addDaysISO(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  const z = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`;
}

export function minutesAgo(min: number) {
  return new Date(Date.now() - min * 60_000).toISOString();
}

export function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}

export function mapsUrl(lat: number, lng: number) {
  return `https://www.google.com/maps?q=${lat},${lng}`;
}

export function formatCoords(lat: number, lng: number, accuracyM?: number) {
  const pin = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  return accuracyM != null && Number.isFinite(accuracyM) ? `${pin} (±${Math.round(accuracyM)} m)` : pin;
}
