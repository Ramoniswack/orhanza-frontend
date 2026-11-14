"use client";

/**
 * Selected commissions — deliberately simple. Two monochrome panels side by side; scrolling trades the width between them:
 * while the left one is open the right one shows only half of its figure, then they swap. The portrait inside a panel never
 * moves (it is anchored to the outer edge), the panel just slides open over it like a curtain. Half-body crops, black and white only.
 * The narrow panel changes its look while it is mostly closed, so a swap is never seen.
 */
import { cubicBezier } from "motion";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import Link from "next/link";
import { useRef } from "react";
import { looks } from "@/lib/lookbook-data";

const ease = cubicBezier(0.65, 0, 0.35, 1);

/** [look id, fade-in range]. The first layer of a side is always underneath at full opacity. */
const LEFT: { id: number; at?: [number, number] }[] = [{ id: 6 }, { id: 3, at: [0.24, 0.34] }, { id: 9, at: [0.74, 0.84] }];
const RIGHT: { id: number; at?: [number, number] }[] = [{ id: 7 }, { id: 12, at: [0.52, 0.62] }];

function Layer({ p, id, at, grow, still }: { p: MotionValue<number>; id: number; at?: [number, number]; grow: MotionValue<number>; still: boolean }) {
  const look = looks[id - 1];
  const op = useTransform(p, at ?? [0, 1], at ? [0, 1] : [1, 1], { clamp: true });
  const cap = useTransform(grow, [1, 1.7], [0, 1], { clamp: true });
  return (
    <motion.div style={{ opacity: still ? (at ? 0 : 1) : op }} className="absolute inset-0">
      <img
        src={`/lookbook/${look.model}`}
        alt={look.name}
        width={look.trimModel.w}
        height={look.trimModel.h}
        loading="lazy"
        decoding="async"
        draggable={false}
        className="absolute left-1/2 top-[-8%] h-[185%] w-auto max-w-none -translate-x-1/2 select-none grayscale contrast-[1.06]"
      />
      <motion.p style={{ opacity: cap }} className="absolute bottom-4 left-4 right-4 z-10 text-sm font-semibold leading-snug tracking-[-0.02em] text-ink md:bottom-6 md:left-6 md:text-base">
        {look.name}
        <span className="mt-0.5 block text-xs font-normal text-slate">{look.category}</span>
      </motion.p>
    </motion.div>
  );
}

function Panel({ side, grow, p, layers, still }: { side: "left" | "right"; grow: MotionValue<number>; p: MotionValue<number>; layers: typeof LEFT; still: boolean }) {
  return (
    <motion.div style={{ flexGrow: grow, flexBasis: 0, backgroundColor: side === "left" ? "#EDEDED" : "#E3E3E3" }} className="relative min-w-0 overflow-hidden rounded-[18px]">
      {/* fixed-width holder, anchored to the outer edge: the figure sits on its centre line, so a half-open panel shows half of it */}
      <div style={{ width: "66.67cqw" }} className={`absolute inset-y-0 ${side === "left" ? "left-0" : "right-0"}`}>
        {layers.map((l) => <Layer key={l.id} p={p} id={l.id} at={l.at} grow={grow} still={still} />)}
      </div>
    </motion.div>
  );
}

export function Commissions() {
  const reduced = !!useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4, restDelta: 0.0005 });
  const left = useTransform(p, [0, 0.05, 0.2, 0.3, 0.45, 0.55, 0.7, 0.8, 0.95, 1], [2, 2, 1, 1, 2, 2, 1, 1, 2, 2], { ease });
  const right = useTransform(left, (v) => 3 - v);
  const fixedL = useMotionValue(2);
  const fixedR = useMotionValue(1);

  return (
    <section ref={ref} id="commissions" aria-labelledby="commissions-h" className={`bg-white text-ink ${reduced ? "section-y" : "h-[320svh]"}`}>
      <div className={`${reduced ? "" : "sticky top-0 h-svh pb-6 pt-20 md:pb-8 md:pt-24"} container-x flex flex-col`}>
        <div className="flex items-end justify-between gap-6 pb-5 md:pb-7">
          <h2 id="commissions-h" className="text-[clamp(1.75rem,3.4vw,3.25rem)] font-bold leading-none tracking-[-0.045em]">Selected commissions</h2>
          <Link href="/collections" className="group inline-flex shrink-0 items-center gap-3 text-sm font-semibold">
            View all
            <span aria-hidden className="block h-px w-8 bg-ink transition-all duration-500 group-hover:w-16" />
          </Link>
        </div>
        <div style={{ containerType: "inline-size" }} className={`flex w-full gap-2 md:gap-3 ${reduced ? "h-[70svh]" : "min-h-0 flex-1"}`}>
          <Panel side="left" grow={reduced ? fixedL : left} p={p} layers={LEFT} still={reduced} />
          <Panel side="right" grow={reduced ? fixedR : right} p={p} layers={RIGHT} still={reduced} />
        </div>
      </div>
    </section>
  );
}
