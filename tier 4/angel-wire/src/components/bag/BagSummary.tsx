import Link from "next/link";
import { formatPrice } from "@/lib/format";

export default function BagSummary({
  subtotal,
  onCheckoutClick,
}: {
  subtotal: number;
  onCheckoutClick: () => void;
}) {
  return (
    <div className="border-t border-grape-ink/10 px-6 py-5">
      <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.1em]">
        <span className="text-grape-ink/60">Subtotal</span>
        <span className="text-grape-ink">{formatPrice(subtotal)}</span>
      </div>
      <p className="mt-1.5 font-mono text-[9px] uppercase tracking-[0.1em] text-grape-ink/70">
        Shipping and duties calculated at checkout.
      </p>
      <Link
        href="/checkout"
        onClick={onCheckoutClick}
        className="mt-4 block w-full border border-grape-ink bg-grape-ink px-4 py-3 text-center text-xs font-medium uppercase tracking-[0.16em] text-chrome-white transition-colors duration-200 hover:bg-grape-ink/90"
      >
        Checkout
      </Link>
    </div>
  );
}
