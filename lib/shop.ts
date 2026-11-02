import { looks, MEN_COUNT, type Look } from "./lookbook-data";
import { lookKey } from "./saved-key";

export type Gender = "men" | "women";
export type Occasion = Look["category"];
export type ShopType = "Suits" | "Coats" | "Blazers";

export const genders: { slug: Gender; label: string }[] = [
  { slug: "men", label: "Men" },
  { slug: "women", label: "Women" },
];
export const occasions: Occasion[] = ["Wedding", "Business", "Casual"];
export const shopTypes: ShopType[] = ["Suits", "Coats", "Blazers"];

// one entry per look, in look order (1 → 15)
const typeByLook: ShopType[] = [
  "Suits", "Coats", "Coats", "Coats", "Suits", "Blazers", "Suits", "Suits",
  "Suits", "Suits", "Suits", "Suits", "Coats", "Suits", "Blazers",
];

export type ShopProduct = {
  slug: string;
  id: number;
  key: string;
  name: string;
  gender: Gender;
  occasion: Occasion;
  type: ShopType;
  image: string; // full-length model cut-out
  flat: string; // the piece on its own
  lines: [string, string, string];
};

const slugify = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export const shopProducts: ShopProduct[] = looks.map((l, i) => ({
  slug: slugify(l.name),
  id: l.id,
  key: lookKey(l.id),
  name: l.name,
  gender: l.id <= MEN_COUNT ? "men" : "women",
  occasion: l.category,
  type: typeByLook[i],
  image: `/lookbook/${l.model}`,
  flat: `/lookbook/${l.product}`,
  lines: l.desc,
}));

const about: Record<ShopType, { intro: string; make: string[]; fabric: string }> = {
  Suits: {
    intro: "A complete suit, drafted from your own measurements rather than altered from a standard size. The shoulder, chest and waist are balanced to your posture, and the trouser length and break are set at the first fitting.",
    make: ["Pattern drafted to your measurements", "Canvas-style structure for a clean, lasting line", "Lapel width, button stance and pocket style chosen with you", "Hand-finished details and a lining of your choice"],
    fabric: "Wool and premium suiting blends, in weights suited to the season. We bring swatches to your consultation, so you can see and feel the cloth before it is cut.",
  },
  Coats: {
    intro: "A coat is judged by how it falls from the shoulder, so every inch is cut to your frame. Sleeve length, coat length and the room allowed for layers underneath are all agreed with you before cutting begins.",
    make: ["Shoulder and sleeve set to your frame", "Length and layering allowance chosen with you", "Clean, quiet finishing along the edges", "Lining and interior pockets of your choice"],
    fabric: "Heavier wools and herringbone weaves chosen for warmth, drape and the way they age with wear. Weight and finish are discussed at the consultation.",
  },
  Blazers: {
    intro: "A blazer that stands on its own, cut sharply through the shoulder and waist and finished like the jacket of a full suit. Wear it with matching trousers, or on its own.",
    make: ["Structured shoulder with a defined waist", "Button, lapel and pocket details chosen with you", "Made to sit cleanly when worn open or closed", "Hand-finished edges and buttonholes"],
    fabric: "Light and mid-weight wool, crepe and blends selected for a crisp line. We guide the choice by occasion and season.",
  },
};
export const productAbout = (t: ShopType) => about[t];

export const getShopProduct = (slug: string) => shopProducts.find((p) => p.slug === slug);
export const genderLabel = (g: Gender) => (g === "men" ? "Men" : "Women");
