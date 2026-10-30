export type CategorySlug = "business-suits" | "wedding-suits" | "coat-pant" | "custom-shirts";

export const categories: { slug: CategorySlug; label: string; blurb: string }[] = [
  { slug: "business-suits", label: "Business Suits", blurb: "Precision tailored for every room." },
  { slug: "wedding-suits", label: "Wedding Suits", blurb: "Distinctive attire for grooms and groomsmen." },
  { slug: "coat-pant", label: "Coat & Pant", blurb: "Formal sets for celebrations and professional life." },
  { slug: "custom-shirts", label: "Custom Shirts", blurb: "Collar, cuff and fit, chosen by you." },
];

export interface Product {
  slug: string;
  name: string;
  category: CategorySlug;
  summary: string;
  description: string;
  details: string[];
  fabric: string;
  badge?: string;
}

// NOTE: images live at /images/products/<slug>-a.webp (primary) and -b.webp (hover).
// They are placeholders taken from the reference template — swap in Orhanza photography.
export const products: Product[] = [
  {
    slug: "midnight-double-breasted-suit",
    name: "Midnight Double-Breasted Suit",
    category: "business-suits",
    summary: "Structured shoulders, a confident double-breasted line.",
    description:
      "A double-breasted suit made around your measurements and the way you carry yourself. Designed for boardrooms, receptions and everything that follows.",
    details: ["Made-to-measure fit", "Structured shoulder", "Choice of lapel and button stance", "Hand-finished detailing"],
    fabric: "Premium wool suiting — choose weight and colour in consultation.",
    badge: "Signature",
  },
  {
    slug: "charcoal-single-breasted-suit",
    name: "Charcoal Single-Breasted Suit",
    category: "business-suits",
    summary: "The everyday business suit, cut properly.",
    description:
      "A clean single-breasted silhouette in a versatile charcoal. The foundation of a considered wardrobe, tailored to your posture and proportions.",
    details: ["Made-to-measure fit", "Two- or three-button option", "Slim, regular or classic cut", "Breathable lining options"],
    fabric: "Wool and premium suiting blends, selected for season and occasion.",
  },
  {
    slug: "boardroom-three-piece-suit",
    name: "Boardroom Three-Piece Suit",
    category: "business-suits",
    summary: "Jacket, trouser and waistcoat as one composed look.",
    description:
      "A three-piece for the days that matter. Personal styling guides lapel, waistcoat cut and pocket details so the result feels unmistakably yours.",
    details: ["Jacket, trouser and waistcoat", "Personal styling consultation", "Pocket and lining choices", "Fitting and refinement"],
    fabric: "Premium suiting cloths in wool and wool blends.",
    badge: "Limited cloth",
  },
  {
    slug: "ivory-grooms-suit",
    name: "Ivory Groom’s Suit",
    category: "wedding-suits",
    summary: "A wedding look cut around the groom.",
    description:
      "Made for the day you will be photographed most. We guide you from fabric to fit so the suit looks right in the ceremony and stays comfortable through the celebration.",
    details: ["Wedding-day styling guidance", "Made-to-measure fit", "Coordinated groomsmen options", "Fittings before delivery"],
    fabric: "Wedding and formal fabrics, chosen for colour, weight and drape.",
    badge: "Wedding",
  },
  {
    slug: "black-tie-evening-suit",
    name: "Black-Tie Evening Suit",
    category: "wedding-suits",
    summary: "Sharp, formal, and made for the evening.",
    description:
      "An evening suit with refined lapels and a close, elegant line. Ideal for receptions, galas and wedding guests who want to stand apart.",
    details: ["Evening lapel options", "Made-to-measure fit", "Formal trouser finish", "Occasion styling advice"],
    fabric: "Formal suiting in wool and premium blends.",
  },
  {
    slug: "wool-linen-groomsmen-suit",
    name: "Wool-Linen Groomsmen Suit",
    category: "wedding-suits",
    summary: "Elegance of wool, freshness of linen.",
    description:
      "Cut from a Valerio Cassani wool-linen blend that combines the elegance of wool with the lightness of linen — suited to versatile, all-day wear and warm-weather celebrations.",
    details: ["Valerio Cassani wool-linen", "Breathable and light", "Made-to-measure fit", "Coordinated group orders"],
    fabric: "Valerio Cassani wool-linen blend.",
    badge: "New cloth",
  },
  {
    slug: "sand-coat-pant-set",
    name: "Sand Coat & Pant Set",
    category: "coat-pant",
    summary: "Tailored coat-pant for celebrations and daytime formal.",
    description:
      "A coordinated coat and trouser set in a warm, light tone. Tailored for formal occasions, weddings and professional styling.",
    details: ["Coat and pant set", "Made-to-measure fit", "Choice of cut and finish", "Fitting and delivery"],
    fabric: "Light wool and wool-linen options.",
  },
  {
    slug: "slate-coat-pant-set",
    name: "Slate Coat & Pant Set",
    category: "coat-pant",
    summary: "A quiet, modern formal set.",
    description:
      "Slate tones, clean lines and a considered fit. A coat-pant set that moves from the office to the evening without effort.",
    details: ["Coat and pant set", "Slim, regular or classic cut", "Personal styling", "Fitting and delivery"],
    fabric: "Wool and premium suiting blends.",
  },
  {
    slug: "noir-coat-pant-set",
    name: "Noir Coat & Pant Set",
    category: "coat-pant",
    summary: "Deep black, precisely cut.",
    description:
      "A formal black coat-pant set for weddings, receptions and professional occasions where presence matters.",
    details: ["Coat and pant set", "Made-to-measure fit", "Formal finish", "Fitting and delivery"],
    fabric: "Formal wool suiting.",
    badge: "Formal",
  },
  {
    slug: "signature-white-shirt",
    name: "Signature White Shirt",
    category: "custom-shirts",
    summary: "The shirt every wardrobe is built on.",
    description:
      "A personalised white shirt with the collar, cuff and fit you choose. Cut to your measurements so it sits right all day.",
    details: ["Choice of collar and cuff", "Made-to-measure fit", "Premium cotton shirting", "Monogram on request"],
    fabric: "Premium cotton shirting.",
  },
  {
    slug: "oxford-business-shirt",
    name: "Oxford Business Shirt",
    category: "custom-shirts",
    summary: "Structured texture for working days.",
    description:
      "A tailored oxford with a relaxed-but-sharp character. Selected fabrics, collar styles and fit preferences — all personalised.",
    details: ["Collar and cuff options", "Fit preferences", "Premium shirting fabrics", "Fitting and refinement"],
    fabric: "Cotton oxford and premium shirting.",
  },
  {
    slug: "linen-resort-shirt",
    name: "Linen Resort Shirt",
    category: "custom-shirts",
    summary: "Fresh, breathable and easy to wear.",
    description:
      "A light linen shirt for warm days, destination weddings and relaxed evenings, tailored to your fit.",
    details: ["Linen and linen blends", "Relaxed or tailored fit", "Collar options", "Seasonal colours"],
    fabric: "Linen and cotton-linen options.",
    badge: "Seasonal",
  },
];

export const productImage = (p: Pick<Product, "slug">, which: "a" | "b" = "a") =>
  `/images/products/${p.slug}-${which}.webp`;

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const categoryLabel = (slug: CategorySlug) => categories.find((c) => c.slug === slug)?.label ?? slug;

export const services = [
  { title: "Made-to-Measure Suits", body: "Custom suits designed for business, celebrations, weddings, and everyday refinement." },
  { title: "Premium Shirting", body: "Personalized shirts with selected fabrics, collar styles, cuffs, and fit preferences." },
  { title: "Coat & Pant Tailoring", body: "Tailored coat-pant sets for formal occasions, weddings, and professional styling." },
  { title: "Wedding & Occasion Wear", body: "Distinctive attire for grooms, groomsmen, and special celebrations." },
  { title: "Fabric Consultation", body: "Guidance on cloth weight, texture, colour, seasonality, and occasion suitability." },
  { title: "Personal Styling", body: "A consultation-led process to create a look that is uniquely yours." },
];

export const processSteps = [
  { title: "Consultation", body: "Discuss occasion, style direction, budget, and preferred silhouette." },
  { title: "Fabric selection", body: "Choose from premium cloths, colours, and seasonal fabrics." },
  { title: "Measurement", body: "Take detailed body measurements for a personalized fit." },
  { title: "Crafting", body: "Your garment is tailored with attention to construction, finish, and detail." },
  { title: "Fitting & delivery", body: "Refine the fit and deliver a garment made for you." },
];

export const fabricCategories = [
  { name: "Wool", note: "Structure and year-round polish.", swatch: ["#2b2f3a", "#3d4352"] },
  { name: "Wool-linen", note: "Elegance with a lighter, fresher hand.", swatch: ["#8d8a7a", "#b3ad98"] },
  { name: "Linen", note: "Breathable, textured, effortless.", swatch: ["#c9bfa6", "#e3dbc6"] },
  { name: "Cotton", note: "Crisp shirting, comfortable all day.", swatch: ["#e9e6df", "#f7f5ef"] },
  { name: "Premium suiting blends", note: "Balanced drape, resilience and finish.", swatch: ["#4a4f5e", "#6b7280"] },
  { name: "Wedding & formal fabrics", note: "Cloths chosen for the occasion.", swatch: ["#5b1f27", "#7a2c37"] },
];

export const galleryCaptions = [
  "Precision tailored for every room.",
  "Fresh cloth, new colours, endless inspiration.",
  "A look that is uniquely yours.",
  "Crafted for confidence.",
];

// Placeholder quotes — replace with real client testimonials before launch.
export const testimonials = [
  { quote: "Orhanza understood exactly the look I wanted. The fit, fabric, and finishing felt premium from the first fitting.", name: "Client" },
  { quote: "My wedding suit was customized perfectly. I received compliments all evening.", name: "Groom" },
];
