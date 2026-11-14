"use client";

/** Custom Made configurator — owns all state (fabric, pieces, tab, filters) and wires Stage + Panel + Skeleton + FinishSheet. */
import { AnimatePresence, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { configQuery, decodeImage, fabrics, getFabric, preload, totalNpr, type Pieces, type Tab } from "@/lib/custom-made";
import { FinishSheet } from "./FinishSheet";
import { Panel } from "./Panel";
import { Skeleton } from "./Skeleton";
import { Stage } from "./Stage";

export function CustomMade({ initialFabric, initialPieces }: { initialFabric: string; initialPieces: Pieces }) {
  const reduce = !!useReducedMotion();
  const [fabricSlug, setFabricSlug] = useState(initialFabric);
  const [pieces, setPieces] = useState<Pieces>(initialPieces);
  const [tab, setTab] = useState<Tab>("fabric");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [sheet, setSheet] = useState(false);
  const [ready, setReady] = useState(false);

  const fabric = getFabric(fabricSlug);
  const stage = pieces.trousers ? "suit" : "jacket";
  const total = totalNpr(fabric, pieces);
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return fabrics.filter((f) => (!category || f.category === category) && (!q || f.name.toLowerCase().includes(q)));
  }, [query, category]);

  // Skeleton: at least 600ms, and until the first model previews are decoded (4s safety cap) — then it fades out.
  const first = useRef(fabric);
  useEffect(() => {
    let alive = true;
    const f = first.current;
    const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
    const images = Promise.race([Promise.all([decodeImage(f.jacketPreview), decodeImage(f.suitPreview)]), wait(4000)]);
    Promise.all([wait(600), images]).then(() => alive && setReady(true));
    return () => { alive = false; };
  }, []);

  // Keep the shareable URL in sync (no navigation).
  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) { mounted.current = true; return; }
    window.history.replaceState(window.history.state, "", `${window.location.pathname}?${configQuery(fabricSlug, pieces)}`);
  }, [fabricSlug, pieces]);

  const select = useCallback((slug: string) => {
    setFabricSlug(slug);
    const f = getFabric(slug);
    preload(f.jacketPreview); preload(f.suitPreview);
  }, []);
  const togglePiece = useCallback((k: "trousers" | "waistcoat") => setPieces((p) => ({ ...p, [k]: !p[k] })), []);
  const closeSheet = useCallback(() => setSheet(false), []);

  return (
    <section data-custom-made aria-label="Custom made suit configurator" aria-busy={!ready} className="relative bg-[#0E0E10] pt-16 md:grid md:h-dvh md:grid-cols-2 md:grid-rows-[minmax(0,1fr)]">
      <div className="sticky top-16 z-10 h-[46svh] md:static md:h-full md:min-h-0">
        <Stage fabric={fabric} stage={stage} total={total} tab={tab} waistcoat={pieces.waistcoat} reduce={reduce} />
      </div>
      <Panel
        tab={tab} setTab={setTab} fabrics={visible} total={total} selected={fabricSlug} onSelect={select}
        query={query} setQuery={setQuery} category={category} setCategory={setCategory}
        pieces={pieces} onTogglePiece={togglePiece} onFinish={() => setSheet(true)} reduce={reduce}
      />
      <FinishSheet open={sheet} onClose={closeSheet} fabric={fabric} pieces={pieces} total={total} reduce={reduce} />
      <AnimatePresence>{!ready && <Skeleton key="skeleton" reduce={reduce} />}</AnimatePresence>
    </section>
  );
}
