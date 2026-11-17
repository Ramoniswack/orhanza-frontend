"use client";

/**
 * Home teaser — a scan line. A thin gold measuring line travels down the model as you scroll; above it the suit is already in the
 * next cloth, below it still the old one. It does this three times (navy → herringbone → green → burgundy) while the cloth name and
 * its price roll over in the corner. Driven by useScroll, so it follows Lenis exactly.
 */
import { cubicBezier } from "motion";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef, useState } from "react";
import { ButtonWipe, EASE_OUT, KineticNumber, LineMaskReveal } from "@/components/motion";
import { Reveal } from "@/components/Reveal";
import { MODEL, getFabric } from "@/lib/custom-made";

const CLOTHS = ["navy-pure-wool", "charcoal-herringbone", "forest-green-twill", "burgundy-twill"].map(getFabric);
// the scan for cloth i+1 runs over these section-progress ranges; layer 0 is always underneath at full opacity
const RANGES: [number, number][] = [[0.28, 0.4], [0.44, 0.56], [0.6, 0.72]];
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
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const [idx, setIdx] = useState(0);
  useMotionValueEvent(p, "change", (v) => {
    const i = v < 0.34 ? 0 : v < 0.5 ? 1 : v < 0.66 ? 2 : 3;
    setIdx((cur) => (cur === i ? cur : i));
  });
  const cloth = CLOTHS[reduce ? 0 : idx];

  return (
    <section ref={ref} id="custom-made" aria-labelledby="cm-home-h" className="bg-white section-y">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 id="cm-home-h" className="t-h2">
            <LineMaskReveal lines={["Made to measure"]} />
          </h2>
          <div className="max-w-sm">
            <Reveal><p className="t-lead">Choose your cloth. See it on the model. We cut it to you.</p></Reveal>
            <ButtonWipe g={p} enter={[0.1, 0.24]} ease={ease} href="/custom-made">Start customising</ButtonWipe>
          </div>
        </div>

        <div className="relative section-gap h-[min(78svh,820px)] overflow-hidden rounded-[22px] bg-[#F4F4F4]">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative h-[92%]" style={{ aspectRatio: `${MODEL.w} / ${MODEL.h}` }}>
              {reduce ? (
                <img src={CLOTHS[0].suitPreview} alt="A made-to-measure suit shown in four cloths" width={MODEL.w} height={MODEL.h} loading="lazy" decoding="async" draggable={false} className="absolute inset-0 h-full w-full select-none" />
              ) : (
                <Cloths p={p} />
              )}
            </div>
          </div>

          <div className="absolute inset-x-5 bottom-5 z-20 flex items-end justify-between gap-4 md:inset-x-8 md:bottom-8">
            <div>
              <p className="label-micro text-slate">Cloth</p>
              <motion.p key={cloth.slug} initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="mt-1.5 text-xl font-semibold tracking-[-0.03em] text-ink md:text-3xl">{cloth.name}</motion.p>
            </div>
            <p className="flex items-baseline gap-2 text-ink">
              <span className="text-xs font-semibold text-gold md:text-sm">from Rs.</span>
              <KineticNumber value={cloth.priceNpr} group play duration={0.9} stagger={0.04} className="text-xl font-bold tracking-[-0.03em] md:text-3xl" />
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
