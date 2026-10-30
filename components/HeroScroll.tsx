"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import frames from "@/lib/frames.json";
import { useLenis } from "./SmoothScroll";

const COUNT = frames.count; // 192 unique frames (the 60fps export duplicated each source frame)
const src = (i: number) => `/frames/frame-${String(i + 1).padStart(4, "0")}.webp`;
const EASE = [0.76, 0, 0.24, 1] as const;

/** A scroll-linked stage: fades/slides/unblurs in, holds, then leaves. */
function Stage({
  p,
  range,
  className = "",
  children,
}: {
  p: MotionValue<number>;
  range: [number, number, number, number];
  className?: string;
  children: ReactNode;
}) {
  const opacity = useTransform(p, range, [0, 1, 1, 0]);
  const y = useTransform(p, range, [56, 0, 0, -56]);
  const blur = useTransform(p, range, [12, 0, 0, 12]);
  const filter = useTransform(blur, (b) => `blur(${b}px)`);
  const pointerEvents = useTransform(opacity, (o) => (o > 0.5 ? "auto" : "none"));
  return (
    <motion.div style={{ opacity, y, filter, pointerEvents }} className={`absolute inset-x-0 z-20 ${className}`}>
      {children}
    </motion.div>
  );
}

/** Word-by-word masked reveal used for the opening headline. */
function Words({ text, play, delay = 0 }: { text: string; play: boolean; delay?: number }) {
  return (
    <>
      {text.split(" ").map((w, i) => (
        <span key={i} className="mr-[0.22em] inline-block overflow-hidden pb-[0.08em] align-bottom">
          <motion.span
            className="inline-block"
            initial={{ y: "110%" }}
            animate={play ? { y: "0%" } : { y: "110%" }}
            transition={{ duration: 1, ease: EASE, delay: delay + i * 0.09 }}
          >
            {w}
          </motion.span>
        </span>
      ))}
    </>
  );
}

export function HeroScroll() {
  const section = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const images = useRef<(HTMLImageElement | undefined)[]>([]);
  const current = useRef(0);
  const [loaded, setLoaded] = useState(0);
  const [ready, setReady] = useState(false);
  const lenis = useLenis();
  const reduced = useReducedMotion();

  /* ── canvas drawing: "cover" fit, nearest-loaded-frame fallback ── */
  const draw = useCallback((index: number) => {
    const c = canvas.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    const i = Math.max(0, Math.min(COUNT - 1, index));
    let img = images.current[i];
    for (let d = 1; !img && d < COUNT; d++) img = images.current[i - d] ?? images.current[i + d];
    if (!img) return;
    const scale = Math.max(c.width / img.naturalWidth, c.height / img.naturalHeight);
    const w = img.naturalWidth * scale;
    const h = img.naturalHeight * scale;
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

  /* ── progressive preload: coarse pass (every 8th, then 4th) → fill in the rest ── */
  useEffect(() => {
    let cancelled = false;
    let count = 0;
    let flagged = false;
    const target = reduced ? COUNT - 1 : 0;

    const load = (i: number) =>
      new Promise<void>((resolve) => {
        if (images.current[i]) return resolve();
        const im = new Image();
        im.decoding = "async";
        im.onload = () => {
          images.current[i] = im;
          count++;
          setLoaded(count);
          if (!flagged && count >= Math.ceil(COUNT * 0.25)) {
            flagged = true;
            setReady(true);
          }
          resolve();
        };
        im.onerror = () => resolve();
        im.src = src(i);
      });

    const order: number[] = [];
    const seen = new Set<number>();
    for (const step of [8, 4, 2, 1]) for (let i = 0; i < COUNT; i += step) if (!seen.has(i)) (seen.add(i), order.push(i));
    if (reduced) order.unshift(target);

    (async () => {
      await load(order[0]);
      draw(order[0]);
      let cursor = 1;
      const worker = async () => {
        while (!cancelled && cursor < order.length) await load(order[cursor++]);
      };
      await Promise.all(Array.from({ length: 6 }, worker));
    })();

    const fallback = window.setTimeout(() => setReady(true), 7000); // never trap the visitor behind the loader
    return () => {
      cancelled = true;
      window.clearTimeout(fallback);
    };
  }, [draw, reduced]);

  // Hold scroll until the first pass has loaded.
  useEffect(() => {
    if (!lenis) return;
    ready ? lenis.start() : lenis.stop();
  }, [ready, lenis]);
  useEffect(() => {
    if (ready) draw(current.current);
  }, [ready, draw]);

  /* ── scroll → frame ── */
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.3, restDelta: 0.0002 });
  const frameIndex = useTransform(p, [0, 1], [0, COUNT - 1]);
  useMotionValueEvent(frameIndex, "change", (v) => !reduced && draw(Math.round(v)));

  const barScale = useTransform(p, [0, 1], [0, 1]);
  const cueOpacity = useTransform(p, [0, 0.05], [1, 0]);
  const pct = Math.round((loaded / COUNT) * 100);

  return (
    <section
      id="hero"
      ref={section}
      aria-label="Orhanza introduction"
      className={`relative ${reduced ? "h-[100svh]" : "h-[560svh]"}`}
    >
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden bg-[#dadada]">
        <canvas
          ref={canvas}
          role="img"
          aria-label="A man in a tailored navy double-breasted suit stands still while a crowd moves past him"
          className="absolute inset-0 h-full w-full grayscale"
        />

        {/* legibility gradients (the template uses a flat dark overlay on its hero video) */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-40 bg-gradient-to-b from-[#111]/55 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[75%] bg-gradient-to-t from-[#111]/85 via-[#111]/35 to-transparent" />

        {/* ─ Stage 1 — opening ─ */}
        <Stage p={p} range={reduced ? [-3, -2, 2, 3] : [-0.3, -0.2, 0.15, 0.26]} className="bottom-0">
          <div className="container-x pb-12 text-center text-[#111] md:pb-20">
            <motion.p
              className="eyebrow"
              initial={{ opacity: 0, y: 14 }}
              animate={ready ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
            >
              Bespoke tailoring · Nepal
            </motion.p>
            <h1 className="h-hero mt-4">
              <Words text="Wear Your Confidence" play={ready} delay={0.25} />
            </h1>
            <motion.p
              className="mx-auto mt-5 max-w-xl text-body text-[#111]/85"
              initial={{ opacity: 0, y: 16 }}
              animate={ready ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, ease: EASE, delay: 0.8 }}
            >
              Premium made-to-measure suits and shirts, tailored in Nepal for men who value fit, fabric, and individuality.
            </motion.p>
            <motion.div
              className="mt-8 flex flex-wrap justify-center gap-3"
              initial={{ opacity: 0, y: 16 }}
              animate={ready ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, ease: EASE, delay: 1 }}
            >
              <Link href="/#book" className="btn btn-light">Book a Consultation</Link>
              <Link href="/#fabrics" className="btn btn-ghost">Explore Fabrics</Link>
            </motion.div>
          </div>
        </Stage>

        {!reduced && (
          <>
            {/* ─ Stage 2 — the fit ─ */}
            <Stage p={p} range={[0.27, 0.34, 0.5, 0.58]} className="bottom-0">
              <div className="container-x pb-14 text-[#111] md:pb-24">
                <p className="eyebrow text-[#6f6f6f]">01 — The Fit</p>
                <h2 className="h-section mt-4 max-w-3xl">
                  The right suit changes how you walk into every room.
                </h2>
                <p className="mt-5 max-w-md text-body text-[#111]/80">
                  Orhanza creates precision-tailored garments designed around your measurements, lifestyle, and personal style.
                </p>
              </div>
            </Stage>

            {/* ─ Stage 3 — the cloth ─ */}
            <Stage p={p} range={[0.55, 0.62, 0.76, 0.84]} className="bottom-0">
              <div className="container-x flex flex-col items-end pb-14 text-right text-[#111] md:pb-24">
                <p className="eyebrow text-[#6f6f6f]">02 — The Cloth</p>
                <h2 className="h-section mt-4 max-w-3xl">Fabrics with character.</h2>
                <p className="mt-5 max-w-md text-body text-[#111]/80">
                  From wool to wool-linen and linen — cloth chosen for the season, the occasion, and the way you live.
                </p>
              </div>
            </Stage>

            {/* ─ Stage 4 — the commission (stays) ─ */}
            <Stage p={p} range={[0.82, 0.9, 1.2, 1.3]} className="bottom-0">
              <div className="container-x pb-12 text-center text-[#111] md:pb-20">
                <p className="eyebrow text-[#6f6f6f]">03 — The Commission</p>
                <h2 className="h-page mt-4">Tailoring made personal.</h2>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <Link href="/#book" className="btn btn-light">Book Your Tailoring Consultation</Link>
                  <Link href="/collections" className="btn btn-ghost">View Our Work</Link>
                </div>
              </div>
            </Stage>

            {/* progress rail + scroll cue */}
            <div className="absolute right-5 top-1/2 z-20 hidden h-40 w-px -translate-y-1/2 bg-[#111]/25 md:block md:right-8">
              <motion.div style={{ scaleY: barScale }} className="h-full w-full origin-top bg-[#111]" />
            </div>
            <motion.div style={{ opacity: cueOpacity }} className="absolute bottom-8 right-6 z-20 hidden items-center gap-3 text-[#111]/80 md:flex">
              <span className="eyebrow">Scroll</span>
              <span className="relative block h-10 w-px overflow-hidden bg-[#111]/30">
                <motion.span
                  className="absolute inset-x-0 top-0 h-1/2 bg-[#111]"
                  animate={{ y: ["-100%", "200%"] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                />
              </span>
            </motion.div>
          </>
        )}

        {/* loader */}
        <AnimatePresence>
          {!ready && (
            <motion.div
              className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#dadada] text-[#111]"
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: EASE }}
            >
              <p className="h-display text-4xl tracking-[0.3em]">ORHANZA</p>
              <div className="mt-8 h-px w-48 overflow-hidden bg-[#111]/20">
                <div className="h-full bg-[#111] transition-[width] duration-200" style={{ width: `${Math.min(100, pct * 4)}%` }} />
              </div>
              <p className="eyebrow mt-4 text-[#111]/60">Preparing your fitting room</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
