"use client";

/** Right half: sticky tab row + Finish, then the tab content. On desktop it is the scroller (scoped Lenis); on mobile it is part of the page. */
import Lenis from "lenis";
import { cancelFrame, frame } from "motion";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { EASE_OUT } from "@/components/motion";
import { FabricGrid } from "./FabricGrid";
import { PIECE_PRICE, categories, formatNpr, garmentIcon, type Fabric, type PieceKey, type Pieces, type Tab } from "@/lib/custom-made";

const TABS: { key: Tab; label: string }[] = [
  { key: "fabric", label: "Fabric" },
  { key: "jacket", label: "Jacket" },
  { key: "trousers", label: "Trousers" },
  { key: "waistcoat", label: "Waistcoat" },
];

const COPY: Record<PieceKey, { title: string; text: string }> = {
  jacket: { title: "Jacket", text: "Cut and canvassed to your measures. Lapel, buttons and lining are settled with your tailor at the fitting." },
  trousers: { title: "Trousers", text: "Matching trousers in the same cloth. Adding them shows the full suit on the model." },
  waistcoat: { title: "Waistcoat", text: "A matching waistcoat for a three-piece. The preview image is coming; the price is already in your total." },
};

const Icon = ({ d }: { d: string }) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d={d} /></svg>
);

export function Panel(props: {
  tab: Tab; setTab: (t: Tab) => void;
  fabrics: Fabric[]; total: number; selected: string; onSelect: (slug: string) => void;
  query: string; setQuery: (q: string) => void; category: string | null; setCategory: (c: string | null) => void;
  pieces: Pieces; onTogglePiece: (k: "trousers" | "waistcoat") => void;
  onFinish: () => void; reduce: boolean;
}) {
  const { tab, setTab, fabrics, total, selected, onSelect, query, setQuery, category, setCategory, pieces, onTogglePiece, onFinish, reduce } = props;
  const scroller = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  // Scoped Lenis: desktop only, not for reduced motion. Same feel as the global instance in lib/lenis.tsx.
  useEffect(() => {
    const wrapper = scroller.current, content = inner.current;
    if (!wrapper || !content) return;
    const desk = window.matchMedia("(min-width: 768px)");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    let update: ((d: { timestamp: number }) => void) | null = null;

    const stop = () => {
      if (update) cancelFrame(update);
      update = null;
      lenisRef.current?.destroy();
      lenisRef.current = null;
    };
    const sync = () => {
      stop();
      // The panel only opts out of the global Lenis while it is itself the scroller (desktop).
      if (desk.matches) wrapper.setAttribute("data-lenis-prevent", ""); else wrapper.removeAttribute("data-lenis-prevent");
      if (!desk.matches || calm.matches) return;
      const l = new Lenis({ wrapper, content, lerp: 0.055, wheelMultiplier: 0.85, smoothWheel: true });
      lenisRef.current = l;
      update = (d) => l.raf(d.timestamp);
      frame.update(update, true);
    };
    sync();
    desk.addEventListener("change", sync);
    calm.addEventListener("change", sync);
    return () => { desk.removeEventListener("change", sync); calm.removeEventListener("change", sync); stop(); };
  }, []);

  const toTop = () => {
    if (lenisRef.current) lenisRef.current.scrollTo(0, { immediate: true, force: true });
    else if (scroller.current) scroller.current.scrollTop = 0;
  };
  const changeTab = (t: Tab) => { if (t !== tab) { setTab(t); toTop(); } };

  const finishBtn = "h-10 items-center rounded-full bg-ink px-6 text-[13px] font-semibold text-white transition-opacity duration-300 hover:opacity-85";

  return (
    <div ref={scroller} className="relative md:h-full md:overflow-y-auto md:overscroll-contain">
      <div ref={inner} className="pb-28 md:pb-12">
        <div className="sticky top-[calc(4rem+46svh)] z-20 border-b border-black/[0.08] bg-white md:top-0">
          <div role="tablist" aria-label="Customise" className="flex items-center px-4 md:px-8">
            {TABS.map((t) => (
              <button key={t.key} role="tab" aria-selected={tab === t.key} onClick={() => changeTab(t.key)} className={`relative h-14 pr-5 text-[13px] font-semibold transition-colors duration-300 md:pr-7 ${tab === t.key ? "text-ink" : "text-slate hover:text-ink"}`}>
                {t.label}
                {tab === t.key && <motion.span layoutId="cm-tab-underline" aria-hidden className="absolute bottom-0 left-0 right-5 h-[2px] bg-ink md:right-7" transition={{ duration: reduce ? 0.15 : 0.45, ease: EASE_OUT }} />}
              </button>
            ))}
            <button onClick={onFinish} className={`ml-auto hidden md:inline-flex ${finishBtn}`}>Finish</button>
          </div>
        </div>

        <div key={tab} className="cm-fade px-4 pt-4 md:px-8 md:pt-5">
          {tab === "fabric" ? (
            <>
              <div className="flex items-center justify-between text-ink">
                <button type="button" aria-label="Search fabrics" aria-pressed={showSearch} onClick={() => setShowSearch((v) => !v)} className="-ml-2 flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-300 hover:bg-black/5">
                  <Icon d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zm9 16-4-4" />
                </button>
                <p className="text-[13px] text-slate" aria-live="polite">{fabrics.length} {fabrics.length === 1 ? "fabric" : "fabrics"}</p>
                <button type="button" aria-label="Filter fabrics" aria-pressed={showFilter} onClick={() => setShowFilter((v) => !v)} className="-mr-2 flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-300 hover:bg-black/5">
                  <Icon d="M4 7h16M7 12h10M10 17h4" />
                </button>
              </div>
              {showSearch && (
                <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search fabrics" aria-label="Search fabrics" className="cm-fade mt-2 h-10 w-full rounded-[6px] border border-black/[0.08] bg-white px-3 text-[13px] text-ink outline-none transition-colors placeholder:text-mute focus:border-ink" />
              )}
              {showFilter && (
                <div className="cm-fade mt-3 flex flex-wrap gap-2" role="group" aria-label="Category">
                  {[null, ...categories].map((c) => (
                    <button key={c ?? "all"} type="button" aria-pressed={category === c} onClick={() => setCategory(c)} className={`rounded-full border px-3 py-1 text-[12px] font-medium transition-colors duration-300 ${category === c ? "border-ink bg-ink text-white" : "border-black/[0.12] text-ink hover:border-ink"}`}>{c ?? "All"}</button>
                  ))}
                </div>
              )}
              <div key={`${category}|${query}`} className="cm-fade mt-5">
                {fabrics.length ? <FabricGrid fabrics={fabrics} selected={selected} onSelect={onSelect} /> : <p className="py-16 text-center text-[13px] text-slate">No fabrics match. Try another word or category.</p>}
              </div>
            </>
          ) : (
            <PieceCard piece={tab} on={tab === "jacket" ? true : pieces[tab]} onToggle={() => tab !== "jacket" && onTogglePiece(tab)} />
          )}
        </div>
      </div>

      {/* mobile: Finish becomes a fixed bottom bar with the total */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between border-t border-black/[0.08] bg-white px-4 py-3 md:hidden">
        <div>
          <p className="label-micro text-slate">Total</p>
          <p className="text-[18px] font-bold tracking-[-0.02em] text-ink">{formatNpr(total)}</p>
        </div>
        <button onClick={onFinish} className={`inline-flex ${finishBtn}`}>Finish</button>
      </div>
    </div>
  );
}

function PieceCard({ piece, on, onToggle }: { piece: PieceKey; on: boolean; onToggle: () => void }) {
  const { title, text } = COPY[piece];
  const required = piece === "jacket";
  return (
    <div className="max-w-[460px] rounded-[6px] border border-black/[0.08] p-6">
      <img src={garmentIcon[piece]} alt="" width={56} height={56} className="h-14 w-14" />
      <h2 className="mt-5 text-[20px] font-bold tracking-[-0.03em] text-ink">{title}</h2>
      <p className="mt-2 text-[14px] leading-relaxed text-slate">{text}</p>
      <p className="mt-4 text-[13px] font-semibold text-ink">{required ? "Included" : `+ ${formatNpr(PIECE_PRICE[piece])}`}</p>
      {required ? (
        <p className="mt-5 text-[13px] text-slate">Every order starts with the jacket.</p>
      ) : (
        <button type="button" onClick={onToggle} className={`mt-5 h-10 rounded-full px-6 text-[13px] font-semibold transition-colors duration-300 ${on ? "border border-ink text-ink hover:bg-ink hover:text-white" : "bg-ink text-white hover:opacity-85"}`}>
          {on ? "Remove" : "Add"}
        </button>
      )}
    </div>
  );
}
