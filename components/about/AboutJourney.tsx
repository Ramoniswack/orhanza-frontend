"use client";

/**
 * 3 — OUR JOURNEY. A plain list (no pinning, no scroll-driven steps). Hover a row — or tap it on a phone, or focus it with the keyboard —
 * and it becomes the active step: label grows, text brightens, row lifts on a soft shadow. The model cut-out is taller than the list and sits in the middle.
 * REPLACE the milestones with real dates and stories when you have them (labels are chapters, so no dates are invented).
 */
import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import { SectionLabel } from "@/components/SectionLabel";

// REPLACE — swap `label` for years (e.g. "2019") and edit the text.
const milestones = [
  { label: "The Studio", text: "A tailoring studio opens in Jhamsikhel, built around the fitting room." },
  { label: "Home Tailoring", text: "We begin visiting clients at home, from first consultation to final fitting." },
  { label: "Made to Measure", text: "Every suit, coat and blazer is drafted from your own measurements." },
  { label: "Wedding Season", text: "Grooms, families and wedding parties dress with us, start to finish." },
  { label: "Women's Line", text: "Pantsuits and tailored coats join the collection." },
  { label: "Today", text: "Orhanza keeps raising the standard of tailoring in Nepal, one fitting at a time." },
];
const EASE = [0.22, 1, 0.36, 1] as const;

export function AboutJourney() {
  const reduce = !!useReducedMotion();
  const [active, setActive] = useState(0);

  return (
    <section aria-labelledby="journey-h" className="bg-white pb-16 pt-6 md:pb-24 md:pt-10">
      <div className="container-x">
        <SectionLabel label="Our journey" />
        <h2 id="journey-h" className="h-display mt-5 text-center text-[clamp(2.2rem,5vw,4.6rem)] text-ink">Our journey</h2>

        {/* phones: cut-out above the list */}
        <div className="mt-6 flex justify-center md:hidden">
          <Image src="/images/about/journey-models.webp" alt="" width={768} height={1124} sizes="45vw" className="h-[34svh] w-auto" />
        </div>

        <div className="relative mt-6 md:mt-12">
          <ol className="relative">
            {milestones.map((m, i) => {
              const on = i === active;
              return (
                <motion.li
                  key={m.label}
                  tabIndex={0}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  initial={false}
                  animate={{ opacity: on ? 1 : 0.4, boxShadow: on ? "0 18px 40px -18px rgba(0,0,0,.2)" : "0 0 0 rgba(0,0,0,0)" }}
                  transition={{ duration: reduce ? 0 : 0.5, ease: EASE }}
                  className="flex cursor-default flex-col gap-1 rounded-[14px] border-b border-ink/10 bg-white px-4 py-4 outline-none md:flex-row md:items-center md:justify-between md:px-6 md:py-8"
                >
                  <motion.span animate={{ scale: on ? 1.3 : 1 }} transition={{ duration: reduce ? 0 : 0.5, ease: EASE }} className="origin-left text-[clamp(1.1rem,1.7vw,1.6rem)] font-semibold tracking-[-0.02em]">
                    {m.label}
                  </motion.span>
                  <span className="text-[13px] leading-snug text-slate md:w-[26%]">{m.text}</span>
                </motion.li>
              );
            })}
          </ol>

          {/* desktop: bigger cut-out standing in the middle, a little taller than the list */}
          <div aria-hidden className="pointer-events-none absolute inset-x-0 -bottom-8 -top-8 z-10 hidden justify-center md:flex">
            <Image src="/images/about/journey-models.webp" alt="" width={768} height={1124} sizes="40vw" className="h-full w-auto max-w-none" />
          </div>
        </div>
      </div>
    </section>
  );
}
