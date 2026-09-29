import { formatCatalogueNumber } from "@/lib/format";

/**
 * The "No. 0XX" chip — first used on ProductCard, now the shared catalogue
 * mark reused across Shop, Product, and Collections wherever a piece needs
 * to read as one physically-numbered archive item rather than a SKU.
 */
export default function CatalogueTag({
  id,
  className = "",
}: {
  id: string;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center border border-grape-ink/20 bg-chrome-white/90 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-grape-ink/70 ${className}`}
    >
      {formatCatalogueNumber(id)}
    </span>
  );
}
