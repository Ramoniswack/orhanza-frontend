"use client";

/** D — OdometerNumber: each digit is a 0–9 column that rolls on Y with a short blur. Suffix is small, grey, superscript. */
import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";

export function OdometerNumber({ value, suffix, className = "", duration = 1.2 }: { value: string | number; suffix?: string; className?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { amount: 0.4, once: true });
  const reduce = !!useReducedMotion();
  const chars = String(value).split("");

  return (
    <span ref={ref} className={`inline-flex items-start ${className}`} role="text" aria-label={`${value}${suffix ?? ""}`}>
      <span className="inline-flex h-[1em] overflow-hidden leading-none" aria-hidden>
        {chars.map((c, i) =>
          /\d/.test(c) ? (
            <Digit key={i} d={Number(c)} go={inView || reduce} i={i} duration={duration} reduce={reduce} />
          ) : (
            <span key={i} className="block h-[1em] leading-none">{c}</span>
          ),
        )}
      </span>
      {suffix && (
        <sup className="ml-[0.1em] mt-[0.08em] text-[0.36em] font-medium leading-none text-mute" aria-hidden>
          {suffix}
        </sup>
      )}
    </span>
  );
}

function Digit({ d, go, i, duration, reduce }: { d: number; go: boolean; i: number; duration: number; reduce: boolean }) {
  return (
    <span className="relative block h-[1em] w-[0.62em] overflow-hidden">
      <motion.span
        className="absolute left-0 top-0 flex w-full flex-col"
        initial={{ y: reduce ? `-${d * 10}%` : "0%", filter: "blur(0px)" }}
        animate={go ? { y: `-${d * 10}%`, filter: reduce ? "blur(0px)" : ["blur(5px)", "blur(5px)", "blur(0px)"] } : undefined}
        transition={{ duration: reduce ? 0 : duration, ease: [0.16, 1, 0.3, 1], delay: i * 0.08, filter: { duration, times: [0, 0.6, 1], delay: i * 0.08 } }}
      >
        {Array.from({ length: 10 }, (_, n) => (
          <span key={n} className="block h-[1em] w-full text-center leading-none">{n}</span>
        ))}
      </motion.span>
    </span>
  );
}
