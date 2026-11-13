"use client";

/**
 * 0 — Landing: the suit as a floating subject (like the moon on the Lunar reference).
 * The exact hero image (public/suit/hero.webp — suit + its black silk background) stays pinned on the stage while the page
 * scrolls: it drifts and pushes in slowly, and big headlines pass in front of it over a faint giant "ORHANZA".
 * The image's edges are feathered into the page black, so on wide screens there is no visible square.
 */
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { MaskLine } from "@/components/motion";
import { useLenis } from "@/lib/lenis";

const EASE = [0.22, 1, 0.36, 1] as const;
const BG = "#030303"; // matches the image's edge colour

const outline: CSSProperties = { WebkitTextStroke: "1.5px rgba(245,240,230,.8)", color: "transparent" };
const btn = "inline-flex items-center border border-ivory/60 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-ivory transition-colors duration-500 hover:bg-ivory hover:text-charcoal";
const display = "font-extrabold uppercase leading-[0.9] tracking-[-0.04em] text-ivory";

// feather the square image into the page: fade the four edges (intersected masks)
const feather: CSSProperties = {
  WebkitMaskImage: "linear-gradient(to right, transparent, #000 16%, #000 84%, transparent), linear-gradient(to bottom, transparent, #000 9%, #000 88%, transparent)",
  maskImage: "linear-gradient(to right, transparent, #000 16%, #000 84%, transparent), linear-gradient(to bottom, transparent, #000 9%, #000 88%, transparent)",
  WebkitMaskComposite: "source-in",
  maskComposite: "intersect",
};

/** a headline block that scrolls up through the stage in front of the suit */
function Block({ p, c, last, children }: { p: MotionValue<number>; c: number; last?: boolean; children: ReactNode }) {
  const w = 0.15;
  const y = useTransform(p, last ? [c - w, c] : [c - w, c + w], last ? ["58svh", "0svh"] : ["58svh", "-58svh"]);
  const op = useTransform(p, last ? [c - w, c - w * 0.5] : [c - w, c - w * 0.6, c + w * 0.6, c + w], last ? [0, 1] : [0, 1, 1, 0]);
  const blur = useTransform(op, (o) => `blur(${(1 - o) * 12}px)`);
  const pe = useTransform(op, (o) => (o > 0.6 ? "auto" : "none"));
  return (
    <motion.div style={{ y, opacity: op, filter: blur }} className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-6 text-center">
      <motion.div style={{ pointerEvents: pe }}>{children}</motion.div>
    </motion.div>
  );
}

export function SuitStory() {
  const section = useRef<HTMLElement>(null);
  const img = useRef<HTMLImageElement>(null);
  const [ready, setReady] = useState(false);
  const lenis = useLenis();
  const reduced = useReducedMotion();

  useEffect(() => {
    if (img.current?.complete) setReady(true);
    const fallback = window.setTimeout(() => setReady(true), 5000);
    return () => window.clearTimeout(fallback);
  }, []);
  useEffect(() => { if (lenis) (ready ? lenis.start() : lenis.stop()); }, [ready, lenis]);

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.3, restDelta: 0.0002 });

  // the subject follows the scroll: pinned, drifting down and pushing in slowly
  const suitY = useTransform(p, [0, 1], ["0svh", "7svh"]);
  const suitScale = useTransform(p, [0, 0.5, 1], [1, 1.12, 1.3]);
  const ghostY = useTransform(p, [0, 1], ["0svh", "-22svh"]);
  const rail = useTransform(p, [0, 1], [0, 1]);
  const cue = useTransform(p, [0, 0.04], [1, 0]);
  const heroY = useTransform(p, [0, 0.17], ["0svh", "-62svh"]);
  const heroOp = useTransform(p, [0.07, 0.15], [1, 0]);
  const heroBlur = useTransform(heroOp, (o) => `blur(${(1 - o) * 12}px)`);
  const fade = (d: number) => ({ initial: { opacity: 0, y: 14 }, animate: ready ? { opacity: 1, y: 0 } : {}, transition: { duration: 0.9, ease: EASE, delay: d } });

  return (
    <section id="hero" ref={section} aria-label="Orhanza introduction" style={{ background: BG }} className={`relative ${reduced ? "h-[100svh]" : "h-[520svh]"}`}>
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        {/* the subject: exact image, square, centred; on phones the sides are cropped (the suit stays in view) */}
        <motion.div
          style={reduced ? undefined : { y: suitY, scale: suitScale, transformOrigin: "50% 38%" }}
          className="absolute left-1/2 top-0 z-10 h-[100svh] w-[100svh] -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : {}}
          transition={{ duration: 1.4, ease: EASE, delay: 0.2 }}
        >
          <img ref={img} src="/suit/hero.webp" alt="A charcoal textured suit with gold zig-zag embroidery and black oxford shoes on a black silk background" width={1024} height={1024} decoding="async" fetchPriority="high" onLoad={() => setReady(true)} draggable={false} className="h-full w-full select-none object-cover" style={feather} />
        </motion.div>

        {/* giant ghost word (over the image at low contrast — the suit is not a cut-out) */}
        {!reduced && (
          <motion.div aria-hidden style={{ y: ghostY }} className="pointer-events-none absolute inset-x-0 top-[18%] z-[11] select-none whitespace-nowrap text-center text-[26vw] font-extrabold leading-none tracking-[-0.05em] text-ivory/[0.045] mix-blend-overlay">
            ORHANZA
          </motion.div>
        )}

        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-[12] h-40 bg-gradient-to-b from-charcoal/80 to-transparent" />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-[12] h-28 bg-gradient-to-t from-[#030303] to-transparent" />

        {/* 1 — welcome */}
        <motion.div style={reduced ? undefined : { y: heroY, opacity: heroOp, filter: heroBlur }} className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center">
          <h1 className={`${display} text-[clamp(2.8rem,9.5vw,9.5rem)]`}>
            <MaskLine mode="mount" play={ready} index={0} stagger={0.15} delay={0.5}>Welcome to</MaskLine>
            <MaskLine mode="mount" play={ready} index={1} stagger={0.15} delay={0.5}><span style={outline}>Orhanza</span></MaskLine>
          </h1>
          <motion.p {...fade(1.5)} className="label-micro mt-5 text-gold">Made to measure</motion.p>
          <motion.div {...fade(1.7)} className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/custom-made" className={btn}>Start customising</Link>
            <Link href="/#book" className={btn}>Book a consultation</Link>
          </motion.div>
        </motion.div>

        {!reduced && (
          <>
            {/* placeholder copy and numbers — replace with real facts */}
            <Block p={p} c={0.27}>
              <h2 className={`${display} text-[clamp(2.2rem,6.6vw,6.6rem)]`}>Cut once,<br />made for you.</h2>
            </Block>
            <Block p={p} c={0.48}>
              <h2 className={`${display} text-[clamp(2.2rem,6.6vw,6.6rem)]`}>Pure wool.<br /><span style={outline}>Cut by hand.</span></h2>
            </Block>
            <Block p={p} c={0.7}>
              <h2 className={`${display} text-[clamp(2.2rem,6.6vw,6.6rem)]`}><span style={outline}>42 hours</span><br />in one jacket.</h2>
            </Block>
            <Block p={p} c={0.9} last>
              <h2 className={`${display} text-[clamp(2.4rem,7.4vw,7.4rem)]`}>Wear it out.</h2>
              <p className="mx-auto mt-4 max-w-sm text-sm text-ivory/60">Choose your cloth, see it on the model, and we cut it to you.</p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <Link href="/custom-made" className={btn}>Start customising</Link>
                <Link href="/#book" className={btn}>Book a fitting</Link>
              </div>
            </Block>

            <motion.div style={{ opacity: cue }} className="pointer-events-none absolute inset-x-0 bottom-3 z-20 flex flex-col items-center gap-2 text-ivory/80 md:bottom-6">
              <span className="label-micro hidden md:block">Scroll down</span>
              <span className="relative block h-8 w-px overflow-hidden bg-ivory/30 md:h-11">
                <motion.span className="absolute inset-x-0 top-0 h-1/2 bg-ivory" animate={{ y: ["-100%", "200%"] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }} />
              </span>
            </motion.div>
            <div aria-hidden className="pointer-events-none absolute right-4 top-[20%] z-20 hidden h-[60%] w-px bg-ivory/15 md:block">
              <motion.span style={{ scaleY: rail }} className="block h-full w-px origin-top bg-gold" />
            </div>
          </>
        )}

        <AnimatePresence>
          {!ready && (
            <motion.div className="absolute inset-0 z-30 flex items-center justify-center text-ivory" style={{ background: BG }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}>
              <p className="text-2xl font-extrabold tracking-[0.5em]">O R H A N Z A</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
