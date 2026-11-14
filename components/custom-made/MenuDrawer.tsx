"use client";

/**
 * Optional two-column left drawer from the reference (dimmed page, hover a link → its sub-links fade/slide in 12px).
 * NOT wired into the Header by default: only /custom-made exists today, so most sub-links are marked "Soon".
 * To use it: render <MenuDrawer open={...} onClose={...} /> from Header and open it from the "Custom Made" item.
 */
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { EASE_OUT } from "@/components/motion";

type Sub = { label: string; href?: string };
const MENU: { label: string; href: string; subs?: Sub[] }[] = [
  { label: "Clothing", href: "/shop" },
  {
    label: "Custom Made",
    href: "/custom-made",
    subs: [
      { label: "Custom Suits", href: "/custom-made" },
      { label: "Jackets" }, { label: "Trousers" }, { label: "Waistcoats" }, { label: "Shirts" }, { label: "Overcoats" },
      { label: "How it works", href: "/#book" },
    ],
  },
  { label: "Men's collection", href: "/collections/men" },
  { label: "Women's collection", href: "/collections/women" },
];

export function MenuDrawer({ open, onClose, reduce = false }: { open: boolean; onClose: () => void; reduce?: boolean }) {
  const [hover, setHover] = useState<string | null>("Custom Made");
  const subs = MENU.find((m) => m.label === hover)?.subs;
  const d = reduce ? 0.15 : 0.6;
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 z-[55] bg-black/60" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: d, ease: EASE_OUT }} onClick={onClose} />
          <motion.nav aria-label="Menu" className="fixed left-0 top-0 z-[56] flex h-dvh w-full max-w-[640px] bg-[#0E0E10] pt-16 text-ivory" initial={reduce ? { opacity: 0 } : { x: "-100%" }} animate={reduce ? { opacity: 1 } : { x: 0 }} exit={reduce ? { opacity: 0 } : { x: "-100%" }} transition={{ duration: d, ease: EASE_OUT }}>
            <ul className="w-1/2 border-r border-ivory/10 px-8 py-10">
              {MENU.map((m) => (
                <li key={m.label} onMouseEnter={() => setHover(m.label)}>
                  <Link href={m.href} onClick={onClose} className={`block py-2 text-[22px] font-bold tracking-[-0.03em] transition-colors duration-300 ${hover === m.label ? "text-ivory" : "text-ivory/40"}`}>{m.label}</Link>
                </li>
              ))}
            </ul>
            <AnimatePresence mode="wait" initial={false}>
              {subs && (
                <motion.ul key={hover} className="w-1/2 px-8 py-10" initial={{ opacity: 0, x: reduce ? 0 : 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: reduce ? 0.15 : 0.3, ease: EASE_OUT }}>
                  {subs.map((s) => (
                    <li key={s.label}>
                      {s.href ? (
                        <Link href={s.href} onClick={onClose} className="block py-1.5 text-[15px] font-medium text-ivory hover:opacity-60">{s.label}</Link>
                      ) : (
                        <span className="block py-1.5 text-[15px] text-ivory/50">{s.label} <span className="ml-1 text-[11px]">Soon</span></span>
                      )}
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
}
