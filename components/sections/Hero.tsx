"use client";

/**
 * 0 — Hero. Time-based intro (nav → headline → logo block → photo → list → flickering words)
 * on top of the scroll-scrubbed frame sequence, which then plays as you scroll.
 */
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { MaskLine } from "@/components/motion";
import { useLenis } from "@/lib/lenis";
import frames from "@/lib/frames.json";

const COUNT = frames.count;
const src = (i: number) => `/frames/frame-${String(i + 1).padStart(4, "0")}.webp`;
const EASE = [0.22, 1, 0.36, 1] as const;

const Star = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={`inline-block h-[0.42em] w-[0.42em] fill-gold align-[0.45em] ${className}`} aria-hidden>
    <rect x="5" y="5" width="14" height="14" />
    <rect x="5" y="5" width="14" height="14" transform="rotate(45 12 12)" />
  </svg>
);

function Stage({ p, range, children }: { p: MotionValue<number>; range: [number, number, number, number]; children: ReactNode }) {
  const opacity = useTransform(p, range, [0, 1, 1, 0]);
  const y = useTransform(p, range, [56, 0, 0, -56]);
  const filter = useTransform(useTransform(p, range, [12, 0, 0, 12]), (b) => `blur(${b}px)`);
  const pointerEvents = useTransform(opacity, (o) => (o > 0.5 ? "auto" : "none"));
  return (
    <motion.div style={{ opacity, y, filter, pointerEvents }} className="absolute inset-x-0 bottom-0 z-20">
      {children}
    </motion.div>
  );
}

const flickerWords = ["Precision", "Elegance", "Individuality"];
const flickerSpots = [{ left: "16%", top: "30%" }, { left: "58%", top: "44%" }, { left: "28%", top: "58%" }, { left: "68%", top: "24%" }];

function Flicker({ play }: { play: boolean }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!play) return;
    const t = setInterval(() => setI((v) => v + 1), 1500);
    return () => clearInterval(t);
  }, [play]);
  if (!play) return null;
  const spot = flickerSpots[i % flickerSpots.length];
  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={i}
        style={spot}
        className="label-micro pointer-events-none absolute z-10 hidden text-ivory/80 md:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0.25, 1, 1, 0] }}
        transition={{ duration: 1.4, times: [0, 0.12, 0.2, 0.3, 0.8, 1] }}
      >
        {flickerWords[i % flickerWords.length]}
      </motion.span>
    </AnimatePresence>
  );
}

export function Hero() {
  const section = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const images = useRef<(HTMLImageElement | undefined)[]>([]);
  const current = useRef(0);
  const [loaded, setLoaded] = useState(0);
  const [ready, setReady] = useState(false);
  const lenis = useLenis();
  const reduced = useReducedMotion();

  const draw = useCallback((index: number) => {
    const c = canvas.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    const i = Math.max(0, Math.min(COUNT - 1, index));
    let img = images.current[i];
    for (let d = 1; !img && d < COUNT; d++) img = images.current[i - d] ?? images.current[i + d];
    if (!img) return;
    const s = Math.max(c.width / img.naturalWidth, c.height / img.naturalHeight);
    const w = img.naturalWidth * s;
    const h = img.naturalHeight * s;
    ctx.drawImage(img, (c.width - w) / 2, (c.height - h) / 2, w, h);
    current.current = i;
  }, []);

  useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      c.width = Math.round(c.clientWidth * dpr);
      c.height = Math.round(c.clientHeight * dpr);
      draw(current.current);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(c);
    return () => ro.disconnect();
  }, [draw]);

  // progressive preload: every 8th → 4th → 2nd → rest
  useEffect(() => {
    let cancelled = false;
    let count = 0;
    let flagged = false;
    const load = (i: number) =>
      new Promise<void>((resolve) => {
        if (images.current[i]) return resolve();
        const im = new Image();
        im.decoding = "async";
        im.onload = () => {
          images.current[i] = im;
          setLoaded(++count);
          if (!flagged && count >= Math.ceil(COUNT * 0.25)) { flagged = true; setReady(true); }
          resolve();
        };
        im.onerror = () => resolve();
        im.src = src(i);
      });
    const order: number[] = [];
    const seen = new Set<number>();
    for (const step of [8, 4, 2, 1]) for (let i = 0; i < COUNT; i += step) if (!seen.has(i)) { seen.add(i); order.push(i); }
    if (reduced) order.unshift(COUNT - 1);
    (async () => {
      await load(order[0]);
      draw(order[0]);
      let cursor = 1;
      const worker = async () => { while (!cancelled && cursor < order.length) await load(order[cursor++]); };
      await Promise.all(Array.from({ length: 6 }, worker));
    })();
    const fallback = window.setTimeout(() => setReady(true), 7000);
    return () => { cancelled = true; window.clearTimeout(fallback); };
  }, [draw, reduced]);

  useEffect(() => { if (lenis) (ready ? lenis.start() : lenis.stop()); }, [ready, lenis]);
  useEffect(() => { if (ready) draw(current.current); }, [ready, draw]);

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.3, restDelta: 0.0002 });
  const frameIndex = useTransform(p, [0.04, 1], [0, COUNT - 1]);
  useMotionValueEvent(frameIndex, "change", (v) => { if (!reduced) draw(Math.round(v)); });

  // headline scrolls up at 0.6× speed and fades/clips at the top
  const { scrollY } = useScroll();
  const headY = useTransform(scrollY, (v) => -v * 0.6);
  const headOpacity = useTransform(scrollY, [0, 380], [1, 0]);
  const introFade = useTransform(scrollY, [0, 300], [1, 0]);

  const bar = useTransform(p, [0, 1], [0, 1]);
  const cue = useTransform(p, [0, 0.04], [1, 0]);
  const pct = Math.round((loaded / COUNT) * 100);
  const t = (d: number) => ({ initial: { opacity: 0, y: 14 }, animate: ready ? { opacity: 1, y: 0 } : {}, transition: { duration: 0.9, ease: EASE, delay: d } });

  return (
    <section id="hero" ref={section} aria-label="Orhanza introduction" className={`relative bg-[#050506] ${reduced ? "h-[100svh]" : "h-[320svh]"}`}>
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        {/* photo: fades in from black, blurred + scale 1.08 → sharp at 1 */}
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.08, filter: "blur(14px)" }}
          animate={ready ? { opacity: 1, scale: 1, filter: "blur(0px)" } : {}}
          transition={{ duration: 1.6, ease: EASE, delay: reduced ? 0 : 1.8 }}
        >
          <canvas ref={canvas} role="img" aria-label="A man in a tailored navy double-breasted suit stands still while a crowd moves past him" className="h-full w-full" />
        </motion.div>
        <div className="halftone pointer-events-none absolute inset-0 z-[5]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-44 bg-gradient-to-b from-charcoal/70 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[75%] bg-gradient-to-t from-charcoal/90 via-charcoal/40 to-transparent" />

        {/* 3 — top-left identity block (logo, pill + caption, descriptor, address) */}
        <motion.div style={{ opacity: introFade }} className="absolute left-0 top-[64px] z-20 w-full">
          <div className="container-x text-ivory">
            <motion.p {...t(1.2)} className="text-[13px] font-extrabold tracking-[0.5em]">O R H A N Z A®</motion.p>
            <motion.p {...t(1.35)} className="label-micro mt-3 flex items-center gap-2 text-ivory/70">
              <span className="h-2 w-4 rounded-full bg-gold" aria-hidden /> बेस्पोक टेलरिङ
            </motion.p>
            <motion.p {...t(1.5)} className="mt-2 bg-gradient-to-r from-mute to-ivory bg-clip-text text-sm text-transparent">Bespoke Tailoring</motion.p>
            <motion.address {...t(1.65)} className="mt-3 text-[11px] not-italic leading-snug text-ivory/60">
              Jhamsikhel, Lalitpur<br />Kathmandu, Nepal<br />@orhanza.np
            </motion.address>
          </div>
        </motion.div>

        {/* 5 — top-right stacked list */}
        <motion.ul style={{ opacity: introFade }} className="absolute right-0 top-[64px] z-20 hidden pr-[clamp(20px,2.8vw,40px)] text-right text-sm text-ivory md:block" aria-label="What we make">
          {["Suits", "Shirts", "Coat-Pant", "Wedding"].map((w, i) => (
            <li key={w}><motion.span className="inline-block" {...t(2.3 + i * 0.12)}>{w}</motion.span></li>
          ))}
        </motion.ul>
        <Flicker play={ready && !reduced} />

        {/* 2 — headline, bottom-left, three masked lines */}
        <motion.div style={reduced ? undefined : { y: headY, opacity: headOpacity }} className="absolute inset-x-0 bottom-0 z-20">
          <div className="container-x pb-10 md:pb-14">
            <h1 className="h-hero text-ivory">
              <MaskLine mode="mount" play={ready} index={0} stagger={0.15} delay={0.3} className="text-gold">OUR SUITS <Star /></MaskLine>
              <MaskLine mode="mount" play={ready} index={1} stagger={0.15} delay={0.3}>JUST REFUSE</MaskLine>
              <MaskLine mode="mount" play={ready} index={2} stagger={0.15} delay={0.3}>TO BLEND IN</MaskLine>
            </h1>
          </div>
        </motion.div>

        {!reduced && (
          <>
            <Stage p={p} range={[0.3, 0.38, 0.52, 0.6]}>
              <div className="container-x pb-12 text-ivory md:pb-20">
                <p className="label-micro text-gold">01 — The Fit</p>
                <h2 className="h-section mt-4 max-w-4xl">The right suit changes how you walk into every room.</h2>
                <p className="mt-5 max-w-md text-ivory/80">Precision-tailored garments designed around your measurements, lifestyle, and personal style.</p>
              </div>
            </Stage>
            <Stage p={p} range={[0.72, 0.84, 1.2, 1.3]}>
              <div className="container-x pb-12 text-center text-ivory md:pb-20">
                <p className="label-micro text-gold">02 — Wear your confidence</p>
                <h2 className="h-section mt-4">Tailoring made personal.</h2>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <Link href="/#book" className="btn btn-light">Book a Consultation</Link>
                  <Link href="/#fabrics" className="btn btn-ghost">Explore Fabrics</Link>
                </div>
              </div>
            </Stage>
            <div className="absolute right-5 top-1/2 z-20 hidden h-40 w-px -translate-y-1/2 bg-ivory/25 md:right-8 md:block">
              <motion.div style={{ scaleY: bar }} className="h-full w-full origin-top bg-gold" />
            </div>
            <motion.div style={{ opacity: cue }} className="absolute bottom-8 right-6 z-20 hidden items-center gap-3 text-ivory/80 md:flex">
              <span className="label-micro">Scroll</span>
              <span className="relative block h-10 w-px overflow-hidden bg-ivory/30">
                <motion.span className="absolute inset-x-0 top-0 h-1/2 bg-ivory" animate={{ y: ["-100%", "200%"] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }} />
              </span>
            </motion.div>
          </>
        )}

        {/* 1 — black screen / loader */}
        <AnimatePresence>
          {!ready && (
            <motion.div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#050506] text-ivory" exit={{ opacity: 0 }} transition={{ duration: 0.8 }}>
              <p className="text-2xl font-extrabold tracking-[0.5em]">O R H A N Z A</p>
              <div className="mt-8 h-px w-48 overflow-hidden bg-ivory/20">
                <div className="h-full bg-gold transition-[width] duration-200" style={{ width: `${Math.min(100, pct * 4)}%` }} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
