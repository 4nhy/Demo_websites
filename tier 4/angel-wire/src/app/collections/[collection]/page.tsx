import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { collections } from "@/data/collections";
import { products } from "@/data/products";
import CollectionDetail from "@/components/collections/CollectionDetail";

export async function generateMetadata(
  props: PageProps<"/collections/[collection]">
): Promise<Metadata> {
  const { collection: slug } = await props.params;
  const collection = collections.find((c) => c.slug === slug);
  return { title: collection ? `${collection.name} — ANGEL WIRE` : "ANGEL WIRE" };
}

export default async function CollectionPage(props: PageProps<"/collections/[collection]">) {
  const { collection: slug } = await props.params;
  const collection = collections.find((c) => c.slug === slug);
  if (!collection) notFound();

  const items = products.filter((p) => p.collections.includes(collection.slug));

  return <CollectionDetail collection={collection} products={items} allCollections={collections} />;
}
