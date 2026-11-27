"use client";

/**
 * Custom Made configurator — a calm, editorial one-suit tryon. Owns all state (fabric, pieces, filters) and wires
 * Stage (large preview) + Panel (fabric → pieces → total/Finish) + Skeleton + FinishSheet. No tabs: it is one quiet scroll.
 */
import { AnimatePresence, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useShortlist } from "@/components/ShortlistProvider";
import { configQuery, decodeImage, fabrics, genderLabel, getFabric, preload, previewSrc, savedKey, totalNpr, type Gender, type Pieces } from "@/lib/custom-made";
import { FinishSheet } from "./FinishSheet";
import { FitAdvisorDrawer } from "./FitAdvisorDrawer";
import type { JacketStyle } from "./JacketStyleSelector";
import { Panel } from "./Panel";
import { Skeleton } from "./Skeleton";
import { Stage } from "./Stage";
import type { FitRecommendation } from "@/lib/fit-advisor";

export function CustomMade({ initialFabric, initialPieces, initialGender = "men" }: { initialFabric: string; initialPieces: Pieces; initialGender?: Gender }) {
  const reduce = !!useReducedMotion();
  const { has, fitProfiles, setFitProfile } = useShortlist();
  const [fabricSlug, setFabricSlug] = useState(initialFabric);
  const [pieces, setPieces] = useState<Pieces>(initialPieces);
  const [gender, setGender] = useState<Gender>(initialGender);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [sheet, setSheet] = useState(false);
  const [fitAdvisorOpen, setFitAdvisorOpen] = useState(false);
  const [appliedProfile, setAppliedProfile] = useState<FitRecommendation | null>(null);
  const [appliedProfileKey, setAppliedProfileKey] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<Record<Gender, JacketStyle | null>>({ men: null, women: null });

  const fabric = getFabric(fabricSlug);
  const stage = pieces.trousers ? "suit" : "jacket";
  const total = totalNpr(pieces);
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
  const togglePiece = useCallback((k: keyof Pieces) => setPieces((p) => ({ ...p, [k]: !p[k] })), []);
  const closeSheet = useCallback(() => setSheet(false), []);
  const chooseStyle = useCallback((g: Gender, style: JacketStyle) => {
    setGender(g);
    setSelectedStyle((current) => ({ ...current, [g]: style }));
  }, []);
  const fitKey = savedKey(fabric.slug, pieces, gender);
  const recommendation = (appliedProfileKey === fitKey ? appliedProfile : null) ?? fitProfiles[fitKey] ?? null;
  const applyFitProfile = useCallback((profile: FitRecommendation) => {
    const key = savedKey(fabric.slug, pieces, gender);
    setAppliedProfile(profile);
    setAppliedProfileKey(key);
    if (has(key)) setFitProfile(key, profile);
    setFitAdvisorOpen(false);
  }, [fabric.slug, pieces, gender, has, setFitProfile]);
  const clearAppliedProfile = useCallback(() => {
    setAppliedProfile(null);
    setAppliedProfileKey(null);
  }, []);

  return (
    <section data-custom-made aria-label="Custom made suit configurator" aria-busy={!ready} className="relative bg-white pt-16 md:grid md:h-dvh md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:grid-rows-[minmax(0,1fr)]">
      <div className="sticky top-16 z-10 h-[44svh] md:relative md:h-full md:min-h-0">
        <Stage fabric={fabric} stage={stage} gender={gender} waistcoat={pieces.waistcoat} jacketStyle={selectedStyle[gender]} reduce={reduce} />
        <button type="button" onClick={() => setFitAdvisorOpen(true)} className="fixed bottom-20 right-5 z-20 flex w-44 items-center justify-between border-y border-ink/12 py-4 text-left text-[11px] font-medium uppercase tracking-[0.16em] text-ink md:absolute md:bottom-24 md:right-2">
          <span>{recommendation ? `Starting block · ${recommendation.baseSize}` : "Find your starting block"}</span>
          <span aria-hidden>→</span>
        </button>
      </div>
      <Panel
        fabrics={visible} total={total} selected={fabricSlug} onSelect={select} gender={gender} onGender={chooseGender}
        query={query} setQuery={setQuery} category={category} setCategory={setCategory}
        pieces={pieces} onTogglePiece={togglePiece} onFinish={() => setSheet(true)} reduce={reduce}
        selectedStyle={selectedStyle} onStyle={chooseStyle}
      />
      <FinishSheet
        open={sheet} onClose={closeSheet} fabric={fabric} pieces={pieces} gender={gender} total={total} reduce={reduce}
        recommendation={recommendation} onClearAppliedProfile={clearAppliedProfile}
      />
      <FitAdvisorDrawer
        isOpen={fitAdvisorOpen}
        onClose={() => setFitAdvisorOpen(false)}
        commission={{ title: fabric.name, subtitle: `${fabric.category} · ${genderLabel(gender)}`, category: gender === "women" ? "WOMENSWEAR" : "MENSWEAR" }}
        onApplyFitProfile={applyFitProfile}
      />
      <AnimatePresence>{!ready && <Skeleton key="skeleton" reduce={reduce} />}</AnimatePresence>
    </section>
  );
}
