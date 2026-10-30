"use client";

/**
 * 2 — Fabrics: section pins and a row of fabric photographs translates horizontally with scroll.
 * Each card = real cloth image (parallax inside its frame) + name + one-line note.
 * Replace the files in /public/images/fabrics/<slug>.webp with your own photos (same names) — nothing else to change.
 */
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { VelocityBlur } from "@/components/motion";

const fabrics = [
  { slug: "wool", name: "Wool", note: "Structure and year-round polish.", swatch: ["#2b2f3a", "#3d4352"] },
  { slug: "wool-linen", name: "Wool-linen", note: "Elegance with a lighter, fresher hand.", swatch: ["#8d8a7a", "#b3ad98"] },
  { slug: "linen", name: "Linen", note: "Breathable, textured, effortless.", swatch: ["#c9bfa6", "#e3dbc6"] },
  { slug: "cotton", name: "Cotton", note: "Crisp shirting, comfortable all day.", swatch: ["#e9e6df", "#cfcabb"] },
  { slug: "blends", name: "Blends", note: "Balanced drape, resilience and finish.", swatch: ["#4a4f5e", "#6b7280"] },
  { slug: "formal", name: "Formal", note: "Cloths chosen for the occasion.", swatch: ["#5b1f27", "#7a2c37"] },
];

function Card({ f, i, p }: { f: (typeof fabrics)[number]; i: number; p: MotionValue<number> }) {
  // subtle parallax: image drifts opposite to the track while it travels
  const imgX = useTransform(p, [0, 1], [`${-4 + i * 0.4}%`, `${4 - i * 0.4}%`]);
  return (
    <article className="w-[clamp(15rem,24vw,23rem)] shrink-0">
      <div className="relative aspect-[4/5] overflow-hidden bg-card">
        <motion.div style={{ x: imgX }} className="absolute -inset-x-[6%] inset-y-0">
          <Image src={`/images/fabrics/${f.slug}.webp`} alt={`${f.name} cloth swatch — Orhanza`} fill sizes="30vw" className="object-cover" loading="eager" />
        </motion.div>
        <span className="label-micro absolute left-4 top-4 rounded-full bg-white/85 px-3 py-1 text-ink backdrop-blur">0{i + 1} / 0{fabrics.length}</span>
      </div>
      <div className="mt-4 flex items-end justify-between gap-4">
        <h3 className="whitespace-nowrap text-[clamp(1.6rem,2.7vw,2.9rem)] font-extrabold uppercase leading-[0.9] tracking-[-0.045em]">{f.name}</h3>
        <span className="mb-1 h-3 w-14 shrink-0 rounded-full" style={{ background: `linear-gradient(90deg, ${f.swatch[0]}, ${f.swatch[1]})` }} />
      </div>
      <p className="mt-2 text-sm text-slate">{f.note}</p>
    </article>
  );
}

export function Fabrics() {
  const ref = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const max = useRef(0);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });

  useEffect(() => {
    const measure = () => { if (track.current) max.current = Math.max(0, track.current.scrollWidth - window.innerWidth); };
    measure();
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    window.addEventListener("resize", measure);
    return () => { ro.disconnect(); window.removeEventListener("resize", measure); };
  }, []);

  const prog = useTransform(p, [0.04, 0.96], [0, 1], { clamp: true });
  const x = useTransform(prog, (v) => -v * max.current);

  return (
    <>
      {/* desktop: pinned horizontal */}
      <section id="fabrics" ref={ref} className="relative hidden h-[260svh] bg-white text-ink md:block" aria-label="Fabrics">
        <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden pt-16">
          <div className="container-x mb-8 flex items-end justify-between gap-8">
            <h2 className="h-section">OUR FABRICS</h2>
            <p className="label-micro pb-2 text-mute">Wool · Wool-linen · Linen · Cotton · Blends · Formal</p>
          </div>

          <VelocityBlur>
            <motion.div ref={track} style={{ x }} className="flex w-max items-start gap-[3vw] px-[clamp(20px,2.8vw,40px)]">
              {fabrics.map((f, i) => <Card key={f.slug} f={f} i={i} p={prog} />)}
            </motion.div>
          </VelocityBlur>

          <div className="container-x mt-8 flex items-center justify-between text-xs text-slate">
            <p>Featured: Valerio Cassani wool-linen — elegance of wool, freshness of linen.</p>
            <div className="flex items-center gap-3" aria-hidden>
              <span>←</span>
              <svg viewBox="0 0 24 24" className="h-6 w-6 -rotate-90">
                <circle cx="12" cy="12" r="10" fill="none" stroke="#B3B3B3" strokeWidth="1.5" />
                <motion.circle cx="12" cy="12" r="10" fill="none" stroke="#B98B45" strokeWidth="1.5" style={{ pathLength: prog }} />
              </svg>
              <span>→</span>
            </div>
          </div>
        </div>
      </section>

      {/* mobile: horizontal snap strip */}
      <section id="fabrics-m" className="bg-white py-14 text-ink md:hidden">
        <h2 className="h-section px-5">OUR FABRICS</h2>
        <div className="no-scrollbar mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5">
          {fabrics.map((f, i) => (
            <div key={f.slug} className="w-[72vw] shrink-0 snap-start">
              <div className="relative aspect-[4/5] overflow-hidden bg-card">
                <Image src={`/images/fabrics/${f.slug}.webp`} alt={`${f.name} cloth swatch — Orhanza`} fill sizes="72vw" loading="eager" className="object-cover" />
              </div>
              <h3 className="mt-3 text-4xl font-extrabold uppercase leading-none tracking-[-0.04em]">{f.name}</h3>
              <p className="mt-1 text-sm text-slate">{f.note}</p>
              <span className="sr-only">{i + 1} of {fabrics.length}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
