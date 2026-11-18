"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import Link from "next/link";
import { useRef } from "react";

const rise = (d: number) => ({ initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { duration: 1.2, delay: d, ease: [0.22, 1, 0.36, 1] as const } });

export function HeroVideo() {
  const ref = useRef<HTMLElement>(null);
  const reduce = !!useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const filmY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
  const copyOp = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={ref} id="hero" aria-label="Orhanza — bespoke tailoring" className="relative h-[100svh] min-h-[540px] overflow-hidden bg-charcoal text-ivory">
      {/* the film layer is 12% taller than the hero and starts 12% above it, so the parallax never exposes an empty strip */}
      <motion.div aria-hidden className="absolute inset-x-0 -top-[12%] h-[112%] will-change-transform" style={{ y: reduce ? 0 : filmY }}>
        <video
          className="h-full w-full object-cover object-[43%_center] md:object-center"
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

      <div aria-hidden className="absolute inset-0 bg-black/25 md:bg-black/30" />
      {/* phones: the headline sits low, so darken the lower half for legibility and keep the face clear */}
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/70 via-black/25 to-transparent md:hidden" />

      <motion.div
        style={{ opacity: reduce ? 1 : copyOp }}
        className="absolute inset-0 flex flex-col items-center justify-end px-6 pb-[max(3.5rem,11svh)] pt-20 text-center text-ivory md:justify-center md:pb-0 md:pt-16"
      >
        <motion.h1
          {...rise(0.3)}
          className="max-w-[15ch] text-balance text-[clamp(2.1rem,8.6vw,2.9rem)] font-normal leading-[1.08] sm:max-w-none md:text-[clamp(2.4rem,4vw,3.75rem)] md:leading-tight"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          Made to measure, made to last.
        </motion.h1>
        <motion.div {...rise(0.55)} className="mt-7 flex w-full justify-center md:mt-8">
          <Link
            href="/shop"
            className="inline-flex h-12 w-full max-w-[17rem] items-center justify-center border border-ivory/70 px-10 sm:w-auto text-[11px] font-semibold uppercase tracking-[0.22em] text-ivory backdrop-blur-[2px] transition-[background-color,color,border-color] duration-500 hover:border-ivory hover:bg-ivory hover:text-charcoal"
          >
            Shop now
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
