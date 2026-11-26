"use client";

/**
 * Configuration column, one calm scroll: Fabric → Pieces → total + Finish.
 * On desktop it is the scroller (scoped Lenis) with the total/Finish bar pinned to its bottom; on mobile it flows under the
 * preview and the same bar is fixed to the bottom of the screen (safe-area aware).
 */
import Lenis from "lenis";
import { cancelFrame, frame } from "motion";
import { useEffect, useRef, useState } from "react";
import { KineticNumber } from "@/components/motion";
import { FabricGrid } from "./FabricGrid";
import { JacketStyleSelector, type JacketStyle } from "./JacketStyleSelector";
import { DELIVERY_TEXT, PIECE_PRICE, categories, formatNpr, getFabric, type Fabric, type Gender, type PieceKey, type Pieces } from "@/lib/custom-made";

const PIECES: { key: PieceKey; title: string; text: string }[] = [
  { key: "jacket", title: "Jacket", text: "Cut and canvassed to your measures. Lapel, buttons and lining are settled with your tailor at the fitting." },
  { key: "trousers", title: "Trousers", text: "Matching trousers in the same cloth. Adding them shows the full suit on the model." },
  { key: "waistcoat", title: "Waistcoat", text: "A matching waistcoat for a three-piece. The preview image is coming; adding it updates your total." },
];

const Icon = ({ d }: { d: string }) => (
  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" aria-hidden><path d={d} /></svg>
);

export function Panel(props: {
  fabrics: Fabric[]; total: number; selected: string; onSelect: (slug: string) => void;
  gender: Gender; onGender: (g: Gender) => void;
  query: string; setQuery: (q: string) => void; category: string | null; setCategory: (c: string | null) => void;
  pieces: Pieces; onTogglePiece: (k: PieceKey) => void;
  selectedStyle: Record<Gender, JacketStyle | null>; onStyle: (g: Gender, style: JacketStyle) => void;
  onFinish: () => void; reduce: boolean;
}) {
  const { fabrics, total, selected, onSelect, gender, onGender, query, setQuery, category, setCategory, pieces, onTogglePiece, selectedStyle, onStyle, onFinish } = props;
  const scroller = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [finishError, setFinishError] = useState(false);
  const current = getFabric(selected);
  const finish = () => {
    if (!Object.values(pieces).some(Boolean)) {
      setFinishError(true);
      return;
    }
    setFinishError(false);
    onFinish();
  };
  const togglePiece = (piece: PieceKey) => {
    onTogglePiece(piece);
    setFinishError(false);
  };

  // Scoped Lenis: desktop only, not for reduced motion. Same feel as the global instance in lib/lenis.tsx.
  useEffect(() => {
    const wrapper = scroller.current, content = inner.current;
    if (!wrapper || !content) return;
    const desk = window.matchMedia("(min-width: 768px)");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lenis: Lenis | null = null;
    let update: ((d: { timestamp: number }) => void) | null = null;
    const stop = () => {
      if (update) cancelFrame(update);
      update = null;
      lenis?.destroy();
      lenis = null;
    };
    const sync = () => {
      stop();
      // The panel only opts out of the global Lenis while it is itself the scroller (desktop).
      if (desk.matches) wrapper.setAttribute("data-lenis-prevent", ""); else wrapper.removeAttribute("data-lenis-prevent");
      if (!desk.matches || calm.matches) return;
      const l = new Lenis({ wrapper, content, lerp: 0.07, wheelMultiplier: 0.85, smoothWheel: true });
      lenis = l;
      update = (d) => l.raf(d.timestamp);
      frame.update(update, true);
    };
    sync();
    desk.addEventListener("change", sync);
    calm.addEventListener("change", sync);
    return () => { desk.removeEventListener("change", sync); calm.removeEventListener("change", sync); stop(); };
  }, []);

  const label = "text-[10px] font-medium uppercase tracking-[0.24em] text-slate";
  const iconBtn = "flex h-9 w-9 items-center justify-center text-ink transition-colors duration-300 hover:bg-ink/5 aria-pressed:bg-ink/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold";

  return (
    <div ref={scroller} className="relative bg-white text-ink md:h-full md:overflow-y-auto md:overscroll-contain">
      <div ref={inner}>
        <div className="px-5 pb-36 pt-9 md:px-10 md:pb-10 md:pt-14">
          {/* Men / Women — one page, one model at a time */}
          <JacketStyleSelector
            gender={gender}
            onGender={onGender}
            pieces={pieces}
            onTogglePiece={togglePiece}
            selectedStyle={selectedStyle}
            onStyle={onStyle}
          />

          {/* 1 — Fabric */}
          <section aria-labelledby="cm-fabric-h">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 id="cm-fabric-h" className={label}>Fabric</h2>
                <p className="mt-3 text-[26px] font-light leading-none tracking-[-0.02em] md:text-[32px]" aria-live="polite">{current.name}</p>
                <p className="mt-2 text-[13px] text-slate">{current.category} · Cloth {formatNpr(current.priceNpr)}</p>
              </div>
              <div className="-mr-2 flex shrink-0 items-center">
                <button type="button" aria-label="Search fabrics" aria-pressed={showSearch} onClick={() => setShowSearch((v) => !v)} className={iconBtn}><Icon d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zm9 16-4-4" /></button>
                <button type="button" aria-label="Filter fabrics by category" aria-pressed={showFilter} onClick={() => setShowFilter((v) => !v)} className={iconBtn}><Icon d="M4 7h16M7 12h10M10 17h4" /></button>
              </div>
            </div>

            {showSearch && (
              <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search fabrics" aria-label="Search fabrics" className="cm-fade mt-5 h-10 w-full border-0 border-b border-ink/25 bg-transparent px-0 text-base text-ink outline-none md:text-[14px] transition-colors placeholder:text-ink/35 focus:border-ink" />
            )}
            {showFilter && (
              <div className="cm-fade mt-5 flex flex-wrap gap-x-5 gap-y-2" role="group" aria-label="Category">
                {[null, ...categories].map((c) => (
                  <button key={c ?? "all"} type="button" aria-pressed={category === c} onClick={() => setCategory(c)} className={`border-b pb-0.5 text-[12px] transition-colors duration-300 ${category === c ? "border-ink text-ink" : "border-transparent text-slate hover:text-ink"}`}>{c ?? "All"}</button>
                ))}
              </div>
            )}

            <div key={`${category}|${query}`} className="cm-fade mt-7">
              {fabrics.length ? <FabricGrid fabrics={fabrics} selected={selected} gender={gender} onSelect={onSelect} /> : <p className="py-14 text-center text-[13px] text-slate">No fabrics match. Try another word or category.</p>}
              <p className="sr-only" aria-live="polite">{fabrics.length} {fabrics.length === 1 ? "fabric" : "fabrics"} shown</p>
            </div>
          </section>

          {/* 2 — Pieces */}
          <section aria-labelledby="cm-pieces-h" className="mt-14 md:mt-16">
            <h2 id="cm-pieces-h" className={label}>Pieces</h2>
            <ul className="mt-4 border-t border-ink/12">
              {PIECES.map((p) => {
                const on = pieces[p.key];
                return (
                  <li key={p.key} className="flex items-start gap-4 border-b border-ink/12 py-5">
                    <label className="flex min-w-0 flex-1 cursor-pointer items-start gap-4">
                      <input
                        type="checkbox"
                        aria-label={p.title}
                        checked={on}
                        onChange={() => togglePiece(p.key)}
                        className="peer sr-only"
                      />
                      <span aria-hidden className={`mt-1 flex h-4 w-4 shrink-0 items-center justify-center border transition-colors duration-300 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gold ${on ? "border-ink bg-ink text-ivory" : "border-ink/35"}`}>
                        {on && <svg viewBox="0 0 12 12" width="9" height="9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square"><path d="M2.5 6.3 5 8.8l4.5-5.2" /></svg>}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[15px] font-medium">{p.title}</p>
                        <p className="mt-1 max-w-sm text-[13px] leading-relaxed text-slate">{p.text}</p>
                        <p className="mt-2 text-[12px] text-ink/70">{formatNpr(PIECE_PRICE[p.key])}</p>
                      </div>
                    </label>
                    <button
                      type="button"
                      aria-pressed={on}
                      aria-label={`${on ? "Remove" : "Add"} ${p.title.toLowerCase()}`}
                      onClick={() => togglePiece(p.key)}
                      className={`mt-0.5 h-9 shrink-0 border px-5 text-[11px] font-medium uppercase tracking-[0.18em] transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${on ? "border-ink bg-ink text-ivory hover:bg-transparent hover:text-ink" : "border-ink/40 text-ink hover:border-ink hover:bg-ink hover:text-ivory"}`}
                    >
                      {on ? "Remove" : "Add"}
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>

        {/* 3 — total + Finish: pinned to the bottom of this column on desktop, fixed to the screen on mobile */}
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-ink/12 bg-white px-5 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 md:sticky md:inset-x-auto md:px-10 md:pb-5 md:pt-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-slate">Total</p>
              <p className="mt-1 flex items-center gap-[0.3em] text-[17px] font-medium tracking-[-0.01em]"><span className="text-slate">Rs.</span><KineticNumber value={total} group play duration={0.8} stagger={0.04} /></p>
              <p className="mt-0.5 hidden text-[11px] text-slate md:block">{DELIVERY_TEXT}</p>
            </div>
            <div className="text-right">
              {finishError && <p role="alert" className="mb-1 text-[11px] text-slate">Select at least one suit piece to continue.</p>}
              <button type="button" onClick={finish} className="h-11 bg-ink px-8 text-[11px] font-medium uppercase tracking-[0.22em] text-ivory transition-colors duration-300 hover:bg-gold hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold">Finish</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
