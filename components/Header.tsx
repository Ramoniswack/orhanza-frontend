"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useShortlist } from "./ShortlistProvider";

const links = [
  { href: "/collections", label: "Collections" },
  { href: "/#process", label: "Process" },
  { href: "/#book", label: "Contact" },
];

export function Header({ onSearch }: { onSearch: () => void }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const { scrollY } = useScroll();
  const [overHero, setOverHero] = useState(isHome);
  const [menu, setMenu] = useState(false);
  const { items, setOpen } = useShortlist();

  useMotionValueEvent(scrollY, "change", (y) => {
    if (!isHome) return setOverHero(false);
    const hero = document.getElementById("hero");
    const end = hero ? hero.offsetHeight - window.innerHeight * 0.6 : 0;
    setOverHero(y < end);
  });

  const transparent = isHome && overHero;
  const tone = transparent ? "text-[#111]" : "text-[#111]";

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background,backdrop-filter,border-color] duration-500 ${
          transparent ? "border-b border-transparent" : "border-b border-[#111]/10 bg-[#dadada]/85 backdrop-blur-xl"
        }`}
      >
        <div className={`container-x flex h-[68px] items-center justify-between ${tone} transition-colors duration-500`}>
          <Link href="/" aria-label="Orhanza — home" className="text-[1.6rem] font-medium tracking-[0.28em]" style={{ fontFamily: "var(--font-display)" }}>
            ORHANZA
          </Link>

          <nav className="hidden items-center gap-9 text-nav md:flex" aria-label="Primary">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="relative transition-opacity hover:opacity-70">
                {l.label}
              </Link>
            ))}
            <button onClick={onSearch} className="text-nav transition-opacity hover:opacity-70">
              Search
            </button>
            <button onClick={() => setOpen(true)} className="text-nav transition-opacity hover:opacity-70">
              Shortlist{items.length > 0 && <span className="ml-1.5 rounded-full bg-gold px-1.5 py-0.5 text-meta text-[#111]">{items.length}</span>}
            </button>
          </nav>

          <button className="md:hidden" onClick={() => setMenu((v) => !v)} aria-expanded={menu} aria-label="Menu">
            <span className="block h-px w-6 bg-current" />
            <span className="mt-2 block h-px w-6 bg-current" />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {menu && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col justify-center gap-6 bg-[#000] px-8 text-[#f4f4f4] md:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          >
            {links.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setMenu(false)} className="h-display text-5xl">
                {l.label}
              </Link>
            ))}
            <button className="h-display text-left text-5xl" onClick={() => { setMenu(false); onSearch(); }}>Search</button>
            <button className="h-display text-left text-5xl" onClick={() => { setMenu(false); setOpen(true); }}>
              Shortlist ({items.length})
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
