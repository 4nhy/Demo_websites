"use client";

import { useState } from "react";
import { ArrowRightIcon } from "./icons";

/** No backend, per the brief — validates client-side and confirms locally. */
export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) return;
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <p className="font-display text-lg text-bone">
        You&apos;re on the list — new recipes land weekly.
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-md flex-col gap-3 sm:flex-row"
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        aria-label="Email address"
        className="w-full flex-1 rounded-full border border-bone/30 bg-transparent px-5 py-3 text-sm text-bone placeholder:text-bone/50 outline-none focus-visible:border-bone"
      />
      <button
        type="submit"
        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-terracotta px-5 py-3 text-sm font-semibold text-terracotta-ink transition-transform hover:-translate-y-0.5"
      >
        Get recipes
        <ArrowRightIcon className="size-4" />
      </button>
    </form>
  );
}
