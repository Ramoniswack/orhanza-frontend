"use client";

/**
 * 4 — Craft: staircase headline, then the workbench photograph ringed by drawn tools (they float) beside a numbered list.
 * Every row carries its own drawn icon that draws in and tilts on hover.
 */
import { motion } from "motion/react";
import Image from "next/image";
import { Button, Drift, Hanger, Ruler, Scissors, Spool, Thimble } from "@/components/Icons";
import { NeedleThread } from "@/components/Illustrations";
import { KineticNumber, StaircaseHeadline } from "@/components/motion";
import { SectionLabel } from "@/components/SectionLabel";
import { values } from "@/lib/content";

const EASE = [0.22, 1, 0.36, 1] as const;
const rowIcons = [Ruler, Spool, Hanger, Thimble, Scissors];

function Badge({ children, className, delay = 0 }: { children: React.ReactNode; className: string; delay?: number }) {
  return (
    <Drift delay={delay} amp={10} dur={5 + delay} className={`absolute z-10 flex h-24 w-24 items-center justify-center rounded-full bg-white p-5 text-gold shadow-[0_10px_40px_-12px_rgba(0,0,0,0.25)] md:h-28 md:w-28 ${className}`}>
      {children}
    </Drift>
  );
}

export function Craft() {
  return (
    <section id="about" className="relative overflow-hidden bg-white py-14 text-ink md:py-20">
      <div className="container-x">
        <SectionLabel label="Craft" />
        <StaircaseHeadline
          className="mt-5 md:mt-6"
          lines={[{ text: "The fit", tone: "setup" }, { text: "speaks for", tone: "punch" }, { text: "itself", tone: "punch" }]}
          indents={[0, 0.6, 1.2]}
        />

        <div className="mt-10 grid items-center gap-14 md:mt-14 md:grid-cols-[0.85fr_1.15fr] md:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.9, ease: EASE }}
            className="relative mx-auto w-full max-w-md md:max-w-none"
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-card">
              <Image src="/images/banners/craft-hands.webp" alt="Tailor's hands, shears and cloth at the Orhanza workbench" fill sizes="(min-width:768px) 38vw, 100vw" className="object-cover" />
            </div>
            <Drift delay={0.4} amp={6} rot={2} dur={7} className="absolute -left-4 top-1/3 hidden h-28 w-20 text-ivory md:block"><NeedleThread className="h-full w-full" /></Drift>
          </motion.div>

          <ul className="border-t hairline">
            {values.map((v, i) => {
              const Icon = rowIcons[i % rowIcons.length];
              return (
                <motion.li
                  key={v.name}
                  initial={{ opacity: 0, x: 36 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.75, ease: EASE, delay: i * 0.08 }}
                  className="group flex items-center gap-5 border-b hairline py-5 transition-colors hover:bg-[#F7F5F0] md:gap-8 md:px-3 md:py-7"
                >
                  <span className="w-7 shrink-0 text-sm text-mute"><KineticNumber value={i + 1} pad={2} stagger={0.08} /></span>
                  <span className="flex-1">
                    <span className="block text-xl font-semibold tracking-[-0.03em] md:text-[1.9rem] md:leading-[1.05]">{v.name}</span>
                  </span>
                  <span className="h-12 w-12 shrink-0 text-gold transition-transform duration-500 group-hover:-rotate-12 group-hover:scale-110 md:h-14 md:w-14"><Icon className="h-full w-full" /></span>
                </motion.li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
