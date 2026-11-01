"use client";

/**
 * 12 — FAQ as a master / detail panel. Questions sit in a list; a sliding pill follows the active one while a dark answer card
 * wipes to the new answer (clip-path), words rise in, the number rolls and a drawn illustration redraws.
 */
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Pin, Tag } from "@/components/Icons";
import { Mannequin, SwatchStack } from "@/components/Illustrations";
import { KineticNumber, MaskLine, RollText } from "@/components/motion";
import { SectionLabel } from "@/components/SectionLabel";
import { faqs } from "@/lib/content";
import { site } from "@/lib/site";

const EASE = [0.22, 1, 0.36, 1] as const;
const art = [Mannequin, SwatchStack, Tag, Pin];

export function Faq() {
  const [active, setActive] = useState(0);
  const Art = art[active % art.length];
  return (
    <section id="faq" className="bg-white py-14 text-ink md:py-20">
      <div className="container-x">
        <SectionLabel label="FAQ" />
        <h2 className="h-section-xl mt-5 md:mt-6"><MaskLine>Good to know</MaskLine></h2>

        <div className="mt-8 grid gap-3 md:mt-12 md:grid-cols-[5fr_7fr] md:gap-5">
          <ul className="flex flex-col gap-1.5" role="tablist" aria-label="Questions">
            {faqs.map((f, i) => {
              const on = active === i;
              return (
                <motion.li
                  key={f.q}
                  initial={{ opacity: 0, x: -28 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.7, ease: EASE, delay: i * 0.07 }}
                >
                  <button
                    role="tab"
                    aria-selected={on}
                    onClick={() => setActive(i)}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    className={`group relative flex w-full items-center gap-4 rounded-[16px] px-5 py-5 text-left transition-colors duration-300 md:gap-6 md:px-6 md:py-7 ${on ? "text-ivory" : "hover:bg-[#F5F4F0]"}`}
                  >
                    {on && <motion.span layoutId="faq-pill" transition={{ type: "spring", stiffness: 420, damping: 36 }} className="absolute inset-0 rounded-[16px] bg-ink" />}
                    <span className={`relative z-10 w-7 shrink-0 text-sm ${on ? "text-gold" : "text-mute"}`}><KineticNumber value={i + 1} pad={2} stagger={0.06} /></span>
                    <span className="relative z-10 flex-1 text-lg font-semibold tracking-[-0.03em] md:text-[1.45rem] md:leading-[1.1]">{f.q}</span>
                    <motion.span aria-hidden animate={{ x: on ? 0 : -8, opacity: on ? 1 : 0 }} transition={{ duration: 0.3 }} className="relative z-10 text-lg text-gold">→</motion.span>
                  </button>
                </motion.li>
              );
            })}
          </ul>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
            role="tabpanel"
            className="relative min-h-[22rem] overflow-hidden rounded-[22px] bg-ink p-7 text-ivory md:min-h-[30rem] md:p-10"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active}
                initial={{ clipPath: "inset(0% 0% 100% 0%)", opacity: 0.4 }}
                animate={{ clipPath: "inset(0% 0% 0% 0%)", opacity: 1 }}
                exit={{ clipPath: "inset(100% 0% 0% 0%)", opacity: 0.4 }}
                transition={{ duration: 0.38, ease: EASE }}
                className="absolute inset-0 flex flex-col justify-between p-7 md:p-10"
              >
                <div className="flex items-start justify-between gap-6">
                  <span className="flex items-baseline gap-3 text-ivory/60">
                    <KineticNumber value={active + 1} pad={2} play className="text-5xl font-semibold tracking-[-0.04em] text-ivory md:text-6xl" />
                    <span className="text-lg">/ {String(faqs.length).padStart(2, "0")}</span>
                  </span>
                  <span className="h-24 w-24 shrink-0 text-gold md:h-36 md:w-36"><Art className="h-full w-full" /></span>
                </div>

                <div>
                  <p className="label-micro text-gold">{faqs[active].q}</p>
                  <p className="mt-4 max-w-xl text-[clamp(1.6rem,2.8vw,2.9rem)] font-semibold leading-[1.08] tracking-[-0.04em]">
                    {faqs[active].a.split(" ").map((w, i) => (
                      <span key={i} className="mr-[0.25em] inline-block overflow-hidden pb-[0.1em] align-bottom">
                        <motion.span initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ duration: 0.6, ease: EASE, delay: 0.12 + i * 0.025 }} className="inline-block">{w}</motion.span>
                      </span>
                    ))}
                  </p>
                  <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="group mt-8 inline-flex items-center gap-3 text-base font-semibold">
                    <RollText>Still unsure? Message us</RollText>
                    <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1.5">→</span>
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
