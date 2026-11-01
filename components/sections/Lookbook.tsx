"use client";

/**
 * Collection lookbook — a pinned, scroll-driven carousel. Scroll position (not time) drives every move,
 * so scrolling back plays it in reverse. Only Lenis (scroll) and motion (animation) are involved.
 *
 * Per look, progress 0‒1 across 300vh:  0‒.30 hold DETAIL · .30‒.50 PAN → HERO · .50‒.80 hold HERO · .80‒1 PAN → next DETAIL.
 * Everything below works in "look units" `g` (0 … 15): look i occupies g ∈ [i, i+1].
 */
import {
  AnimatePresence, cubicBezier, motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useTransform,
  type MotionValue,
} from "motion/react";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ButtonWipe } from "@/components/motion/ButtonWipe";
import { Layer } from "@/components/motion/Layer";
import { LineMask } from "@/components/motion/LineMask";
import { useLenis } from "@/lib/lenis";
import { MEN_COUNT, MONO_PHOTOS, N, SCREENS_PER_LOOK, defaults, looks, type Cfg, type Look } from "@/lib/lookbook-data";

const Debug = dynamic(() => import("./LookbookDebug"), { ssr: false });

const BG = "#F6F6F6";
const INK = "#111111";
const MUTE = "#6B6B6B";
const SITE_FONT = "var(--font-display), 'Helvetica Neue', Arial, sans-serif"; // same family as the rest of the site
const GREY = MONO_PHOTOS ? "grayscale(1)" : undefined;
const NAME_SIZE = "clamp(20px, 1.8vw, 32px)";
const DESC_SIZE = "clamp(14px, 1.1vw, 19px)";
const expoOut = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
const clampI = (v: number) => Math.max(0, Math.min(N - 1, v));

type Ease = (t: number) => number;
const useEased = (g: MotionValue<number>, input: number[], output: number[], ease: Ease) => useTransform(g, input, output, { ease, clamp: true });

/* ─────────────── one look: figures ─────────────── */
function LookFigures({ look, i, g, cfg, ease }: { look: Look; i: number; g: MotionValue<number>; cfg: Cfg; ease: Ease }) {
  const { holdDetail: h, panAEnd: pa, holdHeroEnd: he } = cfg;
  const A0 = i + h, A1 = i + pa, B0 = i + he;
  const giantOut = A0 + (A1 - A0) / cfg.giantSpeed; // giant exits first
  const first = i === 0;

  // L1 giant — arrives as the previous look's "peek", then exits first
  const giantX = useEased(g, [i - 1 + h, i - 1 + pa, i - 1 + he, i, A0, giantOut], [cfg.peekX + 55, cfg.peekX, cfg.peekX, cfg.giantX, cfg.giantX, cfg.giantExitX], ease);
  const giantS = useEased(g, [i - 1 + he, i], [cfg.peekScale, 1], ease);
  // L3 small — right in DETAIL, becomes the left small of HERO, then leaves
  const smallX = useEased(g, [i - 1 + he, i, A0, A1, B0, i + 1], [160, cfg.smallRightX, cfg.smallRightX, cfg.smallLeftX, cfg.smallLeftX, cfg.smallExitX], ease);
  // second small copy behind the giant
  const backX = useEased(g, [i - 1 + he, i, A0, A1], [135, cfg.smallBackX, cfg.smallBackX, cfg.smallExitX], ease);
  // L2 hero — enters from the right edge
  const heroX = useEased(g, [A0, A1, B0, i + 1], [cfg.heroEnterX, cfg.heroX, cfg.heroX, cfg.heroExitX], ease);

  const small = { H: cfg.smallH, bottom: cfg.smallFloor, trim: look.trimProduct, src: look.product, priority: first, filter: GREY };
  return (
    <>
      <Layer {...small} x={backX} z={2} />
      <Layer {...small} x={smallX} z={2} alt={`${look.name} — product`} />
      <Layer src={look.model} trim={look.trimModel} x={heroX} z={3} H={cfg.heroH} top={cfg.heroTop} alt={`${look.name} — worn`} priority={first} filter={GREY} origin="0 0" />
      <Layer src={look.model} trim={look.trimModel} x={giantX} scale={giantS} z={4} H={cfg.giantH} top={cfg.giantTop} priority={first} filter={GREY} origin="0 0" />
    </>
  );
}

/* ─────────────── one look: text ─────────────── */
function LookText({ look, i, g, cfg, ease, mobile }: { look: Look; i: number; g: MotionValue<number>; cfg: Cfg; ease: Ease; mobile: boolean }) {
  const { holdDetail: h, panAEnd: pa, holdHeroEnd: he } = cfg;
  const panLen = pa - h, panBLen = 1 - he;

  // DETAIL text: enters 65% through the previous pan, finishes 20% into the hold; leaves in the first 25% of pan A
  const dEnter: [number, number] = [i - 1 + he + cfg.enterStart * panBLen, i + cfg.enterTail * h];
  const dExit: [number, number] = [i + h, i + h + cfg.exitEnd * panLen];
  // HERO text: enters 65% through pan A, finishes 20% into the hero hold; leaves in the first 25% of pan B
  const hEnter: [number, number] = [i + h + cfg.enterStart * panLen, i + pa + cfg.enterTail * (he - pa)];
  const hExit: [number, number] = [i + he, i + he + cfg.exitEnd * panBLen];

  const dOpacity = useTransform(g, dExit, [1, 0], { ease, clamp: true });
  const dY = useTransform(g, dExit, [0, -8], { ease, clamp: true });
  const hOpacity = useTransform(g, hExit, [1, 0], { ease, clamp: true });
  const hY = useTransform(g, hExit, [0, -8], { ease, clamp: true });
  const dPE = useTransform(g, (v) => (v > dEnter[0] + 0.02 && v < dExit[1] - 0.01 ? ("auto" as const) : ("none" as const)));
  const hPE = useTransform(g, (v) => (v > hEnter[0] + 0.02 && v < hExit[1] - 0.01 ? ("auto" as const) : ("none" as const)));

  // first look has nothing before it: its detail text is already in place
  const dE = (shift = 0): [number, number] => (i === 0 ? [-2, -1.9] : [dEnter[0] + shift * (dEnter[1] - dEnter[0]), dEnter[1] + shift * (dEnter[1] - dEnter[0])]);
  const hE = (shift = 0): [number, number] => [hEnter[0] + shift * (hEnter[1] - hEnter[0]), hEnter[1] + shift * (hEnter[1] - hEnter[0])];
  const st = cfg.lineStagger;
  const hBtn: [number, number] = [hEnter[0] + cfg.buttonDelay * (hEnter[1] - hEnter[0]), hEnter[1]];

  return (
    <>
      {/* DETAIL */}
      <div className="absolute z-[6]" style={{ left: `${cfg.textLeft}vw`, width: `${cfg.textW}vw`, top: `${cfg.textY}vh`, transform: "translateY(-50%)" }}>
        <motion.div style={{ opacity: dOpacity, y: dY, pointerEvents: dPE }} className={`will-change-transform ${mobile ? "rounded-md bg-white/80 p-3 backdrop-blur-sm" : ""}`}>
          <LineMask g={g} enter={dE()} ease={ease} className="font-bold leading-[1.15] tracking-[-0.03em]" style={{ color: INK, fontSize: NAME_SIZE }}>{look.name}</LineMask>
          <div className="mt-3 leading-[1.55] [text-wrap:pretty]" style={{ color: MUTE, fontSize: DESC_SIZE }}>
            {look.desc.map((line, k) => (
              <LineMask key={k} g={g} enter={dE((k + 1) * st)} ease={ease} fade>{line}</LineMask>
            ))}
          </div>
        </motion.div>
      </div>

      {/* HERO */}
      <div
        className="absolute z-[6]"
        style={{ left: `${cfg.heroTextX}vw`, top: `${cfg.heroTextY}vh`, transform: "translate(-50%,-50%)", width: mobile ? "70vw" : "min(34vw, 520px)" }}
      >
        <motion.div style={{ opacity: hOpacity, y: hY, pointerEvents: hPE }} className={`will-change-transform ${mobile ? "rounded-md bg-white/80 p-3 text-left backdrop-blur-sm" : "text-center"}`}>
          <LineMask g={g} enter={hE()} ease={ease}>
            <h2 className="leading-[1.05]" style={{ fontFamily: SITE_FONT, fontSize: mobile ? 28 : 40, color: INK, fontWeight: 700, letterSpacing: "-0.04em" }}>{look.name}</h2>
          </LineMask>
          <LineMask g={g} enter={hE(st)} ease={ease} fade className="mt-3 text-[11px] tracking-[0.18em]" style={{ color: MUTE }}>
            {`Look ${String(look.id).padStart(2, "0")} of ${N} · Made to measure`}
          </LineMask>
          <div className={mobile ? "" : "flex justify-center"}>
            <ButtonWipe g={g} enter={hBtn} ease={ease} href="/#book">{look.cta}</ButtonWipe>
          </div>
        </motion.div>
      </div>
    </>
  );
}

/* ─────────────── ghost word ─────────────── */
function Ghost({ look, i, g, cfg, ease }: { look: Look; i: number; g: MotionValue<number>; cfg: Cfg; ease: Ease }) {
  const { holdDetail: h, panAEnd: pa, holdHeroEnd: he } = cfg;
  const par = cfg.ghostParallax;
  const a = (cfg.heroEnterX - cfg.heroX) * par, b = (cfg.heroX - cfg.heroExitX) * par;
  const x = useTransform(g, [i - 0.1, i + h, i + pa, i + he, i + 1], [14, 14, 14 - a, 14 - a, 14 - a - b], { ease, clamp: true });
  const xv = useTransform(x, (v) => `calc(-50% + ${v}vw)`);
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
      className="pointer-events-none absolute left-1/2 z-0 select-none whitespace-nowrap will-change-transform"
      style={{ top: `${cfg.ghostY}vh`, fontFamily: SITE_FONT, fontSize: `${cfg.ghostCap / 0.72}vh`, fontWeight: 700, letterSpacing: "-0.05em", lineHeight: 1, color: `rgba(0,0,0,${cfg.ghostOpacity})`, translateY: "-50%", x: xv }}
      aria-hidden
    >
      {look.ghost}
    </motion.div>
  );
}

/* ─────────────── reduced motion: 0.3s crossfades, no parallax ─────────────── */
function ReducedStage({ look, scene, cfg, mobile }: { look: Look; scene: "d" | "h"; cfg: Cfg; mobile: boolean }) {
  const gx = useMotionValue(cfg.giantX), sr = useMotionValue(cfg.smallRightX), sb = useMotionValue(cfg.smallBackX), hx = useMotionValue(cfg.heroX), sl = useMotionValue(cfg.smallLeftX);
  const small = { H: cfg.smallH, bottom: cfg.smallFloor, trim: look.trimProduct, src: look.product, filter: GREY };
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="absolute inset-0">
      <div className="absolute inset-0 flex items-center justify-center text-center" aria-hidden style={{ fontFamily: SITE_FONT, fontSize: `${cfg.ghostCap / 0.72}vh`, fontWeight: 700, letterSpacing: "-0.05em", color: `rgba(0,0,0,${cfg.ghostOpacity})` }}>{look.ghost}</div>
      {scene === "d" ? (
        <>
          <Layer {...small} x={sb} z={2} />
          <Layer {...small} x={sr} z={2} alt={`${look.name} — product`} />
          <Layer src={look.model} trim={look.trimModel} x={gx} z={4} H={cfg.giantH} top={cfg.giantTop} alt={`${look.name} — worn`} filter={GREY} origin="0 0" />
          <div className="absolute z-[6]" style={{ left: `${cfg.textLeft}vw`, width: `${cfg.textW}vw`, top: `${cfg.textY}vh`, transform: "translateY(-50%)" }}>
            <p className="font-bold tracking-[-0.03em]" style={{ color: INK, fontSize: NAME_SIZE }}>{look.name}</p>
            <p className="mt-3 leading-[1.55]" style={{ color: MUTE, fontSize: DESC_SIZE }}>{look.desc.join(" ")}</p>
          </div>
        </>
      ) : (
        <>
          <Layer {...small} x={sl} z={2} />
          <Layer src={look.model} trim={look.trimModel} x={hx} z={3} H={cfg.heroH} top={cfg.heroTop} alt={`${look.name} — worn`} filter={GREY} origin="0 0" />
          <div className="absolute z-[6] text-center" style={{ left: `${cfg.heroTextX}vw`, top: `${cfg.heroTextY}vh`, transform: "translate(-50%,-50%)", width: mobile ? "70vw" : "min(34vw,520px)" }}>
            <h2 style={{ fontFamily: SITE_FONT, fontSize: mobile ? 28 : 40, color: INK, fontWeight: 700, letterSpacing: "-0.04em" }}>{look.name}</h2>
            <p className="mt-3 text-[11px] tracking-[0.18em]" style={{ color: MUTE }}>{`Look ${String(look.id).padStart(2, "0")} of ${N} · Made to measure`}</p>
            <a href="/#book" className="mx-auto mt-6 flex h-10 w-[200px] items-center justify-center text-[11px] uppercase tracking-[0.12em] text-white" style={{ background: INK }}>{look.cta}</a>
          </div>
        </>
      )}
    </motion.div>
  );
}

/* ─────────────── section ─────────────── */
export function Lookbook() {
  const reduce = useReducedMotion();
  const lenis = useLenis();
  const section = useRef<HTMLElement>(null);
  const [mobile, setMobile] = useState(false);
  const [debug, setDebug] = useState(false);
  const [cur, setCur] = useState(0);
  const [ghostIdx, setGhostIdx] = useState(0);
  const [scene, setScene] = useState<"d" | "h">("d");

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const on = () => setMobile(mq.matches);
    on();
    mq.addEventListener("change", on);
    setDebug(new URLSearchParams(window.location.search).get("debug") === "1");
    return () => mq.removeEventListener("change", on);
  }, []);

  const base = mobile ? defaults.mobile : defaults.desktop;
  const [override, setOverride] = useState<Cfg | null>(null);
  useEffect(() => setOverride(null), [mobile]);
  const cfg = override ?? base;
  const ease = useMemo(() => cubicBezier(...cfg.panEase), [cfg.panEase]);

  // global scroll value in look units: pinned scroll distance is (N·300 − 100)vh
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const g = useTransform(scrollYProgress, (p) => p * ((N * SCREENS_PER_LOOK - 100) / SCREENS_PER_LOOK));

  useMotionValueEvent(g, "change", (v) => {
    const c = clampI(Math.floor(v + 0.2));
    setCur((p) => (p === c ? p : c));
    const w = clampI(Math.floor(v + (1 - (cfg.holdHeroEnd + 1) / 2)));
    setGhostIdx((p) => (p === w ? p : w));
    const i = clampI(Math.floor(v));
    setScene(v - i < (cfg.holdDetail + cfg.panAEnd) / 2 ? "d" : "h");
  });

  // ── snap: 150ms after scrolling stops inside a pan, glide to the nearest hold
  const timer = useRef<number | undefined>(undefined);
  const px = useCallback((target: number) => {
    const top = (section.current?.getBoundingClientRect().top ?? 0) + window.scrollY;
    return top + target * (SCREENS_PER_LOOK / 100) * window.innerHeight;
  }, []);
  useMotionValueEvent(g, "change", (v) => {
    window.clearTimeout(timer.current);
    if (!lenis || reduce || v < 0 || v > N - 1 + cfg.holdHeroEnd) return;
    timer.current = window.setTimeout(() => {
      const i = clampI(Math.floor(v)), t = v - i;
      let target: number | null = null;
      if (t > cfg.holdDetail && t < cfg.panAEnd) target = i + (t < (cfg.holdDetail + cfg.panAEnd) / 2 ? cfg.holdDetail : cfg.panAEnd);
      else if (t > cfg.holdHeroEnd && i < N - 1) target = i + (t < (cfg.holdHeroEnd + 1) / 2 ? cfg.holdHeroEnd : 1);
      if (target !== null) lenis.scrollTo(px(target), { duration: cfg.snapDuration, easing: expoOut });
    }, cfg.snapMs);
  });
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const goTo = (k: number) => {
    const y = px(clampI(k) + cfg.holdDetail / 2);
    if (lenis) lenis.scrollTo(y, { duration: 2.4, easing: expoOut });
    else window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
  };
  const go = (dir: 1 | -1) => goTo(Math.round(g.get()) + dir);

  const win = [cur - 1, cur, cur + 1].filter((k) => k >= 0 && k < N);
  const ghost = looks[ghostIdx];

  return (
    <section ref={section} id="lookbook" aria-label="Collection lookbook" className="relative" style={{ height: `${N * SCREENS_PER_LOOK}vh`, background: BG }}>
      <div className="sticky top-0 h-screen overflow-hidden" style={{ background: BG }}>
        {/* studio-floor fade */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1]" style={{ height: mobile ? "40%" : "28%", background: `linear-gradient(transparent, rgba(255,255,255,${mobile ? 0.92 : 0.7}))` }} />

        {reduce ? (
          <AnimatePresence initial={false}>
            <ReducedStage key={`${cur}-${scene}`} look={looks[cur]} scene={scene} cfg={cfg} mobile={mobile} />
          </AnimatePresence>
        ) : (
          <>
            <AnimatePresence initial={false}>
              <Ghost key={ghost.id} look={ghost} i={ghostIdx} g={g} cfg={cfg} ease={ease} />
            </AnimatePresence>
            {win.map((i) => <LookFigures key={`f${i}`} look={looks[i]} i={i} g={g} cfg={cfg} ease={ease} />)}
            {win.map((i) => <LookText key={`t${i}`} look={looks[i]} i={i} g={g} cfg={cfg} ease={ease} mobile={mobile} />)}
          </>
        )}

        {/* persistent UI */}
        <nav aria-label="Filter by men or women" className="absolute left-4 top-[76px] z-10 flex items-baseline gap-4 font-bold tracking-[-0.04em] md:left-8 md:top-[80px] md:gap-6" style={{ fontSize: mobile ? 22 : 32 }}>
          {([["Men", 0], ["Women", MEN_COUNT]] as const).map(([label, k]) => {
            const on = (k === 0) === (cur < MEN_COUNT);
            return (
              <button key={label} type="button" onClick={() => goTo(k)} aria-pressed={on} className="relative pb-1 transition-colors duration-[900ms]" style={{ color: on ? INK : "rgba(0,0,0,.28)" }}>
                {label}
                <span aria-hidden className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-black transition-transform duration-[900ms]" style={{ transform: `scaleX(${on ? 1 : 0})` }} />
              </button>
            );
          })}
        </nav>
        <div className="pointer-events-none absolute right-4 top-[76px] z-10 flex items-center gap-2 md:right-8 md:top-[80px] md:gap-3" style={{ color: INK }}>
          <span className="text-[11px] tracking-[0.18em]" style={{ color: MUTE }}>{String(cur + 1).padStart(2, "0")} / {N}</span>
          <span aria-hidden className="grid h-8 w-8 place-items-center rounded-full border md:h-9 md:w-9" style={{ borderColor: INK }}><span className="h-1 w-1 rounded-full" style={{ background: INK }} /></span>
        </div>
        <div className="absolute bottom-5 right-5 z-10 flex gap-2 md:bottom-8 md:right-8">
          {([-1, 1] as const).map((d) => (
            <button
              key={d} onClick={() => go(d)} disabled={(d === -1 && cur === 0) || (d === 1 && cur === N - 1)}
              aria-label={d === -1 ? "Previous look" : "Next look"}
              className="grid h-11 w-11 place-items-center rounded-full border text-[15px] transition-colors hover:bg-black hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-inherit"
              style={{ borderColor: "rgba(0,0,0,.25)", color: INK }}
            >{d === -1 ? "←" : "→"}</button>
          ))}
        </div>
      </div>
      {debug && <Debug cfg={cfg} onChange={setOverride} />}
    </section>
  );
}
