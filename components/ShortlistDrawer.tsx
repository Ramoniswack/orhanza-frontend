"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { resolveSaved, type Saved } from "@/lib/saved";
import { useLenis } from "@/lib/lenis";
import { useShortlist } from "./ShortlistProvider";

/** One saved list — pieces to talk through at your consultation. */
export function ShortlistDrawer() {
  const { items, open, setOpen, remove, clear } = useShortlist();
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;
    open ? lenis.stop() : lenis.start();
    return () => lenis.start();
  }, [open, lenis]);

  const products = items.map(resolveSaved).filter(Boolean) as Saved[];

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[60] bg-charcoal/50 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.aside
            role="dialog"
            aria-label="Your shortlist"
            className="fixed right-0 top-0 z-[61] flex h-dvh w-full max-w-[440px] flex-col bg-white shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 32 }}
          >
            <div className="flex items-center justify-between border-b border-charcoal/10 px-6 py-5">
              <h2 className="text-2xl font-bold tracking-[-0.03em]">
                Your Shortlist <span className="ml-1 text-sm font-medium text-slate">{products.length}</span>
              </h2>
              <button onClick={() => setOpen(false)} aria-label="Close" className="text-xl">✕</button>
            </div>

            <div data-lenis-prevent className="flex-1 overflow-y-auto px-6 py-4">
              {products.length === 0 ? (
                <p className="mt-10 text-center text-slate">Your shortlist is empty.<br />Save pieces you’d like to discuss at your consultation.</p>
              ) : (
                <ul className="divide-y divide-charcoal/10">
                  {products.map((p) => (
                    <li key={p.key} className="flex gap-4 py-4">
                      <div className="relative h-28 w-20 shrink-0 overflow-hidden rounded-xl bg-field">
                        <Image src={p.image} alt={p.name} fill sizes="80px" className="object-cover" style={{ objectPosition: p.position }} />
                      </div>
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <Link href={p.href} onClick={() => setOpen(false)} className="font-medium hover:underline">{p.name}</Link>
                          <p className="mt-1 text-sm text-slate">Made to measure</p>
                        </div>
                        <button onClick={() => remove(p.key)} className="self-start text-sm text-slate underline-offset-4 hover:underline">Remove</button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {products.length > 0 && (
              <div className="space-y-3 border-t border-charcoal/10 p-6">
                <Link
                  href="/#book"
                  onClick={() => setOpen(false)}
                  className="block rounded-[10px] bg-charcoal py-3.5 text-center text-sm font-medium text-ivory transition-opacity hover:opacity-90"
                >
                  Book a Consultation
                </Link>
                <button onClick={clear} className="w-full text-sm text-slate hover:underline">Clear shortlist</button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
