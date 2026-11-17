"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import Link from "next/link";
import { useRef } from "react";

const rise = (d: number) => ({ initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { duration: 1.2, delay: d, ease: [0.22, 1, 0.36, 1] as const } });

export function HeroVideo() {
  const ref = useRef<HTMLElement>(null);
  const reduce = !!useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const filmY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const copyOp = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={ref} id="hero" aria-label="Orhanza — bespoke tailoring" className="relative h-[100svh] min-h-[600px] overflow-hidden bg-charcoal text-ivory">
      <motion.div aria-hidden className="absolute inset-0 will-change-transform" style={{ y: reduce ? 0 : filmY }}>
        <video
          className="h-[112%] w-full object-cover object-[30%_center] md:object-center"
          poster="/hero/hero-poster.jpg"
          autoPlay={!reduce}
          muted
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
        >
          <source src="/hero/hero-720.mp4" type="video/mp4" media="(max-width: 767px)" />
          <source src="/hero/hero.mp4" type="video/mp4" />
        </video>
      </motion.div>

      <div aria-hidden className="absolute inset-0 bg-black/30" />

      <motion.div
        style={{ opacity: reduce ? 1 : copyOp }}
        className="absolute inset-0 flex flex-col items-center justify-center px-6 pt-16 text-center text-ivory"
      >
        <motion.h1
          {...rise(0.3)}
          className="text-[clamp(2rem,4vw,3.75rem)] font-normal leading-tight"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          Made to measure, made to last.
        </motion.h1>
        <motion.div {...rise(0.55)} className="mt-5">
          <Link href="/shop" className="text-[11px] font-semibold uppercase tracking-[0.2em] transition-opacity hover:opacity-65">
            Shop now
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
