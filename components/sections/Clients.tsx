"use client";

/** 11 — Team slot → the people we dress. Wide image uses ExpandOnScroll then parallaxes out; three cards go grayscale → colour on hover. */
import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
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
          className="mt-5 md:mt-6"
          lines={[{ text: "THE PEOPLE", tone: "setup" }, { text: "WE DRESS", tone: "punch" }]}
          indents={[0, 0.8]}
        />
      </div>

      <div className="mt-6 md:mt-8">
        <ExpandOnScroll className="h-[110svh]"><Parallax /></ExpandOnScroll>
      </div>

      <div className="container-x mt-12 grid gap-8 md:mt-16 md:grid-cols-3">
        {audience.map((a, i) => (
          <motion.article key={a.role} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 }} className="group">
            <div className="relative aspect-[3/4] overflow-hidden bg-card">
              <Image src={a.image} alt={a.role} fill sizes="(min-width:768px) 30vw, 100vw" className="object-cover object-top grayscale transition-all duration-700 group-hover:scale-[1.03] group-hover:grayscale-0" />
            </div>
            <p className="mt-4 text-lg font-semibold tracking-[-0.02em]">{a.role}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
