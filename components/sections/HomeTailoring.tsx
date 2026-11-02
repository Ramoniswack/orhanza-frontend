"use client";

/**
 * Home Tailoring Service — editorial scroll timeline.
 * Desktop: sticky photograph on the left, timeline entries scroll on the right beside a hairline divider.
 * The active entry comes from the real scroll position (never a timer): it drives the image cross-fade, the text reveal,
 * the markers, the scroll-drawn thread and the kinetic counter. Scrolling back up reverses everything.
 * The thread ends in a needle: the last stretch of thread runs through the needle's eye.
 * Mobile: single column.
 */
import { AnimatePresence, MotionConfig, motion, useMotionValue, useMotionValueEvent, useScroll, useSpring, type MotionValue } from "motion/react";
import Link from "next/link";
import { useEffect, useId, useRef, useState, type RefObject } from "react";
import { Box, House } from "@/components/Icons";
import { JacketOnHanger, Mannequin, NeedleThread, SwatchStack } from "@/components/Illustrations";
import { KineticNumber } from "@/components/motion";
import { SectionLabel } from "@/components/SectionLabel";

const steps = [
  { title: "Home Consultation", body: "We visit you to talk through the occasion, the look and the budget.", Icon: House },
  { title: "Fabric & Design Selection", body: "Cloths, colours and details, chosen together at your door.", Icon: SwatchStack },
  { title: "Measurement", body: "Detailed body measurements for a fit that is yours alone.", Icon: Mannequin },
  { title: "Trial Fitting", body: "A first fitting to refine the line before final finishing.", Icon: JacketOnHanger },
  { title: "Delivery", body: "Your finished garment, delivered to you.", Icon: Box },
  { title: "Alteration Support", body: "Adjustments afterwards, whenever you need them.", Icon: NeedleThread },
];
const N = steps.length;
const EASE = [0.22, 1, 0.36, 1] as const;
const NEEDLE_ZONE = 150; // px reserved under the last step for the needle

const C = { bg: "#FFFFFF", ink: "#242424", mute: "#898989", off: "#D5D3CE", on: "#333333", line: "#DAD9D4" };

/** entry text states: inactive entries keep their layout at reduced opacity; the active one reveals date → heading → description */
const meta = { off: { opacity: 0.3, y: 10 }, on: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } } };
const desc = { off: { opacity: 0.22, y: 8 }, on: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE, delay: 0.3 } } };
const word = (i: number) => ({ off: { opacity: 0.28, y: "22%" }, on: { opacity: 1, y: "0%", transition: { duration: 0.65, ease: EASE, delay: 0.12 + i * 0.06 } } });

function Marker({ state }: { state: "on" | "past" | "future" }) {
  return (
    <motion.span
      aria-hidden
      initial={false}
      animate={{
        scale: state === "on" ? 1.25 : 0.8,
        opacity: state === "future" ? 0.9 : 1,
        backgroundColor: state === "future" ? C.bg : C.on,
        borderColor: state === "future" ? C.off : C.on,
      }}
      transition={{ duration: 0.4, ease: EASE }}
      className="absolute left-0 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border"
    />
  );
}

/**
 * A thread that snakes down the list, passing through every marker, and finishes by running through the eye of a needle.
 * A faint dashed strand is always there; the dark strand is drawn along it by scroll progress, and a bead rides the tip.
 * The strand is drawn twice — in front of the needle above the eye, behind it below — so it really goes *in* the eye.
 * Geometry is measured from the real list, so it follows whatever height the entries take at any breakpoint.
 */
function Thread({ listRef, progress, cx, anchor }: { listRef: RefObject<HTMLOListElement | null>; progress: MotionValue<number>; cx: number; anchor: "center" | number }) {
  const [geo, setGeo] = useState<{ d: string; h: number; eyeY: number; top: number } | null>(null);
  const path = useRef<SVGPathElement>(null);
  const tipX = useMotionValue(-20);
  const tipY = useMotionValue(0);
  const uid = useId().replace(/:/g, "");
  const W = 72;
  const X = W / 2;

  useEffect(() => {
    const ol = listRef.current;
    if (!ol) return;
    const build = () => {
      const h = ol.offsetHeight;
      const lis = Array.from(ol.children).filter((el): el is HTMLElement => el.tagName === "LI");
      const ys = lis.map((li) => li.offsetTop + (anchor === "center" ? li.offsetHeight / 2 : anchor));
      const top = h + 10; // needle tip-of-head y
      const eyeY = top + 26; // centre of the eye
      const pts = [0, ...ys];
      let d = `M${X} 0`;
      for (let k = 0; k < pts.length - 1; k++) {
        const y0 = pts[k], y1 = pts[k + 1], dy = y1 - y0;
        const side = k % 2 ? 1 : -1; // the strand swings to alternate sides between markers
        const bow = 14;
        d += ` C${X + side * bow} ${y0 + dy * 0.28} ${X + side * bow} ${y1 - dy * 0.28} ${X} ${y1}`;
      }
      // last marker → straight down into the eye, through it, then out behind the needle and a loose tail
      const last = pts[pts.length - 1];
      d += ` C${X} ${last + (eyeY - last) * 0.4} ${X} ${eyeY - (eyeY - last) * 0.3} ${X} ${eyeY}`;
      d += ` C${X} ${eyeY + 22} ${X + 15} ${eyeY + 20} ${X + 16} ${eyeY + 42}`;
      d += ` C${X + 17} ${eyeY + 58} ${X + 4} ${eyeY + 64} ${X + 12} ${eyeY + 80}`;
      setGeo({ d, h, eyeY, top });
    };
    build();
    const ro = new ResizeObserver(build);
    ro.observe(ol);
    return () => ro.disconnect();
  }, [listRef, anchor, X]);

  const place = (v: number) => {
    const el = path.current;
    if (!el) return;
    const pt = el.getPointAtLength(el.getTotalLength() * v);
    tipX.set(pt.x);
    tipY.set(pt.y);
  };
  useMotionValueEvent(progress, "change", place);
  useEffect(() => { if (geo) place(progress.get()); }, [geo]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!geo) return null;
  const { d, h, eyeY, top } = geo;
  const H = h + NEEDLE_ZONE + 10;
  // needle: 12px wide head, tapering to a point; the eye is a 5×26 slot cut out with even-odd fill
  const body = `M${X - 6} ${top + 6} Q${X - 6} ${top} ${X} ${top} Q${X + 6} ${top} ${X + 6} ${top + 6} L${X + 5} ${top + 96} L${X} ${top + 132} L${X - 5} ${top + 96} Z`;
  const eye = `M${X - 2.5} ${eyeY - 13} a2.5 2.5 0 0 1 5 0 v26 a2.5 2.5 0 0 1 -5 0 Z`;

  return (
    <svg aria-hidden width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="pointer-events-none absolute top-0 overflow-visible" style={{ left: cx - X }}>
      <defs>
        <clipPath id={`${uid}f`}><rect x={-60} y={-10} width={W + 120} height={eyeY + 10} /></clipPath>
        <clipPath id={`${uid}b`}><rect x={-60} y={eyeY} width={W + 120} height={H} /></clipPath>
      </defs>

      {/* faint guide strand */}
      <path ref={path} d={d} fill="none" stroke={C.line} strokeWidth={2.4} strokeDasharray="2 7" strokeLinecap="round" />

      {/* thread, after the eye — behind the needle */}
      <g clipPath={`url(#${uid}b)`}>
        <motion.path d={d} fill="none" stroke={C.on} strokeWidth={3.4} strokeLinecap="round" style={{ pathLength: progress }} />
        <motion.circle cx={tipX} cy={tipY} r={5} fill="#B98B45" stroke={C.bg} strokeWidth={2} />
      </g>

      {/* the needle (eye is a real hole, so the thread shows through it) */}
      <path d={`${body} ${eye}`} fillRule="evenodd" fill="#B9B7B0" stroke="#8E8C85" strokeWidth={0.8} />
      <path d={`M${X - 3.2} ${top + 30} L${X - 3.2} ${top + 92}`} stroke="#fff" strokeOpacity={0.55} strokeWidth={1.2} strokeLinecap="round" />

      {/* thread, before the eye — in front of the needle */}
      <g clipPath={`url(#${uid}f)`}>
        <motion.path d={d} fill="none" stroke={C.on} strokeWidth={3.4} strokeLinecap="round" style={{ pathLength: progress }} />
        <motion.circle cx={tipX} cy={tipY} r={5} fill="#B98B45" stroke={C.bg} strokeWidth={2} />
      </g>
    </svg>
  );
}

function Copy({ i, title, body }: { i: number; title: string; body: string }) {
  return (
    <>
      <motion.p variants={meta} className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em]" style={{ color: C.mute }}>
        Step <KineticNumber value={i + 1} pad={2} />
      </motion.p>
      <h3 className="mt-2 text-[clamp(1.5rem,2.2vw,2.4rem)] font-semibold leading-[1.05] tracking-[-0.035em]" style={{ color: C.ink }}>
        {title.split(" ").map((w, wi) => (
          <span key={wi} className="mr-[0.25em] inline-block overflow-hidden pb-[0.12em] align-bottom">
            <motion.span variants={word(wi)} className="inline-block">{w}</motion.span>
          </span>
        ))}
      </h3>
      <motion.p variants={desc} className="mt-3 max-w-[22rem] text-sm leading-relaxed" style={{ color: C.mute }}>{body}</motion.p>
    </>
  );
}

export function HomeTailoring() {
  const list = useRef<HTMLOListElement>(null);
  const listM = useRef<HTMLOListElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const wrapM = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  // 0 → 1 while the viewport's centre line travels down the list
  const { scrollYProgress: p } = useScroll({ target: list, offset: ["start 50%", "end 50%"] }); // which step is active
  const { scrollYProgress: w } = useScroll({ target: wrap, offset: ["start 50%", "end 50%"] }); // thread, incl. the needle
  const { scrollYProgress: wm } = useScroll({ target: wrapM, offset: ["start 60%", "end 60%"] });
  const line = useSpring(w, { stiffness: 140, damping: 30, mass: 0.4 });
  const lineM = useSpring(wm, { stiffness: 140, damping: 30, mass: 0.4 });

  useMotionValueEvent(p, "change", (v) => {
    const i = Math.min(N - 1, Math.max(0, Math.floor(v * N)));
    setActive((a) => (a === i ? a : i));
  });

  return (
    <MotionConfig reducedMotion="user">
      <section id="process" aria-label="Home tailoring service" className="relative pb-12 pt-12 md:pb-16 md:pt-16" style={{ background: C.bg, color: C.ink }}>
        <div className="container-x">
          <SectionLabel label="Process" />
          <h2 className="h-display mt-4 text-[clamp(2.2rem,4.4vw,4.4rem)]">Home Tailoring Service</h2>
        </div>

        {/* ─────────── desktop / tablet ─────────── */}
        <div className="container-x mt-6 hidden md:grid md:grid-cols-[minmax(0,4fr)_minmax(0,6fr)]">
          <div>
            <div className="sticky top-[16svh] pr-10 lg:pr-16">
              <div className="relative flex h-[48svh] max-h-[28rem] items-center justify-center overflow-hidden rounded-[6px]" style={{ background: "#FFFFFF" }}>
                <AnimatePresence mode="wait">
                  {steps.map(({ Icon, title }, i) => i === active && (
                    <motion.div
                      key={title}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
                      transition={{ duration: 0.5, ease: EASE }}
                      className="h-[72%] w-[72%]"
                      style={{ color: "#B98B45" }}
                    >
                      <Icon className="h-full w-full" />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <div className="mt-3 flex items-end justify-between">
                <div className="flex items-baseline gap-3">
                  <KineticNumber value={active + 1} pad={2} play className="text-[clamp(2rem,3vw,3rem)] font-semibold tracking-[-0.04em]" />
                  <span className="text-lg" style={{ color: C.mute }}>/ {String(N).padStart(2, "0")}</span>
                </div>
              </div>
            </div>
          </div>

          {/* divider + entries */}
          <div className="relative">
            <div ref={wrap} className="relative">
              <Thread listRef={list} progress={line} cx={0} anchor="center" />
              <ol ref={list} className="relative">
                {steps.map((s, i) => (
                  <motion.li
                    key={s.title}
                    initial="off"
                    animate={i === active ? "on" : "off"}
                    className="relative flex min-h-[23svh] items-center py-5 pl-12 pr-4 lg:pl-20"
                  >
                    <Marker state={i === active ? "on" : i < active ? "past" : "future"} />
                    <div><Copy i={i} title={s.title} body={s.body} /></div>
                  </motion.li>
                ))}
              </ol>
              <div aria-hidden style={{ height: NEEDLE_ZONE }} />
            </div>
          </div>
        </div>

        {/* ─────────── mobile ─────────── */}
        <div className="container-x mt-8 md:hidden">
          <div ref={wrapM} className="relative">
          <Thread listRef={listM} progress={lineM} cx={6} anchor={14} />
          <ol ref={listM} className="relative pl-8">
            {steps.map((s, i) => (
              <motion.li
                key={s.title}
                initial="off"
                whileInView="on"
                viewport={{ amount: 0.55, margin: "0px 0px -10% 0px" }}
                className="relative pb-8 last:pb-0"
              >
                <motion.span
                  aria-hidden
                  variants={{ off: { scale: 0.8, backgroundColor: C.bg, borderColor: C.off }, on: { scale: 1.2, backgroundColor: C.on, borderColor: C.on, transition: { duration: 0.4 } } }}
                  className="absolute -left-8 top-2 h-3 w-3 rounded-full border"
                />
                <Copy i={i} title={s.title} body={s.body} />
              </motion.li>
            ))}
          </ol>
          <div aria-hidden style={{ height: NEEDLE_ZONE }} />
          </div>
        </div>

        <div className="container-x mt-6 flex justify-end">
          <Link href="/#book" className="group flex items-center gap-4 text-sm font-semibold">
            Book a Consultation
            <span className="block h-px w-12 transition-all duration-500 group-hover:w-24" style={{ background: C.ink }} />
          </Link>
        </div>
      </section>
    </MotionConfig>
  );
}
