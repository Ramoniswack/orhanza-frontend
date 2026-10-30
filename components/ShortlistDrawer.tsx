"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { getProduct, productImage } from "@/lib/data";
import { useLenis } from "@/lib/lenis";
import { useShortlist } from "./ShortlistProvider";

/** Equivalent of the template's cart drawer — a bespoke house shortlists pieces to discuss in a consultation. */
export function ShortlistDrawer() {
  const { items, open, setOpen, remove, clear } = useShortlist();
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;
    open ? lenis.stop() : lenis.start();
    return () => lenis.start();
  }, [open, lenis]);

  const products = items.map(getProduct).filter(Boolean) as NonNullable<ReturnType<typeof getProduct>>[];

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
            className="fixed right-0 top-0 z-[61] flex h-dvh w-full max-w-[440px] flex-col bg-ivory shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 32 }}
          >
            <div className="flex items-center justify-between border-b border-charcoal/10 px-6 py-5">
              <h2 className="font-serif text-2xl">Your Shortlist</h2>
              <button onClick={() => setOpen(false)} aria-label="Close" className="text-xl">✕</button>
            </div>

            <div data-lenis-prevent className="flex-1 overflow-y-auto px-6 py-4">
              {products.length === 0 ? (
                <p className="mt-10 text-center text-slate">Your shortlist is empty.<br />Save pieces you’d like to discuss at your consultation.</p>
              ) : (
                <ul className="divide-y divide-charcoal/10">
                  {products.map((p) => (
                    <li key={p.slug} className="flex gap-4 py-4">
                      <div className="relative h-28 w-20 shrink-0 overflow-hidden rounded-xl bg-field">
                        <Image src={productImage(p)} alt={p.name} fill sizes="80px" className="object-cover" />
                      </div>
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <Link href={`/collections/${p.slug}`} onClick={() => setOpen(false)} className="font-medium hover:underline">{p.name}</Link>
                          <p className="mt-1 text-sm text-slate">Made to measure</p>
                        </div>
                        <button onClick={() => remove(p.slug)} className="self-start text-sm text-slate underline-offset-4 hover:underline">Remove</button>
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
                  className="block rounded-[10px] bg-burgundy py-3.5 text-center text-sm font-medium text-ivory transition-opacity hover:opacity-90"
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
