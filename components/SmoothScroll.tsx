"use client";

import Lenis from "lenis";
import { cancelFrame, frame } from "motion";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

const LenisContext = createContext<Lenis | null>(null);
export const useLenis = () => useContext(LenisContext);

/**
 * Lenis smooth scrolling, driven by Motion's frame loop so that Lenis and every
 * motion value (useScroll / useTransform / useSpring) update in the same frame.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const instance = new Lenis({ lerp: 0.085, smoothWheel: true });
    const update = (data: { timestamp: number }) => instance.raf(data.timestamp);
    frame.update(update, true);
    setLenis(instance);

    return () => {
      cancelFrame(update);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  // New page → start at the top, or jump to the hash target (e.g. /#book).
  useEffect(() => {
    const hash = window.location.hash;
    if (!lenis) return;
    if (hash) {
      const t = window.setTimeout(() => lenis.scrollTo(hash, { offset: -72, duration: 1.4, force: true }), 80);
      return () => window.clearTimeout(t);
    }
    lenis.scrollTo(0, { immediate: true, force: true });
  }, [pathname, lenis]);

  // Same-page hash links ("/#book" while on "/") glide with Lenis instead of jumping.
  useEffect(() => {
    if (!lenis) return;
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest("a");
      if (!a || e.metaKey || e.ctrlKey || e.shiftKey || a.target === "_blank") return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname !== window.location.pathname || !url.hash) return;
      const el = document.querySelector<HTMLElement>(url.hash);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el, { offset: -72, duration: 1.6, force: true });
      window.history.pushState(null, "", url.hash);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [lenis]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
