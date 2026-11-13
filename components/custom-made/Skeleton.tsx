"use client";

/** Loading state: pale silhouette on the left, grey tile grid with a soft shimmer on the right. */
import { motion } from "motion/react";
import { EASE_OUT } from "@/components/motion";
import { MODEL, ui } from "@/lib/custom-made";

export function Skeleton({ reduce }: { reduce: boolean }) {
  return (
    <motion.div
      aria-hidden
      className="absolute inset-0 z-40 bg-white pt-16 md:grid md:grid-cols-2"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduce ? 0.15 : 0.5, ease: EASE_OUT }}
    >
      <div className="flex h-[46svh] items-center justify-center bg-[#F5F5F5] md:h-full">
        <img src={ui.skeletonSuit} alt="" width={MODEL.w} height={MODEL.h} className="h-[88%] w-auto" />
      </div>
      <div className="px-4 pt-4 md:px-8">
        <div className="cm-shimmer h-9 w-2/3 rounded-full bg-[#ECECEC]" />
        <div className="mt-6 grid grid-cols-3 gap-x-2.5 gap-y-5 md:gap-x-4 md:gap-y-7">
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i}>
              <div className="cm-shimmer aspect-[1/1] rounded-[6px] bg-[#ECECEC]" />
              <div className="mt-2 h-3 w-4/5 rounded bg-[#F2F2F2]" />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
