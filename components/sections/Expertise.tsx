"use client";

/** 8 — Expertise bento: cards stagger in; each carries a line illustration of its subject so no card reads as empty. Digits roll via KineticNumber. */
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Button, Drift, Hanger, Ruler, Scissors, Spool, Thimble } from "@/components/Icons";
import { JacketOnHanger, Mannequin, NeedleThread, StitchLines, SwatchStack, TapeMeasure } from "@/components/Illustrations";
import { KineticNumber, StaircaseHeadline } from "@/components/motion";
import { SectionLabel } from "@/components/SectionLabel";
import { site } from "@/lib/site";

function Card({ children, className = "", i = 0 }: { children: ReactNode; className?: string; i?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: (i % 3) * 0.1 }}
      className={`relative overflow-hidden rounded-[22px] p-7 ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function Expertise() {
  return (
    <section className="bg-[#050506] pt-14 text-ivory md:pt-20">
      <div className="container-x">
        <SectionLabel label="Expertise" dark />
        <StaircaseHeadline
          className="mt-5 md:mt-6"
          dark
          lines={[{ text: "Every garment", tone: "setup" }, { text: "made with", tone: "punch" }, { text: "care", tone: "punch" }]}
          indents={[0, 0.6, 1.2]}
        />

        <div className="mt-6 grid gap-3 md:mt-8 md:grid-cols-12 md:grid-rows-[repeat(2,minmax(15rem,auto))]">
          <Card i={0} className="bg-[#141416] md:col-span-4 md:row-span-2">
            <p className="label-micro text-mute">Founder & Owner</p>
            <p className="mt-6 text-[7rem] font-extrabold leading-none tracking-[-0.06em] text-gold md:text-[9rem]">K</p>
            <p className="mt-6 text-2xl font-semibold tracking-[-0.03em]">Kriti Maharjan</p>
            <Mannequin className="pointer-events-none absolute bottom-6 right-6 h-[52%] min-h-[14rem] text-gold" />
            <Drift className="pointer-events-none absolute right-6 top-6 h-16 w-16 text-gold"><Scissors className="h-full w-full" /></Drift>
            <Drift delay={1} dur={7} className="pointer-events-none absolute bottom-8 left-7 h-14 w-14 text-ivory/30"><Button className="h-full w-full" /></Drift>
            <Drift delay={2} dur={5} className="pointer-events-none absolute bottom-28 left-24 h-12 w-12 text-gold/70"><Thimble className="h-full w-full" /></Drift>
          </Card>

          <Card i={1} className="bg-[#EDEDED] text-[#111] md:col-span-4">
            <p className="text-3xl font-bold leading-[0.95] tracking-[-0.04em] md:[writing-mode:vertical-rl] md:rotate-180 md:text-5xl">Wear your confidence</p>
            <JacketOnHanger className="pointer-events-none absolute bottom-5 right-6 h-[70%] text-black/45" />
            <Drift className="pointer-events-none absolute right-6 top-6 h-12 w-12 text-black/50"><Spool className="h-full w-full" /></Drift>
            <Drift delay={1.5} className="pointer-events-none absolute bottom-6 left-6 h-12 w-12 text-black/30"><Hanger className="h-full w-full" /></Drift>
          </Card>

          <Card i={2} className="bg-[#141416] md:col-span-4">
            <h3 className="text-2xl font-semibold tracking-[-0.03em]">Precision fit</h3>
            <TapeMeasure className="pointer-events-none absolute inset-x-6 bottom-5 w-[calc(100%-3rem)] text-gold" />
            <Drift className="pointer-events-none absolute right-6 top-6 h-14 w-14 text-gold"><Ruler className="h-full w-full" /></Drift>
            <Drift delay={1.2} dur={7} className="pointer-events-none absolute left-7 top-1/3 h-12 w-12 text-ivory/25"><Spool className="h-full w-full" /></Drift>
          </Card>

          <Card i={3} className="bg-[#141416] md:col-span-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-semibold tracking-[-0.03em]">Premium fabrics</h3>
                <Link href="/collections" className="mt-6 inline-block text-sm font-semibold underline-offset-4 hover:underline">View Collections →</Link>
              </div>
              <div className="relative h-36 w-24 shrink-0 overflow-hidden rounded-xl">
                <Image src="/images/products/wool-linen-groomsmen-suit-a.webp" alt="Wool-linen suit by Orhanza" fill sizes="96px" className="object-cover object-top" />
              </div>
            </div>
          </Card>

          <Card i={4} className="bg-[#141416] md:col-span-2">
            <KineticNumber value={6} stagger={0.09} className="text-7xl font-extrabold tracking-[-0.05em]" />
            <p className="mt-4 text-sm font-semibold">Steps to your fit</p>
            <NeedleThread className="pointer-events-none absolute -bottom-2 right-2 h-24 text-gold" />
          </Card>
          <Card i={5} className="bg-[#141416] md:col-span-2">
            <KineticNumber value={6} stagger={0.09} className="text-7xl font-extrabold tracking-[-0.05em]" />
            <p className="mt-4 text-sm font-semibold">Fabric families</p>
            <SwatchStack className="pointer-events-none absolute -bottom-2 right-2 h-24 text-gold" />
          </Card>

        </div>

        <div className="mt-8 flex justify-end">
          <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-full bg-[#141416] py-2 pl-2 pr-5 text-sm font-semibold transition-colors hover:bg-ivory hover:text-black">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold text-xs text-white">O</span>{site.handle}
          </a>
        </div>
      </div>

      {/* 100% — full-bleed band, edge to edge */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8 }}
        className="relative mt-10 w-full overflow-hidden border-y border-white/10 bg-[#101012] text-ivory md:mt-14"
      >
        <div className="container-x relative z-10 flex flex-col justify-between gap-8 py-12 md:flex-row md:items-center md:py-16">
          <KineticNumber value={100} suffix="%" stagger={0.1} duration={1.3} className="text-[clamp(6rem,15vw,15rem)] font-extrabold tracking-[-0.06em]" />
          <div className="md:max-w-[28rem]">
            <ul className="flex flex-wrap gap-5 text-ivory/70 md:gap-6" aria-hidden>
              {[Scissors, Spool, Hanger, Button, Thimble].map((I, i) => (
                <li key={i}><Drift delay={i * 0.6} dur={5 + i * 0.5} amp={7} className="h-14 w-14 md:h-16 md:w-16"><I className="h-full w-full" /></Drift></li>
              ))}
            </ul>
            <p className="mt-6 text-2xl font-semibold md:text-4xl">Made to measure</p>
          </div>
        </div>
        <StitchLines className="pointer-events-none absolute inset-y-0 right-0 hidden h-full w-3/5 text-ivory/25 md:block" />
      </motion.div>
    </section>
  );
}
