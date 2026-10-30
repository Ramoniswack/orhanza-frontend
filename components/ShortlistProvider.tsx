"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type Ctx = {
  items: string[];
  has: (slug: string) => boolean;
  toggle: (slug: string) => void;
  remove: (slug: string) => void;
  clear: () => void;
  open: boolean;
  setOpen: (v: boolean) => void;
};

const ShortlistContext = createContext<Ctx | null>(null);
const KEY = "orhanza-shortlist";

export function ShortlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
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
