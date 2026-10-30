"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { categoryLabel, productImage, products } from "@/lib/data";
import { useLenis } from "@/lib/lenis";

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const lenis = useLenis();

  useEffect(() => {
    if (open) {
      lenis?.stop();
      setTimeout(() => input.current?.focus(), 150);
    } else {
      lenis?.start();
      setQ("");
    }
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open, lenis, onClose]);

  const results = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return products.slice(0, 4);
    return products.filter((p) => `${p.name} ${p.summary} ${categoryLabel(p.category)} ${p.fabric}`.toLowerCase().includes(t));
  }, [q]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] bg-ivory/95 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div data-lenis-prevent className="container-x h-full overflow-y-auto pb-16 pt-6">
            <div className="flex items-center justify-between">
              <span className="eyebrow text-slate">Search</span>
              <button onClick={onClose} aria-label="Close search" className="text-xl">✕</button>
            </div>
            <input
              ref={input}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Suits, shirts, wool-linen…"
              className="h-display mt-8 w-full border-b border-charcoal/20 bg-transparent pb-4 text-5xl outline-none placeholder:text-charcoal/25 md:text-7xl"
            />
            <ul className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
              {results.map((p) => (
                <li key={p.slug}>
                  <Link href={`/collections/${p.slug}`} onClick={onClose} className="group block">
                    <div className="relative aspect-[4/5] overflow-hidden rounded-card bg-field">
                      <Image src={productImage(p)} alt={p.name} fill sizes="25vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    </div>
                    <p className="mt-3 text-sm font-medium">{p.name}</p>
                    <p className="text-xs text-slate">{categoryLabel(p.category)}</p>
                  </Link>
                </li>
              ))}
              {results.length === 0 && <p className="col-span-full text-slate">No pieces match “{q}”.</p>}
            </ul>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
