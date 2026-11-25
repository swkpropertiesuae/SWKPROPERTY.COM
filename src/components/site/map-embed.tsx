import { MapPin } from "lucide-react";

type MapEmbedProps = {
  /** Free-text place query, used when coordinates are not known. */
  query?: string;
  lat?: number;
  lng?: number;
  zoom?: number;
  title: string;
  className?: string;
};

/** Hardened, sandboxed, lazy-loaded Google Maps embed with coordinate & zoom validation. */
export function MapEmbed({ query, lat, lng, zoom = 15, title, className = "" }: MapEmbedProps) {
  const validCoords =
    typeof lat === "number" &&
    Number.isFinite(lat) &&
    lat >= -90 &&
    lat <= 90 &&
    typeof lng === "number" &&
    Number.isFinite(lng) &&
    lng >= -180 &&
    lng <= 180;

  const safeZoom = Number.isFinite(zoom) ? Math.min(20, Math.max(1, Math.round(zoom))) : 15;
  const safeQuery = (query ?? "Dubai, UAE").replace(/[\r\n<>"]/g, " ").trim().slice(0, 140) || "Dubai, UAE";
  const q = validCoords ? `${lat},${lng}` : safeQuery;
  const src = `https://maps.google.com/maps?q=${encodeURIComponent(q)}&z=${safeZoom}&output=embed`;
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(q)}`;

  return (
    <figure className={`overflow-hidden rounded-2xl border border-black/[0.08] bg-white ${className}`}>
      <iframe
        src={src}
        title={title}
        loading="lazy"
        sandbox="allow-scripts allow-same-origin allow-popups"
        referrerPolicy="no-referrer"
        className="block h-72 w-full border-0 md:h-96"
        allowFullScreen
      />
      <figcaption className="flex items-center justify-between gap-3 border-t border-black/[0.06] bg-[#f7f7f7] px-4 py-3 text-xs text-[#525252]">
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-[#121212]" aria-hidden="true" />
          {title}
        </span>
        <a
          href={directions}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-[#121212] underline underline-offset-4 hover:text-[#0e9f6e]"
        >
          Get directions
        </a>
      </figcaption>
    </figure>
  );
}
