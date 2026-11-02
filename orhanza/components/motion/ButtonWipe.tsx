"use client";

import Link from "next/link";
import { motion, useTransform, type MotionValue } from "motion/react";

const MotionLink = motion.create(Link);

type EaseFn = (t: number) => number;

/** A thin wedge that widens into a rectangle: scaleX 0→1, skewX −25°→0, rotate −6°→0. Label fades in over the last 40%. */
export function ButtonWipe({
  g, enter, ease, href, children, outline = false,
}: {
  g: MotionValue<number>;
  enter: [number, number];
  ease: EaseFn;
  href: string;
  children: string;
  outline?: boolean;
}) {
  const scaleX = useTransform(g, enter, [0, 1], { ease, clamp: true });
  const skewX = useTransform(g, enter, [-25, 0], { ease, clamp: true });
  const rotate = useTransform(g, enter, [-6, 0], { ease, clamp: true });
  const labelStart = enter[0] + (enter[1] - enter[0]) * 0.6;
  const label = useTransform(g, [labelStart, enter[1]], [0, 1], { ease, clamp: true });
  return (
    <MotionLink
      href={href}
      className={`relative z-10 mt-6 flex h-10 w-[200px] items-center justify-center text-[11px] uppercase tracking-[0.12em] ${outline ? "border border-[#111] bg-transparent text-[#111]" : "bg-[#111] text-white"}`}
      style={{ scaleX, skewX, rotate, transformOrigin: "left center" }}
    >
      <motion.span style={{ opacity: label }}>{children}</motion.span>
    </MotionLink>
  );
}
