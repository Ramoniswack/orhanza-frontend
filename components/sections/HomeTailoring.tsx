"use client";

/**
 * Home Tailoring Service — editorial scroll timeline.
 * Desktop: sticky photograph on the left, timeline entries scroll on the right beside a hairline divider.
 * The active entry comes from the real scroll position (never a timer): it drives the image cross-fade, the text reveal,
 * the markers, the divider's progress line and the kinetic counter. Scrolling back up reverses everything.
 * Mobile: single column — each entry carries its own photograph.
 */
import { MotionConfig, motion, useMotionValueEvent, useScroll, useSpring, useTransform } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { KineticMV, KineticNumber } from "@/components/motion";
import { SectionLabel } from "@/components/SectionLabel";

const steps = [
  { title: "Home Consultation", body: "We visit you to talk through the occasion, the look and the budget.", image: "/images/products/boardroom-three-piece-suit-a.webp" },
  { title: "Fabric & Design Selection", body: "Cloths, colours and details, chosen together at your door.", image: "/images/products/wool-linen-groomsmen-suit-a.webp" },
  { title: "Measurement", body: "Detailed body measurements for a fit that is yours alone.", image: "/images/products/sand-coat-pant-set-a.webp" },
  { title: "Trial Fitting", body: "A first fitting to refine the line before final finishing.", image: "/images/products/midnight-double-breasted-suit-a.webp" },
  { title: "Delivery", body: "Your finished garment, delivered to you.", image: "/images/products/black-tie-evening-suit-a.webp" },
  { title: "Alteration Support", body: "Adjustments afterwards, whenever you need them.", image: "/images/products/signature-white-shirt-a.webp" },
];
const N = steps.length;
const EASE = [0.22, 1, 0.36, 1] as const;

const C = { bg: "#F5F4F0", ink: "#242424", mute: "#898989", off: "#D5D3CE", on: "#333333", line: "#DAD9D4" };

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
      <h3 className="mt-4 text-[clamp(2.2rem,3.5vw,3.8rem)] font-extrabold leading-[1.02] tracking-[-0.04em] uppercase" style={{ color: C.ink }}>
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
  const pct = useTransform(p, (v) => Math.min(100, Math.max(0, v * 100)));
  const drift = useTransform(p, [0, 1], ["-1.5%", "1.5%"]); // very low parallax on the photograph

  useMotionValueEvent(p, "change", (v) => {
    const i = Math.min(N - 1, Math.max(0, Math.floor(v * N)));
    setActive((a) => (a === i ? a : i));
  });

  return (
    <MotionConfig reducedMotion="user">
      <section id="process" aria-label="Home tailoring service" className="relative pb-14 pt-14 md:pb-20 md:pt-20" style={{ background: C.bg, color: C.ink }}>
        <div className="container-x">
          <SectionLabel label="Process" />
          <h2 className="mt-5 text-[clamp(3rem,7vw,7rem)] font-extrabold leading-[0.92] tracking-[-0.04em] uppercase">Home Tailoring<br />Service</h2>
        </div>

        {/* ─────────── desktop / tablet ─────────── */}
        <div className="container-x mt-10 hidden md:grid md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
          <div>
            <div className="sticky top-[14svh] pr-10 lg:pr-16">
              <div className="relative h-[64svh] max-h-[40rem] overflow-hidden rounded-[6px]" style={{ background: "#E8E6E0" }}>
                <motion.div style={{ y: drift }} className="absolute -inset-y-[2%] inset-x-0">
                  {steps.map((s, i) => (
                    <motion.div
                      key={s.title}
                      className="absolute inset-0"
                      initial={false}
                      animate={i === active ? { opacity: 1, scale: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)" } : { opacity: 0, scale: 1.04, y: 12, clipPath: "inset(4% 0% 0% 0%)" }}
                      transition={{ duration: 0.9, ease: EASE }}
                    >
                      <Image src={s.image} alt={`${s.title} — Orhanza home tailoring`} fill sizes="(min-width:768px) 40vw, 100vw" className="object-cover object-top" priority={i === 0} />
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              <div className="mt-5 flex items-end justify-between">
                <div className="flex items-baseline gap-3">
                  <KineticNumber value={active + 1} pad={2} play className="text-[clamp(2.6rem,4.2vw,4.2rem)] font-extrabold tracking-[-0.04em]" />
                  <span className="text-xl font-semibold" style={{ color: C.mute }}>/ {String(N).padStart(2, "0")}</span>
                </div>
                <span className="flex items-baseline text-xl font-semibold" style={{ color: C.mute }}>
                  <KineticMV value={pct} places={3} />
                  <span className="ml-0.5 text-base">%</span>
                </span>
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
                  className="relative flex min-h-[64svh] items-center pl-12 pr-4 lg:pl-20"
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
                <div className="relative mb-6 aspect-[4/5] overflow-hidden rounded-[6px]" style={{ background: "#E8E6E0" }}>
                  <Image src={s.image} alt={`${s.title} — Orhanza home tailoring`} fill sizes="90vw" className="object-cover object-top" />
                </div>
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
