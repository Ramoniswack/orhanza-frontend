"use client";

/**
 * The preview: one suit on a quiet warm-white studio. One wrapper zooms (jacket crop ↔ full suit)
 * and inside it stacked layers crossfade on a shared full-height image frame. Every preview is the same 658×2226 canvas with the head,
 * shoulders and shoes on the same pixels, so a swap changes only the cloth (or adds the trousers) and nothing else moves.
 */
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { MODEL, decodeImage, fabrics, previewFor, previewSrc, ui, type Fabric, type Gender, type Stage as StageKind } from "@/lib/custom-made";

/** Symmetric ease for every change on this stage (fabric swap, jacket ↔ suit, zoom) so they all move as one. */
const SOFT = [0.45, 0, 0.2, 1] as const;

/** `out`: duration of a fade-out for a layer that must disappear (suit → jacket removes the trousers); undefined = stays at 1 underneath. */
type Layer = { id: number; src: string; kind: StageKind; dur: number; enter: boolean; out?: number };

/**
 * Stack of <img> layers. A new layer enters on top at opacity 0 / scale 1.012 → 1 / 1 while everything below stays at 1
 * (never fade the old one out first — that flashes the background). When a layer finishes, everything beneath it is dropped.
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
      if (latest.current !== src) return;
      shown.current = src;
      const dur = reduce ? 0.15 : stageChanged ? 0.9 : 0.8;
      // going to the jacket, the old layer still has trousers: let it fade out in the second half, while the new layer
      // (same pixels above the hem) fades in over it — the shared area never dips
      const out = stageChanged && kind === "jacket" ? dur : undefined;
      setLayers((ls) => [...ls.map((l) => (out ? { ...l, out } : l)), { id: nextId.current++, src, kind, dur, enter: true }]);
    });
  }, [src, kind, reduce]);

  const drop = (id: number) => setLayers((ls) => { const i = ls.findIndex((l) => l.id === id); return i > 0 ? ls.slice(i) : ls; });
  // the zoom follows the picture that is actually on screen, never a picture that is still loading
  const shownKind = layers[layers.length - 1].kind;
  return { layers, drop, shownKind };
}

/** Warm the cache: current stage first, then the rest, one at a time while the browser is idle — a swap never waits for the network. */
function useWarmPreviews(kind: StageKind, gender: Gender) {
  useEffect(() => {
    let stop = false;
    const other: StageKind = kind === "jacket" ? "suit" : "jacket";
    const queue = [...fabrics.map((f) => previewSrc(f, kind, gender)), ...fabrics.map((f) => previewSrc(f, other, gender))];
    const idle = (cb: () => void) => ("requestIdleCallback" in window ? (window as unknown as { requestIdleCallback: (c: () => void) => void }).requestIdleCallback(cb) : setTimeout(cb, 120));
    const next = () => {
      if (stop) return;
      const src = queue.shift();
      if (!src) return;
      decodeImage(src).then(() => idle(next));
    };
    idle(next);
    return () => { stop = true; };
  }, [kind, gender]);
}

export function Stage({ fabric, stage, gender, waistcoat, reduce }: { fabric: Fabric; stage: StageKind; gender: Gender; waistcoat: boolean; reduce: boolean }) {
  const { layers, drop, shownKind } = useCrossfade(previewFor(fabric, stage, gender), stage, reduce);
  useWarmPreviews(stage, gender);
  const zoom = shownKind === "jacket" ? { scale: 1.28, y: "6%" } : { scale: 1, y: "0%" };

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#F1EDE5]">
      {/* warm-white sweep, lighter behind the figure; nothing else on the stage */}
      <div aria-hidden className="absolute inset-0" style={{ background: "radial-gradient(70% 62% at 50% 36%, #FCFAF6 0%, #F3EFE8 58%, #E9E3D8 100%)" }} />

      {/* model — same canvas always; only the wrapper moves */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          role="img"
          aria-label={`${gender === "women" ? "Women's" : "Men's"} suit in ${fabric.name}`}
          className="relative h-[88%]"
          style={{ aspectRatio: `${MODEL.w} / ${MODEL.h}`, transformOrigin: "50% 20%" }}
          initial={false}
          animate={zoom}
          transition={{ duration: reduce ? 0 : 0.9, ease: SOFT }}
        >
          <img src={ui.groundShadow} alt="" width={700} height={90} decoding="async" draggable={false} className="pointer-events-none absolute left-1/2 top-[95%] w-[230%] max-w-none -translate-x-1/2 opacity-40" />
          {layers.map((l) => (
            <motion.img
              key={l.id}
              src={l.src}
              alt=""
              width={MODEL.w}
              height={MODEL.h}
              decoding="async"
              draggable={false}
              className="absolute left-0 top-0 w-full select-none"
              style={{ height: "100%", willChange: "opacity" }}
              initial={l.enter ? { opacity: 0 } : false}
              animate={l.out ? { opacity: [1, 1, 0] } : { opacity: 1 }}
              transition={l.out ? { duration: l.out, ease: SOFT, times: [0, 0.5, 1] } : { duration: l.dur, ease: SOFT }}
              onAnimationComplete={() => drop(l.id)}
            />
          ))}
        </motion.div>
      </div>

      {/* one quiet caption: the cloth you are looking at (truthful about the waistcoat, which has no preview image) */}
      <div className="pointer-events-none absolute bottom-4 left-5 z-10 md:bottom-8 md:left-8" aria-live="polite">
        <p className="label-micro text-slate">{fabric.category}</p>
        <p className="mt-1 text-[15px] font-medium text-ink md:text-[17px]">{fabric.name}</p>
        {waistcoat && <p className="cm-fade mt-1 text-[12px] text-slate">Waistcoat added — not shown in the preview</p>}
      </div>
    </div>
  );
}
