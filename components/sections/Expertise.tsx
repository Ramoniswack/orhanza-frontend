"use client";

/** 8 — Expertise bento: cards stagger in; each carries a line illustration of its subject so no card reads as empty. Digits roll via KineticNumber. */
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
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
    <section className="bg-white pb-14 pt-4 text-ink md:pb-20">
      <div className="container-x">
        <SectionLabel label="Expertise" />
        <StaircaseHeadline
          className="mt-5 md:mt-6"
          lines={[{ text: "EVERY GARMENT", tone: "setup" }, { text: "MADE WITH", tone: "punch" }, { text: "CARE", tone: "punch" }]}
          indents={[0, 0.6, 1.2]}
        />

        <div className="mt-6 grid gap-3 md:mt-8 md:grid-cols-12 md:grid-rows-[repeat(3,minmax(15rem,auto))]">
          <Card i={0} className="bg-card md:col-span-4 md:row-span-2">
            <p className="label-micro text-mute">Founder & Owner</p>
            <p className="mt-6 text-[7rem] font-extrabold leading-none tracking-[-0.06em] text-gold md:text-[9rem]">K</p>
            <p className="mt-6 text-2xl font-semibold tracking-[-0.03em]">Kriti Maharjan</p>
            <Mannequin className="pointer-events-none absolute bottom-6 right-6 h-[56%] min-h-[14rem] text-gold" />
          </Card>

          <Card i={1} className="bg-black text-ivory md:col-span-4">
            <p className="text-3xl font-extrabold uppercase leading-[0.95] tracking-[-0.04em] md:[writing-mode:vertical-rl] md:rotate-180 md:text-5xl">Wear your confidence</p>
            <JacketOnHanger className="pointer-events-none absolute bottom-5 right-6 h-[78%] text-ivory/60" />
          </Card>

          <Card i={2} className="bg-card md:col-span-4">
            <h3 className="text-2xl font-semibold tracking-[-0.03em]">Precision fit</h3>
            <TapeMeasure className="pointer-events-none absolute inset-x-6 bottom-5 w-[calc(100%-3rem)] text-gold" />
          </Card>

          <Card i={3} className="bg-card md:col-span-4">
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

          <Card i={4} className="bg-card md:col-span-2">
            <KineticNumber value={6} stagger={0.09} className="text-[clamp(5rem,12vw,8rem)] font-extrabold tracking-[-0.05em]" />
            <p className="mt-4 text-sm font-semibold">Steps to your fit</p>
            <NeedleThread className="pointer-events-none absolute -bottom-2 right-2 h-24 text-gold" />
          </Card>
          <Card i={5} className="bg-card md:col-span-2">
            <KineticNumber value={6} stagger={0.09} className="text-[clamp(5rem,12vw,8rem)] font-extrabold tracking-[-0.05em]" />
            <p className="mt-4 text-sm font-semibold">Fabric families</p>
            <SwatchStack className="pointer-events-none absolute -bottom-2 right-2 h-24 text-gold" />
          </Card>

          <Card i={6} className="bg-burgundy text-ivory col-span-12">
            <KineticNumber value={100} suffix="%" stagger={0.1} duration={1.3} className="text-[clamp(10rem,25vw,22rem)] font-extrabold tracking-[-0.06em]" />
            <p className="mt-4 text-xl font-semibold">Made to measure</p>
            <StitchLines className="pointer-events-none absolute inset-y-0 right-0 hidden h-full w-1/2 text-ivory/30 md:block" />
          </Card>
        </div>

        <div className="mt-10 flex justify-end">
          <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-full bg-card py-2 pl-2 pr-5 text-sm font-semibold transition-colors hover:bg-ink hover:text-ivory">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold text-xs text-white">O</span>{site.handle}
          </a>
        </div>
      </div>
    </section>
  );
}
