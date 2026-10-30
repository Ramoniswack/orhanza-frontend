"use client";

import { motion, useScroll, useSpring } from "motion/react";
import { useRef } from "react";
import { processSteps } from "@/lib/data";
import { SectionHeading } from "./Reveal";

export function Process() {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] });
  const line = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });

  return (
    <section id="process" className="bg-[#000] py-24 md:py-32" aria-labelledby="process-h">
      <div className="container-x">
        <span id="process-h" className="sr-only">The Orhanza process</span>
        <SectionHeading eyebrow="The Orhanza process" title="From first conversation to final fitting." light />
        <ol ref={ref} className="relative mt-16 ml-3 space-y-12 border-l border-[#f4f4f4]/10 pl-10 md:ml-6 md:pl-16">
          <motion.span style={{ scaleY: line }} className="absolute -left-px top-0 h-full w-px origin-top bg-gold" aria-hidden />
          {processSteps.map((s, i) => (
            <motion.li
              key={s.title}
              className="relative"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-120px" }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="absolute -left-[3.2rem] top-1 flex h-6 w-6 items-center justify-center rounded-full border border-gold bg-[#000] text-meta text-gold md:-left-[4.7rem]">{i + 1}</span>
              <h3 className="h-section text-3xl md:text-5xl">{s.title}</h3>
              <p className="mt-2 max-w-xl text-body text-[#6f6f6f]">{s.body}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
