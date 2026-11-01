"use client";

/** Men / Women entry — two very large words; each glides (Lenis) into the lookbook at its first look. */
import { motion } from "motion/react";
import { useLenis } from "@/lib/lenis";
import { MEN_COUNT, N, lookScrollY } from "@/lib/lookbook-data";

const rows = [
  { label: "Men", start: 0, count: MEN_COUNT },
  { label: "Women", start: MEN_COUNT, count: N - MEN_COUNT },
];
const expoOut = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

export function CollectionIntro() {
  const lenis = useLenis();
  const go = (k: number) => {
    const y = lookScrollY(k);
    if (lenis) lenis.scrollTo(y, { duration: 2.6, easing: expoOut });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };
  return (
    <section aria-label="Collection" className="bg-[#F6F6F6] px-5 pb-10 pt-28 text-[#111] md:px-10 md:pb-16 md:pt-36">
      <div className="mx-auto max-w-[1440px]">
        <p className="text-base text-[#6B6B6B] md:text-xl">The collection — {N} looks, made to measure</p>
        <div className="mt-8 border-t border-black/15 md:mt-12">
          {rows.map((r, i) => (
            <motion.button
              key={r.label}
              type="button"
              onClick={() => go(r.start)}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: i * 0.15 }}
              className="group flex w-full items-end justify-between gap-6 border-b border-black/15 py-5 text-left md:py-8"
              aria-label={`${r.label} — ${r.count} looks`}
            >
              <span className="block origin-left font-bold leading-[0.9] tracking-[-0.06em] transition-transform duration-[1400ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-x-[2vw]" style={{ fontSize: "clamp(5rem, 17vw, 17rem)" }}>
                {r.label}
              </span>
              <span className="mb-3 flex shrink-0 flex-col items-end gap-3 md:mb-6">
                <span className="text-lg text-[#6B6B6B] md:text-2xl">{String(r.count).padStart(2, "0")} looks</span>
                <span aria-hidden className="grid h-12 w-12 place-items-center rounded-full border border-black/30 text-xl transition-transform duration-[1200ms] group-hover:rotate-90 md:h-16 md:w-16 md:text-2xl">↓</span>
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
