"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import gsap from "gsap";
import type { CollectionItem } from "@/data/collection";
import { ModelTransition, type Rect } from "./webglTransition";
import { hasWebGL, pad2, preloadImages, useIsMobile, wrap } from "./hooks";
import { ReserveButton, Roller } from "./ui";
import styles from "./collection.module.css";

const AUTOPLAY_MS = 2500;
const TRANSITION_S = 1.1;
const MODEL_ASPECT = 848 / 1264; // width / height of the cutout PNGs

type Mode = "pending" | "webgl" | "css";
type Side = "left" | "right"; // side the TEXT sits on

const sideOf = (index: number): Side => (index % 2 === 0 ? "left" : "right");

/** Where the model for `index` sits inside the stage (css px). */
function modelRect(index: number, w: number, h: number, mobile: boolean): Rect {
  const mh = mobile ? h : h * 1.0;
  const mw = mh * MODEL_ASPECT;
  const cx = mobile ? w / 2 : sideOf(index) === "left" ? w * 0.67 : w * 0.33;
  return { x: cx - mw / 2, y: mobile ? 0 : h - mh, w: mw, h: mh };
}

type Props = {
  items: CollectionItem[];
  startIndex: number;
  onIndexChange: (i: number) => void;
  reduced: boolean;
  autoplay?: boolean;
  onReserve?: (slug: string) => void;
};

export default function Showcase({
  items,
  startIndex,
  onIndexChange,
  reduced,
  autoplay = true,
  onReserve,
}: Props) {
  const N = items.length;
  const mobile = useIsMobile();

  const rootRef = useRef<HTMLElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // "pending" renders identically on server and client; the WebGL effect then
  // promotes it to "webgl" or drops it to the plain CSS crossfade.
  const [mode, setMode] = useState<Mode>("pending");
  const [shown, setShown] = useState(wrap(startIndex, N)); // drives text / counter / rail
  const [cssModel, setCssModel] = useState(wrap(startIndex, N)); // drives the CSS crossfade
  const [size, setSize] = useState({ w: 0, h: 0 });

  // mutable engine state (kept out of React so ticks never re-render)
  const curRef = useRef(wrap(startIndex, N)); // index currently resting on the canvas
  const animatingRef = useRef(false);
  const pendingRef = useRef<number | null>(null);
  const progRef = useRef({ t: 0 });
  const sizeRef = useRef({ w: 0, h: 0 });
  const mobileRef = useRef(mobile);
  const glRef = useRef<ModelTransition | null>(null);
  const modeRef = useRef<Mode>(mode);
  const hoverRef = useRef(false);
  const autoRef = useRef<gsap.core.Tween | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const firstRender = useRef(true);
  const lastIdx = useRef<{ from: number; to: number }>({ from: curRef.current, to: curRef.current });

  mobileRef.current = mobile;
  modeRef.current = mode;
  const dur = reduced ? 0.01 : TRANSITION_S;

  /* ---------------------------------------------------------------- */
  /* drawing                                                           */
  /* ---------------------------------------------------------------- */
  const draw = useCallback((from: number, to: number, t: number, seed?: [number, number]) => {
    const gl = glRef.current;
    const { w, h } = sizeRef.current;
    if (!gl || !w || !h) return;
    lastIdx.current = { from, to };
    gl.draw(from, to, modelRect(from, w, h, mobileRef.current), modelRect(to, w, h, mobileRef.current), t, seed);
  }, []);

  /* ---------------------------------------------------------------- */
  /* autoplay                                                          */
  /* ---------------------------------------------------------------- */
  const killAuto = () => {
    autoRef.current?.kill();
    autoRef.current = null;
  };

  const go = useCallback(
    (target: number) => {
      target = wrap(target, N);
      if (animatingRef.current) {
        pendingRef.current = target;
        return;
      }
      if (target === curRef.current) return;
      const root = rootRef.current;
      if (!root) return;

      animatingRef.current = true;
      autoRef.current?.kill();
      autoRef.current = null;
      const from = curRef.current;
      const useGL = modeRef.current === "webgl" && !!glRef.current;

      const outEls = root.querySelectorAll("[data-stagger]");
      const blockEls = root.querySelectorAll("[data-block]");

      const tl = gsap.timeline({
        onComplete: () => {
          curRef.current = target;
          onIndexChange(target);
          progRef.current.t = 0;
          if (useGL) draw(target, target, 0);
          animatingRef.current = false;
          tlRef.current = null;
          const next = pendingRef.current;
          pendingRef.current = null;
          if (next !== null && next !== target) go(next);
          else scheduleRef.current();
        },
      });
      tlRef.current = tl;

      // text + counter + rail leave quickly
      tl.to(outEls, { opacity: 0, y: reduced ? 0 : -12, duration: reduced ? 0.15 : 0.28, ease: "power2.in" }, 0);
      tl.to(blockEls, { opacity: 0, y: reduced ? 0 : -12, duration: reduced ? 0.15 : 0.28, ease: "power2.in" }, 0);

      if (useGL) {
        const seed: [number, number] = [Math.random() * 40, Math.random() * 40];
        progRef.current.t = 0;
        tl.to(
          progRef.current,
          {
            t: 1,
            duration: dur,
            ease: "power3.inOut",
            onUpdate: () => draw(from, target, progRef.current.t, seed),
          },
          0
        );
      } else {
        tl.call(() => setCssModel(target), undefined, 0);
        tl.to({}, { duration: reduced ? 0.4 : 0.6 }, 0); // hold the timeline for the CSS crossfade
      }

      // swap content (and the side it sits on) while it is invisible, then stagger in
      tl.call(() => setShown(target), undefined, reduced ? 0.15 : 0.42);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [N, dur, reduced, draw, onIndexChange]
  );

  const scheduleRef = useRef<() => void>(() => {});
  scheduleRef.current = () => {
    autoRef.current?.kill();
    autoRef.current = null;
    if (!autoplay || reduced || hoverRef.current || modeRef.current === "pending") return;
    if (typeof document !== "undefined" && document.hidden) return;
    autoRef.current = gsap.delayedCall(AUTOPLAY_MS / 1000, () => go(curRef.current + 1));
  };

  const next = useCallback(() => go((pendingRef.current ?? curRef.current) + 1), [go]);
  const prev = useCallback(() => go((pendingRef.current ?? curRef.current) - 1), [go]);

  /* ---------------------------------------------------------------- */
  /* stagger-in after content swap                                     */
  /* ---------------------------------------------------------------- */
  useLayoutEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const root = rootRef.current;
    if (!root) return;
    const y = reduced ? 0 : 24;
    const text = root.querySelectorAll("[data-stagger]");
    const blocks = root.querySelectorAll("[data-block]");
    const ctx = gsap.context(() => {
      gsap.fromTo(
        text,
        { opacity: 0, y },
        { opacity: 1, y: 0, duration: reduced ? 0.2 : 0.65, ease: "power3.out", stagger: reduced ? 0 : 0.06 }
      );
      gsap.fromTo(
        blocks,
        { opacity: 0, y },
        { opacity: 1, y: 0, duration: reduced ? 0.2 : 0.65, ease: "power3.out", delay: reduced ? 0 : 0.18, stagger: reduced ? 0 : 0.08 }
      );
    }, root);
    return () => ctx.revert();
  }, [shown, reduced]);

  /* ---------------------------------------------------------------- */
  /* WebGL lazy init                                                   */
  /* ---------------------------------------------------------------- */
  useEffect(() => {
    if (reduced || !hasWebGL()) {
      setMode("css");
      return;
    }
    let cancelled = false;
    let inst: ModelTransition | null = null;

    (async () => {
      const images = await preloadImages(items.map((i) => i.modelImage));
      if (cancelled || !canvasRef.current) return;
      try {
        inst = await ModelTransition.create(canvasRef.current, images, () => {
          glRef.current = null;
          setMode("css");
        });
      } catch {
        if (!cancelled) setMode("css");
        return;
      }
      if (cancelled) {
        inst.destroy();
        return;
      }
      glRef.current = inst;
      const { w, h } = sizeRef.current;
      if (w && h) inst.resize(w, h);
      draw(curRef.current, curRef.current, 0, [Math.random() * 40, Math.random() * 40]);
      setMode("webgl");
    })();

    return () => {
      cancelled = true;
      glRef.current = null;
      inst?.destroy();
    };
  }, [items, reduced, draw]);

  // if the user flips reduced-motion while mounted, drop to the CSS path
  useEffect(() => {
    if (reduced) setMode("css");
  }, [reduced]);

  /* ---------------------------------------------------------------- */
  /* resize                                                            */
  /* ---------------------------------------------------------------- */
  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      const w = Math.round(r.width);
      const h = Math.round(r.height);
      if (w === sizeRef.current.w && h === sizeRef.current.h) return;
      sizeRef.current = { w, h };
      setSize({ w, h });
      glRef.current?.resize(w, h);
      const { from, to } = lastIdx.current;
      if (glRef.current) draw(from, to, animatingRef.current ? progRef.current.t : 0);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [draw]);

  // geometry depends on mobile layout too
  useEffect(() => {
    if (glRef.current && !animatingRef.current) draw(curRef.current, curRef.current, 0);
  }, [mobile, draw]);

  /* ---------------------------------------------------------------- */
  /* autoplay lifecycle, keyboard, swipe, visibility                   */
  /* ---------------------------------------------------------------- */
  useEffect(() => {
    scheduleRef.current();
    return () => { autoRef.current?.kill(); };
  }, [mode, autoplay, reduced]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      if (e.key === "ArrowRight") {
        next();
      } else if (e.key === "ArrowLeft") {
        prev();
      } else return;
    };
    const onVis = () => (document.hidden ? killAuto() : scheduleRef.current());
    window.addEventListener("keydown", onKey);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [next, prev]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    let sx = 0,
      sy = 0,
      id = -1;
    const down = (e: PointerEvent) => {
      if (e.pointerType === "mouse") return;
      sx = e.clientX;
      sy = e.clientY;
      id = e.pointerId;
    };
    const up = (e: PointerEvent) => {
      if (e.pointerId !== id) return;
      id = -1;
      const dx = e.clientX - sx;
      const dy = e.clientY - sy;
      if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.4) (dx < 0 ? next : prev)();
    };
    const cancel = () => (id = -1);
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", cancel);
    return () => {
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", cancel);
    };
  }, [next, prev]);

  // unmount: stop everything, hand the index back
  useEffect(
    () => () => {
      tlRef.current?.kill();
      autoRef.current?.kill();
      onIndexChange(curRef.current);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  /* ---------------------------------------------------------------- */
  /* render                                                            */
  /* ---------------------------------------------------------------- */
  const item = items[shown];
  const upNext = items[wrap(shown + 1, N)];
  const side = sideOf(shown);

  const onEnter = (e: ReactPointerEvent) => {
    if (e.pointerType !== "mouse") return;
    hoverRef.current = true;
    killAuto();
  };
  const onLeave = (e: ReactPointerEvent) => {
    if (e.pointerType !== "mouse") return;
    hoverRef.current = false;
    if (!animatingRef.current) scheduleRef.current();
  };

  return (
    <section
      ref={rootRef}
      className={styles.showcase}
      data-side={side}
      data-mode={mode}
      aria-roledescription="carousel"
      aria-label="ORHANZA collection showcase"
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
    >
      {/* models: one WebGL canvas, or stacked <img>s for the CSS fallback */}
      <div ref={wrapRef} className={styles.modelWrap}>
        {mode !== "css" && (
          <canvas
            ref={canvasRef}
            className={styles.modelCanvas}
            data-ready={mode === "webgl"}
            role="img"
            aria-label={`${item.title}, model wearing the piece`}
          />
        )}
        {mode !== "webgl" &&
          size.w > 0 &&
          items.map((it, i) => {
            const r = modelRect(i, size.w, size.h, mobile);
            return (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={it.slug}
                src={it.modelImage}
                alt={i === cssModel ? `${it.title}, model wearing the piece` : ""}
                aria-hidden={i === cssModel ? undefined : true}
                className={`${styles.modelImg} ${i === cssModel ? styles.modelImgOn : ""}`}
                style={{ left: r.x, top: r.y, width: r.w, height: r.h }}
                draggable={false}
                decoding="async"
              />
            );
          })}
      </div>

      {/* text block */}
      <div className={styles.textBlock}>
        <p className={styles.eyebrow} data-stagger>
          <span aria-hidden="true">——</span> Details
        </p>
        <h2 className={styles.title} data-stagger aria-live="polite" aria-atomic="true">
          {item.title}
        </h2>
        <p className={styles.desc} data-stagger>
          {item.description}
        </p>
        <p className={styles.price} data-stagger>
          {item.price}
        </p>
        <div data-stagger className={styles.cta}>
          <ReserveButton slug={item.slug} onReserve={onReserve} />
        </div>
      </div>

      {/* counter card (text side) */}
      <div className={styles.counterCard} data-block>
        <div>
          <p className={styles.counterLabel}>New arrivals</p>
          <p className={styles.counterNum} aria-label={`Slide ${shown + 1} of ${N}`}>
            <Roller value={pad2(shown + 1)} reduced={reduced} />
            <span className={styles.counterTotal}> / {pad2(N)}</span>
          </p>
        </div>
        <svg className={styles.dots} width="6" height="22" viewBox="0 0 6 22" aria-hidden="true">
          <circle cx="3" cy="3" r="2.2" />
          <circle cx="3" cy="11" r="2.2" />
          <circle cx="3" cy="19" r="2.2" />
        </svg>
      </div>

      {/* thumbnail rail (opposite edge) */}
      <div className={styles.rail} data-block>
        <div className={styles.railThumbs}>
          <button
            type="button"
            className={`${styles.thumb} ${styles.thumbCurrent}`}
            aria-current="true"
            aria-label={`Current: ${item.title}`}
            tabIndex={-1}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.thumbImage} alt={`${item.title} flat lay`} draggable={false} />
          </button>
          <button
            type="button"
            className={styles.thumb}
            onClick={() => go(shown + 1)}
            aria-label={`Next: ${upNext.title}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={upNext.thumbImage} alt={`${upNext.title} flat lay`} draggable={false} />
            <span className={styles.nextBadge}>Next</span>
          </button>
        </div>
        <div className={styles.railArrows}>
          <button type="button" onClick={prev} aria-label="Previous slide">
            ‹
          </button>
          <button type="button" onClick={next} aria-label="Next slide">
            ›
          </button>
        </div>
      </div>
    </section>
  );
}
