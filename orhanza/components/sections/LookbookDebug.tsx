"use client";

import { useControls } from "leva";
import { useEffect } from "react";
import type { Cfg } from "@/lib/lookbook-data";

/** ?debug=1 — every x, height, ease and timing value from the spec, live. Mounted only when the flag is present. */
export default function LookbookDebug({ cfg, onChange }: { cfg: Cfg; onChange: (c: Cfg) => void }) {
  const schema: Record<string, { value: number; step: number }> = {};
  for (const [k, v] of Object.entries(cfg)) if (typeof v === "number") schema[k] = { value: v, step: Math.abs(v) < 5 ? 0.01 : 0.5 };
  cfg.panEase.forEach((v, i) => (schema[`ease${i + 1}`] = { value: v, step: 0.01 }));
  const v = useControls("Lookbook", schema) as Record<string, number>;
  const key = JSON.stringify(v);
  useEffect(() => {
    const next = { ...cfg, ...v, panEase: [v.ease1, v.ease2, v.ease3, v.ease4] } as unknown as Cfg;
    onChange(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return null;
}
