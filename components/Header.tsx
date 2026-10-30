"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { useShortlist } from "./ShortlistProvider";

const links = [
  { href: "/collections", label: "Collections" },
  { href: "/#about", label: "About" },
  { href: "/#process", label: "Process" },
  { href: "/#book", label: "Contact" },
];

/** Thin dark full-width bar — stays on top over dark and white sections. */
export function Header({ onSearch }: { onSearch: () => void }) {
  const [menu, setMenu] = useState(false);
  const { items, setOpen } = useShortlist();
  const fade = (d: number) => ({ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.8, delay: d } });

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 bg-[#1A1A1A] text-ivory">
        <div className="container-x flex h-10 items-center justify-between text-[11px]">
          <Link href="/" aria-label="Orhanza — home" className="font-extrabold tracking-[0.5em]">
            O R H A N Z A<sup className="ml-1 text-[8px] tracking-normal">®</sup>
          </Link>

          <motion.nav {...fade(0.3)} className="hidden items-center gap-7 md:flex" aria-label="Primary">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="transition-opacity hover:opacity-60">{l.label}</Link>
            ))}
            <button onClick={onSearch} className="transition-opacity hover:opacity-60">Search</button>
            <button onClick={() => setOpen(true)} className="transition-opacity hover:opacity-60">
              Shortlist{items.length > 0 && <span className="ml-1.5 rounded-full bg-gold px-1.5 py-0.5 text-[9px] text-charcoal">{items.length}</span>}
            </button>
          </motion.nav>

          <button className="md:hidden" onClick={() => setMenu((v) => !v)} aria-expanded={menu} aria-label="Menu">
            <span className="block h-px w-5 bg-current" />
            <span className="mt-1.5 block h-px w-5 bg-current" />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {menu && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col justify-center gap-5 bg-charcoal px-8 text-ivory md:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          >
            {links.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setMenu(false)} className="h-section">{l.label}</Link>
            ))}
            <button className="h-section text-left" onClick={() => { setMenu(false); onSearch(); }}>Search</button>
            <button className="h-section text-left" onClick={() => { setMenu(false); setOpen(true); }}>Shortlist ({items.length})</button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
