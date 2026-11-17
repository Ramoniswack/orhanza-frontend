"use client";

import type { FitCategory, ProportionLevel } from "@/lib/fit-advisor";

interface BodySilhouetteProps {
  category: FitCategory;
  heightCm: number;
  weightKg: number;
  shoulders: ProportionLevel;
  waist: ProportionLevel;
}

export function BodySilhouette({
  category,
  heightCm,
  weightKg,
  shoulders,
  waist,
}: BodySilhouetteProps) {
  const heightScale = 0.88 + ((heightCm - 150) / 55) * 0.16;
  const weightFactor = (weightKg - 45) / 90;
  const baseShoulder = category === "MENSWEAR" ? 24 : 20;
  const shoulderOffset = shoulders === "Fuller" ? 3.5 : shoulders === "Narrower" ? -2.5 : 0;
  const halfShoulder = baseShoulder + weightFactor * 6 + shoulderOffset;
  const baseWaist = category === "MENSWEAR" ? 17 : 13.5;
  const waistOffset = waist === "Fuller" ? 4.5 : waist === "Narrower" ? -2.5 : 0;
  const halfWaist = baseWaist + weightFactor * 7 + waistOffset;
  const cx = 50;

  return (
    <div className="flex h-44 w-24 shrink-0 select-none items-center justify-center" aria-hidden="true">
      <svg viewBox="0 0 100 180" className="h-full w-full overflow-visible stroke-ink" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <g style={{ transform: `scaleY(${heightScale})`, transformOrigin: "50px 172px" }}>
          <circle cx={cx} cy="22" r="10.5" />
          <line x1={cx - 4} y1="32.5" x2={cx - 4} y2="39" />
          <line x1={cx + 4} y1="32.5" x2={cx + 4} y2="39" />
          <polygon points={`${cx - halfShoulder},41 ${cx + halfShoulder},41 ${cx + halfWaist},92 ${cx - halfWaist},92`} />
          <rect x={cx - halfShoulder - 8.5} y="43" width="6" height="48" rx="1.5" />
          <rect x={cx + halfShoulder + 2.5} y="43" width="6" height="48" rx="1.5" />
          <rect x={cx - halfWaist + 1} y="95" width={Math.max(8, halfWaist - 2.5)} height="74" rx="1" />
          <rect x={cx + 1.5} y="95" width={Math.max(8, halfWaist - 2.5)} height="74" rx="1" />
        </g>
      </svg>
    </div>
  );
}
