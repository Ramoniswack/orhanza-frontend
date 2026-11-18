"use client";

/**
 * Home — Selected pieces. A pinned, scroll-driven horizontal card slider.
 * The tall outer section pins a 100svh viewport; vertical scroll is converted into a right-to-left translate3d of the card track,
 * and the pin only releases once the last card is fully in view (outer height = 100svh + the track's overflow, measured live).
 * Each card has a quick-add drawer (size picker + CTA); only one drawer is open at a time.
 *
 * PLACEHOLDERS: prices (PRICE) and sizes/availability (sizesFor) below are sample data — replace with real values.
 */
import { motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import { LineMaskReveal } from "@/components/motion";
import { useShortlist } from "@/components/ShortlistProvider";
import { useLenis } from "@/lib/lenis";
import { shopProducts, type ShopProduct } from "@/lib/shop";

const FEATURED_IDS = [1, 2, 5, 6, 9, 11, 12, 13]; // look ids shown in the slider
const PRICE: Record<number, number> = { 1: 62000, 2: 74500, 5: 58000, 6: 49500, 9: 46000, 11: 52500, 12: 48000, 13: 68000 }; // placeholder, NPR
const CTA_LABEL = "Add to cart"; // the site is shortlist-based: this adds the piece to the shortlist
const EASE = [0.22, 1, 0.36, 1] as const;

const MEN_SIZES = ["44", "46", "48", "50", "52", "54", "56", "58", "60"];
const WOMEN_SIZES = ["XXS", "XS", "S", "M", "L", "XL", "XXL"];
const sizesFor = (p: ShopProduct) =>
  (p.gender === "men" ? MEN_SIZES : WOMEN_SIZES).map((label, i) => ({ label, available: (p.id + i * 2) % 5 !== 0 })); // placeholder availability

/** the pinned scroll-driven slider is desktop only; phones get a plain swipeable row */
const DESKTOP_QUERY = "(min-width: 768px)";
function useIsDesktop() {
  return useSyncExternalStore(
    (cb) => { const m = window.matchMedia(DESKTOP_QUERY); m.addEventListener("change", cb); return () => m.removeEventListener("change", cb); },
    () => window.matchMedia(DESKTOP_QUERY).matches,
    () => false,
  );
}

const rs = (n: number) => `Rs. ${n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;

// ~4 cards on desktop, 2 on tablet, 1.2 on phones; also capped by viewport height so card + info + footer always fit
const CARD_W = "max(200px, min(calc((100vw - 2 * var(--pad) - (var(--n) - 1) * var(--gap)) / var(--n)), calc((100svh - 300px) * 0.75)))";

function PlusMinus({ open }: { open: boolean }) {
  return (
    <motion.span aria-hidden className="relative block h-[18px] w-[18px]" animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.5, ease: EASE }}>
      <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current" />
      <motion.span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current" animate={{ rotate: open ? 90 : 0 }} transition={{ duration: 0.5, ease: EASE }} />
    </motion.span>
  );
}

function Card({ product, open, onToggle, onClose, priority }: { product: ShopProduct; open: boolean; onToggle: () => void; onClose: () => void; priority: boolean }) {
  const { has, toggle, show } = useShortlist();
  const [size, setSize] = useState<string | null>(null);
  const [hint, setHint] = useState(false);
  const [added, setAdded] = useState(false);
  const sizes = sizesFor(product);
  const href = `/shop/${product.slug}`;

  // forget the choice shortly after the drawer has slid away
  useEffect(() => {
    if (open) return;
    const t = window.setTimeout(() => { setSize(null); setHint(false); setAdded(false); }, 700);
    return () => window.clearTimeout(t);
  }, [open]);

  const add = () => {
    if (!size) { setHint(true); return; }
    if (!has(product.key)) toggle(product.key);
    setAdded(true);
    show();
    onClose();
  };

  return (
    <article className="shrink-0 snap-start text-[#1A1A1A]" style={{ width: CARD_W }}>
      <div className="group relative aspect-[3/4] overflow-hidden bg-[#F4F4F4]">
        <Image src={product.image} alt={`${product.name} — made to measure by Orhanza`} fill priority={priority} sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 85vw" className="object-contain p-[7%] transition-opacity duration-700 ease-out group-hover:opacity-0" />
        <Image src={product.flat} alt="" fill sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 85vw" className="object-contain p-[12%] opacity-0 transition-opacity duration-700 ease-out group-hover:opacity-100" />
        <Link href={href} aria-label={product.name} className="absolute inset-0 z-10" />

        {/* quick-add drawer */}
        <motion.div
          initial={false}
          animate={{ y: open ? "0%" : "101%" }}
          transition={{ duration: 0.65, ease: EASE }}
          inert={!open}
          aria-hidden={!open}
          className="absolute inset-x-0 bottom-0 z-20 flex h-[46%] flex-col justify-between bg-white px-4 pb-4 pt-4 md:px-5 md:pb-5"
        >
          <div>
            <p className={`text-[13px] transition-colors duration-300 ${hint && !size ? "text-[#9B2C2C]" : "text-[#333333]"}`}>{hint && !size ? "Please select a size" : "Available sizes"}</p>
            <div role="radiogroup" aria-label="Available sizes" className="mt-3 grid grid-cols-5 gap-1">
              {sizes.map((s) => (
                <button
                  key={s.label}
                  type="button"
                  role="radio"
                  aria-checked={size === s.label}
                  disabled={!s.available}
                  onClick={() => { setSize(s.label); setHint(false); }}
                  className={`h-8 border text-[13px] transition-colors duration-300 ${
                    !s.available ? "cursor-not-allowed border-transparent text-[#BDBDBD] line-through" : size === s.label ? "border-[#1A1A1A] bg-[#1A1A1A] text-white" : "border-transparent text-[#333333] hover:border-black/30"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
          <button type="button" onClick={add} className="h-11 w-full bg-[#1C1C1C] text-[11px] font-medium uppercase tracking-[0.2em] text-white transition-colors duration-300 hover:bg-black">
            {added ? "Added" : CTA_LABEL}
          </button>
        </motion.div>
      </div>

      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Link href={href} className="block text-[15px] leading-snug text-[#1A1A1A] hover:underline">{product.name}</Link>
          <p className="mt-1 text-[13px] text-[#666666]">{rs(PRICE[product.id] ?? 45000)}</p>
        </div>
        <button type="button" onClick={onToggle} aria-expanded={open} aria-label={open ? `Close quick add for ${product.name}` : `Quick add ${product.name}`} className="-mr-2 -mt-1.5 grid h-9 w-9 shrink-0 place-items-center text-[#1A1A1A] transition-opacity hover:opacity-60">
          <PlusMinus open={open} />
        </button>
      </div>
    </article>
  );
}

function Chevron({ dir }: { dir: 1 | -1 }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="square" aria-hidden>
      <path d={dir === 1 ? "M9 5l7 7-7 7" : "M15 5l-7 7 7 7"} />
    </svg>
  );
}

export function SelectedPieces() {
  const reducedMotion = !!useReducedMotion();
  const isDesktop = useIsDesktop();
  const reduce = reducedMotion || !isDesktop; // true → no pin / no scroll transition, native swipe row
  const lenis = useLenis();
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const dist = useMotionValue(0);
  const [distPx, setDistPx] = useState(0);
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [edge, setEdge] = useState({ start: true, end: false });
  const products = FEATURED_IDS.map((id) => shopProducts.find((p) => p.id === id)).filter((p): p is ShopProduct => !!p);

  // pinned progress: 0 when the section hits the top, 1 when the last card is fully in view
  const { scrollYProgress: p } = useScroll({ target: section, offset: ["start start", "end end"] });
  const x = useTransform([p, dist], ([a, d]: number[]) => -a * d);
  const transform = useTransform(x, (v) => `translate3d(${v}px,0,0)`);
  useMotionValueEvent(p, "change", (v) => {
    if (reduce) return;
    const next = { start: v < 0.004, end: v > 0.996 };
    setEdge((cur) => (cur.start === next.start && cur.end === next.end ? cur : next));
  });

  useEffect(() => {
    const measure = () => {
      const t = track.current;
      if (!t) return;
      const d = Math.max(0, t.offsetWidth - window.innerWidth);
      dist.set(d);
      setDistPx(d);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    window.addEventListener("resize", measure);
    return () => { ro.disconnect(); window.removeEventListener("resize", measure); };
  }, [dist]);

  useEffect(() => {
    if (!openKey) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpenKey(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openKey]);

  // native swipe row: keep the arrow states in sync with the row's own scroll position
  const onRowScroll = useCallback(() => {
    const el = scroller.current;
    if (!el || !reduce) return;
    const next = { start: el.scrollLeft < 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 };
    setEdge((cur) => (cur.start === next.start && cur.end === next.end ? cur : next));
  }, [reduce]);
  useEffect(() => { if (reduce) onRowScroll(); else setEdge({ start: true, end: false }); }, [reduce, onRowScroll]);

  const go = useCallback((dir: 1 | -1) => {
    const kids = track.current?.children;
    if (!kids || kids.length < 2) return;
    const step = (kids[1] as HTMLElement).offsetLeft - (kids[0] as HTMLElement).offsetLeft;
    if (reduce) { scroller.current?.scrollBy({ left: dir * step, behavior: "smooth" }); return; }
    const d = dist.get();
    const target = Math.min(d, Math.max(0, (Math.round((p.get() * d) / step) + dir) * step));
    const y = (section.current?.getBoundingClientRect().top ?? 0) + window.scrollY + target; // 1px of scroll = 1px of travel
    if (lenis) lenis.scrollTo(y, { duration: 1.2 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  }, [dist, lenis, p, reduce]);

  return (
    <section
      ref={section}
      id="selected-pieces"
      aria-labelledby="sp-h"
      className="relative bg-white [--n:1.2] sm:[--n:2] lg:[--n:4]"
      style={{ "--pad": "clamp(20px, 2.8vw, 40px)", "--gap": "clamp(12px, 1.4vw, 24px)", height: reduce ? undefined : `calc(100svh + ${distPx}px)` } as CSSProperties}
    >
      <div className={reduce ? "py-8 md:py-16" : "sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden pb-6 pt-[76px]"}>
        <div className="flex items-end justify-between" style={{ paddingInline: "var(--pad)" }}>
          <h2 id="sp-h" className="t-h2 !text-[clamp(1.75rem,3vw,2.75rem)]">
            <LineMaskReveal lines={["Selected pieces"]} />
          </h2>
          <div className="flex items-center gap-1 text-[#1A1A1A]">
            {([-1, 1] as const).map((d) => (
              <button key={d} type="button" onClick={() => go(d)} disabled={d === -1 ? edge.start : edge.end} aria-label={d === -1 ? "Previous pieces" : "Next pieces"} className="grid h-10 w-10 place-items-center transition-opacity hover:opacity-60 disabled:opacity-25 disabled:hover:opacity-25">
                <Chevron dir={d} />
              </button>
            ))}
          </div>
        </div>

        <div ref={scroller} onScroll={onRowScroll} className={`mt-4 md:mt-7 ${reduce ? "no-scrollbar snap-x snap-mandatory overflow-x-auto overscroll-x-contain" : ""}`} style={reduce ? { scrollPaddingInline: "var(--pad)" } : undefined}>
          <motion.div ref={track} className="flex w-max items-start will-change-transform" style={{ gap: "var(--gap)", paddingInline: "var(--pad)", transform: reduce ? undefined : transform }}>
            {products.map((pr, i) => (
              <Card key={pr.key} product={pr} priority={i < 4} open={openKey === pr.key} onToggle={() => setOpenKey((k) => (k === pr.key ? null : pr.key))} onClose={() => setOpenKey(null)} />
            ))}
          </motion.div>
        </div>

        <div className="mt-5 text-center md:mt-9">
          <Link href="/shop" className="inline-block border-b border-transparent pb-1 text-[11px] font-medium uppercase tracking-[0.15em] text-[#1A1A1A] transition-colors duration-300 hover:border-[#1A1A1A] md:text-xs">
            Discover more
          </Link>
        </div>
      </div>
    </section>
  );
}
