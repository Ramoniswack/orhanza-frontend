"use client";

/**
 * 4 — CLAIM YOUR STYLE. One row: model pair left · call-to-action centre · model pair right. Nothing overlaps and there is no dead space.
 * The pairs glide up once as the row enters the viewport.
 */
import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

const EASE = [0.22, 1, 0.36, 1] as const;

export function AboutCta() {
  const reduce = !!useReducedMotion();
  const rise = (x: number) =>
    reduce ? {} : { initial: { opacity: 0, y: 60, x }, whileInView: { opacity: 1, y: 0, x: 0 }, viewport: { once: true, amount: 0.3 }, transition: { duration: 1, ease: EASE } };

  return (
    <section aria-label="Book a fitting" className="overflow-x-clip bg-white pt-10 md:pt-16">
      <div className="container-x flex items-end justify-between gap-3">
        <motion.div {...rise(-40)} aria-hidden className="shrink-0">
          <Image src="/images/about/cta-left.webp" alt="" width={356} height={702} sizes="(min-width:768px) 20vw, 28vw" className="h-[30svh] w-auto md:h-[52svh]" />
        </motion.div>

        <Link href="/#book" className="group flex flex-1 items-center justify-center gap-3 self-center pb-6 text-center">
          <span className="h-display text-[clamp(1.5rem,3.6vw,3.4rem)] text-ink">Claim your style</span>
          <span aria-hidden className="text-[clamp(1.5rem,3.6vw,3.4rem)] leading-none text-gold transition-transform duration-500 group-hover:translate-x-2">→</span>
        </Link>

        <motion.div {...rise(40)} aria-hidden className="shrink-0">
          <Image src="/images/about/cta-right.webp" alt="" width={379} height={699} sizes="(min-width:768px) 20vw, 28vw" className="h-[30svh] w-auto md:h-[52svh]" />
        </motion.div>
      </div>
    </section>
  );
}
