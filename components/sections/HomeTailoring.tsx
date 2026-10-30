"use client";

/**
 * Home Tailoring Service — replaces the old Services + Process sections.
 * A serpentine timeline: the line draws itself as you scroll (motion pathLength), and each step lights up
 * when the line reaches it. Desktop = S-shaped path, mobile = vertical line.
 */
import { motion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

const steps = [
  { title: "Home Consultation", body: "We come to you to talk occasion, style and budget." },
  { title: "Fabric & Design Selection", body: "Cloths, colours and details chosen at your door." },
  { title: "Measurement", body: "Detailed body measurements for a personal fit." },
  { title: "Trial Fitting", body: "Refine the fit before the final finishing." },
  { title: "Delivery", body: "Your finished garment, delivered to you." },
  { title: "Alteration Support", body: "Adjustments after delivery, whenever needed." },
];

/** node centres inside the 1000×420 viewBox, in path order */
const pts = [[90, 70], [430, 70], [770, 70], [770, 300], [430, 300], [90, 300]] as const;
const PATH = "M90 70 H770 A115 115 0 0 1 770 300 H90";
/** fraction of the path length at which each node sits (680 + 361 arc + 680 = 1721) */
const at = [0, 340 / 1721, 680 / 1721, 1041 / 1721, 1381 / 1721, 1];

const EASE = [0.22, 1, 0.36, 1] as const;

function Node({ i, p }: { i: number; p: MotionValue<number> }) {
  const f = at[i];
  const o = useTransform(p, [Math.max(0, f - 0.05), f + 0.001], [0, 1]);
  const s = useTransform(p, [Math.max(0, f - 0.05), f + 0.001], [0.4, 1]);
  const [cx, cy] = pts[i];
  return (
    <g>
      <circle cx={cx} cy={cy} r="9" fill="#2a2a2a" />
      <motion.circle cx={cx} cy={cy} r="9" fill="#fff" style={{ opacity: o, scale: s, transformOrigin: `${cx}px ${cy}px` }} />
    </g>
  );
}

function Label({ i, p }: { i: number; p: MotionValue<number> }) {
  const f = at[i];
  const o = useTransform(p, [Math.max(0, f - 0.06), f + 0.02], [0.18, 1]);
  const y = useTransform(p, [Math.max(0, f - 0.06), f + 0.02], [10, 0]);
  const [cx, cy] = pts[i];
  const s = steps[i];
  return (
    <motion.div
      style={{ opacity: o, y, left: `${cx / 10}%`, top: `calc(${(cy / 420) * 100}% + 24px)` }}
      className="absolute w-[11rem] -translate-x-1/2 text-center"
    >
      <p className="font-[family-name:var(--font-cormorant)] text-[1.2rem] leading-tight text-[#E8DDBE]">{s.title}</p>
    </motion.div>
  );
}

function Desktop({ p }: { p: MotionValue<number> }) {
  return (
    <div className="relative hidden aspect-[1000/420] w-full md:block">
      <svg viewBox="0 0 1000 420" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
        <path d={PATH} fill="none" stroke="#fff" strokeOpacity=".12" strokeWidth="3" strokeLinecap="round" />
        <motion.path d={PATH} fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" style={{ pathLength: p }} />
        {pts.map((_, i) => <Node key={i} i={i} p={p} />)}
      </svg>
      {steps.map((_, i) => <Label key={i} i={i} p={p} />)}
    </div>
  );
}

function Mobile({ p }: { p: MotionValue<number> }) {
  return (
    <ol className="relative md:hidden">
      <span className="absolute bottom-3 left-[7px] top-3 w-[3px] rounded bg-white/12" aria-hidden />
      <motion.span style={{ scaleY: p }} className="absolute bottom-3 left-[7px] top-3 w-[3px] origin-top rounded bg-white" aria-hidden />
      {steps.map((s, i) => (
        <motion.li
          key={s.title}
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="relative pb-8 pl-10 last:pb-0"
        >
          <span className="absolute left-0 top-1 h-[17px] w-[17px] rounded-full bg-white" aria-hidden />
          <p className="font-[family-name:var(--font-cormorant)] text-xl text-[#E8DDBE]">{s.title}</p>
        </motion.li>
      ))}
    </ol>
  );
}

export function HomeTailoring() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });

  return (
    <section
      id="process"
      aria-label="Home tailoring service"
      className="relative overflow-hidden bg-[#121212] py-16 text-ivory md:py-24"
      style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px)", backgroundSize: "96px 96px" }}
    >
      <div className="container-x relative">
        <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.9, ease: EASE }}>
          <h2 className="text-[clamp(2.4rem,5vw,4.6rem)] font-normal leading-[1.02] tracking-[-0.03em] text-[#E3D2A0]">Home Tailoring<br />Service</h2>
          <p className="mt-4 font-[family-name:var(--font-cormorant)] text-2xl italic text-ivory md:text-3xl">Premium Tailoring at your doorstep.</p>
        </motion.div>

        <div className="mt-10 grid items-end gap-10 md:mt-6 md:grid-cols-12">
          <div ref={ref} className="md:col-span-8">
            <Desktop p={smooth} />
            <Mobile p={smooth} />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1, ease: EASE }}
            className="relative mx-auto hidden aspect-[3/4] w-full max-w-[22rem] md:col-span-4 md:block"
            style={{ maskImage: "linear-gradient(to bottom, #000 60%, transparent 100%)", WebkitMaskImage: "linear-gradient(to bottom, #000 60%, transparent 100%)" }}
          >
            <Image src="/images/products/black-tie-evening-suit-a.webp" alt="Black-tie suit tailored at home by Orhanza" fill sizes="22rem" className="object-cover object-top" />
          </motion.div>
        </div>

        <div className="mt-10 flex justify-end border-t border-white/10 pt-6 md:mt-4">
          <Link href="/#book" className="group flex items-center gap-4 text-sm font-semibold">
            Book a Consultation
            <span className="block h-px w-12 bg-ivory transition-all duration-500 group-hover:w-24" />
          </Link>
        </div>
      </div>
    </section>
  );
}
