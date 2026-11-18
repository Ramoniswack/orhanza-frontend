"use client";

import Link from "next/link";
import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";
import { useShortlist } from "@/components/ShortlistProvider";

const fits = ["Slim", "Regular", "Classic"];

export function ProductActions({ itemKey }: { itemKey: string }) {
  const { has, toggle, show } = useShortlist();
  const [fit, setFit] = useState("Regular");
  const saved = has(itemKey);
  // phones: once the inline buttons have scrolled away, keep the two actions in a bar pinned to the bottom
  const actions = useRef<HTMLDivElement>(null);
  const [stuck, setStuck] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    const el = actions.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setStuck(!e.isIntersecting && e.boundingClientRect.top < 0), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

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

      <div ref={actions} className="flex flex-wrap gap-3">
        <button onClick={() => { toggle(itemKey); if (!saved) show(); }} className="btn bg-charcoal text-ivory hover:bg-black">
          {saved ? "Remove from shortlist" : "Add to shortlist"}
        </button>
        <Link href="/#book" className="btn btn-outline">Book a Consultation</Link>
      </div>

      {mounted && createPortal(
        <div inert={!stuck} aria-hidden={!stuck} className={`fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-black/10 bg-white/95 px-[1.1rem] pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur transition-transform duration-500 ease-out lg:hidden ${stuck ? "translate-y-0" : "translate-y-full"}`}>
          <button onClick={() => { toggle(itemKey); if (!saved) show(); }} className="btn h-12 flex-1 bg-charcoal text-ivory">{saved ? "Remove" : "Add to shortlist"}</button>
          <Link href="/#book" className="btn btn-outline h-12 flex-1">Book</Link>
        </div>
      , document.body)}
    </div>
  );
}
