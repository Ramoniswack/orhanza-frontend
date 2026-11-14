"use client";

/** Home teaser — one rounded preview that cross-fades through four cloths as the section scrolls (Lenis-driven via useScroll). */
import { cubicBezier } from "motion";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { ButtonWipe, EASE_OUT, LineMaskReveal } from "@/components/motion";
import { Reveal } from "@/components/Reveal";
import { MODEL, getFabric } from "@/lib/custom-made";

const CLOTHS = ["navy-pure-wool", "charcoal-herringbone", "forest-green-twill", "burgundy-twill"].map(getFabric);
// layer i fades in over these progress ranges; layer 0 is always underneath at full opacity (the old one never fades out first)
const RANGES: [number, number][] = [[0.3, 0.4], [0.44, 0.54], [0.58, 0.68]];
const ease = cubicBezier(...EASE_OUT);

export function CustomMadeTeaser() {
  const ref = useRef<HTMLElement>(null);
  const reduce = !!useReducedMotion();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const o1 = useTransform(p, RANGES[0], [0, 1], { clamp: true });
  const o2 = useTransform(p, RANGES[1], [0, 1], { clamp: true });
  const o3 = useTransform(p, RANGES[2], [0, 1], { clamp: true });
  const opacities = [null, o1, o2, o3];

  return (
    <section ref={ref} id="custom-made" aria-labelledby="cm-home-h" className="bg-white section-y">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 id="cm-home-h" className="t-h2">
            <LineMaskReveal lines={["Made to measure"]} />
          </h2>
          <div className="max-w-sm">
            <Reveal><p className="t-lead">Choose your cloth. See it on the model. We cut it to you.</p></Reveal>
            <ButtonWipe g={p} enter={[0.1, 0.24]} ease={ease} href="/custom-made">Start customising</ButtonWipe>
          </div>
        </div>

        <div className="relative section-gap h-[min(78svh,820px)] overflow-hidden rounded-[22px] bg-[#121214]" style={{ backgroundImage: "radial-gradient(75% 70% at 50% 34%, #3a3a3e 0%, #232326 46%, #121214 100%)", boxShadow: "inset 0 0 140px 20px rgba(0,0,0,0.5)" }}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative h-[92%]" style={{ aspectRatio: `${MODEL.w} / ${MODEL.h}` }}>
              {CLOTHS.map((f, i) => {
                const common = { src: f.suitPreview, alt: i === 0 ? "A made-to-measure suit shown in four cloths" : "", width: MODEL.w, height: MODEL.h, loading: "lazy" as const, decoding: "async" as const, draggable: false, className: "absolute inset-0 h-full w-full select-none [filter:drop-shadow(0_24px_30px_rgba(0,0,0,0.5))]" };
                return opacities[i] && !reduce ? (
                  <motion.img key={f.slug} {...common} aria-hidden style={{ opacity: opacities[i]!, willChange: "opacity" }} />
                ) : (
                  <img key={f.slug} {...common} aria-hidden={i !== 0} style={{ opacity: i === 0 ? 1 : 0 }} />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
