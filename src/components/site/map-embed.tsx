import { MapPin } from "lucide-react"

type MapEmbedProps = {
  /** Free-text place query, used when coordinates are not known. */
  query?: string
  lat?: number
  lng?: number
  zoom?: number
  title: string
  className?: string
}

/** Key-less, lazy-loaded Google Maps embed with a directions link (works without JavaScript). */
export function MapEmbed({ query, lat, lng, zoom = 15, title, className = "" }: MapEmbedProps) {
  const q = lat !== undefined && lng !== undefined ? `${lat},${lng}` : (query ?? "Dubai, UAE")
  const src = `https://maps.google.com/maps?q=${encodeURIComponent(q)}&z=${zoom}&output=embed`
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(q)}`
  return (
    <figure className={`overflow-hidden rounded-3xl border border-[#e6dfd2] bg-white ${className}`}>
      <iframe
        src={src}
        title={title}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="block h-72 w-full border-0 md:h-96"
        allowFullScreen
      />
      <figcaption className="flex items-center justify-between gap-3 px-4 py-3 text-xs text-[#39455a]">
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-[#94652c]" aria-hidden />
          {title}
        </span>
        <a href={directions} target="_blank" rel="noopener noreferrer" className="font-semibold text-[#94652c] hover:underline">
          Get directions
        </a>
      </figcaption>
    </figure>
  )
}
