import Link from "next/link";

export default function EmptyBagState({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
      <p className="font-display text-2xl italic text-grape-ink/70">Empty. For now.</p>
      <Link
        href="/shop"
        onClick={onNavigate}
        className="mt-5 font-mono text-[10px] uppercase tracking-[0.16em] text-grape-ink underline decoration-grape-ink/30 underline-offset-4 hover:decoration-grape-ink"
      >
        Browse the Archive
      </Link>
    </div>
  );
}
