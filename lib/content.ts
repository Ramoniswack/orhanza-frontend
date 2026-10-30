// Copy for the long-scroll sections. All of it is derived from the Orhanza content pack — swap freely.
import { fabricCategories, products } from "./data";

export const servicePanels = [
  { title: "Made-to-Measure Suits", body: "Custom suits designed for business, celebrations, weddings, and everyday refinement.", sub: ["Business", "Celebrations", "Weddings", "Everyday refinement"], image: "/images/products/midnight-double-breasted-suit-a.webp" },
  { title: "Premium Shirting", body: "Personalized shirts with selected fabrics, collar styles, cuffs, and fit preferences.", sub: ["Selected fabrics", "Collar styles", "Cuffs", "Fit preferences"], image: "/images/products/signature-white-shirt-a.webp" },
  { title: "Coat & Pant Tailoring", body: "Tailored coat-pant sets for formal occasions, weddings, and professional styling.", sub: ["Formal occasions", "Weddings", "Professional styling"], image: "/images/products/sand-coat-pant-set-a.webp" },
  { title: "Wedding & Occasion Wear", body: "Distinctive attire for grooms, groomsmen, and special celebrations.", sub: ["Grooms", "Groomsmen", "Special celebrations"], image: "/images/products/ivory-grooms-suit-a.webp" },
  { title: "Fabric Consultation", body: "Guidance on cloth weight, texture, colour, seasonality, and occasion suitability.", sub: ["Cloth weight", "Texture", "Colour", "Seasonality", "Occasion"], image: "/images/banners/craft.webp" },
  { title: "Personal Styling", body: "A consultation-led process to create a look that is uniquely yours.", sub: ["Consultation-led", "Silhouette", "Uniquely yours"], image: "/images/products/black-tie-evening-suit-a.webp" },
];

export const values = [
  { name: "Precision fit", note: "Designed around your measurements" },
  { name: "Premium fabrics", note: "Chosen for season and occasion" },
  { name: "Personal styling", note: "A look that is uniquely yours" },
  { name: "Modern elegance", note: "Confident, refined, modern-classic" },
  { name: "Made-to-measure craftsmanship", note: "Construction, finish and detail" },
];

export const stats = [
  { value: "6", suffix: "", title: "Steps to your fit", body: "Consultation, fabric, measurement, trial fitting, delivery, alterations." },
  { value: "6", suffix: "", title: "Fabric families", body: "Wool, wool-linen, linen, cotton, suiting blends and formal cloth." },
  { value: "4", suffix: "", title: "Core collections", body: "Business, wedding, coat-pant and custom shirts." },
  { value: "100", suffix: "%", title: "Made to measure", body: "Every commission is cut around the person wearing it." },
];

export const stepCards = [
  { n: "01", title: "Consultation", body: "Discuss occasion, style direction, budget, and preferred silhouette.", list: ["Occasion & style direction", "Budget", "Preferred silhouette"] },
  { n: "02", title: "Fabric selection", body: "Choose from premium cloths, colours, and seasonal fabrics.", list: ["Premium cloths", "Colours", "Seasonal fabrics"] },
  { n: "03", title: "Measurement", body: "Take detailed body measurements for a personalized fit.", list: ["Detailed measurements", "Personalized fit", "Built around you"] },
  { n: "04", title: "Crafting", body: "Your garment is tailored with attention to construction, finish, and detail.", list: ["Construction", "Finish", "Detail"] },
  { n: "05", title: "Fitting & delivery", body: "Refine the fit and deliver a garment made for you.", list: ["Fitting", "Refined fit", "Delivery"] },
];

export const commissions = [
  { name: "Business Suits", cat: "business-suits", tags: ["Consultation", "Made to measure"], swatch: fabricCategories[0].swatch, cta: "Book a Consultation →" },
  { name: "Wedding & Occasion", cat: "wedding-suits", tags: ["Consultation", "Fittings"], swatch: fabricCategories[5].swatch, cta: "Book a Consultation →" },
  { name: "Shirts & Coat-Pant", cat: "custom-shirts", tags: ["Consultation", "Made to measure"], swatch: fabricCategories[2].swatch, cta: "Contact Us →" },
].map((c) => ({ ...c, features: (products.find((p) => p.category === c.cat)?.details ?? []).slice(0, 3) }));

export const audience = [
  { role: "Professionals & businessmen", intro: "Suits that carry you from the first meeting to the last.", image: "/images/products/midnight-double-breasted-suit-a.webp" },
  { role: "Grooms & wedding guests", intro: "Distinctive attire for the day you will be photographed most.", image: "/images/products/ivory-grooms-suit-a.webp" },
  { role: "Students & fashion-conscious men", intro: "A distinctive fit, cut around you and how you move.", image: "/images/products/oxford-business-shirt-a.webp" },
];

export const faqs = [
  { q: "What does made-to-measure mean?", a: "Your garment is designed around your measurements, fabric choices and personal style — not taken off a rail and altered." },
  { q: "How does the process work?", a: "Six steps, at your doorstep: home consultation, fabric & design selection, measurement, trial fitting, delivery and alteration support. Each one is led by you." },
  { q: "Can you make wedding suits and groomsmen outfits?", a: "Yes. Orhanza makes distinctive attire for grooms, groomsmen, wedding guests and special celebrations." },
  { q: "Which fabrics do you work with?", a: "Wool, wool-linen, linen, cotton, premium suiting blends and wedding and formal fabrics — including a featured Valerio Cassani wool-linen." },
  { q: "How much does it cost, and how long does it take?", a: "Budget and timing depend on the cloth and the style, so we discuss them with you in the consultation before anything is cut." },
  { q: "Where can I find you?", a: "Jhamsikhel, Lalitpur / Kathmandu. Message @orhanza.np on Instagram to arrange a consultation." },
];

export const testimonialSlides = [
  { quote: "Orhanza understood exactly the look I wanted. The fit, fabric, and finishing felt premium from the first fitting.", name: "Client", image: "/images/banners/craft.webp" },
  { quote: "My wedding suit was customized perfectly. I received compliments all evening.", name: "Groom", image: "/images/banners/instagram.webp" },
];
