"use client";

/**
 * 0 — Landing: the suit as a floating subject (like the moon on the Lunar reference).
 * The exact hero image (public/suit/hero.webp — suit + its black silk background) stays pinned on the stage while the page
 * scrolls: it drifts and pushes in slowly, and big headlines pass in front of it over a faint giant "ORHANZA".
 * The image's edges are feathered into the page black, so on wide screens there is no visible square.
 *
 * The suit never leaves the middle of the stage. After the short headlines the stage turns into a starfield (three layers drifting at
 * different speeds, like the moon reference) and the selected commissions float up through it: grey half-body figures at different
 * depths — near ones large, sharp and fast, far ones small, soft and slow — rising straight up, no sway or tilt.
 */
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { MaskLine } from "@/components/motion";
import { useLenis } from "@/lib/lenis";
import { looks } from "@/lib/lookbook-data";

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
  const w = 0.06;
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


/** deterministic starfield (same on server and client): x, y in %, size px, opacity, layer 0 (far) – 2 (near) */
const STARS = (() => {
  let seed = 7;
  const r = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  return Array.from({ length: 110 }, (_, i) => ({ x: r() * 100, y: r() * 100, s: 1 + r() * 1.6, o: 0.25 + r() * 0.65, g: i % 3 }));
})();
const STAR_SHIFT = [-30, -60, -110]; // svh travelled over the whole scroll, per layer

function Stars({ p }: { p: MotionValue<number> }) {
  const y0 = useTransform(p, [0, 1], ["0svh", `${STAR_SHIFT[0]}svh`]);
  const y1 = useTransform(p, [0, 1], ["0svh", `${STAR_SHIFT[1]}svh`]);
  const y2 = useTransform(p, [0, 1], ["0svh", `${STAR_SHIFT[2]}svh`]);
  const ys = [y0, y1, y2];
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-[13] overflow-hidden">
      {ys.map((y, g) => (
        <motion.div key={g} style={{ y }} className="absolute inset-x-0 top-0 h-[230svh]">
          {STARS.filter((st) => st.g === g).map((st, i) => (
            <span key={i} className="absolute rounded-full bg-white" style={{ left: `${st.x}%`, top: `${st.y}%`, width: st.s + g * 0.3, height: st.s + g * 0.3, opacity: st.o }} />
          ))}
        </motion.div>
      ))}
      {/* one thin streak now and then, as in the reference */}
      <motion.span
        className="absolute left-[54%] top-0 h-24 w-px bg-gradient-to-b from-transparent via-white/70 to-transparent"
        initial={{ y: "-12svh", opacity: 0 }}
        animate={{ y: ["-12svh", "45svh"], opacity: [0, 0.8, 0] }}
        transition={{ duration: 1.8, ease: "easeIn", repeat: Infinity, repeatDelay: 7 }}
      />
    </div>
  );
}

/** Selected commissions float up through the stage. h = figure height (svh), x = left edge (%), d = depth 0.5 (far) – 1 (near). */
const FLOAT = [
  { id: 6,  x: 6,  h: 62, s: 0.56, e: 0.71, d: 1,    rot: 2 },
  { id: 7,  x: 70, h: 58, s: 0.59, e: 0.75, d: 0.95, rot: -2 },
  { id: 3,  x: 22, h: 38, s: 0.6,  e: 0.8,  d: 0.55, rot: 3 },
  { id: 12, x: 80, h: 36, s: 0.64, e: 0.84, d: 0.5,  rot: -3 },
  { id: 5,  x: 8,  h: 60, s: 0.7,  e: 0.85, d: 0.9,  rot: -2 },
  { id: 9,  x: 67, h: 64, s: 0.74, e: 0.89, d: 1,    rot: 2 },
  { id: 1,  x: 25, h: 34, s: 0.76, e: 0.95, d: 0.5,  rot: 3 },
  { id: 4,  x: 77, h: 54, s: 0.8,  e: 0.95, d: 0.85, rot: -2 },
] as const;

function Floating({ p, cfg }: { p: MotionValue<number>; cfg: (typeof FLOAT)[number] }) {
  const look = looks[cfg.id - 1];
  const y = useTransform(p, [cfg.s, cfg.e], ["112svh", `-${cfg.h + 14}svh`]);
  const op = useTransform(p, [cfg.s, cfg.s + 0.02, cfg.e - 0.02, cfg.e], [0, 1, 1, 0]);
  const pe = useTransform(op, (o) => (o > 0.5 && cfg.d > 0.7 ? "auto" : "none"));
  const near = cfg.d > 0.7;
  const xm = cfg.x > 50 ? 58 : Math.min(cfg.x, 30);
  return (
    <motion.div
      style={{ y, opacity: op, pointerEvents: pe, filter: `blur(${((1 - cfg.d) * 5).toFixed(1)}px) brightness(${(0.7 + cfg.d * 0.3).toFixed(2)})`, "--h": `${cfg.h}svh`, "--x": `${cfg.x}%`, "--xm": `${xm}%` } as never}
      className="absolute top-0 left-[var(--xm)] z-[15] h-[calc(var(--h)*0.72)] md:left-[var(--x)] md:h-[var(--h)]"
    >
      <Link href="/collections" tabIndex={near ? 0 : -1} aria-hidden={!near} aria-label={`${look.name} — view collection`} className="group block h-full">
        <img
          src={`/lookbook/${look.model}`}
          alt=""
          width={look.trimModel.w}
          height={look.trimModel.h}
          loading="lazy"
          decoding="async"
          draggable={false}
          className="block h-full w-auto max-w-none select-none grayscale contrast-[1.08]"
          style={{ WebkitMaskImage: "linear-gradient(to bottom, #000 52%, transparent 90%)", maskImage: "linear-gradient(to bottom, #000 52%, transparent 90%)" }}
        />
        {near && <span className="absolute -bottom-1 left-0 block max-w-40 text-xs font-semibold leading-snug tracking-[-0.02em] text-ivory md:text-sm">{look.name}</span>}
      </Link>
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
  const suitY = useTransform(p, [0, 1], ["0svh", "3svh"]);
  const suitScale = useTransform(p, [0, 0.45, 1], [1, 1.1, 1.03]);
  const suitOp = useTransform(p, [0.5, 0.62], [1, 0.85]);
  const ghostY = useTransform(p, [0, 1], ["0svh", "-30svh"]);
  const rail = useTransform(p, [0, 1], [0, 1]);
  const cue = useTransform(p, [0, 0.025], [1, 0]);
  const heroY = useTransform(p, [0, 0.07], ["0svh", "-62svh"]);
  const heroOp = useTransform(p, [0.03, 0.065], [1, 0]);
  const heroBlur = useTransform(heroOp, (o) => `blur(${(1 - o) * 12}px)`);
  const fade = (d: number) => ({ initial: { opacity: 0, y: 14 }, animate: ready ? { opacity: 1, y: 0 } : {}, transition: { duration: 0.9, ease: EASE, delay: d } });

  return (
    <section id="hero" ref={section} aria-label="Orhanza introduction" style={{ background: BG }} className={`relative ${reduced ? "h-[100svh]" : "h-[560svh] md:h-[660svh]"}`}>
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        {/* the subject: exact image, square, centred; on phones the sides are cropped (the suit stays in view) */}
        <motion.div
          style={reduced ? undefined : { y: suitY, scale: suitScale, opacity: suitOp, transformOrigin: "50% 38%" }}
          className="absolute left-1/2 top-0 z-10 h-[100svh] w-[100svh] -translate-x-1/2"
        >
          <motion.img
            initial={{ opacity: 0 }}
            animate={ready ? { opacity: 1 } : {}}
            transition={{ duration: 1.4, ease: EASE, delay: 0.2 }}
            ref={img}
            src="/suit/hero.webp" alt="A charcoal textured suit with gold zig-zag embroidery and black oxford shoes on a black silk background" width={1024} height={1024} decoding="async" fetchPriority="high" onLoad={() => setReady(true)} draggable={false} className="h-full w-full select-none object-cover" style={feather} />
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
            <MaskLine mode="mount" play={ready} index={0} stagger={0.15} delay={0.5}><span style={outline}>Orhanza</span></MaskLine>
          </h1>
          <motion.p {...fade(1.3)} className="label-micro mt-5 text-gold">Tailoring made personal</motion.p>
          <motion.div {...fade(1.5)} className="mt-8 flex justify-center">
            <Link href="/custom-made" className={btn}>Start customising</Link>
          </motion.div>
        </motion.div>

        {!reduced && (
          <>
            <Block p={p} c={0.14}>
              <h2 className={`${display} text-[clamp(2.2rem,6.6vw,6.6rem)]`}>Tailored to<br />your life.</h2>
            </Block>
            <Block p={p} c={0.24}>
              <h2 className={`${display} text-[clamp(2.2rem,6.6vw,6.6rem)]`}><span style={outline}>Made</span> to move<br />with you.</h2>
            </Block>

            {/* selected commissions: starfield + figures floating up through it, the suit stays put */}
            <Stars p={p} />
            <Block p={p} c={0.53}>
              <h2 className={`${display} text-[clamp(2.2rem,6.6vw,6.6rem)]`}>Selected<br /><span style={outline}>commissions</span></h2>
            </Block>
            {FLOAT.map((cfg) => <Floating key={cfg.id} p={p} cfg={cfg} />)}
            <Block p={p} c={0.99} last>
              <Link href="/collections" className="group inline-block">
                <span className={`${display} block text-[clamp(2.2rem,6.6vw,6.6rem)]`}>More <span style={outline}>commissions</span></span>
                <span aria-hidden className="mt-5 block h-px origin-left scale-x-50 bg-ivory transition-transform duration-[1200ms] group-hover:scale-x-100" />
              </Link>
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
