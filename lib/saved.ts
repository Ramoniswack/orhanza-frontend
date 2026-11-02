import { looks } from "./lookbook-data";
import { shopProducts } from "./shop";

/** Anything the visitor can shortlist: a shop piece, keyed "look-<id>". */
export type Saved = { key: string; name: string; image: string; href: string; position: string };

export { lookKey } from "./saved-key";
import { lookKey } from "./saved-key";

export function resolveSaved(key: string): Saved | null {
  const l = looks.find((x) => lookKey(x.id) === key);
  const p = shopProducts.find((x) => x.id === l?.id);
  return l && p ? { key, name: l.name, image: p.image, href: `/shop/${p.slug}`, position: "top" } : null;
}
