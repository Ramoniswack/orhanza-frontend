"use client";

/** 9 — Testimonials: BgFlip to dark, crossfading slides + thin progress bar, then a staircase headline over a large image with an odometer metrics panel. Quotes are placeholders. */
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import { BgFlip, KineticNumber, LineMaskReveal, StaircaseHeadline } from "@/components/motion";
import { SectionLabel } from "@/components/SectionLabel";
import { testimonialSlides } from "@/lib/content";

const SLIDE_MS = 6000;

export function Testimonials() {
  const [i, setI] = useState(0);
  const slide = testimonialSlides[i];

  return (
    <BgFlip tone="dark" pushUp className="pb-14 pt-14 md:pb-20 md:pt-20">
      <div className="container-x">
        <SectionLabel label="Testimonials" dark />
        <div className="mx-auto mt-5 max-w-4xl text-center md:mt-6">
          <LineMaskReveal as="h2" className="h-section-xl" lines={["What clients", "say"]} />
          <svg viewBox="0 0 24 24" className="mx-auto mt-5 h-8 w-8 fill-gold" aria-hidden><path d="M4 18v-6c0-4 2-7 6-8l1 2c-2 1-3 3-3 5h3v7H4zm10 0v-6c0-4 2-7 6-8l1 2c-2 1-3 3-3 5h3v7h-7z" /></svg>
        </div>

        <div className="mt-8 grid items-center gap-8 md:grid-cols-[1fr_1.1fr] md:gap-16">
          <div>
            <div className="relative aspect-[4/3] overflow-hidden bg-[#111]">
              <AnimatePresence mode="popLayout">
                <motion.div key={i} initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} className="absolute inset-0">
                  <Image src={slide.image} alt="Orhanza client look" fill sizes="(min-width:768px) 40vw, 100vw" className="object-cover" />
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="mt-3 h-px w-full bg-ivory/15">
              <motion.div key={i} className="h-full bg-gold" initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: SLIDE_MS / 1000, ease: "linear" }} onAnimationComplete={() => setI((v) => (v + 1) % testimonialSlides.length)} />
            </div>
            <p className="mt-4 flex items-baseline gap-2 text-sm text-ivory/60"><KineticNumber value={i + 1} pad={2} play className="text-ivory" /> / {String(testimonialSlides.length).padStart(2, "0")}</p>
          </div>
          <div className="relative min-h-[16rem]">
            <AnimatePresence mode="wait">
              <motion.figure key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
                <blockquote className="text-3xl font-semibold leading-[1.1] tracking-[-0.03em] md:text-5xl">{slide.quote}</blockquote>
                <figcaption className="label-micro mt-6 text-ivory/60">— {slide.name}</figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-10 md:mt-14">
          <div className="relative aspect-[16/10] overflow-hidden bg-[#111] md:aspect-[16/8]">
            <Image src="/images/products/wool-linen-groomsmen-suit-a.webp" alt="Wool-linen groomsmen suit — Orhanza" fill sizes="100vw" className="object-cover object-top opacity-70" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent" />
            <StaircaseHeadline
              dark
              size="md"
              className="absolute left-6 top-8 md:left-12 md:top-12"
              lines={[{ text: "When the fit", tone: "setup" }, { text: "is right, the", tone: "setup" }, { text: "confidence", tone: "punch" }, { text: "follows", tone: "punch" }]}
            />
          </div>
        </div>
      </div>
    </BgFlip>
  );
}
