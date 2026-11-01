"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
import Image from "next/image";
import type { Trim } from "@/lib/lookbook-data";

/**
 * One figure. x is the element centre in vw (a MotionValue so it can be scrubbed).
 * `H` and `top` are the spec's numbers: height / top of the WHOLE untrimmed image, in vh.
 * The trimmed bitmap is placed inside that box so figures align on their bounding boxes.
 * Only transform + opacity animate.
 */
export function Layer({
  src, alt = "", trim, x, scale, opacity, z, H, top, bottom, priority = false, filter, origin = "0 100%",
}: {
  src: string;
  alt?: string;
  trim: Trim;
  x: MotionValue<number>;
  scale?: MotionValue<number>;
  opacity?: MotionValue<number>;
  z: number;
  H: number;
  top?: number;     // vh from stage top to the whole image's top
  bottom?: number;  // vh from stage bottom to the figure's feet (bottom-anchored layers)
  priority?: boolean;
  filter?: string;
  origin?: string;
}) {
  const tx = useTransform(x, (v) => `${v}vw`);
  const figH = H * trim.hFrac;
  const figTop = top !== undefined ? top + H * trim.top : undefined;
  return (
    <motion.div
      aria-hidden={alt === "" ? true : undefined}
      className="pointer-events-none absolute left-0 w-0 will-change-transform"
      style={{
        x: tx, scale, opacity, zIndex: z,
        top: figTop !== undefined ? `${figTop}vh` : undefined,
        bottom: bottom !== undefined ? `${bottom}vh` : undefined,
        height: `${figH}vh`,
        transformOrigin: origin,
      }}
    >
      <Image
        src={`/lookbook/${src}`}
        alt={alt}
        width={trim.w}
        height={trim.h}
        sizes="60vw"
        priority={priority}
        loading={priority ? undefined : "eager"}
        draggable={false}
        className="absolute left-0 top-0 h-full w-auto max-w-none -translate-x-1/2 select-none"
        style={{ filter }}
      />
    </motion.div>
  );
}
