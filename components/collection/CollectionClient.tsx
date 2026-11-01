"use client";

/**
 * Collection page.
 *  1. dark intro — masked headline, rolling digits, a fan of cutouts that leans toward the cursor
 *  2. sticky filter bar — sliding pill, live count that rolls
 *  3. staggered grid — cards of different width and drop, tinted spotlights, parallax figures, fast spring reflow on filter
 *  4. quick view — slides in from the right; prev / next move the stage sideways in the direction you travel
 *  5. closing band
 */
import { AnimatePresence, motion, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button, Drift, Hanger, Scissors, Spool, Thimble } from "@/components/Icons";
import { JacketOnHanger, Mannequin, StitchLines, TapeMeasure } from "@/components/Illustrations";
import { KineticNumber, MaskLine, RollText } from "@/components/motion";
import { SectionLabel } from "@/components/SectionLabel";
import { collectionItems, type CollectionItem } from "@/data/collection";
import { useLenis } from "@/lib/lenis";

const EASE = [0.22, 1, 0.36, 1] as const;
const FAST = { type: "spring", stiffness: 340, damping: 30 } as const;

type Cat = "all" | "men" | "women";
const cats: { id: Cat; label: string }[] = [{ id: "all", label: "All" }, { id: "men", label: "Men" }, { id: "women", label: "Women" }];

/* spotlight colours per piece — pale garments get deep grounds, dark garments get warm sand */
const tint: [string, string, boolean][] = [
  ["#4A4A50", "#1A1A1D", true], ["#E9E3D5", "#BFB6A0", false], ["#31465A", "#0F1822", true], ["#E7E1D3", "#BDB4A0", false], ["#EDE6D6", "#BDB39C", false],
  ["#7B2F3B", "#2A0E14", true], ["#3C5A48", "#14241B", true], ["#4A4036", "#1C1712", true], ["#F0E9DA", "#C9BEA6", false], ["#4B4B52", "#18181B", true],
  ["#EAE3D4", "#C2B8A2", false], ["#34524C", "#13211F", true], ["#31465A", "#0F1822", true], ["#5A3F38", "#201512", true], ["#EBE4D6", "#C4BAA4", false],
];

type Piece = CollectionItem & { n: number; cat: Exclude<Cat, "all">; light: string; deep: string; dark: boolean };
const pieces: Piece[] = collectionItems.map((it, i) => ({ ...it, n: i + 1, cat: i < 8 ? "men" : "women", light: tint[i][0], deep: tint[i][1], dark: tint[i][2] }));

const pattern = [
  "md:col-span-5 aspect-[5/6]",
  "md:col-span-3 aspect-[3/4] md:mt-24",
  "md:col-span-4 aspect-[4/5] md:mt-10",
  "md:col-span-3 aspect-[3/4]",
  "md:col-span-4 aspect-[4/5] md:mt-16",
  "md:col-span-5 aspect-[5/6] md:mt-6",
];

const bg = (p: Piece) => ({ background: `radial-gradient(ellipse at 50% 30%, ${p.light}, ${p.deep} 78%)` });

/* ───────────── 1. intro fan ───────────── */
function Fan() {
  const mx = useMotionValue(0);
  const s = useSpring(mx, { stiffness: 120, damping: 18 });
  const cards = [
    { p: pieces[5], x: "-64%", y: 36, r: -9, depth: 26 },
    { p: pieces[11], x: "64%", y: 56, r: 9, depth: 34 },
    { p: pieces[2], x: "0%", y: 0, r: 0, depth: 12 },
  ];
  return (
    <div
      className="relative mx-auto h-[24rem] w-full max-w-[34rem] md:h-[34rem]"
      onMouseMove={(e) => { const b = e.currentTarget.getBoundingClientRect(); mx.set(((e.clientX - b.left) / b.width - 0.5) * 2); }}
      onMouseLeave={() => mx.set(0)}
    >
      {cards.map((c, i) => <FanCard key={c.p.slug} {...c} s={s} i={i} />)}
    </div>
  );
}
function FanCard({ p, x, y, r, depth, s, i }: { p: Piece; x: string; y: number; r: number; depth: number; s: ReturnType<typeof useSpring>; i: number }) {
  const dx = useTransform(s, (v: number) => v * depth);
  const rot = useTransform(s, (v: number) => v * (depth / 6));
  return (
    <motion.div
      initial={{ opacity: 0, x: "0%", y: 120, rotate: 0, scale: 0.8 }}
      animate={{ opacity: 1, x, y, rotate: r, scale: 1 }}
      transition={{ ...FAST, delay: 0.25 + i * 0.09 }}
      className="absolute left-1/2 top-0 w-[46%] -translate-x-1/2"
      style={{ zIndex: i === 2 ? 3 : 1 }}
    >
      <motion.div style={{ x: dx, rotate: rot }} className="relative aspect-[3/4] overflow-hidden shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7)]">
        <div className="absolute inset-0" style={bg(p)} />
        <Image src={p.modelImage} alt="" fill priority sizes="16rem" className="object-contain object-bottom px-[6%] pb-[5%] pt-[8%]" />
      </motion.div>
    </motion.div>
  );
}

/* ───────────── 3. grid card ───────────── */
function Card({ p, cls, onOpen }: { p: Piece; cls: string; onOpen: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const fig = useTransform(scrollYProgress, [0, 1], ["6%", "-6%"]);
  const ink = p.dark ? "text-ivory" : "text-[#1B1B1D]";
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 70, scale: 0.92 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.12 }}
      exit={{ opacity: 0, scale: 0.86, transition: { duration: 0.18 } }}
      transition={{ ...FAST, layout: FAST }}
      className={`col-span-1 ${cls}`}
    >
      <button ref={ref} onClick={onOpen} aria-label={`Quick view — ${p.title}`} className={`group relative block h-full w-full overflow-hidden text-left ${ink}`} style={bg(p)}>
        <span aria-hidden className="pointer-events-none absolute inset-3 z-10 border border-current opacity-20 transition-all duration-500 group-hover:inset-2 group-hover:opacity-60" />
        <span aria-hidden className="absolute bottom-[15%] left-1/2 h-4 w-[44%] -translate-x-1/2 rounded-[50%] bg-black/40 blur-md transition-all duration-500 group-hover:opacity-0" />
        <motion.div style={{ y: fig }} className="absolute inset-0">
          <Image src={p.modelImage} alt={p.title} fill sizes="(min-width:768px) 36vw, 50vw" className="object-contain object-bottom px-[8%] pb-[14%] pt-[8%] drop-shadow-[0_24px_30px_rgba(0,0,0,0.3)] transition-all duration-500 ease-out group-hover:scale-90 group-hover:opacity-0" />
          <Image src={p.thumbImage} alt="" fill sizes="(min-width:768px) 36vw, 50vw" className="scale-110 object-contain object-center p-[12%] pb-[18%] opacity-0 transition-all duration-500 ease-out group-hover:scale-100 group-hover:opacity-100" />
        </motion.div>
        <span className="label-micro absolute left-4 top-4 z-10 opacity-70">No. {String(p.n).padStart(2, "0")}</span>
        <span className="label-micro absolute right-4 top-4 z-10 opacity-70">{p.cat}</span>
        <span className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-3 p-4 md:p-5">
          <span className="text-base font-semibold leading-tight tracking-[-0.03em] md:text-lg"><RollText>{p.title}</RollText></span>
          <span className="shrink-0 text-xs font-semibold opacity-70">{p.price}</span>
        </span>
      </button>
    </motion.div>
  );
}

/* ───────────── 4. quick view ───────────── */
function QuickView({ list, index, dir, setIndex, onClose, onReserve }: { list: Piece[]; index: number; dir: number; setIndex: (i: number, d: number) => void; onClose: () => void; onReserve: () => void }) {
  const p = list[index];
  const go = useCallback((d: number) => setIndex((index + d + list.length) % list.length, d), [index, list.length, setIndex]);
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); if (e.key === "ArrowRight") go(1); if (e.key === "ArrowLeft") go(-1); };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [go, onClose]);
  return (
    <motion.div className="fixed inset-0 z-[200]" initial={{ opacity: 1 }} animate={{ opacity: 1 }} exit={{ opacity: 1 }} role="dialog" aria-modal aria-label={p.title}>
      <motion.button aria-label="Close" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%", transition: { duration: 0.28, ease: [0.5, 0, 0.9, 0.4] } }}
        transition={{ type: "spring", stiffness: 300, damping: 34 }}
        data-lenis-prevent
        className="absolute inset-y-0 right-0 grid w-full grid-rows-[1fr_auto] overflow-hidden bg-white md:w-[min(66rem,94vw)] md:grid-cols-[1.1fr_1fr] md:grid-rows-1"
      >
        {/* stage */}
        <div className="relative min-h-[48svh] overflow-hidden md:min-h-0">
          <AnimatePresence initial={false} custom={dir} mode="popLayout">
            <motion.div
              key={p.slug}
              custom={dir}
              variants={{
                enter: (d: number) => ({ x: d * 90, opacity: 0, scale: 0.94 }),
                center: { x: 0, opacity: 1, scale: 1 },
                exit: (d: number) => ({ x: d * -90, opacity: 0, scale: 0.94 }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: EASE }}
              className="absolute inset-0"
              style={bg(p)}
            >
              <Image src={p.modelImage} alt={p.title} fill sizes="40rem" className="object-contain object-bottom px-[10%] pb-[6%] pt-[10%] drop-shadow-[0_30px_40px_rgba(0,0,0,0.35)]" />
              <span className={`label-micro absolute left-6 top-6 ${p.dark ? "text-ivory/70" : "text-ink/60"}`}>No. {String(p.n).padStart(2, "0")} / {String(collectionItems.length).padStart(2, "0")}</span>
            </motion.div>
          </AnimatePresence>
          <div className="absolute bottom-5 left-5 z-10 flex gap-2">
            {[-1, 1].map((d) => (
              <button key={d} onClick={() => go(d)} aria-label={d < 0 ? "Previous piece" : "Next piece"} className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-lg transition-transform duration-300 hover:scale-110">{d < 0 ? "←" : "→"}</button>
            ))}
          </div>
        </div>

        {/* details */}
        <div className="relative flex flex-col justify-between gap-8 p-6 md:p-10">
          <button onClick={onClose} aria-label="Close quick view" className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 text-xl transition-transform duration-300 hover:rotate-90">×</button>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={p.slug} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.26, ease: EASE }} className="mt-8 md:mt-14">
              <p className="label-micro text-gold">{p.cat === "men" ? "Menswear" : "Womenswear"}</p>
              <h3 className="mt-4 text-[clamp(2rem,3.4vw,3.4rem)] font-bold leading-[1] tracking-[-0.05em]">{p.title}</h3>
              <p className="mt-5 max-w-sm text-slate">{p.description}</p>
              <p className="mt-6 text-2xl font-semibold tracking-[-0.03em]">{p.price}</p>
            </motion.div>
          </AnimatePresence>
          <div className="flex flex-wrap items-center gap-3">
            <button onClick={onReserve} className="btn btn-burgundy">Reserve now</button>
            <Link href="/#book" onClick={onClose} className="btn btn-ghost !border-ink/20 !text-ink">Book a fitting</Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ───────────── page ───────────── */
export function CollectionClient() {
  const router = useRouter();
  const lenis = useLenis();
  const [cat, setCat] = useState<Cat>("all");
  const [sel, setSel] = useState<{ slug: string; dir: number } | null>(null);
  const shown = useMemo(() => pieces.filter((p) => cat === "all" || p.cat === cat), [cat]);
  const idx = sel ? shown.findIndex((p) => p.slug === sel.slug) : -1;
  const open = sel !== null && idx >= 0;

  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    return () => { lenis?.start(); document.documentElement.style.overflow = ""; };
  }, [open, lenis]);

  const reserve = () => { setSel(null); router.push("/#book"); };

  return (
    <div style={{ paddingTop: 64 }} className="bg-white text-ink">
      {/* 1 — intro */}
      <section className="relative overflow-hidden bg-black text-ivory">
        <div className="container-x grid items-center gap-8 py-12 md:grid-cols-[1.1fr_1fr] md:py-20">
          <div>
            <SectionLabel label="Collection" dark />
            <h1 className="h-section-xl mt-5 md:mt-6">
              <MaskLine mode="mount">The pieces</MaskLine>
              <MaskLine mode="mount" index={1} className="text-gold">we make</MaskLine>
            </h1>
            <div className="mt-8 flex flex-wrap items-end gap-x-12 gap-y-6 md:mt-12">
              <div className="border-t border-ivory/40 pt-4">
                <KineticNumber value={pieces.length} pad={2} play stagger={0.1} duration={1.2} className="text-[clamp(3.5rem,7vw,7rem)] font-extrabold tracking-[-0.05em]" />
                <p className="mt-2 text-sm font-semibold text-ivory/50">Pieces</p>
              </div>
              <div className="border-t border-ivory/40 pt-4">
                <KineticNumber value={100} suffix="%" play stagger={0.1} duration={1.3} className="text-[clamp(3.5rem,7vw,7rem)] font-extrabold tracking-[-0.05em]" />
                <p className="mt-2 text-sm font-semibold text-ivory/50">Made to measure</p>
              </div>
            </div>
          </div>
          <Fan />
        </div>
        <Drift className="pointer-events-none absolute bottom-6 left-[46%] hidden h-14 w-14 text-gold/70 lg:block"><Scissors className="h-full w-full" /></Drift>
        <Drift delay={1.4} className="pointer-events-none absolute right-8 top-8 hidden h-12 w-12 text-ivory/30 lg:block"><Thimble className="h-full w-full" /></Drift>
      </section>

      {/* 2 — filter bar */}
      <div className="sticky top-16 z-30 border-b hairline bg-white/90 backdrop-blur-md">
        <div className="container-x flex items-center justify-between gap-4 py-3">
          <div className="flex gap-1.5" role="tablist" aria-label="Filter collection">
            {cats.map((c) => (
              <button key={c.id} role="tab" aria-selected={cat === c.id} onClick={() => setCat(c.id)} className={`relative rounded-full px-5 py-2 text-sm font-semibold transition-colors duration-300 ${cat === c.id ? "text-ivory" : "text-ink hover:bg-card"}`}>
                {cat === c.id && <motion.span layoutId="cat-pill" transition={{ type: "spring", stiffness: 480, damping: 36 }} className="absolute inset-0 rounded-full bg-ink" />}
                <span className="relative z-10">{c.label}</span>
              </button>
            ))}
          </div>
          <p className="flex items-baseline gap-2 text-sm font-semibold text-mute">
            <KineticNumber value={shown.length} pad={2} play stagger={0.05} duration={0.5} className="text-2xl font-bold tracking-[-0.04em] text-ink" />
            pieces
          </p>
        </div>
      </div>

      {/* 3 — grid */}
      <section className="container-x pb-20 pt-10 md:pb-32 md:pt-16" aria-label="Collection">
        <motion.div layout className="grid grid-cols-2 items-start gap-3 md:grid-cols-12 md:gap-5">
          <AnimatePresence mode="popLayout" initial={false}>
            {shown.map((p, i) => (
              <Card key={p.slug} p={p} cls={pattern[i % pattern.length]} onOpen={() => setSel({ slug: p.slug, dir: 1 })} />
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* 5 — closing band */}
      <section className="relative overflow-hidden bg-burgundy text-ivory">
        <div className="container-x relative z-10 grid gap-8 py-14 md:grid-cols-[1fr_auto] md:items-end md:py-20">
          <div>
            <h2 className="h-section-xl"><MaskLine>Found</MaskLine><MaskLine index={1}>your piece?</MaskLine></h2>
            <ul className="mt-8 flex gap-5 text-ivory/60" aria-hidden>
              {[Scissors, Spool, Hanger, Button].map((I, i) => (
                <li key={i}><Drift delay={i * 0.5} dur={5 + i * 0.6} className="h-12 w-12 md:h-14 md:w-14"><I className="h-full w-full" /></Drift></li>
              ))}
            </ul>
          </div>
          <Link href="/#book" className="btn btn-light w-fit">Book a Consultation</Link>
        </div>
        <StitchLines className="pointer-events-none absolute inset-y-0 right-0 hidden h-full w-3/5 text-ivory/20 md:block" />
        <JacketOnHanger className="pointer-events-none absolute -bottom-6 right-[10%] hidden h-[85%] text-ivory/35 lg:block" />
        <Mannequin className="pointer-events-none absolute -bottom-4 right-[32%] hidden h-[70%] text-ivory/25 xl:block" />
        <TapeMeasure className="pointer-events-none absolute left-0 top-0 hidden w-72 text-ivory/20 lg:block" />
      </section>

      <AnimatePresence>
        {open && (
          <QuickView
            key="qv"
            list={shown}
            index={idx}
            dir={sel!.dir}
            setIndex={(i, d) => setSel({ slug: shown[i].slug, dir: d })}
            onClose={() => setSel(null)}
            onReserve={reserve}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
