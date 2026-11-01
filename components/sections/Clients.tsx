"use client";

/**
 * 11 — Clients. The wide photograph expands on scroll; then three cards stack like a deck: each one slides up and pins over the last,
 * which shrinks and dims behind it. The new card's photo un-masks and its number rolls as it lands.
 */
import { motion, useMotionValue, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import { Button, Hanger, Scissors } from "@/components/Icons";
import { KineticNumber, StaircaseHeadline } from "@/components/motion";
import { SectionLabel } from "@/components/SectionLabel";
import { audience } from "@/lib/content";

const EASE = [0.22, 1, 0.36, 1] as const;
const themes = [
  { bg: "#F1EEE7", fg: "#1B1B1D", mute: "rgba(27,27,29,0.55)" },
  { bg: "#151517", fg: "#EDE5D6", mute: "rgba(237,229,214,0.55)" },
  { bg: "#E2DACB", fg: "#1B1B1D", mute: "rgba(27,27,29,0.55)" },
];
const icons = [Hanger, Button, Scissors];

function StackCard({ i, a, mv, next }: { i: number; a: (typeof audience)[number]; mv: MotionValue<number>; next?: MotionValue<number> }) {
  const t = themes[i % themes.length];
  const Icon = icons[i % icons.length];
  const ref = useRef<HTMLDivElement>(null);
  // 0 → 1 while this card rises from the bottom of the screen to its pinned spot
  const { scrollYProgress: arrive } = useScroll({ target: ref, offset: ["start end", "start 18%"] });
  useMotionValueEvent(arrive, "change", (v) => mv.set(v));
  // this card landing: photo un-masks, scale settles
  const clip = useTransform(arrive, [0.2, 0.9], ["inset(0% 0% 100% 0%)", "inset(0% 0% 0% 0%)"]);
  const imgScale = useTransform(arrive, [0, 1], [1.25, 1]);
  // the next card covering this one: shrink + dim
  const covered = next ?? arrive;
  const scale = useTransform(covered, [0, 1], next ? [1, 0.92] : [1, 1]);
  const dim = useTransform(covered, [0, 1], next ? [0, 0.55] : [0, 0]);
  return (
    <div ref={ref} className={`sticky ${i < audience.length - 1 ? "mb-[14svh]" : ""}`} style={{ top: 88 + i * 18 }}>
      <motion.div style={{ scale, backgroundColor: t.bg, color: t.fg }} className="relative grid h-[74svh] origin-top overflow-hidden rounded-[22px] md:grid-cols-[1fr_1.05fr]">
        <div className="relative order-2 flex flex-col justify-between p-6 md:order-1 md:p-12">
          <div className="flex items-start justify-between">
            <span className="flex items-baseline gap-2" style={{ color: t.mute }}>
              <KineticNumber value={i + 1} pad={2} stagger={0.08} className="text-5xl font-semibold tracking-[-0.05em] md:text-7xl" />
              <span className="text-base">/ 03</span>
            </span>
            <span className="h-14 w-14 text-gold md:h-20 md:w-20"><Icon className="h-full w-full" /></span>
          </div>
          <div>
            <h3 className="text-[clamp(1.9rem,3.4vw,3.6rem)] font-bold leading-[1.02] tracking-[-0.045em]">{a.role}</h3>
            <p className="mt-4 max-w-sm text-base md:text-lg" style={{ color: t.mute }}>{a.intro}</p>
          </div>
        </div>
        <div className="relative order-1 min-h-[34svh] overflow-hidden md:order-2">
          <motion.div style={{ clipPath: clip }} className="absolute inset-0">
            <motion.div style={{ scale: imgScale }} className="absolute inset-0">
              <Image src={a.image} alt={a.role} fill sizes="(min-width:768px) 40vw, 100vw" className="object-cover object-top" />
            </motion.div>
          </motion.div>
        </div>
        <motion.span aria-hidden style={{ opacity: dim }} className="pointer-events-none absolute inset-0 bg-black" />
      </motion.div>
    </div>
  );
}

export function Clients() {
  const m0 = useMotionValue(0);
  const m1 = useMotionValue(0);
  const m2 = useMotionValue(0);
  const mvs = [m0, m1, m2];
  return (
    <section className="bg-white py-14 text-ink md:py-20">
      <div className="container-x">
        <SectionLabel label="Clients" />
        <StaircaseHeadline
          className="mt-5 md:mt-6"
          lines={[{ text: "The people", tone: "setup" }, { text: "we dress", tone: "punch" }]}
          indents={[0, 0.8]}
        />
      </div>

      <div className="container-x mt-10 md:mt-14">
        {audience.map((a, i) => <StackCard key={a.role} i={i} a={a} mv={mvs[i]} next={mvs[i + 1]} />)}
      </div>
    </section>
  );
}
