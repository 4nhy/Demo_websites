import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-bone px-5 py-24 text-center">
      <p className="text-sm font-medium text-olive">404</p>
      <h1 className="mt-3 max-w-lg font-display text-3xl font-semibold text-balance text-ink sm:text-4xl">
        This recipe wandered off.
      </h1>
      <p className="mt-4 max-w-md text-md text-ink/70">
        Whatever you were looking for isn&apos;t on this page — maybe it got
        filtered out, maybe the link was never quite right. Either way, the
        rest of the kitchen is still here.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-terracotta px-6 py-3.5 text-sm font-semibold text-terracotta-ink transition-transform hover:-translate-y-0.5"
      >
        Back to the kitchen
        <ArrowRightIcon className="size-4" />
      </Link>
      <Link
        href="/recipes"
        className="mt-4 text-sm font-medium text-olive hover:underline"
      >
        Or just browse all recipes →
      </Link>
    </div>
  );
}
