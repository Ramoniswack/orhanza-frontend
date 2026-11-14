"use client";

/** 3-column fabric picker. Hover dimming is pure CSS (.cm-grid / .cm-tile in globals.css) — no per-tile state. */
import type { KeyboardEvent } from "react";
import { formatNpr, preload, type Fabric } from "@/lib/custom-made";

const COLS = 3;

export function FabricGrid({ fabrics, selected, onSelect }: { fabrics: Fabric[]; selected: string; onSelect: (slug: string) => void }) {
  const roving = fabrics.some((f) => f.slug === selected) ? selected : fabrics[0]?.slug;

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const step = e.key === "ArrowLeft" ? -1 : e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" ? -COLS : e.key === "ArrowDown" ? COLS : 0;
    if (!step) return;
    const tiles = Array.from(e.currentTarget.querySelectorAll<HTMLButtonElement>("button.cm-tile"));
    const i = tiles.indexOf(document.activeElement as HTMLButtonElement);
    const next = tiles[i + step];
    if (i < 0 || !next) return;
    e.preventDefault();
    next.focus();
  }

  return (
    <div role="group" aria-label="Fabrics" onKeyDown={onKeyDown} className="cm-grid grid grid-cols-3 gap-x-2.5 gap-y-5 md:gap-x-4 md:gap-y-7">
      {fabrics.map((f, i) => {
        const on = f.slug === selected;
        return (
          <button
            key={f.slug}
            type="button"
            aria-pressed={on}
            aria-label={`${f.name}, ${formatNpr(f.priceNpr)}`}
            tabIndex={f.slug === roving ? 0 : -1}
            onClick={() => onSelect(f.slug)}
            onPointerEnter={() => { preload(f.jacketPreview); preload(f.suitPreview); }}
            className="cm-tile group/t rounded-[6px] text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
          >
            <span className={`relative block aspect-[1/1] overflow-hidden rounded-[6px] bg-[#1a1a1c] ring-1 transition-shadow duration-500 ${on ? "ring-2 ring-gold" : "ring-ivory/10 group-hover/t:ring-ivory/30"}`}>
              <img src={f.thumb} alt="" width={240} height={240} decoding="async" loading={i < 9 ? "eager" : "lazy"} draggable={false} className="h-full w-full object-cover" />
              {on && <span aria-hidden className="absolute right-2 top-2 block h-3 w-3 rounded-full bg-gold ring-2 ring-charcoal" />}
              {/* soft-box falloff over the swatch so it reads as cloth under light, not a flat square */}
              <span aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.14), transparent 45%, rgba(0,0,0,0.22))" }} />
            </span>
            <span className="mt-2 block">
              <span className="cm-name block truncate text-[13px] font-semibold leading-tight text-ivory">{f.name}</span>
              <span className="mt-0.5 block text-[12px] text-ivory/50">{formatNpr(f.priceNpr)}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
