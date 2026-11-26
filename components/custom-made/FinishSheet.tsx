"use client";

/** Summary after "Finish": fabric, pieces, total, then Book a fitting / Save (the one saved list). */
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { EASE_OUT, KineticNumber } from "@/components/motion";
import { useShortlist } from "@/components/ShortlistProvider";
import { FitAdvisorDrawer } from "./FitAdvisorDrawer";
import { useLenis } from "@/lib/lenis";
import { configQuery, DELIVERY_TEXT, genderLabel, lineItems, savedKey, type Fabric, type Gender, type Pieces } from "@/lib/custom-made";
import type { FitRecommendation } from "@/lib/fit-advisor";

export function FinishSheet({ open, onClose, fabric, pieces, gender, total, reduce }: { open: boolean; onClose: () => void; fabric: Fabric; pieces: Pieces; gender: Gender; total: number; reduce: boolean }) {
  const { has, toggle, fitProfiles, setFitProfile, setPendingFitProfile } = useShortlist();
  const lenis = useLenis();
  const key = savedKey(fabric.slug, pieces, gender);
  const saved = has(key);
  const [fitAdvisorOpen, setFitAdvisorOpen] = useState(false);
  const [appliedProfile, setAppliedProfile] = useState<FitRecommendation | null>(null);
  const [appliedProfileKey, setAppliedProfileKey] = useState<string | null>(null);
  const recommendation = (appliedProfileKey === key ? appliedProfile : null) ?? fitProfiles[key] ?? null;

  const applyFitProfile = (profile: FitRecommendation) => {
    setAppliedProfile(profile);
    setAppliedProfileKey(key);
    if (saved) setFitProfile(key, profile);
    setFitAdvisorOpen(false);
  };

  const toggleSaved = () => {
    if (saved) {
      toggle(key);
      setAppliedProfile(null);
      setAppliedProfileKey(null);
      return;
    }
    toggle(key);
    if (recommendation) setFitProfile(key, recommendation);
  };

  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    return () => { lenis?.start(); };
  }, [open, lenis]);

  useEffect(() => {
    if (!open || fitAdvisorOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); };
  }, [open, fitAdvisorOpen, onClose]);

  const d = reduce ? 0.15 : 0.6;
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 z-[70] bg-ink/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: d, ease: EASE_OUT }} onClick={onClose} />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Your made-to-measure suit"
            className="fixed right-0 top-0 z-[71] flex h-dvh w-full max-w-[440px] flex-col border-l border-ink/12 bg-white text-ink"
            initial={reduce ? { opacity: 0 } : { x: "100%" }}
            animate={reduce ? { opacity: 1 } : { x: 0 }}
            exit={reduce ? { opacity: 0 } : { x: "100%" }}
            transition={{ duration: d, ease: EASE_OUT }}
          >
            <div className="flex items-center justify-between border-b border-ink/12 px-6 py-5">
              <h2 className="text-[24px] font-light tracking-[-0.02em] text-ink">Your suit</h2>
              <button autoFocus onClick={onClose} aria-label="Close" className="flex h-9 w-9 items-center justify-center text-lg text-ink hover:bg-ink/5 focus-visible:outline-2 focus-visible:outline-gold">✕</button>
            </div>

            <div data-lenis-prevent className="flex-1 overflow-y-auto px-6 py-6">
              <div className="flex items-center gap-4">
                <img src={fabric.thumb} alt="" width={64} height={64} className="h-16 w-16 object-cover" />
                <div>
                  <p className="text-[15px] font-medium text-ink">{fabric.name}</p>
                  <p className="mt-0.5 text-[12px] text-slate">{fabric.category} · {genderLabel(gender)}</p>
                </div>
              </div>
              <ul className="mt-6 divide-y divide-ink/12 border-y border-ink/12">
                {lineItems(pieces).map((i) => (
                  <li key={i.label} className="flex justify-between py-3 text-[14px] text-ink"><span>{i.label}</span><span className="inline-flex items-center gap-[0.3em] text-slate"><span>Rs.</span><KineticNumber value={i.price} group play duration={0.9} stagger={0.04} /></span></li>
                ))}
              </ul>
              <p className="mt-5 flex justify-between text-[17px] font-medium tracking-[-0.01em] text-ink"><span>Total</span><span className="inline-flex items-center gap-[0.3em]"><span>Rs.</span><KineticNumber value={total} group play duration={1.1} stagger={0.05} /></span></p>
              <p className="mt-2 text-[12px] text-slate">Estimated delivery: {DELIVERY_TEXT}</p>
              <button type="button" onClick={() => setFitAdvisorOpen(true)} className="mt-6 flex w-full items-center justify-between border-y border-ink/12 py-4 text-left text-[11px] font-medium uppercase tracking-[0.16em] text-ink">
                <span>{recommendation ? `Starting block · ${recommendation.baseSize}` : "Find your starting block"}</span>
                <span aria-hidden>→</span>
              </button>
              {recommendation && <p className="mt-3 text-xs leading-relaxed text-slate">{recommendation.summary}</p>}
            </div>

            <div className="space-y-3 border-t border-ink/12 p-6">
              <Link href={`/contact?${configQuery(fabric.slug, pieces, gender)}#book`} onClick={() => { if (recommendation) setPendingFitProfile(recommendation); onClose(); }} className="block bg-ink py-4 text-center text-[11px] font-medium uppercase tracking-[0.22em] text-ivory transition-colors duration-300 hover:bg-gold hover:text-ink">Book a fitting</Link>
              <button type="button" onClick={toggleSaved} aria-pressed={saved} className="w-full border border-ink/40 py-4 text-[11px] font-medium uppercase tracking-[0.22em] text-ink transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-ivory">{saved ? "Saved ✓" : recommendation ? "Save suit & fit profile" : "Save"}</button>
            </div>
          </motion.aside>
          <FitAdvisorDrawer
            isOpen={fitAdvisorOpen}
            onClose={() => setFitAdvisorOpen(false)}
            commission={{ title: fabric.name, subtitle: `${fabric.category} · ${genderLabel(gender)}`, category: gender === "women" ? "WOMENSWEAR" : "MENSWEAR" }}
            onApplyFitProfile={applyFitProfile}
          />
        </>
      )}
    </AnimatePresence>
  );
}
