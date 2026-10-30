"use client";

/** 12 — FAQ: accordion with hairlines, accent "+" rotating 45° to ×, height on a spring (stiffness 300, damping 30), hover #F2F2F2. */
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ScrubParagraph, StaircaseHeadline } from "@/components/motion";
import { SectionLabel } from "@/components/SectionLabel";
import { faqs } from "@/lib/content";
import { site } from "@/lib/site";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="bg-white py-14 text-ink md:py-20">
      <div className="container-x">
        <SectionLabel label="FAQ" />
        <StaircaseHeadline
          className="mt-8 md:mt-10"
          lines={[{ text: "WHAT YOU NEED", tone: "setup" }, { text: "TO KNOW BEFORE", tone: "punch" }, { text: "WE START", tone: "punch" }]}
          indents={[0, 0.6, 1.2]}
        />

        <div className="mt-10 grid gap-10 md:mt-14 md:grid-cols-[0.7fr_1.3fr] md:gap-20">
          <div>
            <div className="relative aspect-[4/3] w-full max-w-xs overflow-hidden bg-card">
              <Image src="/images/banners/craft.webp" alt="Orhanza atelier" fill sizes="20rem" className="object-cover" />
            </div>
            <p className="mt-6 text-2xl font-semibold tracking-[-0.03em]">Have queries? Need help?</p>
            <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm underline underline-offset-4">Message {site.handle}</a>
          </div>

          <ul className="border-t hairline">
            {faqs.map((f, i) => {
              const isOpen = open === i;
              return (
                <li key={f.q} className="border-b hairline">
                  <button onClick={() => setOpen(isOpen ? null : i)} aria-expanded={isOpen} className="flex w-full items-center justify-between gap-6 py-6 text-left transition-colors hover:bg-[#F2F2F2] md:px-3">
                    <span className="text-lg font-semibold tracking-[-0.02em] md:text-2xl">{f.q}</span>
                    <motion.span animate={{ rotate: isOpen ? 45 : 0 }} transition={{ type: "spring", stiffness: 300, damping: 30 }} className="text-3xl leading-none text-gold">+</motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ type: "spring", stiffness: 300, damping: 30 }} className="overflow-hidden">
                        <p className="max-w-xl pb-6 text-slate md:px-3">{f.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="mt-28 text-center md:mt-40">
          <ScrubParagraph className="mx-auto max-w-3xl text-3xl font-semibold leading-[1.1] tracking-[-0.03em] md:text-5xl" text="Still unsure? The best way to start is a conversation." />
          <Link href="/#book" className="btn btn-burgundy mt-10">Book a Consultation</Link>
        </div>
      </div>
    </section>
  );
}
