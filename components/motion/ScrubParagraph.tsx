"use client";

/** C — ScrubParagraph: words go from 20% opacity to full as the paragraph moves through the viewport (scroll-linked). */
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";

export function ScrubParagraph({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 86%", "end 48%"] });
  const words = text.split(" ");

  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <Word key={i} w={w} i={i} n={words.length} p={scrollYProgress} reduce={!!reduce} />
      ))}
    </p>
  );
}

function Word({ w, i, n, p, reduce }: { w: string; i: number; n: number; p: MotionValue<number>; reduce: boolean }) {
  const start = (i / n) * 0.8;
  const opacity = useTransform(p, [start, start + 0.2], [0.2, 1]);
  return (
    <motion.span style={{ opacity: reduce ? 1 : opacity }} className="mr-[0.25em] inline-block">
      {w}
    </motion.span>
  );
}
