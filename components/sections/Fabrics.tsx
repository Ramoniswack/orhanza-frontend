"use client";

/**
 * 2 — Fabrics: section pins and a row of fabric photographs translates horizontally with scroll.
 * Minimal: cloth image + name only, no blur, one hairline progress bar.
 * Replace the files in /public/images/fabrics/<slug>.webp with your own photos (same names) — nothing else to change.
 */
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import Image from "next/image";
import { useEffect, useRef } from "react";

const fabrics = [
  { slug: "wool", name: "Wool" },
  { slug: "wool-linen", name: "Wool-linen" },
  { slug: "linen", name: "Linen" },
  { slug: "cotton", name: "Cotton" },
  { slug: "blends", name: "Blends" },
  { slug: "formal", name: "Formal" },
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
      </div>
      <h3 className="mt-4 whitespace-nowrap text-lg font-semibold tracking-[-0.02em]">{f.name}</h3>
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
          <h2 className="h-section container-x mb-8">OUR FABRICS</h2>

          <motion.div ref={track} style={{ x }} className="flex w-max items-start gap-[2vw] px-[clamp(20px,2.8vw,40px)]">
            {fabrics.map((f, i) => <Card key={f.slug} f={f} i={i} p={prog} />)}
          </motion.div>

          <div className="container-x mt-8">
            <div className="h-px w-full bg-black/10"><motion.div style={{ scaleX: prog }} className="h-full origin-left bg-ink" /></div>
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
              <h3 className="mt-3 text-lg font-semibold tracking-[-0.02em]">{f.name}</h3>
              <span className="sr-only">{i + 1} of {fabrics.length}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
