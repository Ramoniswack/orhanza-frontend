"use client";

/**
 * Home teaser — a scan line. A thin gold measuring line travels down the model as you scroll; above it the suit is already in the
 * next cloth, below it still the old one. It does this three times (navy → herringbone → green → burgundy) while the cloth name and
 * its price roll over in the corner. Driven by useScroll, so it follows Lenis exactly.
 * The section is PINNED: it holds on screen until every cloth — the last one included — has been shown in full, then releases.
 */
import { cubicBezier } from "motion";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef, useState } from "react";
import { ButtonWipe, EASE_OUT, KineticNumber, LineMaskReveal } from "@/components/motion";
import { Reveal } from "@/components/Reveal";
import { MODEL, getFabric } from "@/lib/custom-made";

const CLOTHS = ["navy-pure-wool", "charcoal-herringbone", "forest-green-twill", "burgundy-twill"].map(getFabric);
// the scan for cloth i+1 runs over these section-progress ranges; layer 0 is always underneath at full opacity
// pinned: short hold on the first cloth → three scans → long hold on the last cloth, then the section scrolls away
const RANGES: [number, number][] = [[0.1, 0.26], [0.36, 0.52], [0.62, 0.78]];
const PIN_VH = 460; // total section height; (PIN_VH − 100)vh of scrolling happens while pinned
const ease = cubicBezier(...EASE_OUT);

/**
 * The scan line y(t) goes 0 → 1 once per cloth change. Cloth k is only visible between the line of the next change (above) and its own
 * line (below) — a layer is never stacked under another one, so nothing of the old cloth (or its slightly different stance, shoes, leg edge)
 * can show beside the new one. Once a scan has passed, the old picture is gone from that part of the body.
 */
function Cloths({ p }: { p: MotionValue<number> }) {
  const t1 = useTransform(p, RANGES[0], [0, 1], { clamp: true });
  const t2 = useTransform(p, RANGES[1], [0, 1], { clamp: true });
  const t3 = useTransform(p, RANGES[2], [0, 1], { clamp: true });
  const ts = [t1, t2, t3];
  const SEAM = 0.25; // % of overlap so two bands never leave a hairline gap
  const clip = (k: number) => (): string => {
    const top = k < 3 ? Math.max(0, ts[k].get() * 100 - SEAM) : 0;        // below the next scan line…
    const bottom = k > 0 ? (1 - ts[k - 1].get()) * 100 : 0;               // …and above this cloth's own line
    return `inset(${top}% 0 ${bottom}% 0)`;
  };
  const c0 = useTransform(() => clip(0)());
  const c1 = useTransform(() => clip(1)());
  const c2 = useTransform(() => clip(2)());
  const c3 = useTransform(() => clip(3)());
  const clips = [c0, c1, c2, c3];
  const lines = ts.map((t) => ({ top: useTransform(t, (v) => `${v * 100}%`), op: useTransform(t, [0, 0.04, 0.96, 1], [0, 1, 1, 0]) }));
  return (
    <>
      {CLOTHS.map((f, k) => (
        <motion.img key={f.slug} src={f.suitPreview} alt={k === 0 ? "A made-to-measure suit shown in four cloths" : ""} aria-hidden={k !== 0} width={MODEL.w} height={MODEL.h} loading="lazy" decoding="async" draggable={false} className="absolute inset-0 h-full w-full select-none" style={{ clipPath: clips[k], willChange: "clip-path" }} />
      ))}
      {lines.map((l, k) => (
        <motion.span key={k} aria-hidden className="pointer-events-none absolute -left-[60vw] -right-[60vw] z-10 h-px" style={{ top: l.top, opacity: l.op, background: "linear-gradient(to right, transparent, var(--color-gold) 38%, var(--color-gold) 62%, transparent)", boxShadow: "0 0 14px 1px rgba(185,139,69,0.4)" }} />
      ))}
    </>
  );
}

export function CustomMadeTeaser() {
  const ref = useRef<HTMLElement>(null);
  const reduce = !!useReducedMotion();
  // pinned progress: 0 when the section reaches the top, 1 when its last screen is about to scroll away
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  // arrival progress: drives the intro button before the pin begins
  const { scrollYProgress: arrive } = useScroll({ target: ref, offset: ["start end", "start start"] });
  const [idx, setIdx] = useState(0);
  useMotionValueEvent(p, "change", (v) => {
    const i = v < 0.18 ? 0 : v < 0.44 ? 1 : v < 0.7 ? 2 : 3;
    setIdx((cur) => (cur === i ? cur : i));
  });
  const shown = reduce ? 0 : idx;
  const cloth = CLOTHS[shown];
  const num = (n: number) => String(n).padStart(2, "0");

  return (
    <section
      ref={ref}
      id="custom-made"
      aria-labelledby="cm-home-h"
      className="relative bg-white"
      style={reduce ? undefined : { height: `${PIN_VH}svh` }}
    >
      <div className={`${reduce ? "section-y" : "sticky top-0 h-[100svh] pb-4 pt-[84px] md:pb-6 md:pt-[92px]"} flex flex-col`}>
        <div className="container-x flex min-h-0 w-full flex-1 flex-col">
          <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-1">
            <h2 id="cm-home-h" className="t-h2 !text-[clamp(1.9rem,3.8vw,3.4rem)]">
              <LineMaskReveal lines={["Made to measure"]} />
            </h2>
            <div className="flex items-end gap-6">
              <div className="hidden max-w-xs sm:block">
                <Reveal><p className="t-lead !text-[0.95rem]">Choose your cloth. See it on the model. We cut it to you.</p></Reveal>
              </div>
              <ButtonWipe g={arrive} enter={[0.55, 0.95]} ease={ease} href="/custom-made">Start customising</ButtonWipe>
            </div>
          </div>

          {/* stage */}
          <div className="relative mt-4 flex min-h-0 flex-1 flex-col overflow-hidden bg-[#F4F4F4] md:mt-5">
            <div className="relative min-h-0 flex-1">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative h-[96%]" style={{ aspectRatio: `${MODEL.w} / ${MODEL.h}` }}>
                  {reduce ? (
                    <img src={CLOTHS[0].suitPreview} alt="A made-to-measure suit shown in four cloths" width={MODEL.w} height={MODEL.h} loading="lazy" decoding="async" draggable={false} className="absolute inset-0 h-full w-full select-none" />
                  ) : (
                    <Cloths p={p} />
                  )}
                </div>
              </div>

              {/* selected piece — index + swatch rail */}
              <div className="pointer-events-none absolute left-5 top-5 z-20 md:left-8 md:top-7">
                <p className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-slate md:text-[11px]">
                  <span aria-hidden className="h-px w-7 bg-gold" />Selected piece
                </p>
                <p className="mt-2 flex items-baseline gap-2 text-ink" aria-label={`Cloth ${shown + 1} of ${CLOTHS.length}`}>
                  <motion.span key={shown} initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="text-[clamp(1.6rem,2.6vw,2.6rem)] font-light leading-none tracking-[-0.04em]">{num(shown + 1)}</motion.span>
                  <span className="text-[11px] font-medium tracking-[0.2em] text-slate/70 md:text-xs">/ {num(CLOTHS.length)}</span>
                </p>
              </div>
              <ul aria-hidden className="pointer-events-none absolute right-5 top-5 z-20 flex flex-col gap-2 md:right-8 md:top-7">
                {CLOTHS.map((f, k) => (
                  <li key={f.slug} className="flex items-center justify-end gap-3">
                    <span className={`hidden text-[10px] font-semibold uppercase tracking-[0.2em] transition-opacity duration-500 md:block ${k === shown ? "text-ink opacity-100" : "opacity-0"}`}>{f.name}</span>
                    <span className="block h-[14px] w-[14px] transition-[transform,box-shadow] duration-500" style={{ background: f.hex, transform: k === shown ? "scale(1.25)" : "scale(1)", boxShadow: k === shown ? "0 0 0 1px #F4F4F4, 0 0 0 2px #111" : "0 0 0 1px rgba(0,0,0,.12)" }} />
                  </li>
                ))}
              </ul>
            </div>

            {/* selected piece — name, price, action */}
            <div className="relative z-20 grid grid-cols-[1fr_auto] items-end gap-x-6 gap-y-3 border-t border-black/10 bg-[#F4F4F4] px-5 py-4 md:px-8 md:py-6">
              <div className="min-w-0">
                <p className="label-micro text-slate">Cloth <span className="mx-1.5 text-gold">·</span> {cloth.category}</p>
                <motion.p key={cloth.slug} initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="mt-2 truncate text-[clamp(1.6rem,3.6vw,3.5rem)] font-semibold leading-[1] tracking-[-0.045em] text-ink">{cloth.name}</motion.p>
                <a href={`/custom-made?fabric=${cloth.slug}`} className="mt-3 inline-flex items-center gap-2 border-b border-ink pb-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink transition-colors duration-300 hover:border-gold hover:text-gold md:mt-4 md:text-[11px]">
                  Select this cloth <span aria-hidden>→</span>
                </a>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold md:text-[11px]">from Rs.</p>
                <div className="mt-1 flex justify-end"><KineticNumber value={cloth.priceNpr} group play duration={0.9} stagger={0.04} className="text-[clamp(1.6rem,3.6vw,3.5rem)] font-bold tracking-[-0.045em] text-ink" /></div>
                <p className="mt-2 hidden text-[11px] tracking-[0.04em] text-slate md:block">Cut &amp; finished to your measure</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
