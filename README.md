# Orhanza — Next.js site

Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · `motion` (Framer Motion) · `lenis`

Built from the **Homelander** Framer template (`l.zip`) as the structural/visual reference, with the
Orhanza content pack and a **scroll-scrubbed hero** driven by `video_frames_60fps.zip`.

## Run

```bash
npm install
cp .env.example .env.local   # fill in confirmed phone / WhatsApp / email / map / hours
npm run dev                  # http://localhost:3000
npm run build && npm start
```

## How the hero works (`components/sections/Hero.tsx`)

- `HeroScroll` is a 320svh section containing a `sticky` 100svh viewport.
- `useScroll({ target, offset: ["start start","end end"] })` → `useSpring` → `useTransform` maps progress to a frame index (0–191).
- Frames are drawn to a `<canvas>` (cover-fit, DPR capped at 2). Frames preload progressively
  (every 8th → 4th → 2nd → rest); scrolling is held (`lenis.stop()`) until ~25 % is ready, with a branded loader.
- Four scroll-linked text stages (`Stage`) fade/slide/unblur over the footage; stage 1 plays a word-mask reveal on load.
- `prefers-reduced-motion`: no scrubbing — a single static frame with the opening copy.
- `lib/lenis.tsx` runs Lenis from Motion's frame loop (`frame.update(..., true)`), so Lenis and every motion value update in the same tick. It also handles route changes and same-page `#hash` links.

### Frames
`public/frames/frame-0001.webp … frame-0192.webp` — the 480 frames in the zip contained only 192 unique images
(each source frame was duplicated to reach 60 fps), so duplicates were dropped and the rest converted to WebP.
If you replace the footage, update `lib/frames.json` (`{"count": N}`).

## Motion spec implementation (long-scroll update)

```
components/motion/    A LineMaskReveal · B StaircaseHeadline · C ScrubParagraph · D OdometerNumber
                      E VelocityBlur · F ExpandOnScroll · G BgFlip
components/sections/  Hero(0) SelectedProjects(1) Fabrics(2) Services(3) Craft(4) Stats(5) Showreel(6)
                      Process(7) Expertise(8) Testimonials(9) Commissions(10) Clients(11) Faq(12) Booking Footer(13)
lib/lenis.tsx         Lenis provider (lerp 0.09) driven by Motion's frame loop
```

Spec section → Orhanza content: "Our Clients" → Fabrics · "Recognition" → Craft & values · "Pricing" → Commissions
(no prices are published, so rows say *priced after consultation*) · "Team" → The people we dress.
Numbers in Stats / Bento / Testimonials are counts taken from the content pack (6 services, 5 steps, 6 fabric families, 4 collections) — replace with real figures.
Design tokens live in `app/globals.css` (`@theme`). The spec's red accent is mapped to Orhanza gold (`--color-accent`); set it to `#E8283C` to use the spec red.
Typography is Plus Jakarta Sans 800 caps (`--font-display`). The Devanagari caption "बेस्पोक टेलरिङ" stands in for the spec's Japanese caption.
Pinned sections (Fabrics, Services) fall back to normal flow below 768px; `prefers-reduced-motion` disables parallax, odometer, velocity blur and scrubbing.

## Template → Orhanza mapping

| Template (Homelander) | Orhanza |
|---|---|
| Full-screen hero video + "Shop Now" | Scroll-scrubbed frame hero, "Book a Consultation" / "Explore Fabrics" |
| 2×2 editorial grid | Signature commissions (4 categories) |
| "New Arrival" 4-col grid, hover swap, quick add, badges | New Arrivals, same card behaviour; quick add → **Add to shortlist** |
| Cart drawer | Shortlist drawer (persisted in localStorage) → carried into the booking form |
| `/products-collection` + filters | `/collections` with category tabs (`?category=`) |
| Product page (size, quantity, add to cart) | `/collections/[slug]` (fit preference, shortlist, book consultation) |
| Support form + call/mail cards | Booking form (`/api/enquiry`) + Call/WhatsApp/Email/Instagram (only shown if set in env) |
| Newsletter banner | Instagram follow banner |
| Footer (pages, collections, address, socials) | Same structure |

Added from the content pack: About, Services, Process (scroll-drawn line), Fabric spotlight, Gallery (filterable masonry), Testimonials, SEO metadata + JSON-LD, sitemap, robots.

## Before launch

1. **Replace placeholder photography.** Product images in `public/images/products/` are reused from the template (they are not Orhanza garments).
2. **Replace placeholder testimonials** in `lib/data.ts`.
3. **Confirm contact details** with the business and set them in `.env.local` (nothing is invented).
4. **Wire the enquiry endpoint** (`app/api/enquiry/route.ts` currently validates and logs only).
5. Check the licence of the Homelander template before reusing its images/layout commercially.
