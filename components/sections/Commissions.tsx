"use client";

/** 10 — Pricing slot → commissions. No prices are published, so rows show the step count (odometer) and "priced after consultation". */
import { motion } from "motion/react";
import Link from "next/link";
import { StaircaseHeadline } from "@/components/motion";
import { SectionLabel } from "@/components/SectionLabel";
import { commissions } from "@/lib/content";

export function Commissions() {
  return (
    <section id="commissions" className="bg-white py-14 text-ink md:py-20">
      <div className="container-x">
        <SectionLabel label="Commissions" />
        <StaircaseHeadline
          className="mt-5 md:mt-6"
          lines={[{ text: "THE RIGHT BRIEF", tone: "setup" }, { text: "MAKES THE RIGHT", tone: "punch" }, { text: "GARMENT", tone: "punch" }]}
          indents={[0, 0.6, 1.2]}
        />

        <div className="mt-8 border-t hairline md:mt-10">
          {commissions.map((c, i) => (
            <motion.article
              key={c.name}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 }}
              className="group grid items-center gap-6 border-b hairline py-8 md:grid-cols-[7rem_1fr_auto] md:gap-8 md:py-10"
            >
              <div className="h-20 w-28 rounded-xl" style={{ background: `linear-gradient(135deg, ${c.swatch[0]}, ${c.swatch[1]})` }} aria-hidden />
              <div>
                <h3 className="text-2xl font-extrabold tracking-[-0.04em] md:text-3xl">{c.name}</h3>
              </div>
              <Link href="/#book" className="flex items-center gap-2 text-sm font-semibold">
                {c.cta.replace(" →", "")}<span className="inline-block transition-transform duration-300 group-hover:translate-x-2">→</span>
              </Link>
            </motion.article>
          ))}
        </div>

      </div>
    </section>
  );
}
