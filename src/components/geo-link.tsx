import { formatCoords, mapsUrl } from "@/lib/format";

export function GeoLink({
  lat,
  lng,
  accuracyM,
}: {
  lat?: number;
  lng?: number;
  accuracyM?: number;
}) {
  if (lat == null || lng == null) return null;
  return (
    <a
      href={mapsUrl(lat, lng)}
      target="_blank"
      rel="noreferrer"
      className="inline-flex text-sm text-amber-300 hover:underline"
    >
      Haritada aç · {formatCoords(lat, lng, accuracyM)}
    </a>
  );
}
