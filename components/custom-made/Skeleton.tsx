"use client";

/** Loading state: pale silhouette on the left, grey tile grid with a soft shimmer on the right. */
import { motion } from "motion/react";
import { EASE_OUT } from "@/components/motion";
import { MODEL, ui } from "@/lib/custom-made";

export function Skeleton({ reduce }: { reduce: boolean }) {
  return (
    <motion.div
      aria-hidden
      className="absolute inset-0 z-40 bg-[#0E0E10] pt-16 md:grid md:grid-cols-2"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduce ? 0.15 : 0.5, ease: EASE_OUT }}
    >
      <div className="flex h-[46svh] items-center justify-center bg-[#161618] md:h-full">
        <img src={ui.skeletonSuit} alt="" width={MODEL.w} height={MODEL.h} className="h-[88%] w-auto opacity-20 invert" />
      </div>
      <div className="px-4 pt-4 md:px-8">
        <div className="cm-shimmer h-9 w-2/3 rounded-full bg-[#1c1c1f]" />
        <div className="mt-6 grid grid-cols-3 gap-x-2.5 gap-y-5 md:gap-x-4 md:gap-y-7">
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i}>
              <div className="cm-shimmer aspect-[1/1] rounded-[6px] bg-[#1c1c1f]" />
              <div className="mt-2 h-3 w-4/5 rounded bg-[#17171a]" />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
