"use client";

/** 4 — "Recognition" slot → craft & values. Staircase, accent feature card + hairline rows (fade-up 24px, 0.08s), then ScrubParagraph with a star watermark. */
import { motion } from "motion/react";
import { StaircaseHeadline } from "@/components/motion";
import { SectionLabel } from "@/components/SectionLabel";
import { values } from "@/lib/content";

export function Craft() {
  return (
    <section id="about" className="bg-white py-14 text-ink md:py-20">
      <div className="container-x">
        <SectionLabel label="Craft" />
        <StaircaseHeadline
          className="mt-5 md:mt-6"
          lines={[{ text: "THE FIT", tone: "setup" }, { text: "SPEAKS FOR", tone: "punch" }, { text: "ITSELF", tone: "punch" }]}
          indents={[0, 0.6, 1.2]}
        />

        <div className="mt-6 grid gap-4 md:mt-8 md:grid-cols-[0.8fr_1.2fr] md:gap-6">
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex min-h-[420px] flex-col justify-between overflow-hidden bg-burgundy p-8 text-ivory"
          >
            <svg viewBox="0 0 24 24" className="absolute -right-10 -top-10 h-64 w-64 fill-ivory/10" aria-hidden>
              <rect x="5" y="5" width="14" height="14" /><rect x="5" y="5" width="14" height="14" transform="rotate(45 12 12)" />
            </svg>
            <p className="label-micro">Founder & Owner</p>
            <div>
              <p className="text-5xl font-extrabold leading-none tracking-[-0.04em] md:text-6xl">Kriti<br />Maharjan</p>
            </div>
          </motion.div>

          <ul className="border-t hairline">
            {values.map((v, i) => (
              <motion.li
                key={v.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 }}
                className="flex items-baseline justify-between gap-6 border-b hairline py-6 md:py-8"
              >
                <span className="text-xl font-semibold tracking-[-0.02em] md:text-3xl">{v.name}</span>
              </motion.li>
            ))}
          </ul>
        </div>

      </div>
    </section>
  );
}
