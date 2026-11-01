import trim from "./lookbook-trim.json";

export type Trim = { w: number; h: number; top: number; hFrac: number };
export type Look = {
  id: number;
  model: string;
  product: string;
  name: string;
  ghost: string;
  desc: [string, string, string];
  cta: string;
  trimModel: Trim;
  trimProduct: Trim;
};

const raw: { name: string; ghost: string; desc: [string, string, string] }[] = [
  { name: "Ivory Bandhgala", ghost: "Bandhgala", desc: ["A closed-collar jacket cut close to the body,", "in a matte ivory wool with a quiet drape.", "Finished by hand, fitted to you."] },
  { name: "Black Overcoat & Forest Waistcoat", ghost: "Overcoat", desc: ["A long black overcoat with a clean shoulder,", "worn over a deep forest waistcoat.", "Made for cold evenings and long coats."] },
  { name: "Grey Herringbone Overcoat", ghost: "Herringbone", desc: ["Herringbone wool in a soft charcoal grey,", "cut straight and unlined at the edges.", "A coat that gets better with wear."] },
  { name: "Black Overcoat & Turtleneck", ghost: "Turtleneck", desc: ["A sharp black overcoat over a fine-knit roll neck.", "Minimal, warm and easy to wear all season.", "Tailored to sit clean through the chest."] },
  { name: "Olive Shawl-Lapel Dinner Suit", ghost: "Dinner", desc: ["A shawl-lapel jacket in deep olive,", "with trousers cut for a long, quiet line.", "Made for evenings that run late."] },
  { name: "Ombré Double-Breasted Blazer", ghost: "Ombré", desc: ["A double-breasted blazer that fades from black to white.", "Gold buttons, structured shoulder.", "Each one dyed and finished by hand."] },
  { name: "Cream Double-Breasted & White Trouser", ghost: "Cream", desc: ["A cream double-breasted jacket", "paired with a crisp white trouser.", "Light, formal and made for warm days."] },
  { name: "Cream Double-Breasted & Tan Trouser", ghost: "Tan", desc: ["The same cream jacket, softened", "by a warm tan trouser with a clean break.", "Relaxed tailoring for daytime."] },
  { name: "Emerald Pantsuit", ghost: "Emerald", desc: ["A fitted emerald jacket with a sharp lapel,", "and a high-waisted trouser to match.", "Cut close, with room to move."] },
  { name: "Sand Pantsuit", ghost: "Sand", desc: ["A pale sand pantsuit in a fluid crepe,", "tailored to hold its line through the day.", "Quiet colour, careful construction."] },
  { name: "Black Satin Pantsuit", ghost: "Satin", desc: ["Black satin with a soft sheen,", "cut sharply through the shoulder and waist.", "Made for the evening."] },
  { name: "White Cape Suit", ghost: "Cape", desc: ["A cape-backed jacket in clean white,", "with a slim trouser underneath.", "Formal, light and easy to move in."] },
  { name: "Ivory Belted Longcoat", ghost: "Longcoat", desc: ["A long ivory coat, belted at the waist,", "falling straight to the calf.", "Made to be worn open or closed."] },
  { name: "Off-Shoulder Ivory Suit", ghost: "Off-Shoulder", desc: ["An off-shoulder jacket in ivory,", "cut to show the collarbone and hold its shape.", "Tailored on the body, not on the rack."] },
  { name: "Black Blazer Dress", ghost: "Blazer", desc: ["A blazer cut long enough to wear as a dress,", "with a nipped waist and sharp lapel.", "One piece, finished like a jacket."] },
];

export const looks: Look[] = raw.map((r, i) => {
  const id = i + 1;
  const t = (trim as Record<string, { model: Trim; product: Trim }>)[String(id)];
  return { id, model: `${id}.webp`, product: `${id}.1.webp`, ...r, cta: "Book a fitting", trimModel: t.model, trimProduct: t.product };
});

export const N = looks.length;
export const SCREENS_PER_LOOK = 400; // vh of scroll per look

/** Every x is the element centre in vw; heights are of the whole (untrimmed) image in vh. */
export const defaults = {
  desktop: {
    giantH: 200, giantTop: -6, giantX: 27,
    heroH: 145, heroTop: -2, heroX: 28, heroEnterX: 112,
    smallH: 70, smallRightX: 83, smallLeftX: 6, smallBackX: 8, smallFloor: 4,
    peekX: 97, peekScale: 0.7,
    giantExitX: -45, heroExitX: -45, smallExitX: -60, giantSpeed: 1.35,
    ghostCap: 22, ghostY: 50, ghostParallax: 0.35, ghostOpacity: 0.08,
    textLeft: 48, textW: 28, textY: 52, heroTextX: 71, heroTextY: 47,
    exitEnd: 0.25, enterStart: 0.65, enterTail: 0.2,
    panEase: [0.22, 0.61, 0.36, 1] as [number, number, number, number],
    buttonDelay: 0.15, lineStagger: 0.08,
    holdDetail: 0.2, panAEnd: 0.5, holdHeroEnd: 0.7,
    snapMs: 150, snapDuration: 1.8,
  },
  mobile: {
    giantH: 150, giantTop: -4, giantX: 30,
    heroH: 110, heroTop: 0, heroX: 32, heroEnterX: 120,
    smallH: 45, smallRightX: 88, smallLeftX: 8, smallBackX: 10, smallFloor: 10,
    peekX: 112, peekScale: 0.7,
    giantExitX: -70, heroExitX: -60, smallExitX: -60, giantSpeed: 1.35,
    ghostCap: 14, ghostY: 40, ghostParallax: 0.35, ghostOpacity: 0.08,
    textLeft: 6, textW: 70, textY: 82, heroTextX: 41, heroTextY: 82,
    exitEnd: 0.25, enterStart: 0.65, enterTail: 0.2,
    panEase: [0.22, 0.61, 0.36, 1] as [number, number, number, number],
    buttonDelay: 0.15, lineStagger: 0.08,
    holdDetail: 0.2, panAEnd: 0.5, holdHeroEnd: 0.7,
    snapMs: 150, snapDuration: 1.8,
  },
};
export type Cfg = typeof defaults.desktop;

/** Garments keep their true colour (the cloth is the product). Flip to true for a fully greyscale lookbook. */
export const MONO_PHOTOS = false;

/** Looks 1–8 are menswear, 9–15 womenswear. */
export const MEN_COUNT = 8;

/** Page-Y (px) that lands on the detail hold of look k (0-based), for the #lookbook section. */
export function lookScrollY(k: number): number {
  const el = document.getElementById("lookbook");
  const top = (el?.getBoundingClientRect().top ?? 0) + window.scrollY;
  return top + (k + defaults.desktop.holdDetail / 2) * (SCREENS_PER_LOOK / 100) * window.innerHeight;
}
