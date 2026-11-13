"use client";

/** Summary after "Finish": fabric, pieces, total, then Book a fitting / Save (the one saved list). */
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useEffect } from "react";
import { EASE_OUT } from "@/components/motion";
import { useShortlist } from "@/components/ShortlistProvider";
import { useLenis } from "@/lib/lenis";
import { configQuery, formatNpr, lineItems, savedKey, type Fabric, type Pieces } from "@/lib/custom-made";

export function FinishSheet({ open, onClose, fabric, pieces, total, reduce }: { open: boolean; onClose: () => void; fabric: Fabric; pieces: Pieces; total: number; reduce: boolean }) {
  const { has, toggle } = useShortlist();
  const lenis = useLenis();
  const key = savedKey(fabric.slug, pieces);
  const saved = has(key);

  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); lenis?.start(); };
  }, [open, lenis, onClose]);

  const d = reduce ? 0.15 : 0.6;
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 z-[70] bg-black/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: d, ease: EASE_OUT }} onClick={onClose} />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Your made-to-measure suit"
            className="fixed right-0 top-0 z-[71] flex h-dvh w-full max-w-[440px] flex-col bg-white"
            initial={reduce ? { opacity: 0 } : { x: "100%" }}
            animate={reduce ? { opacity: 1 } : { x: 0 }}
            exit={reduce ? { opacity: 0 } : { x: "100%" }}
            transition={{ duration: d, ease: EASE_OUT }}
          >
            <div className="flex items-center justify-between border-b border-black/[0.08] px-6 py-5">
              <h2 className="text-[22px] font-bold tracking-[-0.03em] text-ink">Your suit</h2>
              <button autoFocus onClick={onClose} aria-label="Close" className="text-xl text-ink">✕</button>
            </div>

            <div data-lenis-prevent className="flex-1 overflow-y-auto px-6 py-6">
              <div className="flex items-center gap-4">
                <img src={fabric.thumb} alt="" width={64} height={64} className="h-16 w-16 rounded-[6px] object-cover" />
                <div>
                  <p className="text-[15px] font-semibold text-ink">{fabric.name}</p>
                  <p className="mt-0.5 text-[12px] text-slate">{fabric.category}</p>
                </div>
              </div>
              <ul className="mt-6 divide-y divide-black/[0.08] border-y border-black/[0.08]">
                {lineItems(fabric, pieces).map((i) => (
                  <li key={i.label} className="flex justify-between py-3 text-[14px] text-ink"><span>{i.label}</span><span className="text-slate">{formatNpr(i.price)}</span></li>
                ))}
              </ul>
              <p className="mt-5 flex justify-between text-[17px] font-bold tracking-[-0.02em] text-ink"><span>Total</span><span>{formatNpr(total)}</span></p>
              <p className="mt-2 text-[12px] text-slate">Final price is confirmed at your fitting.</p>
            </div>

            <div className="space-y-3 border-t border-black/[0.08] p-6">
              <Link href={`/contact?${configQuery(fabric.slug, pieces)}#book`} onClick={onClose} className="block rounded-full bg-ink py-3.5 text-center text-[14px] font-semibold text-white transition-opacity duration-300 hover:opacity-85">Book a fitting</Link>
              <button type="button" onClick={() => toggle(key)} aria-pressed={saved} className="w-full rounded-full border border-ink py-3.5 text-[14px] font-semibold text-ink transition-colors duration-300 hover:bg-ink hover:text-white">{saved ? "Saved ✓" : "Save"}</button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
