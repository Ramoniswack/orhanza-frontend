"use client";

/**
 * 1 — HERO. No pinning and no blank scroll: everything is on screen straight away.
 * On load the IMAGES come first (portrait + team rise from below, the tools drop from above), then the headline drops in.
 * After that, scrolling only nudges things a little (simple parallax): `p` runs 0 → 1 while the hero scrolls out of view.
 * Layout is a grid, so no image overlaps another. prefers-reduced-motion: everything is simply shown.
 */
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRef } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

export function AboutHero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = !!useReducedMotion();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const hY = useTransform(p, [0, 1], ["0vh", "-10vh"]);
  const portraitY = useTransform(p, [0, 1], ["0vh", "5vh"]);
  const sideY = useTransform(p, [0, 1], ["0vh", "-6vh"]);
  const par = (y: typeof hY) => (reduce ? undefined : { y });
  const enter = (from: object, delay: number) =>
    reduce ? {} : { initial: { opacity: 0, ...from }, animate: { opacity: 1, x: 0, y: 0 }, transition: { duration: 1.1, ease: EASE, delay } };

  return (
    <section ref={ref} aria-labelledby="about-h" className="relative overflow-x-clip bg-white pt-24 md:pt-28">
      <div className="container-x">
        {/* headline — arrives after the images */}
        <motion.div style={par(hY)}>
          <motion.h1
            id="about-h"
            {...(reduce ? {} : { initial: { opacity: 0, y: "-60%" }, animate: { opacity: 1, y: "0%" }, transition: { duration: 1, ease: EASE, delay: 0.9 } })}
            className="h-display text-center text-[clamp(3rem,10.5vw,10rem)] text-ink"
          >
            Know Orhanza
          </motion.h1>
        </motion.div>

        <div className="mt-6 grid grid-cols-2 items-end gap-x-4 gap-y-8 md:mt-8 md:grid-cols-[1fr_auto_1fr] md:gap-x-10">
          {/* portrait */}
          <motion.div style={par(portraitY)} className="order-first col-span-2 flex justify-center md:order-none md:col-span-1 md:col-start-2">
            <motion.div {...enter({ y: 80 }, 0)}>
              <Image src="/images/about/hero-portrait.webp" alt="Orhanza's master tailor with a measuring tape around his neck" width={467} height={729} priority sizes="(min-width:768px) 36vw, 70vw" className="h-[46svh] w-auto md:h-[min(64svh,40rem)]" />
            </motion.div>
          </motion.div>

          {/* team — left */}
          <motion.div style={par(sideY)} className="md:col-start-1 md:row-start-1 md:self-end">
            <motion.div {...enter({ y: 80 }, 0.15)}>
              <Image src="/images/about/hero-team.webp" alt="Three Orhanza tailors in black turtlenecks" width={1314} height={713} priority sizes="(min-width:768px) 30vw, 50vw" className="h-auto w-full md:max-w-[26rem]" />
            </motion.div>
          </motion.div>

          {/* tools + copy — right */}
          <motion.div style={par(sideY)} className="md:col-start-3 md:row-start-1 md:self-end">
            <div className="hidden md:block md:max-w-[24rem]">
              <p className="label-micro text-slate">Passion beyond borders</p>
              <p className="mt-3 text-[15px] leading-relaxed text-slate">Fuelled by a deep-rooted passion for the craft, Orhanza brings precision tailoring to Kathmandu and the people who wear it.</p>
            </div>
            <motion.div {...enter({ y: -80 }, 0.3)} className="md:mt-8">
              <Image src="/images/about/hero-detail.webp" alt="Tailor's hands cutting dark wool with shears, tape measure and chalk beside them" width={1376} height={768} priority sizes="(min-width:768px) 30vw, 50vw" className="h-auto w-full md:max-w-[26rem]" />
            </motion.div>
          </motion.div>
        </div>

        {/* phones: the copy sits under the images */}
        <div className="mt-8 md:hidden">
          <p className="label-micro text-slate">Passion beyond borders</p>
          <p className="mt-3 text-[15px] leading-relaxed text-slate">Fuelled by a deep-rooted passion for the craft, Orhanza brings precision tailoring to Kathmandu and the people who wear it.</p>
        </div>
      </div>
    </section>
  );
}
