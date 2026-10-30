"use client";

import Link from "next/link";
import { useState } from "react";
import { useShortlist } from "./ShortlistProvider";

const fits = ["Slim", "Regular", "Classic"];

/** Template's size selector / quantity / "Add to Cart" → fit preference / shortlist / consultation. */
export function ProductActions({ slug }: { slug: string }) {
  const { has, toggle, setOpen } = useShortlist();
  const [fit, setFit] = useState("Regular");
  const saved = has(slug);

  return (
    <div className="mt-8 space-y-6">
      <div>
        <p className="eyebrow text-slate">Preferred fit</p>
        <div className="mt-3 flex gap-2">
          {fits.map((f) => (
            <button key={f} onClick={() => setFit(f)} aria-pressed={fit === f} className={`rounded-[10px] border px-5 py-2.5 text-sm transition-colors ${fit === f ? "border-charcoal bg-charcoal text-ivory" : "border-charcoal/20 hover:border-charcoal"}`}>
              {f}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-slate">Final fit is refined with your measurements and fittings.</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button onClick={() => { toggle(slug); if (!saved) setOpen(true); }} className="btn btn-burgundy">
          {saved ? "Remove from shortlist" : "Add to shortlist"}
        </button>
        <Link href="/#book" className="btn btn-outline">Book a Consultation</Link>
      </div>
    </div>
  );
}
