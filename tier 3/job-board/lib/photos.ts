import type { PhotoPoolId } from "./jobs";

// Curated stock pool (Tier 3 — see git history for the old ASSETS.md; the
// concept carries over even though that file was discarded in the restart
// to the Swiss direction). Verified, licensed Unsplash IDs, mapped
// deterministically by category so adjacent listings don't repeat a frame.
export const PHOTO_POOL: Record<PhotoPoolId, string> = {
  "eng-01": "1521737604893-d14cc237f11d",
  "eng-02": "1573497019940-1c28c88b4f3e",
  "eng-03": "1556761175-5973dc0f32e7",
  "design-01": "1531482615713-2afd69097998",
  "design-02": "1600880292089-90a7e086ee0c",
  "mktg-01": "1552664730-d307ca884978",
  "ops-01": "1542744173-8e7e53415bb0",
  "intern-01": "1522202176988-66273c2fd55f",
  "intern-02": "1519389950473-47ba0277781c",
  "general-01": "1587825140708-dfaf72ae4b04",
};

export function photoUrl(id: PhotoPoolId, width = 1200): string {
  return `https://images.unsplash.com/photo-${PHOTO_POOL[id]}?w=${width}&q=80&auto=format&fit=crop`;
}
