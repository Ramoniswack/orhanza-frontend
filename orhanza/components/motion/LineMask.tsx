"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
import type { CSSProperties, ReactNode } from "react";

type EaseFn = (t: number) => number;

/**
 * Scroll-scrubbed line mask: wrapper clips, inner line rises 105% → 0.
 * `enter` is in "look units" of the global scroll value `g`; `fade` also fades opacity 0 → 1.
 */
export function LineMask({
  g, enter, ease, fade = false, className = "", style, children,
}: {
  g: MotionValue<number>;
  enter: [number, number];
  ease: EaseFn;
  fade?: boolean;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const y = useTransform(g, enter, ["105%", "0%"], { ease, clamp: true });
  const o = useTransform(g, enter, [0, 1], { ease, clamp: true });
  return (
    <span className={`block overflow-hidden pb-[0.12em] -mb-[0.12em] ${className}`} style={style}>
      <motion.span className="block will-change-transform" style={{ y, opacity: fade ? o : 1 }}>
        {children}
      </motion.span>
    </span>
  );
}
