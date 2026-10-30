"use client";

/** 11 — Team slot → the people we dress. Wide image uses ExpandOnScroll then parallaxes out; three cards go grayscale → colour on hover. */
import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ExpandOnScroll, StaircaseHeadline } from "@/components/motion";
import { SectionLabel } from "@/components/SectionLabel";
import { audience } from "@/lib/content";

function Parallax() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "12%"]);
  return (
    <div ref={ref} className="h-full w-full overflow-hidden">
      <motion.div style={{ y }} className="relative h-[120%] w-full">
        <Image src="/images/banners/instagram.webp" alt="Orhanza — tailored suits made in Nepal" fill sizes="100vw" className="object-cover" />
      </motion.div>
    </div>
  );
}

export function Clients() {
  return (
    <section className="bg-white py-14 text-ink md:py-20">
      <div className="container-x">
        <SectionLabel label="Clients" />
        <StaircaseHeadline
          className="mt-8 md:mt-10"
          lines={[{ text: "THE PEOPLE WE DRESS", tone: "setup" }, { text: "ARE THE ONES", tone: "punch" }, { text: "WHO MATTER", tone: "punch" }]}
          indents={[0, 0.6, 1.2]}
        />
      </div>

      <div className="mt-10 md:mt-14">
        <ExpandOnScroll className="h-[110svh]"><Parallax /></ExpandOnScroll>
        <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="container-x mt-6 text-sm text-slate">
          Founded by Kriti Maharjan — from business tailoring to wedding attire, every commission begins with the person who will wear it.
        </motion.p>
      </div>

      <div className="container-x mt-24 grid gap-8 md:mt-32 md:grid-cols-3">
        {audience.map((a, i) => (
          <motion.article key={a.role} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 }} className="group">
            <p className="mb-4 min-h-[2.5rem] max-w-xs text-sm text-slate">{a.intro}</p>
            <div className="relative aspect-[3/4] overflow-hidden bg-card">
              <Image src={a.image} alt={a.role} fill sizes="(min-width:768px) 30vw, 100vw" className="object-cover object-top grayscale transition-all duration-700 group-hover:scale-[1.03] group-hover:grayscale-0" />
            </div>
            <p className="mt-4 text-lg font-semibold tracking-[-0.02em]">{a.role}</p>
          </motion.article>
        ))}
      </div>
      <div className="container-x mt-14">
        <Link href="/collections" className="text-sm font-semibold underline-offset-4 hover:underline">Explore the Collections →</Link>
      </div>
    </section>
  );
}
