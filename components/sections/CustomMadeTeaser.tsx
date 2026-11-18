"use client";

/**
 * Home — Selected pieces. A pinned, scroll-driven slider: the section holds on screen while a horizontal track of four cloths
 * slides one panel at a time (scroll position, not time, drives it — scrolling back reverses it). It releases only after the
 * last cloth has been shown in full.
 */
import { cubicBezier } from "motion";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef, useState } from "react";
import { ButtonWipe, EASE_OUT, KineticNumber, LineMaskReveal } from "@/components/motion";
import { MODEL, getFabric } from "@/lib/custom-made";

const CLOTHS = ["navy-pure-wool", "charcoal-herringbone", "forest-green-twill", "burgundy-twill"].map(getFabric);
// slide k → k+1 happens over these ranges of pinned progress; each cloth rests before and after (the last rests longest)
const SLIDES: [number, number][] = [[0.16, 0.3], [0.42, 0.56], [0.68, 0.82]];
const PIN_VH = 440; // section height; (PIN_VH − 100)vh of scrolling happens while pinned
const ease = cubicBezier(...EASE_OUT);
const EASE_UI = [0.22, 1, 0.36, 1] as const;

function Track({ p }: { p: MotionValue<number> }) {
  const input = [0, ...SLIDES.flat(), 1];
  const output = ["0%", "0%", "-25%", "-25%", "-50%", "-50%", "-75%", "-75%"];
  const x = useTransform(p, input, output, { ease, clamp: true });
  return (
    <motion.div className="absolute inset-y-0 left-0 flex w-[400%] will-change-transform" style={{ x }}>
      {CLOTHS.map((f, k) => (
        <div key={f.slug} className="relative flex h-full w-1/4 items-center justify-center">
          <div className="relative h-[94%]" style={{ aspectRatio: `${MODEL.w} / ${MODEL.h}` }}>
            <img src={f.suitPreview} alt={`${f.name} — made-to-measure suit`} width={MODEL.w} height={MODEL.h} loading="eager" decoding="async" draggable={false} className="absolute inset-0 h-full w-full select-none" />
          </div>
        </div>
      ))}
    </motion.div>
  );
}

export function CustomMadeTeaser() {
  const ref = useRef<HTMLElement>(null);
  const reduce = !!useReducedMotion();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const { scrollYProgress: arrive } = useScroll({ target: ref, offset: ["start end", "start start"] });
  const [idx, setIdx] = useState(0);
  useMotionValueEvent(p, "change", (v) => {
    const i = v < 0.23 ? 0 : v < 0.49 ? 1 : v < 0.75 ? 2 : 3;
    setIdx((cur) => (cur === i ? cur : i));
  });
  const shown = reduce ? 0 : idx;
  const cloth = CLOTHS[shown];
  const num = (n: number) => String(n).padStart(2, "0");

  return (
    <section ref={ref} id="custom-made" aria-labelledby="cm-home-h" className="relative bg-white" style={reduce ? undefined : { height: `${PIN_VH}svh` }}>
      <div className={`${reduce ? "section-y" : "sticky top-0 h-[100svh] pb-4 pt-[84px] md:pb-6 md:pt-[92px]"} flex flex-col`}>
        <div className="container-x flex min-h-0 w-full flex-1 flex-col">
          <div className="flex items-end justify-between gap-6">
            <h2 id="cm-home-h" className="t-h2 !text-[clamp(1.9rem,3.8vw,3.4rem)]">
              <LineMaskReveal lines={["Selected pieces"]} />
            </h2>
            <ButtonWipe g={arrive} enter={[0.55, 0.95]} ease={ease} href="/custom-made">Start customising</ButtonWipe>
          </div>

          <div className="relative mt-4 flex min-h-0 flex-1 flex-col overflow-hidden bg-[#F4F4F4] md:mt-5">
            <div className="relative min-h-0 flex-1 overflow-hidden">
              {reduce ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative h-[94%]" style={{ aspectRatio: `${MODEL.w} / ${MODEL.h}` }}>
                    <img src={CLOTHS[0].suitPreview} alt="Selected pieces — made-to-measure suit" width={MODEL.w} height={MODEL.h} decoding="async" draggable={false} className="absolute inset-0 h-full w-full select-none" />
                  </div>
                </div>
              ) : (
                <Track p={p} />
              )}

              {/* counter + position ticks */}
              <p className="pointer-events-none absolute left-5 top-5 z-20 flex items-baseline gap-2 text-ink md:left-8 md:top-7" aria-label={`Piece ${shown + 1} of ${CLOTHS.length}`}>
                <motion.span key={shown} initial={reduce ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE_UI }} className="text-[clamp(1.25rem,2vw,2rem)] font-light leading-none tracking-[-0.03em]">{num(shown + 1)}</motion.span>
                <span className="text-[11px] tracking-[0.2em] text-slate/70">/ {num(CLOTHS.length)}</span>
              </p>
              <div aria-hidden className="pointer-events-none absolute right-5 top-5 z-20 flex gap-1.5 md:right-8 md:top-7">
                {CLOTHS.map((f, k) => (
                  <span key={f.slug} className={`block h-px transition-[width,background-color] duration-500 ${k === shown ? "w-9 bg-ink" : "w-5 bg-black/20"}`} />
                ))}
              </div>
            </div>

            <div className="relative z-20 flex items-end justify-between gap-6 border-t border-black/10 bg-[#F4F4F4] px-5 py-4 md:px-8 md:py-5">
              <div className="min-w-0">
                <p className="label-micro text-slate">{cloth.category}</p>
                <motion.p key={cloth.slug} initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE_UI }} className="mt-1.5 truncate text-[clamp(1.35rem,2.6vw,2.4rem)] font-semibold leading-[1.05] tracking-[-0.04em] text-ink">{cloth.name}</motion.p>
              </div>
              <div className="flex shrink-0 items-baseline gap-2 text-ink">
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold md:text-[11px]">from Rs.</span>
                <KineticNumber value={cloth.priceNpr} group play duration={0.9} stagger={0.04} className="text-[clamp(1.35rem,2.6vw,2.4rem)] font-bold tracking-[-0.04em]" />
              </div>
              <a href={`/custom-made?fabric=${cloth.slug}`} className="hidden shrink-0 border-b border-ink pb-0.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink transition-colors duration-300 hover:border-gold hover:text-gold md:inline-block">
                Select this cloth →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
