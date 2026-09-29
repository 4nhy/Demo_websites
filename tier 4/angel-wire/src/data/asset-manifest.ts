/**
 * Real image manifest — the bridge between placeholder and finished asset.
 *
 * Every visual "image" on the site is requested by a stable id (a product's
 * image id like "aw-0001-a", or a synthetic id for collection/editorial
 * imagery, e.g. "collection-angel-hour-hero"). Until a real file exists for
 * an id, `AssetImage` renders `AssetPlaceholder` — nothing else needs to
 * change when a real photo lands; add one line here and it appears
 * everywhere that id is requested.
 *
 * Real files live under `public/images/<kind>/<id>.<ext>`. Width/height are
 * the actual source pixel dimensions (needed by next/image for layout
 * stability, not just decoration).
 *
 * Product imagery (aw-XXXX-a) was originally procedurally generated —
 * scripts/generate-product-art.mjs — per the asset strategy agreed before
 * implementation. That rule has since been overridden on explicit user
 * instruction: all 20 products and the hero object are now real
 * user-supplied photography, not procedural — see ASSETS.md for the full
 * history of that reversal. generate-product-art.mjs and
 * generate-hero-heart.mjs are both deleted, not just unused.
 */
export type RealImage = {
  src: string;
  width: number;
  height: number;
};

export const REAL_IMAGES: Record<string, RealImage> = {
  // ---- Hero -------------------------------------------------------
  // Real user-supplied photo (public/images/_incoming/hero/), not
  // procedural — see ASSETS.md. Every earlier pass of this asset
  // (banded-chrome SVG, pastel-holographic SVG, then a from-scratch cross
  // SVG) is retired; this is a straightforward real photo through the same
  // AssetImage/next-Image path every other product photo uses.
  P1: { src: "/images/hero/chrome-cross-pendant.png", width: 408, height: 611 },

  // ---- Products — all 20 are now real user-supplied photography ----
  // scripts/generate-product-art.mjs is fully retired; every procedural
  // "-a"/"-b" pair has been replaced by a single real front photo (no "-b"
  // detail slot — none was supplied, and pairing a real photo with a
  // leftover procedural crop would look mismatched). See ASSETS.md.
  "aw-0001-a": { src: "/images/products/aw-0001-a.jpg", width: 736, height: 1179 },
  "aw-0002-a": { src: "/images/products/aw-0002-a.jpg", width: 736, height: 981 },
  "aw-0003-a": { src: "/images/products/aw-0003-a.jpg", width: 736, height: 978 },
  "aw-0004-a": { src: "/images/products/aw-0004-a.jpg", width: 736, height: 736 },
  "aw-0005-a": { src: "/images/products/aw-0005-a.jpg", width: 736, height: 1104 },
  "aw-0006-a": { src: "/images/products/aw-0006-a.jpg", width: 736, height: 1319 },
  "aw-0007-a": { src: "/images/products/aw-0007-a.jpg", width: 600, height: 800 },
  "aw-0008-a": { src: "/images/products/aw-0008-a.jpg", width: 736, height: 736 },
  "aw-0009-a": { src: "/images/products/aw-0009-a.jpg", width: 736, height: 980 },
  "aw-0010-a": { src: "/images/products/aw-0010-a.jpg", width: 736, height: 981 },
  "aw-0011-a": { src: "/images/products/aw-0011-a.jpg", width: 736, height: 981 },
  "aw-0012-a": { src: "/images/products/aw-0012-a.jpg", width: 736, height: 981 },
  "aw-0013-a": { src: "/images/products/aw-0013-a.jpg", width: 736, height: 806 },
  "aw-0014-a": { src: "/images/products/aw-0014-a.jpg", width: 736, height: 869 },
  "aw-0015-a": { src: "/images/products/aw-0015-a.jpg", width: 736, height: 736 },
  "aw-0016-a": { src: "/images/products/aw-0016-a.jpg", width: 736, height: 689 },
  "aw-0017-a": { src: "/images/products/aw-0017-a.jpg", width: 736, height: 736 },
  "aw-0018-a": { src: "/images/products/aw-0018-a.jpg", width: 735, height: 709 },
  "aw-0019-a": { src: "/images/products/aw-0019-a.jpg", width: 735, height: 964 },
  "aw-0020-a": { src: "/images/products/aw-0020-a.jpg", width: 736, height: 983 },

  // ---- Editorial / collection / about imagery ---------------------------
  // Real user-supplied photos, dropped directly into public/images/collections
  // and public/images/editorial (not via _incoming/) — replacing the earlier
  // Commons-sourced set (a sequin macro, a leather-jacket detail, etc.) that
  // ASSETS.md still describes as current. See ASSETS.md for the correction.
  "collection-angel-hour-hero": { src: "/images/collections/angel-hour-hero.jpg", width: 736, height: 278 },
  "collection-after-dark-hero": { src: "/images/collections/after-dark-hero.jpg", width: 735, height: 490 },
  "collection-soft-damage-hero": { src: "/images/collections/soft-damage-hero.jpg", width: 735, height: 519 },
  // Found Objects was a three-crop scattered layout (CollectionChapter.tsx)
  // wanting three distinct object photos; only one was ever supplied, and
  // per explicit instruction no more are coming. The layout was simplified
  // to a single hero image instead of faking three crops from one file —
  // see CollectionChapter.tsx's doc comment. The object-0/1/2 ids this
  // manifest used to carry as a stopgap are gone, not just unused.
  // The user photo originally here was replaced (GUESS / Diesel logos in
  // frame) by a cropped Pexels thrift-store photo under a new filename, so
  // no cached copy of the old image can survive. COL-found-objects and
  // L-found-objects below point at the same file. Source, license and crop
  // are in ASSETS.md, "Found Objects — replaced".
  "collection-found-objects-hero": { src: "/images/collections/found-objects-thrift.jpg", width: 736, height: 552 },

  // Real user-supplied photos (public/images/about/), replacing the earlier
  // Commons-sourced pair — see ASSETS.md.
  "about-hero": { src: "/images/about/hero.jpg", width: 736, height: 431 },
  "about-rack": { src: "/images/about/rack.jpg", width: 736, height: 1308 },

  // Real user-supplied photos (a thrift-window shot, a thrift-rack shot),
  // replacing the earlier Commons pair (Polaroid still life, sequin macro).
  E1: { src: "/images/editorial/e1.jpg", width: 736, height: 981 },
  E2: { src: "/images/editorial/e2.jpg", width: 736, height: 981 },

  // No dedicated Lookbook photos were ever supplied — per explicit
  // instruction, reusing the four real collection photos here instead of
  // the old Commons set (a leather-jacket detail, etc.), so this section
  // isn't the last one still on old/off-direction imagery. Same file,
  // different id, same pattern ASSETS.md already documents elsewhere.
  "L-angel-hour": { src: "/images/collections/angel-hour-hero.jpg", width: 736, height: 278 },
  "L-after-dark": { src: "/images/collections/after-dark-hero.jpg", width: 735, height: 490 },
  "L-soft-damage": { src: "/images/collections/soft-damage-hero.jpg", width: 735, height: 519 },
  "L-found-objects": { src: "/images/collections/found-objects-thrift.jpg", width: 736, height: 552 },

  // Was /images/shop/editorial-band.jpg (the old Commons Polaroid
  // still-life, untouched since 2026-09-02) — a THIRD manifest entry for
  // editorial imagery that the E1/E2 fix missed entirely, since it's a
  // separate id pointing at a separate file. Now the same thrift-rack photo
  // as E2.
  "shop-editorial-band": { src: "/images/editorial/e2.jpg", width: 736, height: 981 },

  "COL-angel-hour": { src: "/images/collections/angel-hour-hero.jpg", width: 736, height: 278 },
  "COL-after-dark": { src: "/images/collections/after-dark-hero.jpg", width: 735, height: 490 },
  "COL-soft-damage": { src: "/images/collections/soft-damage-hero.jpg", width: 735, height: 519 },
  "COL-found-objects": { src: "/images/collections/found-objects-thrift.jpg", width: 736, height: 552 },
};

export function getRealImage(id: string): RealImage | undefined {
  return REAL_IMAGES[id];
}
