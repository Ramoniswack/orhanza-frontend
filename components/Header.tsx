"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useLenis } from "@/lib/lenis";
import { site } from "@/lib/site";
import { useShortlist } from "./ShortlistProvider";

const links: { href: string; label: string }[] = [
  { href: "/shop", label: "Shop" },
  { href: "/try-on", label: "Try On" },
  { href: "/custom-made", label: "Custom Made" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

/** Thin-line bookmark with a small gold spark — reads as "saved pieces", fills in when the list has items. */
function ShortlistIcon({ filled = false }: { filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-[19px] w-[19px]" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="miter" strokeLinecap="square" aria-hidden="true">
      <path d="M6.5 3.5h11v17L12 16.2 6.5 20.5v-17z" fill={filled ? "currentColor" : "none"} className="transition-[fill] duration-500" />
      {!filled && <path d="M12 7.6v3.6M10.2 9.4h3.6" stroke="var(--color-gold)" strokeWidth="1.1" />}
    </svg>
  );
}

/** Full-width bar. On the home page it is transparent while the hero is on screen, then turns solid once you scroll past it. */
export function Header() {
  const [menu, setMenu] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const { items, show } = useShortlist();
  const pathname = usePathname();
  const lenis = useLenis();
  const isHome = pathname === "/";
  const [pastHero, setPastHero] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => {
    const hero = document.getElementById("hero");
    const end = hero ? hero.offsetTop + hero.offsetHeight - 64 : 80;
    setPastHero(y > end);
  });
  useEffect(() => { setMenu(false); }, [pathname]);
  useEffect(() => { if (!menu) setShopOpen(false); }, [menu]);
  useEffect(() => {
    if (!lenis) return;
    menu ? lenis.stop() : lenis.start();
    return () => lenis.start();
  }, [menu, lenis]);
  const clear = isHome && !pastHero && !menu;
  const fade = (d: number) => ({ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.8, delay: d } });

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter] duration-500 text-ivory ${clear ? "bg-transparent" : "bg-[#1A1A1A]"}`}>
        <div className="container-x flex h-16 items-center justify-between text-[15px]">
          <Link
            href="/"
            aria-label="Orhanza — home"
            className="text-base font-semibold italic tracking-[0.1em] sm:text-xl"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            ORHANZA<sup className="ml-1 text-[9px] tracking-normal sm:text-[10px]">®</sup>
          </Link>

          <motion.nav {...fade(0.3)} className="hidden items-center gap-6 text-[12px] font-semibold uppercase tracking-[0.12em] lg:flex xl:gap-9" aria-label="Primary">
            {links.map((l) => (
              <Link key={l.href} href={l.href} aria-current={pathname === l.href ? "page" : undefined} className={`transition-opacity hover:opacity-100 ${pathname === l.href ? "opacity-100" : "opacity-75"}`}>{l.label}</Link>
            ))}
            <button
              onClick={() => show()}
              aria-label={`Open shortlist, ${items.length} items`}
              title="Shortlist"
              className="relative grid h-10 w-10 place-items-center transition-opacity duration-300 hover:opacity-60"
            >
              <ShortlistIcon filled={items.length > 0} />
              {items.length > 0 && (
                <motion.span
                  key={items.length}
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute -right-0.5 top-0.5 grid h-[16px] min-w-[16px] place-items-center bg-gold px-1 text-[9px] font-semibold leading-none tracking-normal text-charcoal"
                >
                  {items.length}
                </motion.span>
              )}
            </button>
          </motion.nav>

          <div className="-mr-2 flex items-center lg:hidden">
            <button onClick={() => { setMenu(false); show(); }} aria-label={`Open shortlist, ${items.length} items`} className="relative grid h-11 w-11 place-items-center transition-opacity active:opacity-60">
              <ShortlistIcon filled={items.length > 0} />
              {items.length > 0 && <span className="absolute right-0.5 top-1.5 grid h-[16px] min-w-[16px] place-items-center bg-gold px-1 text-[9px] font-semibold leading-none text-charcoal">{items.length}</span>}
            </button>
            <button className="flex h-11 w-11 flex-col items-center justify-center" onClick={() => setMenu((v) => !v)} aria-expanded={menu} aria-label={menu ? "Close menu" : "Open menu"}>
              <span className={`block h-px w-6 bg-current transition-transform duration-300 ${menu ? "translate-y-[4.5px] rotate-45" : ""}`} />
              <span className={`mt-2 block h-px w-6 bg-current transition-transform duration-300 ${menu ? "-translate-y-[4.5px] -rotate-45" : ""}`} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menu && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col overflow-y-auto overscroll-contain bg-charcoal px-[1.1rem] pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-20 text-ivory lg:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          >
            <nav aria-label="Mobile menu">
              <ul className="divide-y divide-white/10 border-y border-white/10">
                <li>
                  <button type="button" aria-expanded={shopOpen} onClick={() => setShopOpen((v) => !v)} className="flex w-full items-center justify-between py-5 text-left text-[1.6rem] font-light tracking-[-0.02em]">
                    Shop
                    <span aria-hidden className="relative block h-3.5 w-3.5">
                      <span className="absolute left-0 top-1/2 h-px w-full bg-current" />
                      <span className={`absolute left-1/2 top-0 h-full w-px bg-current transition-transform duration-500 ${shopOpen ? "rotate-90" : ""}`} />
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {shopOpen && (
                      <motion.ul initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden">
                        {[{ href: "/shop", label: "All pieces" }, { href: "/shop?gender=men", label: "Men" }, { href: "/shop?gender=women", label: "Women" }].map((s) => (
                          <li key={s.href}><Link href={s.href} onClick={() => setMenu(false)} className="block py-3 pl-4 text-base text-ivory/70 active:text-ivory">{s.label}</Link></li>
                        ))}
                        <li className="pb-3" />
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </li>
                {links.filter((l) => l.href !== "/shop").map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} onClick={() => setMenu(false)} className="flex items-center justify-between py-5 text-[1.6rem] font-light tracking-[-0.02em]">
                      {l.label}
                      <span aria-hidden className="text-base text-ivory/40">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="mt-auto space-y-6 pt-10">
              <Link href="/#book" onClick={() => setMenu(false)} className="flex h-12 items-center justify-center border border-ivory/60 text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors active:bg-ivory active:text-charcoal">Book a consultation</Link>
              <div className="flex items-center justify-between text-sm text-ivory/70">
                <button type="button" className="flex items-center gap-2" aria-label={`Open shortlist, ${items.length} items`} onClick={() => { setMenu(false); show(); }}>
                  <ShortlistIcon filled={items.length > 0} />
                  <span>Shortlist ({items.length})</span>
                </button>
                <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:underline">Instagram</a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
