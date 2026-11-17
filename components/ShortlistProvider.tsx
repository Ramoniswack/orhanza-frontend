"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { isFitRecommendation, type FitRecommendation } from "@/lib/fit-advisor";

type Ctx = {
  items: string[];
  fitProfiles: Record<string, FitRecommendation>;
  pendingFitProfile: FitRecommendation | null;
  has: (key: string) => boolean;
  toggle: (key: string) => void;
  setFitProfile: (key: string, profile: FitRecommendation) => void;
  setPendingFitProfile: (profile: FitRecommendation | null) => void;
  remove: (key: string) => void;
  clear: () => void;
  open: boolean;
  setOpen: (v: boolean) => void;
  /** open the shortlist drawer */
  show: () => void;
};

const ShortlistContext = createContext<Ctx | null>(null);
const KEY = "orhanza-shortlist";
const FIT_PROFILES_KEY = "orhanza-fit-profiles";
const OLD_FAV_KEY = "orhanza-favourites"; // retired — anything saved there is folded into the shortlist

export function ShortlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<string[]>([]);
  const [fitProfiles, setFitProfiles] = useState<Record<string, FitRecommendation>>({});
  const [pendingFitProfile, setPendingFitProfile] = useState<FitRecommendation | null>(null);
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
    try {
      const stored: unknown = JSON.parse(localStorage.getItem(FIT_PROFILES_KEY) ?? "{}");
      if (stored && typeof stored === "object" && !Array.isArray(stored)) {
        setFitProfiles(
          Object.fromEntries(
            Object.entries(stored).filter((entry): entry is [string, FitRecommendation] =>
              isFitRecommendation(entry[1]),
            ),
          ),
        );
      }
    } catch {}
  }, []);

  const persist = useCallback((next: string[]) => {
    setItems(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {}
  }, []);

  const persistFitProfiles = useCallback((next: Record<string, FitRecommendation>) => {
    setFitProfiles(next);
    try {
      localStorage.setItem(FIT_PROFILES_KEY, JSON.stringify(next));
    } catch {}
  }, []);

  const toggle = useCallback((key: string) => {
    const removing = items.includes(key);
    persist(removing ? items.filter((item) => item !== key) : [...items, key]);
    if (removing && fitProfiles[key]) {
      const next = { ...fitProfiles };
      delete next[key];
      persistFitProfiles(next);
    }
  }, [fitProfiles, items, persist, persistFitProfiles]);

  const remove = useCallback((key: string) => {
    persist(items.filter((item) => item !== key));
    if (fitProfiles[key]) {
      const next = { ...fitProfiles };
      delete next[key];
      persistFitProfiles(next);
    }
  }, [fitProfiles, items, persist, persistFitProfiles]);

  const setFitProfile = useCallback((key: string, profile: FitRecommendation) => {
    persistFitProfiles({ ...fitProfiles, [key]: profile });
  }, [fitProfiles, persistFitProfiles]);

  const clear = useCallback(() => {
    persist([]);
    persistFitProfiles({});
  }, [persist, persistFitProfiles]);

  const value = useMemo<Ctx>(
    () => ({
      items,
      fitProfiles,
      pendingFitProfile,
      open,
      setOpen,
      has: (s) => items.includes(s),
      toggle,
      setFitProfile,
      setPendingFitProfile,
      remove,
      clear,
      show: () => setOpen(true),
    }),
    [items, fitProfiles, pendingFitProfile, open, toggle, setFitProfile, remove, clear],
  );

  return <ShortlistContext.Provider value={value}>{children}</ShortlistContext.Provider>;
}

export const useShortlist = () => {
  const ctx = useContext(ShortlistContext);
  if (!ctx) throw new Error("useShortlist must be used inside <ShortlistProvider>");
  return ctx;
};
