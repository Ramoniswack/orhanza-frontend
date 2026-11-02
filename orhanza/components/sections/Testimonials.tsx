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
  const n = testimonialSlides.length;
  const slide = testimonialSlides[i];
  const go = (k: number) => setI(((k % n) + n) % n);

  return (
    <BgFlip tone="dark" pushUp className="pb-14 pt-14 md:pb-24 md:pt-20">
      <div className="container-x">
        <SectionLabel label="Testimonials" dark />

        {/* heading row: title left, controls right */}
        <div className="mt-5 flex flex-wrap items-end justify-between gap-6 md:mt-6">
          <LineMaskReveal as="h2" className="h-section-xl" lines={["What clients say"]} />
          <div className="flex items-center gap-5">
            <p className="flex items-baseline gap-2 text-sm text-ivory/60"><KineticNumber value={i + 1} pad={2} play className="text-ivory" /> / {String(n).padStart(2, "0")}</p>
            <div className="flex gap-2">
              {([["Previous testimonial", -1, "M15 5l-7 7 7 7"], ["Next testimonial", 1, "M9 5l7 7-7 7"]] as const).map(([label, d, path]) => (
                <button key={label} type="button" aria-label={label} onClick={() => go(i + d)} className="grid h-11 w-11 place-items-center rounded-full border border-ivory/25 text-ivory transition-colors hover:border-gold hover:text-gold">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d={path} /></svg>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-10 md:mt-14 md:grid-cols-[5fr_7fr] md:gap-16 lg:gap-24">
          {/* portrait */}
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[22px] bg-[#111] md:mx-0 md:max-w-none">
            <AnimatePresence mode="popLayout">
              <motion.div key={i} initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} className="absolute inset-0">
                <Image src={slide.image} alt="Orhanza client look" fill sizes="(min-width:768px) 40vw, 100vw" className="object-cover object-top" />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* quote */}
          <div className="flex flex-col justify-center">
            <svg viewBox="0 0 24 24" className="h-9 w-9 fill-gold" aria-hidden><path d="M4 18v-6c0-4 2-7 6-8l1 2c-2 1-3 3-3 5h3v7H4zm10 0v-6c0-4 2-7 6-8l1 2c-2 1-3 3-3 5h3v7h-7z" /></svg>
            <div className="relative mt-6 min-h-[15rem] md:min-h-[17rem]">
              <AnimatePresence mode="wait">
                <motion.figure key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
                  <blockquote className="text-[clamp(1.6rem,2.6vw,2.6rem)] font-medium leading-[1.2] tracking-[-0.02em] text-ivory">{slide.quote}</blockquote>
                  <figcaption className="mt-8 flex items-center gap-4 text-sm text-ivory/70">
                    <span aria-hidden className="h-px w-10 bg-gold" />
                    <span className="label-micro">{slide.name}</span>
                  </figcaption>
                </motion.figure>
              </AnimatePresence>
            </div>

            {/* segmented progress — one bar per testimonial, click to jump */}
            <div className="mt-6 flex gap-3" role="tablist" aria-label="Testimonials">
              {testimonialSlides.map((_, k) => (
                <button key={k} type="button" role="tab" aria-selected={k === i} aria-label={`Testimonial ${k + 1}`} onClick={() => go(k)} className="group relative h-6 flex-1 max-w-24">
                  <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-ivory/20 transition-colors group-hover:bg-ivory/40" />
                  {k < i && <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gold/60" />}
                  {k === i && (
                    <motion.span key={i} className="absolute left-0 top-1/2 h-[2px] -translate-y-1/2 bg-gold" initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: SLIDE_MS / 1000, ease: "linear" }} onAnimationComplete={() => go(i + 1)} />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 md:mt-14">
          <div className="relative aspect-[16/10] overflow-hidden rounded-[22px] bg-[#111] md:aspect-[16/8]">
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
