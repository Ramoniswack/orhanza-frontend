"use client";

/** Compact fabric picker: square swatches, name and price beneath. Selected = fine charcoal outline + small check. Arrow keys move focus. */
import type { KeyboardEvent } from "react";
import { formatNpr, preload, previewSrc, type Fabric, type Gender } from "@/lib/custom-made";

export function FabricGrid({ fabrics, selected, gender, onSelect }: { fabrics: Fabric[]; selected: string; gender: Gender; onSelect: (slug: string) => void }) {
  const roving = fabrics.some((f) => f.slug === selected) ? selected : fabrics[0]?.slug;

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const cols = getComputedStyle(e.currentTarget).gridTemplateColumns.split(" ").length || 3;
    const step = e.key === "ArrowLeft" ? -1 : e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" ? -cols : e.key === "ArrowDown" ? cols : 0;
    if (!step) return;
    const tiles = Array.from(e.currentTarget.querySelectorAll<HTMLButtonElement>("button[data-tile]"));
    const i = tiles.indexOf(document.activeElement as HTMLButtonElement);
    const next = tiles[i + step];
    if (i < 0 || !next) return;
    e.preventDefault();
    next.focus();
  }

  return (
    <div role="group" aria-label="Fabrics" onKeyDown={onKeyDown} className="grid grid-cols-3 gap-x-3 gap-y-6 md:gap-x-4 md:gap-y-7 xl:grid-cols-4">
      {fabrics.map((f, i) => {
        const on = f.slug === selected;
        return (
          <button
            key={f.slug}
            data-tile
            type="button"
            aria-pressed={on}
            aria-label={`${f.name}, ${formatNpr(f.priceNpr)}`}
            tabIndex={f.slug === roving ? 0 : -1}
            onClick={() => onSelect(f.slug)}
            onPointerEnter={() => { preload(previewSrc(f, "jacket", gender)); preload(previewSrc(f, "suit", gender)); }}
            className="group/t text-left focus-visible:outline-none"
          >
            <span className={`relative block aspect-square overflow-hidden bg-[#E7E1D6] outline outline-1 outline-offset-[3px] transition-[outline-color] duration-300 group-focus-visible/t:outline-2 group-focus-visible/t:outline-gold ${on ? "outline-ink" : "outline-transparent group-hover/t:outline-ink/30"}`}>
              <img src={f.thumb} alt="" width={240} height={240} decoding="async" loading={i < 12 ? "eager" : "lazy"} draggable={false} className="h-full w-full object-cover" />
              {on && (
                <span aria-hidden className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center bg-ink text-ivory">
                  <svg viewBox="0 0 12 12" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square"><path d="M2.5 6.3 5 8.8l4.5-5.2" /></svg>
                </span>
              )}
            </span>
            <span className="mt-2.5 block">
              <span className={`block truncate text-[12px] leading-tight md:text-[13px] ${on ? "font-medium text-ink" : "text-ink/80"}`}>{f.name}</span>
              <span className="mt-0.5 block text-[11px] text-slate md:text-[12px]">{formatNpr(f.priceNpr)}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
