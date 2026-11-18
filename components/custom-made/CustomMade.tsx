"use client";

/**
 * Custom Made configurator — a calm, editorial one-suit tryon. Owns all state (fabric, pieces, filters) and wires
 * Stage (large preview) + Panel (fabric → pieces → total/Finish) + Skeleton + FinishSheet. No tabs: it is one quiet scroll.
 */
import { AnimatePresence, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { configQuery, decodeImage, fabrics, getFabric, preload, previewSrc, totalNpr, type Gender, type Pieces } from "@/lib/custom-made";
import { FinishSheet } from "./FinishSheet";
import { Panel } from "./Panel";
import { Skeleton } from "./Skeleton";
import { Stage } from "./Stage";

export function CustomMade({ initialFabric, initialPieces, initialGender = "men" }: { initialFabric: string; initialPieces: Pieces; initialGender?: Gender }) {
  const reduce = !!useReducedMotion();
  const [fabricSlug, setFabricSlug] = useState(initialFabric);
  const [pieces, setPieces] = useState<Pieces>(initialPieces);
  const [gender, setGender] = useState<Gender>(initialGender);
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
  const first = useRef({ fabric, gender });
  useEffect(() => {
    let alive = true;
    const { fabric: f, gender: g } = first.current;
    const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
    const images = Promise.race([Promise.all([decodeImage(previewSrc(f, "jacket", g)), decodeImage(previewSrc(f, "suit", g))]), wait(4000)]);
    Promise.all([wait(600), images]).then(() => alive && setReady(true));
    return () => { alive = false; };
  }, []);

  // Keep the shareable URL in sync (no navigation).
  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) { mounted.current = true; return; }
    window.history.replaceState(window.history.state, "", `${window.location.pathname}?${configQuery(fabricSlug, pieces, gender)}`);
  }, [fabricSlug, pieces, gender]);

  const select = useCallback((slug: string) => {
    setFabricSlug(slug);
    const f = getFabric(slug);
    preload(previewSrc(f, "jacket", gender)); preload(previewSrc(f, "suit", gender));
  }, [gender]);
  const chooseGender = useCallback((g: Gender) => {
    setGender(g);
    preload(previewSrc(getFabric(fabricSlug), stage, g));
  }, [fabricSlug, stage]);
  const togglePiece = useCallback((k: "trousers" | "waistcoat") => setPieces((p) => ({ ...p, [k]: !p[k] })), []);
  const closeSheet = useCallback(() => setSheet(false), []);

  return (
    <section data-custom-made aria-label="Custom made suit configurator" aria-busy={!ready} className="relative bg-white pt-16 md:grid md:h-dvh md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:grid-rows-[minmax(0,1fr)]">
      <div className="sticky top-16 z-10 h-[44svh] md:static md:h-full md:min-h-0">
        <Stage fabric={fabric} stage={stage} gender={gender} waistcoat={pieces.waistcoat} reduce={reduce} />
      </div>
      <Panel
        fabrics={visible} total={total} selected={fabricSlug} onSelect={select} gender={gender} onGender={chooseGender}
        query={query} setQuery={setQuery} category={category} setCategory={setCategory}
        pieces={pieces} onTogglePiece={togglePiece} onFinish={() => setSheet(true)} reduce={reduce}
      />
      <FinishSheet open={sheet} onClose={closeSheet} fabric={fabric} pieces={pieces} gender={gender} total={total} reduce={reduce} />
      <AnimatePresence>{!ready && <Skeleton key="skeleton" reduce={reduce} />}</AnimatePresence>
    </section>
  );
}
