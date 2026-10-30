"use client";

/**
 * Tailoring line illustrations — single-weight strokes in currentColor, drawn in as they scroll into view.
 * Colour them with a text-* class on the wrapper/className.
 */
import { motion } from "motion/react";

type P = { className?: string };

function Path({ d, delay = 0, dash }: { d: string; delay?: number; dash?: string }) {
  return (
    <motion.path
      d={d}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.25}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={dash}
      vectorEffect="non-scaling-stroke"
      initial={{ pathLength: 0, opacity: 0 }}
      whileInView={{ pathLength: 1, opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1.6, delay, ease: [0.22, 1, 0.36, 1] }}
    />
  );
}

const svg = (viewBox: string, className?: string) => ({ viewBox, className, "aria-hidden": true as const, fill: "none" });

/** dress form on a stand, a tape measure slung round the chest */
export function Mannequin({ className }: P) {
  return (
    <svg {...svg("0 0 160 270", className)}>
      <Path d="M80 14 V30" />
      <Path d="M72 42 C72 32 88 32 88 42" delay={0.1} />
      <Path d="M52 64 C52 50 66 42 80 42 C94 42 108 50 108 64 L113 98 C113 120 101 140 80 152 C59 140 47 120 47 98 Z" delay={0.2} />
      <Path d="M80 42 V152" delay={0.5} dash="2 5" />
      <Path d="M49 80 C70 100 90 100 111 80" delay={0.6} />
      <Path d="M49 86 C70 106 90 106 111 86" delay={0.7} />
      <Path d="M56 112 C72 120 88 120 104 112" delay={0.8} dash="2 4" />
      <Path d="M80 152 V240" delay={0.9} />
      <Path d="M80 240 L48 258 M80 240 L112 258 M80 240 V262" delay={1} />
      <circle cx="80" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.25" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/** jacket on a hanger */
export function JacketOnHanger({ className }: P) {
  return (
    <svg {...svg("0 0 220 250", className)}>
      <Path d="M110 34 V26 C110 14 126 14 126 26" />
      <Path d="M110 34 L34 76 Q30 80 38 80 H182 Q190 80 186 76 Z" delay={0.1} />
      <Path d="M72 82 L52 96 L60 226 H160 L168 96 L148 82 C130 102 90 102 72 82 Z" delay={0.3} />
      <Path d="M72 82 L100 142 L110 120 L92 100" delay={0.6} />
      <Path d="M148 82 L120 142 L110 120 L128 100" delay={0.7} />
      <Path d="M110 142 V226" delay={0.8} />
      <Path d="M68 160 H92 M128 204 H152" delay={0.9} />
      <circle cx="117" cy="174" r="2.2" stroke="currentColor" strokeWidth="1.25" vectorEffect="non-scaling-stroke" />
      <circle cx="117" cy="194" r="2.2" stroke="currentColor" strokeWidth="1.25" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/* tape measure: two offset curves joined by tick marks sampled along a cubic */
const tape = (() => {
  const P0 = [8, 96], P1 = [76, 6], P2 = [184, 6], P3 = [252, 96];
  const at = (t: number) => {
    const u = 1 - t;
    const x = u ** 3 * P0[0] + 3 * u * u * t * P1[0] + 3 * u * t * t * P2[0] + t ** 3 * P3[0];
    const y = u ** 3 * P0[1] + 3 * u * u * t * P1[1] + 3 * u * t * t * P2[1] + t ** 3 * P3[1];
    const dx = 3 * u * u * (P1[0] - P0[0]) + 6 * u * t * (P2[0] - P1[0]) + 3 * t * t * (P3[0] - P2[0]);
    const dy = 3 * u * u * (P1[1] - P0[1]) + 6 * u * t * (P2[1] - P1[1]) + 3 * t * t * (P3[1] - P2[1]);
    const l = Math.hypot(dx, dy);
    return { x, y, nx: dy / l, ny: -dx / l }; // normal, pointing down-left of travel → below the curve
  };
  const W = 16;
  let top = "", bottom = "", ticks = "";
  for (let i = 0; i <= 48; i++) {
    const t = i / 48, q = at(t);
    const a = `${q.x.toFixed(1)} ${q.y.toFixed(1)}`;
    const b = `${(q.x + q.nx * W).toFixed(1)} ${(q.y + q.ny * W).toFixed(1)}`;
    top += `${i ? "L" : "M"}${a}`;
    bottom += `${i ? "L" : "M"}${b}`;
    const len = i % 4 === 0 ? W : i % 2 === 0 ? W * 0.55 : W * 0.3;
    ticks += `M${a}L${(q.x + q.nx * len).toFixed(1)} ${(q.y + q.ny * len).toFixed(1)}`;
  }
  return { top, bottom, ticks };
})();

export function TapeMeasure({ className }: P) {
  return (
    <svg {...svg("0 0 260 124", className)}>
      <Path d={tape.top} />
      <Path d={tape.bottom} delay={0.15} />
      <Path d={tape.ticks} delay={0.4} />
      <Path d="M8 96 L8 110 M252 96 L252 110" delay={0.2} />
    </svg>
  );
}

/** needle with a loop of thread and a short run of stitches */
export function NeedleThread({ className }: P) {
  return (
    <svg {...svg("0 0 200 200", className)}>
      <Path d="M154 26 L50 176" />
      <ellipse cx="148" cy="35" rx="2.2" ry="7" transform="rotate(35 148 35)" stroke="currentColor" strokeWidth="1.25" vectorEffect="non-scaling-stroke" />
      <Path d="M146 38 C112 12 84 44 108 72 C132 100 66 112 80 142 C90 164 126 150 150 176" delay={0.3} />
      <Path d="M30 188 H46 M56 188 H72 M82 188 H98" delay={0.8} />
    </svg>
  );
}

/** a fanned stack of cloth swatches, the top one showing its weave */
export function SwatchStack({ className }: P) {
  const hatch = Array.from({ length: 9 }, (_, i) => `M${44 + i * 12} 36 L${44 + i * 12 - 28} 64`).join("");
  return (
    <svg {...svg("0 0 200 170", className)}>
      <g transform="rotate(-12 100 88)"><Path d="M48 34 H148 V138 H48 Z" /></g>
      <g transform="rotate(-4 100 88)"><Path d="M48 34 H148 V138 H48 Z" delay={0.15} /></g>
      <g transform="rotate(6 100 88)">
        <Path d="M48 34 H148 V138 H48 Z" delay={0.3} />
        <clipPath id="swatch-clip"><rect x="48" y="34" width="100" height="104" /></clipPath>
        <g clipPath="url(#swatch-clip)">
          <Path d={Array.from({ length: 12 }, (_, i) => `M${40 + i * 10} 30 L${40 + i * 10 + 80} 142`).join("")} delay={0.5} />
          <Path d={Array.from({ length: 12 }, (_, i) => `M${160 - i * 10} 30 L${160 - i * 10 - 80} 142`).join("")} delay={0.6} />
        </g>
      </g>
      <path d={hatch} stroke="none" />
    </svg>
  );
}

/** long running-stitch curves — a quiet texture for wide dark cards */
export function StitchLines({ className }: P) {
  return (
    <svg {...svg("0 0 400 200", className)} preserveAspectRatio="xMidYMid slice">
      <Path d="M0 150 C100 60 220 200 400 70" dash="7 9" />
      <Path d="M0 120 C110 30 230 170 400 40" dash="7 9" delay={0.2} />
      <Path d="M0 180 C90 100 210 230 400 100" dash="7 9" delay={0.4} />
    </svg>
  );
}
