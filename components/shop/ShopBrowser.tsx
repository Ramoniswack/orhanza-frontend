"use client";

import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { genders, occasions, shopProducts, shopTypes, type Gender, type Occasion, type ShopType } from "@/lib/shop";
import { ShopCard } from "./ShopCard";

type Props = { initial?: { gender?: string; occasion?: string; type?: string } };

const chip = (on: boolean) =>
  `rounded-full border px-4 py-2 text-sm transition-colors ${on ? "border-charcoal bg-charcoal text-ivory" : "border-charcoal/20 hover:border-charcoal"}`;

export function ShopBrowser({ initial }: Props) {
  const [gender, setGender] = useState<Gender | "all">(genders.some((g) => g.slug === initial?.gender) ? (initial!.gender as Gender) : "all");
  const [occasion, setOccasion] = useState<Occasion | "all">(occasions.find((o) => o.toLowerCase() === initial?.occasion?.toLowerCase()) ?? "all");
  const [type, setType] = useState<ShopType | "all">(shopTypes.find((t) => t.toLowerCase() === initial?.type?.toLowerCase()) ?? "all");

  const list = useMemo(
    () => shopProducts.filter((p) => (gender === "all" || p.gender === gender) && (occasion === "all" || p.occasion === occasion) && (type === "all" || p.type === type)),
    [gender, occasion, type],
  );
  const dirty = gender !== "all" || occasion !== "all" || type !== "all";

  const sync = (g: string, o: string, t: string) => {
    const q = new URLSearchParams();
    if (g !== "all") q.set("gender", g);
    if (o !== "all") q.set("occasion", o.toLowerCase());
    if (t !== "all") q.set("type", t.toLowerCase());
    window.history.replaceState(null, "", q.size ? `/shop?${q}` : "/shop");
  };
  const pick = {
    gender: (v: Gender | "all") => { setGender(v); sync(v, occasion, type); },
    occasion: (v: Occasion | "all") => { setOccasion(v); sync(gender, v, type); },
    type: (v: ShopType | "all") => { setType(v); sync(gender, occasion, v); },
  };
  const reset = () => { setGender("all"); setOccasion("all"); setType("all"); sync("all", "all", "all"); };

  return (
    <>
      {/* Men / Women */}
      <div role="tablist" aria-label="Men or women" className="flex items-baseline gap-6 text-[clamp(1.6rem,3vw,2.4rem)] font-bold tracking-[-0.04em]">
        {([{ slug: "all", label: "All" }, ...genders] as const).map((g) => {
          const on = gender === g.slug;
          return (
            <button key={g.slug} role="tab" aria-selected={on} onClick={() => pick.gender(g.slug as Gender | "all")} className="relative pb-1 transition-colors duration-500" style={{ color: on ? "#111" : "rgba(0,0,0,.28)" }}>
              {g.label}
              <span aria-hidden className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-black transition-transform duration-500" style={{ transform: `scaleX(${on ? 1 : 0})` }} />
            </button>
          );
        })}
      </div>

      {/* filters */}
      <div className="mt-6 flex flex-col gap-4 border-y border-black/10 py-5 md:flex-row md:items-center md:gap-10">
        <div className="flex flex-wrap items-center gap-2">
          <span className="label-micro mr-1 text-slate">Occasion</span>
          {(["all", ...occasions] as const).map((o) => (
            <button key={o} onClick={() => pick.occasion(o)} aria-pressed={occasion === o} className={chip(occasion === o)}>{o === "all" ? "All" : o}</button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="label-micro mr-1 text-slate">Type</span>
          {(["all", ...shopTypes] as const).map((t) => (
            <button key={t} onClick={() => pick.type(t)} aria-pressed={type === t} className={chip(type === t)}>{t === "all" ? "All" : t}</button>
          ))}
        </div>
        <div className="flex items-center gap-4 text-sm text-slate md:ml-auto">
          <span aria-live="polite">{list.length} {list.length === 1 ? "piece" : "pieces"}</span>
          {dirty && <button onClick={reset} className="font-medium text-charcoal underline-offset-4 hover:underline">Clear filters</button>}
        </div>
      </div>

      <motion.div layout className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {list.map((p, i) => (
            <motion.div key={p.slug} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
              <ShopCard product={p} priority={i < 4} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      {list.length === 0 && (
        <p className="mt-16 text-center text-slate">Nothing matches those filters. <button onClick={reset} className="font-medium text-charcoal underline underline-offset-4">Clear filters</button></p>
      )}
    </>
  );
}
