import { notFound } from "next/navigation";
import StudioClient from "./StudioClient";

// Dev-only still renderer for the static fallback tier. Not shipped in production.
export default async function StudioPage({ searchParams }: PageProps<"/studio">) {
  if (process.env.NODE_ENV === "production") notFound();
  const { shot } = await searchParams;
  return <StudioClient shot={typeof shot === "string" ? shot : "slate"} />;
}
