"use client";

import Link from "next/link";
import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import gsap from "gsap";
import styles from "./collection.module.css";

/* ------------------------------------------------------------------ */
/* RESERVE NOW                                                         */
/* No existing reserve/inquiry handler was available to hook into, so  */
/* this links to /collection/[slug]. To use a handler instead, pass    */
/* `onReserve` (renders a <button> rather than a link).                */
/* ------------------------------------------------------------------ */
export function ReserveButton({
  slug,
  onReserve,
  tabIndex,
}: {
  slug: string;
  onReserve?: (slug: string) => void;
  tabIndex?: number;
}) {
  if (onReserve) {
    return (
      <button
        type="button"
        className={styles.reserve}
        onClick={() => onReserve(slug)}
        tabIndex={tabIndex}
      >
        Reserve now
      </button>
    );
  }
  return (
    <Link href={`/collection/${slug}`} className={styles.reserve} tabIndex={tabIndex}>
      Reserve now
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/* Roller: vertical "slot" roll between two strings                    */
/* ------------------------------------------------------------------ */
export function Roller({
  value,
  className,
  reduced,
}: {
  value: string;
  className?: string;
  reduced?: boolean;
}) {
  const [shown, setShown] = useState(value);
  const [prev, setPrev] = useState<string | null>(null);
  const dirRef = useRef(1);
  const lastRef = useRef(value);
  const curRef = useRef<HTMLSpanElement>(null);
  const prevRef = useRef<HTMLSpanElement>(null);

  // value change -> start a roll (state updates happen before paint)
  useLayoutEffect(() => {
    if (value === lastRef.current) return;
    dirRef.current = value > lastRef.current ? 1 : -1;
    setPrev(lastRef.current);
    setShown(value);
    lastRef.current = value;
  }, [value]);

  useLayoutEffect(() => {
    if (prev === null || !curRef.current || !prevRef.current) return;
    const d = dirRef.current;
    if (reduced) {
      gsap.fromTo(curRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3, onComplete: () => setPrev(null) });
      return;
    }
    const tl = gsap.timeline({ onComplete: () => setPrev(null) });
    tl.fromTo(curRef.current, { yPercent: 100 * d }, { yPercent: 0, duration: 0.7, ease: "power3.out" }, 0);
    tl.fromTo(prevRef.current, { yPercent: 0 }, { yPercent: -100 * d, duration: 0.7, ease: "power3.out" }, 0);
    return () => {
      tl.kill();
    };
  }, [prev, reduced]);

  return (
    <span className={`${styles.roller} ${className ?? ""}`}>
      <span ref={curRef} className={styles.rollerCur}>
        {shown}
      </span>
      {prev !== null && (
        <span ref={prevRef} className={styles.rollerPrev} aria-hidden="true">
          {prev}
        </span>
      )}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* CrossFade: stacks old + new content and fades between them          */
/* ------------------------------------------------------------------ */
type Layer = { id: number; node: ReactNode };

export function CrossFade({
  id,
  children,
  className,
  duration = 0.55,
  reduced,
  live,
}: {
  /** Changes whenever `children` should cross-fade to something new. */
  id: string | number;
  children: ReactNode;
  className?: string;
  duration?: number;
  reduced?: boolean;
  live?: boolean;
}) {
  const seq = useRef(0);
  const lastId = useRef(id);
  const [layers, setLayers] = useState<Layer[]>([{ id: 0, node: children }]);
  const els = useRef(new Map<number, HTMLDivElement>());

  useLayoutEffect(() => {
    if (id === lastId.current) {
      // same logical content: keep the newest layer fresh (e.g. re-rendered props)
      setLayers((ls) => ls.map((l, i) => (i === ls.length - 1 ? { ...l, node: children } : l)));
      return;
    }
    lastId.current = id;
    seq.current += 1;
    setLayers((ls) => [...ls.slice(-1), { id: seq.current, node: children }]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useLayoutEffect(() => {
    if (layers.length < 2) return;
    const old = els.current.get(layers[0].id);
    const next = els.current.get(layers[1].id);
    if (!old || !next) return;
    const d = reduced ? 0.25 : duration;
    const tl = gsap.timeline({
      onComplete: () => setLayers((ls) => ls.slice(-1)),
    });
    tl.fromTo(next, { opacity: 0, y: reduced ? 0 : 10 }, { opacity: 1, y: 0, duration: d, ease: "power2.out" }, 0);
    tl.to(old, { opacity: 0, y: reduced ? 0 : -10, duration: d, ease: "power2.out" }, 0);
    return () => {
      tl.kill();
    };
  }, [layers, duration, reduced]);

  return (
    <div className={`${styles.crossfade} ${className ?? ""}`} aria-live={live ? "polite" : undefined} aria-atomic={live ? true : undefined}>
      {layers.map((l, i) => (
        <div
          key={l.id}
          ref={(el) => {
            if (el) els.current.set(l.id, el);
            else els.current.delete(l.id);
          }}
          className={i === 0 ? styles.crossfadeBase : styles.crossfadeTop}
          aria-hidden={layers.length > 1 && i === 0 ? true : undefined}
        >
          {l.node}
        </div>
      ))}
    </div>
  );
}
