"use client";

/**
 * Left half: a lit studio. The model sits on a soft-box backdrop with a floor reflection; one wrapper zooms (jacket crop ↔ full suit)
 * and inside it stacked layers crossfade. A specular "light" follows the pointer and is clipped to the garment itself (mask-image),
 * so the cloth catches highlights like a real fabric instead of looking printed.
 */
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { EASE_OUT, OdometerNumber } from "@/components/motion";
import { DELIVERY_TEXT, MODEL, decodeImage, garmentIcon, masks, previewFor, ui, type Fabric, type Stage as StageKind, type Tab } from "@/lib/custom-made";

type Layer = { id: number; src: string; kind: StageKind; dur: number; enter: boolean };

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
  const mask = stage === "jacket" ? masks.jacket : masks.suit;

  // pointer-driven key light (0..1 across the stage), smoothed so it glides
  const box = useRef<HTMLDivElement>(null);
  const lx = useMotionValue(0.32), ly = useMotionValue(0.28);
  const sx = useSpring(lx, { stiffness: 60, damping: 18, mass: 0.6 });
  const sy = useSpring(ly, { stiffness: 60, damping: 18, mass: 0.6 });
  const sheen = useTransform([sx, sy], ([x, y]: number[]) => `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(255,246,228,0.34), rgba(255,246,228,0.10) 28%, transparent 52%)`);
  const spot = useTransform([sx, sy], ([x, y]: number[]) => `radial-gradient(60% 55% at ${x * 100}% ${Math.max(18, y * 60)}%, rgba(237,229,214,0.20), rgba(237,229,214,0.05) 45%, transparent 72%)`);
  const onMove = (e: React.PointerEvent) => {
    if (reduce || e.pointerType === "touch") return;
    const r = box.current?.getBoundingClientRect();
    if (!r) return;
    lx.set(Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)));
    ly.set(Math.min(1, Math.max(0, (e.clientY - r.top) / r.height)));
  };

  return (
    <div ref={box} onPointerMove={onMove} className="relative h-full w-full overflow-hidden bg-[#121214]">
      {/* studio: soft-box falloff, floor sweep, vignette */}
      <div aria-hidden className="absolute inset-0" style={{ background: "radial-gradient(75% 70% at 50% 34%, #3a3a3e 0%, #232326 46%, #121214 100%)" }} />
      <motion.div aria-hidden className="absolute inset-0 mix-blend-screen" style={{ background: reduce ? "radial-gradient(60% 55% at 32% 22%, rgba(237,229,214,0.18), transparent 70%)" : spot }} />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-[16%]" style={{ background: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.55))" }} />
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ boxShadow: "inset 0 0 160px 30px rgba(0,0,0,0.55)" }} />

      <div className="absolute left-5 top-5 z-10 md:left-8 md:top-8">
        <p className="label-micro text-ivory/55">Total</p>
        <p className="mt-1.5 flex items-baseline gap-1.5 text-[26px] font-bold leading-none tracking-[-0.03em] text-ivory md:text-[34px]">
          <span className="text-[0.42em] font-semibold text-gold">Rs.</span>
          <OdometerNumber value={total.toLocaleString("en-US")} duration={0.9} />
        </p>
        <p className="mt-2 text-[12px] text-ivory/55">{DELIVERY_TEXT}</p>
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
          <img src={ui.groundShadow} alt="" width={700} height={90} decoding="async" draggable={false} className="pointer-events-none absolute left-1/2 top-[95%] w-[230%] max-w-none -translate-x-1/2 opacity-80" />
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
              style={{ height: l.kind === "jacket" ? `${(MODEL.jacketH / MODEL.h) * 100}%` : "100%", willChange: "opacity, transform", transformOrigin: "50% 20%", filter: "drop-shadow(0 28px 36px rgba(0,0,0,0.55))" }}
              initial={l.enter ? { opacity: 0, scale: reduce ? 1 : 1.012 } : false}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: l.dur, ease: EASE_OUT }}
              onAnimationComplete={() => drop(l.id)}
            />
          ))}
          {/* specular layer: light that follows the pointer, only where the garment is */}
          {!reduce && (
            <motion.div
              aria-hidden
              className="pointer-events-none absolute left-0 top-0 w-full mix-blend-soft-light"
              style={{
                height: stage === "jacket" ? `${(MODEL.jacketH / MODEL.h) * 100}%` : "100%",
                backgroundImage: sheen,
                WebkitMaskImage: `url(${mask})`, maskImage: `url(${mask})`,
                WebkitMaskSize: "100% 100%", maskSize: "100% 100%", WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat",
              }}
            />
          )}
        </motion.div>
      </div>

      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-overlay" style={{ backgroundImage: `url(${ui.grain})`, backgroundSize: "256px 256px" }} />

      {waistcoat && <span className="cm-fade absolute bottom-5 left-5 z-10 rounded-full border border-ivory/20 bg-black/40 px-3 py-1.5 text-[12px] font-semibold text-ivory backdrop-blur md:bottom-8 md:left-8">Waistcoat added</span>}

      <div className="absolute bottom-5 right-5 z-10 h-16 w-16 overflow-hidden rounded-[6px] border border-ivory/15 bg-black/30 backdrop-blur md:bottom-8 md:right-8" aria-hidden>
        <AnimatePresence initial={false}>
          <motion.img key={icon} src={icon} alt="" width={40} height={40} className="absolute inset-3 h-10 w-10 invert" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduce ? 0.15 : 0.3, ease: EASE_OUT }} />
        </AnimatePresence>
      </div>
    </div>
  );
}
