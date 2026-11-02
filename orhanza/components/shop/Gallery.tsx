"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";

type View = { label: string; src: string; fit: "contain" | "crop" };

/** Product page images: full look, a close crop, and the piece on its own. */
export function Gallery({ name, image, flat }: { name: string; image: string; flat: string }) {
  const views: View[] = [
    { label: "Full look", src: image, fit: "contain" },
    { label: "Detail", src: image, fit: "crop" },
    { label: "The piece", src: flat, fit: "contain" },
  ];
  const [i, setI] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const v = views[i];

  return (
    <div>
      <div
        className="relative aspect-[4/5] cursor-zoom-in overflow-hidden rounded-[6px] bg-[#F3F3F3] md:aspect-[5/6]"
        onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 }); }}
        onMouseLeave={() => setZoom(null)}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={i} className="absolute inset-0 transition-transform duration-300 ease-out" style={{ transform: zoom ? "scale(2.2)" : "scale(1)", transformOrigin: zoom ? `${zoom.x}% ${zoom.y}%` : "50% 50%" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            {v.fit === "contain" ? (
              <Image src={v.src} alt={`${name} — ${v.label.toLowerCase()}`} fill priority sizes="(min-width:1024px) 50vw, 100vw" className="object-contain p-6 md:p-8" />
            ) : (
              <Image src={v.src} alt={`${name} — ${v.label.toLowerCase()}`} fill sizes="(min-width:1024px) 50vw, 100vw" className="scale-[1.05] object-cover object-top" />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-3">
        {views.map((x, k) => (
          <button key={x.label} onClick={() => setI(k)} aria-pressed={i === k} aria-label={`Show ${x.label.toLowerCase()}`} className={`relative aspect-[4/5] overflow-hidden rounded-[6px] bg-[#F3F3F3] transition-opacity ${i === k ? "ring-1 ring-charcoal" : "opacity-60 hover:opacity-100"}`}>
            <Image src={x.src} alt="" fill sizes="12vw" className={x.fit === "contain" ? "object-contain p-2" : "scale-[1.05] object-cover object-top"} />
          </button>
        ))}
      </div>
    </div>
  );
}
