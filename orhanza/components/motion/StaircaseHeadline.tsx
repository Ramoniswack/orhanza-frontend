"use client";

/**
 * B — StaircaseHeadline: 3–4 lines, each indented further than the last. Lines enter with LineMaskReveal,
 * then colour is scroll-scrubbed per line (light grey → #B3B3B3 → final). Setup lines stop at mid-grey,
 * punchline lines finish near-black (or cream on dark). Each line's progress is offset so they fill in sequence.
 */
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { MaskLine } from "./LineMaskReveal";

export type StairLine = { text: string; tone?: "setup" | "punch" };

export function StaircaseHeadline({
  lines,
  indents = [0, 0.6, 1.2, 0.6],
  dark = false,
  size = "xl",
  className = "",
}: {
  lines: StairLine[];
  indents?: number[];
  dark?: boolean;
  size?: "md" | "xl";
  className?: string;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 88%", "end 38%"] });

  return (
    <h2 ref={ref} className={`stair ${size === "xl" ? "h-section-xl" : "h-section"} ${className}`}>
      {lines.map((line, i) => (
        <StairLineView key={i} line={line} i={i} indent={indents[i % indents.length]} p={scrollYProgress} dark={dark} reduce={!!reduce} />
      ))}
    </h2>
  );
}

function StairLineView({ line, i, indent, p, dark, reduce }: { line: StairLine; i: number; indent: number; p: MotionValue<number>; dark: boolean; reduce: boolean }) {
  const punch = line.tone === "punch";
  const start = Math.min(i * 0.16, 0.5);
  const light = dark ? "#2B2B2F" : "#E9E9EA";
  const mid = "#B3B3B3";
  const final = dark ? "#EDE5D6" : "#1B1B1D";
  const color = useTransform(p, punch ? [start, start + 0.18, start + 0.4] : [start, start + 0.3], punch ? [light, mid, final] : [light, mid]);

  return (
    <MaskLine index={i} style={{ marginLeft: `calc(${indent}em * var(--stair-scale, 1))` }}>
      <motion.span style={{ color: reduce ? (punch ? final : mid) : color }}>{line.text}</motion.span>
    </MaskLine>
  );
}
