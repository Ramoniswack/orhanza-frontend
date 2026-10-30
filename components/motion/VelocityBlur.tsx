"use client";

/** E — VelocityBlur: blur(0–8px) plus a faint horizontal ghost trail, both proportional to scroll velocity. */
import { motion, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from "motion/react";
import type { ReactNode } from "react";

export function VelocityBlur({ children, className = "", max = 8, ghost = "rgba(0,0,0,0.14)" }: { children: ReactNode; className?: string; max?: number; ghost?: string }) {
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { stiffness: 220, damping: 40 });
  const reduce = useReducedMotion();
  const filter = useTransform(velocity, (v) => {
    if (reduce) return "none";
    const blur = Math.min(Math.abs(v) / 260, 1) * max;
    if (blur < 0.15) return "none";
    const trail = Math.max(-26, Math.min(26, -v / 55));
    return `blur(${blur.toFixed(2)}px) drop-shadow(${trail.toFixed(1)}px 0 0 ${ghost})`;
  });
  return (
    <motion.div style={{ filter }} className={className}>
      {children}
    </motion.div>
  );
}
