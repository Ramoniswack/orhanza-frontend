"use client";

/**
 * KineticNumber — mechanical odometer digits.
 *
 * Every digit is its own column holding a 0–9 strip (+ a repeated 0 so 9 → 0 rolls on instead of snapping).
 * A column is positioned by a single motion value, so:
 *  - the old digit rolls UP and out, the new one rolls in from BELOW (and the reverse when the value goes down)
 *  - changing the value mid-roll just retargets the motion value: no overlapping or stacked animations
 *  - columns have a fixed width (tabular digits), so 9 → 10 or 01 → 02 never shifts the layout
 *
 * <KineticNumber value={n} />          discrete value — rolls (staggered per digit) whenever `value` changes
 * <KineticMV value={motionValue} />    continuous value (scroll progress, percentages) — mechanical carry, no text swapping
 */
import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform, type MotionValue } from "motion/react";
import { useEffect, useRef } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;
const STRIP = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
const mod10 = (n: number) => ((n % 10) + 10) % 10;

/** Fade digits slightly as they pass the top/bottom edge of the window — a roll, not a cross-fade. */
const EDGE_MASK = "linear-gradient(to bottom, transparent 0%, #000 9%, #000 91%, transparent 100%)";

/** One rolling column. `pos` is an unbounded real number: visible digit = pos mod 10, fraction = roll progress. */
function Column({ pos, opacity }: { pos: MotionValue<number>; opacity?: MotionValue<number> }) {
  const y = useTransform(pos, (v) => `${-mod10(v)}em`);
  return (
    <motion.span
      aria-hidden
      className="relative block h-[1em] w-[1ch] overflow-hidden text-center leading-none"
      style={{ maskImage: EDGE_MASK, WebkitMaskImage: EDGE_MASK, opacity }}
    >
      <motion.span style={{ y }} className="absolute inset-x-0 top-0 flex flex-col">
        {STRIP.map((d, i) => (
          <span key={i} className="block h-[1em] leading-none">{d}</span>
        ))}
      </motion.span>
    </motion.span>
  );
}

function Suffix({ children }: { children: React.ReactNode }) {
  return <sup className="ml-[0.1em] mt-[0.08em] text-[0.36em] font-medium leading-none text-mute" aria-hidden>{children}</sup>;
}

/* ───────────────────────── discrete value ───────────────────────── */

function Place({ k, n, go, delay, duration, reduce }: { k: number; n: number; go: boolean; delay: number; duration: number; reduce: boolean }) {
  // unbounded "tick count" for this place: ones = n, tens = floor(n/10)… so 9 → 10 rolls the ones column on to 0 and the tens column on to 1
  const target = Math.floor(n / 10 ** k);
  const pos = useMotionValue(reduce ? target : 0);
  useEffect(() => {
    if (!go) return;
    const controls = animate(pos, target, { duration: reduce ? 0 : duration, delay: reduce ? 0 : delay, ease: EASE });
    return () => controls.stop(); // retarget from wherever it is — rapid changes never stack
  }, [go, target, delay, duration, reduce, pos]);
  return <Column pos={pos} />;
}

export function KineticNumber({
  value,
  pad = 0,
  suffix,
  className = "",
  stagger = 0.06,
  duration = 0.8,
  play,
}: {
  value: number | string;
  /** minimum digit count — `pad={2}` renders 1 as "01" */
  pad?: number;
  suffix?: string;
  className?: string;
  /** delay between digits (left → right) */
  stagger?: number;
  duration?: number;
  /** force-start (e.g. a counter that is always on screen). Default: start when scrolled into view. */
  play?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, { amount: 0.4, once: true });
  const reduce = !!useReducedMotion();
  const n = Math.max(0, Math.round(Number(value) || 0));
  const count = Math.max(pad, String(n).length);
  const go = play ?? seen;

  return (
    <span ref={ref} role="text" aria-label={`${n}${suffix ?? ""}`} className={`inline-flex items-start leading-none [font-variant-numeric:lining-nums_tabular-nums] ${className}`}>
      <span className="inline-flex" aria-hidden>
        {Array.from({ length: count }, (_, i) => {
          const k = count - 1 - i;
          return <Place key={k} k={k} n={n} go={go} delay={i * stagger} duration={duration} reduce={reduce} />;
        })}
      </span>
      {suffix && <Suffix>{suffix}</Suffix>}
    </span>
  );
}

/* ───────────────────────── continuous value ───────────────────────── */

/** Position of place k for a continuous value: mechanical odometer — a column only advances while every lower column is on 9 → 0. */
function placePos(v: number, k: number): number {
  if (k === 0) return v;
  const below = mod10(placePos(v, k - 1));
  return Math.floor(v / 10 ** k) + Math.max(0, below - 9);
}

function MVPlace({ value, k }: { value: MotionValue<number>; k: number }) {
  const pos = useTransform(value, (v) => placePos(Math.max(0, v), k));
  // leading zeros fade out instead of popping, but keep their width → no layout shift
  const opacity = useTransform(value, (v) => (k === 0 ? 1 : Math.min(1, Math.max(0, v - (10 ** k - 1)))));
  return <Column pos={pos} opacity={opacity} />;
}

export function KineticMV({ value, places = 3, suffix, className = "" }: { value: MotionValue<number>; places?: number; suffix?: string; className?: string }) {
  return (
    <span className={`inline-flex items-start leading-none [font-variant-numeric:lining-nums_tabular-nums] ${className}`} aria-hidden>
      <span className="inline-flex">
        {Array.from({ length: places }, (_, i) => {
          const k = places - 1 - i;
          return <MVPlace key={k} value={value} k={k} />;
        })}
      </span>
      {suffix && <Suffix>{suffix}</Suffix>}
    </span>
  );
}
