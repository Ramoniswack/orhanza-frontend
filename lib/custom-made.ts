/** Custom Made — typed data from public/custom-made/manifest.json + every price and constant in one place. */
import manifest from "../public/custom-made/manifest.json";

export type Fabric = {
  slug: string;
  name: string;
  category: string;
  hex: string;
  priceNpr: number;
  image: string;
  thumb: string;
  jacketPreview: string;
  suitPreview: string;
};
export type PieceKey = "jacket" | "trousers" | "waistcoat";
export type Pieces = { jacket: true; trousers: boolean; waistcoat: boolean };
export type Stage = "jacket" | "suit";
export type Tab = "fabric" | PieceKey;

/* ── PRICES (NPR) ─ PLACEHOLDERS: replace these. ──────────────────────────────────────────────
   Cloth prices come from manifest.json (also placeholders). Put a real price for a cloth in
   FABRIC_PRICE_OVERRIDES and it wins over the manifest. Piece prices are the making charge. */
export const FABRIC_PRICE_OVERRIDES: Record<string, number> = {};
export const PIECE_PRICE: Record<PieceKey, number> = { jacket: 18000, trousers: 9000, waistcoat: 7500 };
export const DELIVERY_TEXT = "3–4 weeks delivery"; // placeholder

export const fabrics: Fabric[] = manifest.fabrics.map((f) => ({ ...f, priceNpr: FABRIC_PRICE_OVERRIDES[f.slug] ?? f.priceNpr }));
export const categories: string[] = Array.from(new Set(fabrics.map((f) => f.category)));
export const garmentIcon: Record<string, string> = manifest.garments;
export const ui = manifest.ui;

/** Model canvas. The jacket preview is the top part of the full-body canvas at the same scale. */
export const MODEL = { w: 329, h: 1113, jacketH: 667 } as const;

export const getFabric = (slug: string): Fabric => fabrics.find((f) => f.slug === slug) ?? fabrics[0];
export const previewFor = (f: Fabric, stage: Stage) => (stage === "suit" ? f.suitPreview : f.jacketPreview);

/** "Rs. 64,000" — en-US grouping on purpose so server and client render identically. */
export const formatNpr = (n: number) => `Rs. ${n.toLocaleString("en-US")}`;

export function lineItems(fabric: Fabric, pieces: Pieces) {
  const items = [{ label: "Cloth", price: fabric.priceNpr }, { label: "Jacket", price: PIECE_PRICE.jacket }];
  if (pieces.trousers) items.push({ label: "Trousers", price: PIECE_PRICE.trousers });
  if (pieces.waistcoat) items.push({ label: "Waistcoat", price: PIECE_PRICE.waistcoat });
  return items;
}
export const totalNpr = (fabric: Fabric, pieces: Pieces) => lineItems(fabric, pieces).reduce((s, i) => s + i.price, 0);

export const piecesList = (p: Pieces) => ["jacket", p.trousers && "trousers", p.waistcoat && "waistcoat"].filter(Boolean).join(",");
export const parsePieces = (s?: string | null): Pieces => {
  const l = (s ?? "").split(",");
  return { jacket: true, trousers: l.includes("trousers"), waistcoat: l.includes("waistcoat") };
};
export const configQuery = (slug: string, p: Pieces) => `fabric=${encodeURIComponent(slug)}&pieces=${piecesList(p)}`;

/** Key used in the single saved list (ShortlistProvider): "custom:<fabric>:<pieces joined by +>". */
export const savedKey = (slug: string, p: Pieces) => `custom:${slug}:${piecesList(p).split(",").join("+")}`;
export function parseSavedKey(key: string) {
  const [tag, slug, pcs] = key.split(":");
  if (tag !== "custom" || !slug) return null;
  const fabric = fabrics.find((f) => f.slug === slug);
  return fabric ? { fabric, pieces: parsePieces((pcs ?? "").split("+").join(",")) } : null;
}

/* ── image helpers (client only) ── */
const warmed = new Set<string>();
/** Fire-and-forget preload so a later crossfade is instant. */
export function preload(src: string) {
  if (typeof window === "undefined" || warmed.has(src)) return;
  warmed.add(src);
  const img = new Image();
  img.decoding = "async";
  img.src = src;
}
/** Resolve once the image is decoded (or failed — never rejects, so UI never hangs on a bad file). */
export function decodeImage(src: string): Promise<void> {
  const img = new Image();
  img.decoding = "async";
  img.src = src;
  return img.decode().catch(() => undefined);
}
