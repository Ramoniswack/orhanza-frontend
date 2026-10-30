"use client";

/** 5 — Stats: stacked rows, thin accent bar at left, odometer numbers rolling as each row enters. Figures are placeholders drawn from the content pack. */
import { motion } from "motion/react";
import { OdometerNumber } from "@/components/motion";
import { stats } from "@/lib/content";

export function Stats() {
  return (
    <section className="bg-white pb-14 text-ink md:pb-20" aria-label="Orhanza at a glance">
      <div className="container-x">
        <ul className="border-t hairline">
          {stats.map((s, i) => (
            <motion.li
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.05 * i }}
              className="relative grid items-center gap-3 border-b hairline py-8 pl-6 md:grid-cols-[1.2fr_1fr] md:gap-10 md:py-12 md:pl-10"
            >
              <span className="absolute left-0 top-8 h-[calc(100%-4rem)] w-[3px] bg-gold md:top-12 md:h-[calc(100%-6rem)]" aria-hidden />
              <OdometerNumber value={s.value} suffix={s.suffix || undefined} className="text-[clamp(4rem,10vw,10rem)] font-extrabold leading-none tracking-[-0.05em]" />
              <h3 className="text-xl font-semibold md:text-2xl">{s.title}</h3>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
