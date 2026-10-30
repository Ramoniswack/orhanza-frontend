"use client";

/** 4 — Craft: staircase headline, then a photographic portrait with a plain caption beside a numbered list of what we stand for. */
import { motion } from "motion/react";
import Image from "next/image";
import { KineticNumber, StaircaseHeadline } from "@/components/motion";
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

        <div className="mt-8 grid items-start gap-8 md:mt-10 md:grid-cols-[0.8fr_1.2fr] md:gap-12">
          <motion.figure
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-card">
              <Image src="/images/banners/instagram.webp" alt="Kriti Maharjan, founder of Orhanza" fill sizes="(min-width:768px) 36vw, 100vw" className="object-cover object-[50%_30%]" />
            </div>
            <figcaption className="mt-3 flex items-baseline justify-between gap-4 text-sm">
              <span className="font-semibold">Kriti Maharjan</span>
              <span className="text-mute">Founder & Owner</span>
            </figcaption>
          </motion.figure>

          <ul className="border-t hairline">
            {values.map((v, i) => (
              <motion.li
                key={v.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 }}
                className="flex items-baseline gap-6 border-b hairline py-6 md:gap-10 md:py-8"
              >
                <span className="w-8 shrink-0 text-sm text-mute"><KineticNumber value={i + 1} pad={2} stagger={0.08} /></span>
                <span className="text-xl font-semibold tracking-[-0.02em] md:text-3xl">{v.name}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
