"use client";

/** 10 — Pricing slot → commissions. No prices are published, so rows show the step count (odometer) and "priced after consultation". */
import { motion } from "motion/react";
import Link from "next/link";
import { OdometerNumber, ScrubParagraph, StaircaseHeadline } from "@/components/motion";
import { SectionLabel } from "@/components/SectionLabel";
import { commissions } from "@/lib/content";

export function Commissions() {
  return (
    <section id="commissions" className="bg-white py-14 text-ink md:py-20">
      <div className="container-x">
        <SectionLabel label="Commissions" />
        <StaircaseHeadline
          className="mt-8 md:mt-10"
          lines={[{ text: "THE RIGHT BRIEF", tone: "setup" }, { text: "BUILDS THE RIGHT", tone: "setup" }, { text: "GARMENT AND", tone: "punch" }, { text: "CONFIDENCE", tone: "punch" }]}
        />
        <ScrubParagraph className="mt-16 max-w-3xl text-2xl font-semibold leading-tight tracking-[-0.03em] md:mt-24 md:text-4xl" text="Budget is part of the first conversation. We design the garment around it." />

        <div className="mt-16 border-t hairline md:mt-24">
          {commissions.map((c, i) => (
            <motion.article
              key={c.name}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 }}
              className="group grid items-center gap-6 border-b hairline py-8 md:grid-cols-[7rem_1.1fr_0.9fr_1.1fr_auto] md:gap-8 md:py-10"
            >
              <div className="h-20 w-28 rounded-xl" style={{ background: `linear-gradient(135deg, ${c.swatch[0]}, ${c.swatch[1]})` }} aria-hidden />
              <div>
                <h3 className="text-2xl font-extrabold tracking-[-0.04em] md:text-3xl">{c.name}</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {c.tags.map((t) => <span key={t} className="label-micro rounded-full border border-black/15 px-3 py-1">{t}</span>)}
                </div>
              </div>
              <div>
                <OdometerNumber value="5" suffix="steps" className="text-5xl font-extrabold tracking-[-0.05em]" />
                <p className="mt-2 text-xs text-slate">Priced after consultation</p>
              </div>
              <ul className="space-y-2 text-sm">
                {c.features.map((f) => (
                  <li key={f} className="flex items-center gap-3"><svg viewBox="0 0 12 12" className="h-3 w-3 shrink-0 stroke-gold" fill="none" strokeWidth="1.6"><path d="M2 6.5l2.5 2.5L10 3" /></svg>{f}</li>
                ))}
              </ul>
              <Link href="/#book" className="flex items-center gap-2 text-sm font-semibold">
                {c.cta.replace(" →", "")}<span className="inline-block transition-transform duration-300 group-hover:translate-x-2">→</span>
              </Link>
            </motion.article>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-6">
          <p className="text-3xl font-extrabold uppercase tracking-[-0.04em] md:text-5xl">Not sure where to start?</p>
          <Link href="/#book" className="btn btn-burgundy">Book a Consultation</Link>
        </div>
      </div>
    </section>
  );
}
