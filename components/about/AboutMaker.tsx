"use client";

/**
 * 2 — THE MAKER. A plain three-column row (no overlap, no dead space). Each photo glides in once from its own side as it enters the
 * viewport (left / below / right). REPLACE the paragraph with Kriti's own words.
 */
import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { ScrubParagraph } from "@/components/motion";
import { SectionLabel } from "@/components/SectionLabel";

const EASE = [0.22, 1, 0.36, 1] as const;

export function AboutMaker() {
  const reduce = !!useReducedMotion();
  const reveal = (from: object) =>
    reduce ? {} : { initial: { opacity: 0, ...from }, whileInView: { opacity: 1, x: 0, y: 0 }, viewport: { once: true, amount: 0.3 }, transition: { duration: 1, ease: EASE } };

  return (
    <section aria-labelledby="maker-h" className="overflow-x-clip bg-white pb-16 pt-16 md:pb-24 md:pt-24">
      <div className="container-x">
        <SectionLabel label="The maker" />
        <h2 id="maker-h" className="sr-only">The maker</h2>
        <ScrubParagraph text="Orhanza is Kriti Maharjan" className="h-display mt-6 text-center text-[clamp(2.2rem,5.6vw,5.5rem)] text-ink" />

        <div className="mt-10 grid items-end gap-6 md:mt-14 md:grid-cols-[1fr_1.1fr_1.4fr] md:gap-8">
          <motion.div {...reveal({ x: -60 })}>
            <Image src="/images/about/maker-blur.webp" alt="" width={1018} height={768} sizes="(min-width:768px) 28vw, 100vw" className="h-auto w-full" />
          </motion.div>
          <motion.div {...reveal({ y: 60 })}>
            <Image src="/images/about/maker-glasses.webp" alt="Kriti Maharjan in round glasses and a trench coat, tape measure over the shoulder" width={1214} height={768} sizes="(min-width:768px) 30vw, 100vw" className="h-auto w-full" />
          </motion.div>
          <motion.div {...reveal({ x: 60 })}>
            <Image src="/images/about/maker-eye.webp" alt="Close-up of the tailor's closed eye" width={1268} height={768} sizes="(min-width:768px) 38vw, 100vw" className="h-auto w-full" />
          </motion.div>
        </div>

        <div className="mt-8 max-w-xl md:mt-12">
          <p className="text-[clamp(1.1rem,1.6vw,1.5rem)] font-semibold tracking-[-0.02em]">The maker</p>
          <p className="mt-3 leading-relaxed text-slate">
            Kriti Maharjan founded Orhanza to bring precise, personal tailoring to Kathmandu. Every garment starts with a conversation and is cut to the one person who will wear it.
          </p>
        </div>
      </div>
    </section>
  );
}
