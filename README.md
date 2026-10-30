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

## How the hero works (`components/HeroScroll.tsx`)

- `HeroScroll` is a 560svh section containing a `sticky` 100svh viewport.
- `useScroll({ target, offset: ["start start","end end"] })` → `useSpring` → `useTransform` maps progress to a frame index (0–191).
- Frames are drawn to a `<canvas>` (cover-fit, DPR capped at 2). Frames preload progressively
  (every 8th → 4th → 2nd → rest); scrolling is held (`lenis.stop()`) until ~25 % is ready, with a branded loader.
- Four scroll-linked text stages (`Stage`) fade/slide/unblur over the footage; stage 1 plays a word-mask reveal on load.
- `prefers-reduced-motion`: no scrubbing — a single static frame with the opening copy.
- `components/SmoothScroll.tsx` runs Lenis from Motion's frame loop (`frame.update(..., true)`), so Lenis and every motion value update in the same tick. It also handles route changes and same-page `#hash` links.

### Frames
`public/frames/frame-0001.webp … frame-0192.webp` — the 480 frames in the zip contained only 192 unique images
(each source frame was duplicated to reach 60 fps), so duplicates were dropped and the rest converted to WebP.
If you replace the footage, update `lib/frames.json` (`{"count": N}`).

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
