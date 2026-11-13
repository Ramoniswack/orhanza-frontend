"use client";

/** Left half: sticky model stage. One wrapper zooms (jacket crop ↔ full suit); inside it, stacked layers crossfade. */
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { EASE_OUT, OdometerNumber } from "@/components/motion";
import { DELIVERY_TEXT, MODEL, decodeImage, garmentIcon, previewFor, ui, type Fabric, type Stage as StageKind, type Tab } from "@/lib/custom-made";

type Layer = { id: number; src: string; kind: StageKind; dur: number; enter: boolean };

/**
 * Stack of <img> layers. A new layer enters on top at opacity 0 / scale 1.012 → 1 / 1 while everything below stays at 1
 * (never fade the old one out first — that flashes the background). When a layer finishes, everything beneath it is dropped.
 * Rapid changes just stack more layers; the latest always ends on top.
 */
function useCrossfade(src: string, kind: StageKind, reduce: boolean) {
  const [layers, setLayers] = useState<Layer[]>(() => [{ id: 0, src, kind, dur: 0, enter: false }]);
  const latest = useRef(src);
  const shown = useRef(src);
  const lastKind = useRef(kind);
  const nextId = useRef(1);

  useEffect(() => {
    latest.current = src;
    const stageChanged = lastKind.current !== kind;
    lastKind.current = kind;
    if (src === shown.current) return;
    decodeImage(src).then(() => {
      if (latest.current !== src) return; // a newer choice arrived while decoding
      shown.current = src;
      const dur = reduce ? 0.15 : stageChanged ? 0.9 : 0.7;
      setLayers((ls) => [...ls, { id: nextId.current++, src, kind, dur, enter: true }]);
    });
  }, [src, kind, reduce]);

  const drop = (id: number) => setLayers((ls) => { const i = ls.findIndex((l) => l.id === id); return i > 0 ? ls.slice(i) : ls; });
  return { layers, drop };
}

export function Stage({ fabric, stage, total, tab, waistcoat, reduce }: { fabric: Fabric; stage: StageKind; total: number; tab: Tab; waistcoat: boolean; reduce: boolean }) {
  const { layers, drop } = useCrossfade(previewFor(fabric, stage), stage, reduce);
  const zoom = stage === "jacket" ? { scale: 1.28, y: "6%" } : { scale: 1, y: "0%" };
  const icon = garmentIcon[tab === "fabric" ? "jacket" : tab];

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#F5F5F5]">
      <div className="absolute left-5 top-5 z-10 md:left-8 md:top-8">
        <p className="label-micro text-slate">Total</p>
        <p className="mt-1.5 flex items-baseline gap-1.5 text-[26px] font-bold leading-none tracking-[-0.03em] text-ink md:text-[34px]">
          <span className="text-[0.42em] font-semibold text-slate">Rs.</span>
          <OdometerNumber value={total.toLocaleString("en-US")} duration={0.9} />
        </p>
        <p className="mt-2 text-[12px] text-slate">{DELIVERY_TEXT}</p>
      </div>

      {/* model — same canvas always; only the wrapper moves */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          role="img"
          aria-label={`Suit in ${fabric.name}`}
          className="relative h-[88%]"
          style={{ aspectRatio: `${MODEL.w} / ${MODEL.h}`, transformOrigin: "50% 20%" }}
          initial={false}
          animate={zoom}
          transition={{ duration: reduce ? 0 : 0.9, ease: EASE_OUT }}
        >
          <img src={ui.groundShadow} alt="" width={700} height={90} decoding="async" draggable={false} className="pointer-events-none absolute left-1/2 top-[96%] w-[210%] max-w-none -translate-x-1/2 opacity-50 mix-blend-multiply" />
          {layers.map((l) => (
            <motion.img
              key={l.id}
              src={l.src}
              alt=""
              width={MODEL.w}
              height={l.kind === "jacket" ? MODEL.jacketH : MODEL.h}
              decoding="async"
              draggable={false}
              className="absolute left-0 top-0 w-full select-none"
              style={{ height: l.kind === "jacket" ? `${(MODEL.jacketH / MODEL.h) * 100}%` : "100%", willChange: "opacity, transform", transformOrigin: "50% 20%" }}
              initial={l.enter ? { opacity: 0, scale: reduce ? 1 : 1.012 } : false}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: l.dur, ease: EASE_OUT }}
              onAnimationComplete={() => drop(l.id)}
            />
          ))}
        </motion.div>
      </div>

      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-multiply" style={{ backgroundImage: `url(${ui.grain})`, backgroundSize: "256px 256px" }} />

      {/* TODO: no waistcoat render exists yet — add a `waistcoat-<slug>.webp` set and swap the preview here. Until then the chip + price carry it. */}
      {waistcoat && <span className="cm-fade absolute bottom-5 left-5 z-10 rounded-full border border-black/10 bg-white px-3 py-1.5 text-[12px] font-semibold text-ink md:bottom-8 md:left-8">Waistcoat added</span>}

      <div className="absolute bottom-5 right-5 z-10 h-16 w-16 overflow-hidden rounded-[6px] border border-black/[0.08] bg-white md:bottom-8 md:right-8" aria-hidden>
        <AnimatePresence initial={false}>
          <motion.img key={icon} src={icon} alt="" width={40} height={40} className="absolute inset-3 h-10 w-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduce ? 0.15 : 0.3, ease: EASE_OUT }} />
        </AnimatePresence>
      </div>
    </div>
  );
}
