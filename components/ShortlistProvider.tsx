"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type Ctx = {
  items: string[];
  has: (key: string) => boolean;
  toggle: (key: string) => void;
  remove: (key: string) => void;
  clear: () => void;
  open: boolean;
  setOpen: (v: boolean) => void;
  /** open the shortlist drawer */
  show: () => void;
};

const ShortlistContext = createContext<Ctx | null>(null);
const KEY = "orhanza-shortlist";
const OLD_FAV_KEY = "orhanza-favourites"; // retired — anything saved there is folded into the shortlist

export function ShortlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const list: string[] = JSON.parse(localStorage.getItem(KEY) ?? "[]");
      const old: string[] = JSON.parse(localStorage.getItem(OLD_FAV_KEY) ?? "[]");
      const merged = Array.from(new Set([...list, ...old]));
      setItems(merged);
      if (old.length) {
        localStorage.setItem(KEY, JSON.stringify(merged));
        localStorage.removeItem(OLD_FAV_KEY);
      }
    } catch {}
  }, []);

  const persist = useCallback((next: string[]) => {
    setItems(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {}
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      items,
      open,
      setOpen,
      has: (s) => items.includes(s),
      toggle: (s) => persist(items.includes(s) ? items.filter((i) => i !== s) : [...items, s]),
      remove: (s) => persist(items.filter((i) => i !== s)),
      clear: () => persist([]),
      show: () => setOpen(true),
    }),
    [items, open, persist],
  );

  return <ShortlistContext.Provider value={value}>{children}</ShortlistContext.Provider>;
}

export const useShortlist = () => {
  const ctx = useContext(ShortlistContext);
  if (!ctx) throw new Error("useShortlist must be used inside <ShortlistProvider>");
  return ctx;
};
