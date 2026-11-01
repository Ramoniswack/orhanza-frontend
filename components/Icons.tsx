"use client";

/**
 * Tailoring icon set — single-stroke line drawings (currentColor) that draw themselves in when they enter view.
 * <Drift> wraps any icon in a slow, endless float so decorative icons feel alive without being busy.
 */
import { motion } from "motion/react";
import type { ReactNode } from "react";

type P = { className?: string };

const circ = (cx: number, cy: number, r: number) => `M${cx - r} ${cy} a${r} ${r} 0 1 0 ${2 * r} 0 a${r} ${r} 0 1 0 ${-2 * r} 0`;

function IPath({ d, delay = 0, dash }: { d: string; delay?: number; dash?: string }) {
  return (
    <motion.path
      d={d}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={dash}
      vectorEffect="non-scaling-stroke"
      initial={{ pathLength: 0, opacity: 0 }}
      whileInView={{ pathLength: 1, opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1.3, delay, ease: [0.22, 1, 0.36, 1] }}
    />
  );
}

const svg = (className?: string) => ({ viewBox: "0 0 64 64", className, "aria-hidden": true as const, fill: "none" });

export function Drift({ children, className = "", amp = 8, rot = 3, dur = 6, delay = 0 }: { children: ReactNode; className?: string; amp?: number; rot?: number; dur?: number; delay?: number }) {
  return (
    <motion.div
      aria-hidden
      className={className}
      animate={{ y: [0, -amp, 0], rotate: [-rot, rot, -rot] }}
      transition={{ duration: dur, delay, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}

export function Scissors({ className }: P) {
  return (
    <svg {...svg(className)}>
      <IPath d={circ(17, 49, 7)} />
      <IPath d={circ(47, 49, 7)} delay={0.1} />
      <IPath d="M21 43.5 L45 6 L46.5 7.5 L25 44.5" delay={0.2} />
      <IPath d="M43 43.5 L19 6 L17.5 7.5 L39 44.5" delay={0.3} />
      <IPath d={circ(32, 27, 1.6)} delay={0.6} />
    </svg>
  );
}

export function Spool({ className }: P) {
  return (
    <svg {...svg(className)}>
      <IPath d="M14 8 H50 V15 H14 Z" />
      <IPath d="M14 49 H50 V56 H14 Z" delay={0.1} />
      <IPath d="M19 15 V49 M45 15 V49" delay={0.2} />
      <IPath d="M19 21 L45 25 M19 28 L45 32 M19 35 L45 39 M19 42 L45 46" delay={0.4} />
      <IPath d="M45 46 C56 47 58 55 52 60" delay={0.8} dash="3 4" />
    </svg>
  );
}

export function Button({ className }: P) {
  return (
    <svg {...svg(className)}>
      <IPath d={circ(32, 32, 24)} />
      <IPath d={circ(32, 32, 17)} delay={0.15} />
      <IPath d={circ(26, 26, 2.2) + circ(38, 26, 2.2) + circ(26, 38, 2.2) + circ(38, 38, 2.2)} delay={0.4} />
      <IPath d="M26 26 L38 38 M38 26 L26 38" delay={0.6} />
    </svg>
  );
}

export function Hanger({ className }: P) {
  return (
    <svg {...svg(className)}>
      <IPath d="M32 24 V19 C32 9 44 9 44 17 C44 21 40 22 37 24" />
      <IPath d="M32 24 L5 45 Q2 48 7 48 H57 Q62 48 59 45 Z" delay={0.2} />
      <IPath d="M12 48 V52 H52 V48" delay={0.5} dash="2 4" />
    </svg>
  );
}

export function Thimble({ className }: P) {
  const dots = [0, 1, 2, 3].flatMap((r) => [0, 1, 2].map((c) => circ(23 + c * 9 + (r % 2) * 4, 30 + r * 7, 0.9))).join("");
  return (
    <svg {...svg(className)}>
      <IPath d="M14 52 V34 C14 14 50 14 50 34 V52" />
      <IPath d="M10 52 H54 V57 H10 Z" delay={0.2} />
      <IPath d={dots} delay={0.5} />
    </svg>
  );
}

export function Ruler({ className }: P) {
  const ticks = Array.from({ length: 13 }, (_, i) => `M${8 + i * 4.5} 22 V${i % 4 === 0 ? 34 : i % 2 === 0 ? 30 : 27}`).join("");
  return (
    <svg {...svg(className)}>
      <IPath d="M4 22 H60 V42 H4 Z" />
      <IPath d={ticks} delay={0.3} />
    </svg>
  );
}

export function Sparkle({ className }: P) {
  return (
    <svg {...svg(className)}>
      <IPath d="M32 5 C34 24 40 30 59 32 C40 34 34 40 32 59 C30 40 24 34 5 32 C24 30 30 24 32 5 Z" />
      <IPath d="M50 8 V16 M46 12 H54" delay={0.5} />
    </svg>
  );
}

export function House({ className }: P) {
  return (
    <svg {...svg(className)}>
      <IPath d="M5 30 L32 8 L59 30" />
      <IPath d="M44 19 V11 H50 V24" delay={0.15} />
      <IPath d="M11 26 V56 H53 V26" delay={0.2} />
      <IPath d="M27 56 V38 H37 V56" delay={0.4} />
      <IPath d="M16 34 H23 V42 H16 Z M41 34 H48 V42 H41 Z" delay={0.5} />
      <IPath d="M2 56 H62" delay={0.6} />
    </svg>
  );
}

export function Box({ className }: P) {
  return (
    <svg {...svg(className)}>
      <IPath d="M7 20 L32 8 L57 20 V44 L32 57 L7 44 Z" />
      <IPath d="M7 20 L32 32 L57 20" delay={0.2} />
      <IPath d="M32 32 V57" delay={0.3} />
      <IPath d="M19.5 14 L44.5 26" delay={0.5} />
      <IPath d="M40 40 L50 35 V41 L40 46 Z" delay={0.7} />
    </svg>
  );
}

export function Tag({ className }: P) {
  return (
    <svg {...svg(className)}>
      <IPath d="M6 6 H29 L58 35 L35 58 L6 29 Z" />
      <IPath d={circ(17, 17, 3.2)} delay={0.3} />
      <IPath d="M26 36 L38 24 M32 42 L44 30" delay={0.5} />
    </svg>
  );
}

export function Pin({ className }: P) {
  return (
    <svg {...svg(className)}>
      <IPath d="M32 60 C19 43 13 35 13 25 A19 19 0 0 1 51 25 C51 35 45 43 32 60 Z" />
      <IPath d={circ(32, 25, 7)} delay={0.3} />
      <IPath d="M22 61 H42" delay={0.5} />
    </svg>
  );
}

export function Chat({ className }: P) {
  return (
    <svg {...svg(className)}>
      <IPath d="M8 12 H56 V42 H30 L18 54 V42 H8 Z" />
      <IPath d="M18 24 H46 M18 31 H36" delay={0.4} />
    </svg>
  );
}
