/** Renders one or more JSON-LD blocks safely escaped against script breakout & line separators. Server-safe. */
function serializeJsonLd(value: object): string {
  const raw = JSON.stringify(value) ?? "{}";
  return raw
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

export function JsonLd({ id, data }: { id?: string; data: object | object[] }) {
  const list = (Array.isArray(data) ? data : [data]).filter(
    (d): d is object => Boolean(d && typeof d === "object")
  );
  return (
    <>
      {list.map((d, i) => (
        <script
          key={id ? `${id}-${i}` : i}
          id={id && i === 0 ? id : undefined}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(d) }}
        />
      ))}
    </>
  );
}
