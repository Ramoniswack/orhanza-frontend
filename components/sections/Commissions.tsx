"use client";

/**
 * 10 — Commissions: three panels in a row. The hovered (or tapped) panel opens on a spring while the others narrow;
 * its two coloured cutouts rise in, its title rolls and its number is a KineticNumber.
 */
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { KineticNumber, MaskLine, RollText } from "@/components/motion";
import { SectionLabel } from "@/components/SectionLabel";

const EASE = [0.22, 1, 0.36, 1] as const;

const panels = [
  { name: "Business Suits", note: "Boardroom to dinner", href: "/collections", bg: "#EDEDED", fg: "#111111", figs: [8, 7] },
  { name: "Wedding & Occasion", note: "Groom, guests, black tie", href: "/collections", bg: "#111111", fg: "#F4F4F4", figs: [1, 12] },
  { name: "Coat-Pant & Shirts", note: "Sharp, separate, yours", href: "/collections", bg: "#DCDCDC", fg: "#111111", figs: [9, 3] },
];

export function Commissions() {
  const [open, setOpen] = useState(0);
  return (
    <section id="commissions" className="bg-white py-14 text-ink md:py-20">
      <div className="container-x">
        <SectionLabel label="Commissions" />
        <h2 className="h-section-xl mt-5 md:mt-6">
          <MaskLine>Made for the</MaskLine>
          <MaskLine index={1} >occasion</MaskLine>
        </h2>

        <div className="mt-8 flex flex-col gap-2 md:mt-12 md:h-[40rem] md:flex-row">
          {panels.map((p, i) => {
            const active = open === i;
            return (
              <motion.div
                key={p.name}
                layout
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                animate={{ flexGrow: active ? 3.4 : 1 }}
                transition={{ flexGrow: { type: "spring", stiffness: 70, damping: 20 }, opacity: { duration: 0.8, delay: i * 0.1 }, y: { duration: 0.8, ease: EASE, delay: i * 0.1 } }}
                onMouseEnter={() => setOpen(i)}
                onFocus={() => setOpen(i)}
                onClick={() => setOpen(i)}
                style={{ backgroundColor: p.bg, color: p.fg, flexBasis: 0 }}
                className="group relative h-[30rem] min-w-0 cursor-pointer overflow-hidden md:h-auto"
              >
                <Link href={p.href} className="absolute inset-0 z-10" aria-label={`${p.name} — view collection`} tabIndex={0} />

                {/* cutouts */}
                <div className="pointer-events-none absolute inset-x-0 bottom-[5.5rem] top-[14%] md:bottom-24">
                  <motion.div
                    className="absolute inset-y-0 left-1/2 w-[min(78%,20rem)]"
                    initial={false}
                    animate={{ x: active ? "-88%" : "-50%", scale: active ? 1 : 0.92 }}
                    transition={{ type: "spring", stiffness: 60, damping: 20 }}
                  >
                    <Image src={`/collection/${p.figs[0]}.webp`} alt="" fill sizes="22rem" className="object-contain object-bottom grayscale" />
                  </motion.div>
                  <motion.div
                    className="absolute inset-y-0 left-1/2 hidden w-[min(78%,20rem)] md:block"
                    initial={false}
                    animate={{ x: active ? "-8%" : "-50%", opacity: active ? 1 : 0, scale: active ? 1 : 0.85 }}
                    transition={{ type: "spring", stiffness: 60, damping: 20 }}
                  >
                    <Image src={`/collection/${p.figs[1]}.webp`} alt="" fill sizes="22rem" className="object-contain object-bottom grayscale" />
                  </motion.div>
                </div>

                {/* copy */}
                <div className="relative z-[5] flex items-start justify-between gap-4 p-5 md:p-7">
                  <span className="text-sm opacity-60"><KineticNumber value={i + 1} pad={2} stagger={0.08} /></span>
                  <motion.span animate={{ opacity: active ? 1 : 0, x: active ? 0 : 12 }} transition={{ duration: 0.5, ease: EASE }} className="label-micro hidden whitespace-nowrap md:block">{p.note}</motion.span>
                </div>
                <div className="absolute inset-x-0 bottom-0 z-[5] flex items-end justify-between gap-4 bg-gradient-to-t from-black/0 p-5 md:p-7">
                  <h3 className="flex min-w-0 flex-wrap text-[clamp(1.5rem,2.3vw,2.4rem)] font-semibold leading-[1.02] tracking-[-0.04em]">
                    {p.name.split(" ").map((w, wi) => <RollText key={wi} active={active} className="mr-[0.25em]">{w}</RollText>)}
                  </h3>
                  <motion.span aria-hidden animate={{ rotate: active ? -45 : 0 }} transition={{ type: "spring", stiffness: 220, damping: 18 }} className="hidden h-11 w-11 shrink-0 md:flex items-center justify-center rounded-full border border-current/30 text-lg">→</motion.span>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-8 flex justify-end">
          <Link href="/#book" className="btn bg-[#111] text-white hover:bg-black">Book a Consultation</Link>
        </div>
      </div>
    </section>
  );
}
