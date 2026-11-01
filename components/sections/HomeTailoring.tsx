"use client";

/**
 * Home Tailoring Service — editorial scroll timeline.
 * Desktop: sticky photograph on the left, timeline entries scroll on the right beside a hairline divider.
 * The active entry comes from the real scroll position (never a timer): it drives the image cross-fade, the text reveal,
 * the markers, the divider's progress line and the kinetic counter. Scrolling back up reverses everything.
 * Mobile: single column — each entry carries its own photograph.
 */
import { AnimatePresence, MotionConfig, motion, useMotionValueEvent, useScroll, useSpring, useTransform } from "motion/react";
import Link from "next/link";
import { useRef, useState } from "react";
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

function Copy({ i, title, body }: { i: number; title: string; body: string }) {
  return (
    <>
      <motion.p variants={meta} className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em]" style={{ color: C.mute }}>
        Step <KineticNumber value={i + 1} pad={2} />
      </motion.p>
      <h3 className="mt-4 text-[clamp(2rem,3.2vw,3.5rem)] font-semibold leading-[1.02] tracking-[-0.04em]" style={{ color: C.ink }}>
        {title.split(" ").map((w, wi) => (
          <span key={wi} className="mr-[0.25em] inline-block overflow-hidden pb-[0.12em] align-bottom">
            <motion.span variants={word(wi)} className="inline-block">{w}</motion.span>
          </span>
        ))}
      </h3>
      <motion.p variants={desc} className="mt-5 max-w-[24rem] text-[15px] leading-relaxed" style={{ color: C.mute }}>{body}</motion.p>
    </>
  );
}

export function HomeTailoring() {
  const list = useRef<HTMLOListElement>(null);
  const listM = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);

  // 0 → 1 while the viewport's centre line travels down the list
  const { scrollYProgress: p } = useScroll({ target: list, offset: ["start 50%", "end 50%"] });
  const { scrollYProgress: pm } = useScroll({ target: listM, offset: ["start 60%", "end 60%"] });
  const line = useSpring(p, { stiffness: 140, damping: 30, mass: 0.4 });
  const lineM = useSpring(pm, { stiffness: 140, damping: 30, mass: 0.4 });

  useMotionValueEvent(p, "change", (v) => {
    const i = Math.min(N - 1, Math.max(0, Math.floor(v * N)));
    setActive((a) => (a === i ? a : i));
  });

  return (
    <MotionConfig reducedMotion="user">
      <section id="process" aria-label="Home tailoring service" className="relative pb-14 pt-14 md:pb-20 md:pt-20" style={{ background: C.bg, color: C.ink }}>
        <div className="container-x">
          <SectionLabel label="Process" />
          <h2 className="h-section-xl mt-5">Home Tailoring<br />Service</h2>
        </div>

        {/* ─────────── desktop / tablet ─────────── */}
        <div className="container-x mt-10 hidden md:grid md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
          <div>
            <div className="sticky top-[14svh] pr-10 lg:pr-16">
              <div className="relative flex h-[60svh] max-h-[36rem] items-center justify-center overflow-hidden rounded-[6px]" style={{ background: "#ECEAE4" }}>
                <AnimatePresence mode="wait">
                  {steps.map(({ Icon, title }, i) => i === active && (
                    <motion.div
                      key={title}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
                      transition={{ duration: 0.5, ease: EASE }}
                      className="h-[60%] w-[60%]"
                      style={{ color: "#B98B45" }}
                    >
                      <Icon className="h-full w-full" />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <div className="mt-5 flex items-end justify-between">
                <div className="flex items-baseline gap-3">
                  <KineticNumber value={active + 1} pad={2} play className="text-[clamp(2.6rem,4.2vw,4.2rem)] font-semibold tracking-[-0.04em]" />
                  <span className="text-xl" style={{ color: C.mute }}>/ {String(N).padStart(2, "0")}</span>
                </div>
              </div>
            </div>
          </div>

          {/* divider + entries */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 w-px" style={{ background: C.line }} aria-hidden />
            <motion.span style={{ scaleY: line, background: C.on }} className="absolute inset-y-0 -left-px w-[3px] origin-top rounded-full" aria-hidden />
            <ol ref={list} className="relative">
              {steps.map((s, i) => (
                <motion.li
                  key={s.title}
                  initial="off"
                  animate={i === active ? "on" : "off"}
                  className="relative flex min-h-[46svh] items-center pl-12 pr-4 lg:pl-20"
                >
                  <Marker state={i === active ? "on" : i < active ? "past" : "future"} />
                  <div><Copy i={i} title={s.title} body={s.body} /></div>
                </motion.li>
              ))}
            </ol>
          </div>
        </div>

        {/* ─────────── mobile ─────────── */}
        <div className="container-x mt-8 md:hidden">
          <ol ref={listM} className="relative pl-8">
            <span className="absolute inset-y-0 left-[5px] w-px" style={{ background: C.line }} aria-hidden />
            <motion.span style={{ scaleY: lineM, background: C.on }} className="absolute inset-y-0 left-[4px] w-[3px] origin-top rounded-full" aria-hidden />
            {steps.map((s, i) => (
              <motion.li
                key={s.title}
                initial="off"
                whileInView="on"
                viewport={{ amount: 0.55, margin: "0px 0px -10% 0px" }}
                className="relative pb-14 last:pb-0"
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
        </div>

        <div className="container-x mt-12 flex justify-end md:mt-6">
          <Link href="/#book" className="group flex items-center gap-4 text-sm font-semibold">
            Book a Consultation
            <span className="block h-px w-12 transition-all duration-500 group-hover:w-24" style={{ background: C.ink }} />
          </Link>
        </div>
      </section>
    </MotionConfig>
  );
}
