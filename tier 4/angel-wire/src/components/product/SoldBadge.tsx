export default function SoldBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center bg-grape-ink px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-chrome-white ${className}`}
    >
      Sold
    </span>
  );
}
