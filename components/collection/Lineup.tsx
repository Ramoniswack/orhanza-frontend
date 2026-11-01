"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import type { CollectionItem } from "@/data/collection";
import { pad2, preloadImages, useIsMobile, wrap } from "./hooks";
import { CrossFade, ReserveButton } from "./ui";
import styles from "./collection.module.css";

const MODEL_ASPECT = 848 / 1264;
const SNAP_S = 0.9;

type Props = {
  items: CollectionItem[];
  startIndex: number;
  onIndexChange: (i: number) => void;
  reduced: boolean;
  onReserve?: (slug: string) => void;
};

/** depth steps: index 0 = front model, last entry = hidden "waiting" slot at the back */
function depthTable(mobile: boolean) {
  return mobile
    ? {
        scale: [1, 0.82, 0.66, 0.5],
        blur: [0, 2, 4, 6],
        opacity: [1, 0.75, 0.5, 0],
        gray: [0, 0.5, 1, 1],
        dx: [0, 0.85, 1.5, 1.9], // in units of the model's visible width
        dy: [0, -10, -20, -30],
      }
    : {
        scale: [1, 0.88, 0.78, 0.68, 0.6, 0.52],
        blur: [0, 2, 4, 6, 8, 10],
        opacity: [1, 0.8, 0.6, 0.45, 0.3, 0],
        gray: [0, 0.25, 0.5, 0.75, 1, 1],
        dx: [0, 0.9, 1.6, 2.15, 2.55, 2.85],
        dy: [0, -12, -24, -36, -48, -60],
      };
}

const CHEV = {
  left: "M9 2.5 4.5 7 9 11.5",
  right: "M5 2.5 9.5 7 5 11.5",
  up: "M2.5 9 7 4.5 11.5 9",
  down: "M2.5 5 7 9.5 11.5 5",
} as const;

function Chevron({ dir }: { dir: keyof typeof CHEV }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
      <path d={CHEV[dir]} />
    </svg>
  );
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** relative slot of item i for a continuous position p: [-1, N-1) */
function rel(i: number, p: number, N: number) {
  let r = (((i - p) % N) + N) % N;
  if (r >= N - 1) r -= N;
  return r;
}

export default function Lineup({ items, startIndex, onIndexChange, reduced, onReserve }: Props) {
  const N = items.length;
  const mobile = useIsMobile();

  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const imgRefs = useRef<(HTMLImageElement | null)[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const listRef = useRef<HTMLDivElement>(null);

  const [active, setActive] = useState(wrap(startIndex, N));
  const [ready, setReady] = useState(false);

  const posRef = useRef({ v: wrap(startIndex, N) });
  const targetRef = useRef(wrap(startIndex, N));
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const activeRef = useRef(active);
  const geo = useRef({ w: 0, h: 0, mh: 0, mw: 0, u: 0, pitch: 0, visible: 0 });
  const mobileRef = useRef(mobile);
  mobileRef.current = mobile;

  /* ---------------------------------------------------------------- */
  /* paint: every model + list card is a pure function of position     */
  /* ---------------------------------------------------------------- */
  const render = useCallback(() => {
    const p = posRef.current.v;
    const g = geo.current;
    if (!g.w) return;
    const T = depthTable(mobileRef.current);
    const last = T.scale.length - 1;
    const cx = g.w * (mobileRef.current ? 0.64 : 0.7);

    for (let i = 0; i < N; i++) {
      const el = imgRefs.current[i];
      if (!el) continue;
      const r = rel(i, p, N);

      let s: number, b: number, o: number, gr: number, dx: number, dy: number;
      if (r < 0) {
        // leaving: slides out to the right and fades
        const t = -r;
        s = lerp(T.scale[0], 1.04, t);
        b = 0;
        o = 1 - t;
        gr = 0;
        dx = lerp(0, 1.7, t) * g.u;
        dy = 0;
      } else if (r >= last) {
        el.style.visibility = "hidden";
        continue;
      } else {
        const k = Math.floor(r);
        const f = r - k;
        s = lerp(T.scale[k], T.scale[k + 1], f);
        b = lerp(T.blur[k], T.blur[k + 1], f);
        o = lerp(T.opacity[k], T.opacity[k + 1], f);
        gr = lerp(T.gray[k], T.gray[k + 1], f);
        dx = -lerp(T.dx[k], T.dx[k + 1], f) * g.u;
        dy = lerp(T.dy[k], T.dy[k + 1], f);
      }
      if (o <= 0.004) {
        el.style.visibility = "hidden";
        continue;
      }
      el.style.visibility = "visible";
      el.style.opacity = o.toFixed(3);
      el.style.transform = `translate3d(${(cx - g.mw / 2 + dx).toFixed(1)}px, ${dy.toFixed(1)}px, 0) scale(${s.toFixed(4)})`;
      el.style.filter = b > 0.05 || gr > 0.01 ? `blur(${b.toFixed(2)}px) grayscale(${gr.toFixed(3)})` : "none";
      el.style.zIndex = String(100 - Math.round(r * 10));
    }

    // product list: scrolls one card per step
    const horizontal = mobileRef.current;
    for (let i = 0; i < N; i++) {
      const el = cardRefs.current[i];
      if (!el) continue;
      const r = rel(i, p, N);
      if (r > g.visible + 0.01) {
        el.style.visibility = "hidden";
        continue;
      }
      el.style.visibility = "visible";
      const pos = r * g.pitch;
      el.style.transform = horizontal ? `translate3d(${pos.toFixed(1)}px,0,0)` : `translate3d(0,${pos.toFixed(1)}px,0)`;
      el.style.opacity = String(r < 0 ? Math.max(0, 1 + r) : 1);
    }

    const a = wrap(Math.round(p), N);
    if (a !== activeRef.current) {
      activeRef.current = a;
      setActive(a);
      onIndexChange(a);
    }
  }, [N, onIndexChange]);

  /* ---------------------------------------------------------------- */
  /* measure                                                           */
  /* ---------------------------------------------------------------- */
  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const measure = () => {
      const w = stage.clientWidth;
      const h = stage.clientHeight;
      const mh = h * (mobileRef.current ? 0.84 : 0.88);
      const mw = mh * MODEL_ASPECT;
      const card = cardRefs.current[0];
      const view = listRef.current;
      let pitch = 0;
      let visible = 0;
      if (card && view) {
        const horizontal = mobileRef.current;
        const gap = 10;
        pitch = (horizontal ? card.offsetWidth : card.offsetHeight) + gap;
        const span = horizontal ? view.clientWidth : view.clientHeight;
        visible = Math.ceil(span / pitch) + 0.5;
      }
      geo.current = { w, h, mh, mw, u: mh * 0.26, pitch, visible };
      stage.style.setProperty("--model-w", `${mw}px`);
      stage.style.setProperty("--model-h", `${mh}px`);
      render();
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(stage);
    if (listRef.current) ro.observe(listRef.current);
    return () => ro.disconnect();
  }, [render, mobile]);

  /* preload, then reveal */
  useEffect(() => {
    let alive = true;
    preloadImages([...items.map((i) => i.modelImage), ...items.map((i) => i.thumbImage)]).then(() => {
      if (alive) setReady(true);
    });
    return () => {
      alive = false;
    };
  }, [items]);

  /* ---------------------------------------------------------------- */
  /* motion                                                            */
  /* ---------------------------------------------------------------- */
  const animateTo = useCallback(
    (target: number, duration = SNAP_S) => {
      targetRef.current = target;
      tweenRef.current?.kill();
      tweenRef.current = gsap.to(posRef.current, {
        v: target,
        duration: reduced ? 0.01 : duration,
        ease: "power3.out",
        onUpdate: render,
        onComplete: render,
      });
    },
    [render, reduced]
  );

  const step = useCallback(
    (dir: 1 | -1) => {
      const base = tweenRef.current?.isActive() ? targetRef.current : Math.round(posRef.current.v);
      animateTo(base + dir);
    },
    [animateTo]
  );

  const goTo = useCallback(
    (index: number) => {
      const cur = Math.round(posRef.current.v);
      let d = wrap(index, N) - wrap(cur, N);
      if (d > N / 2) d -= N;
      if (d < -N / 2) d += N;
      if (d !== 0) animateTo(cur + d, Math.min(1.4, SNAP_S + Math.abs(d) * 0.08));
    },
    [N, animateTo]
  );

  /* drag / swipe with momentum + snapping, wheel / trackpad, keyboard */
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const perItem = () => (mobileRef.current ? 150 : 240); // px of drag per item
    let dragging = false;
    let startX = 0;
    let startPos = 0;
    let lastX = 0;
    let lastT = 0;
    let vel = 0; // items / second
    let id = -1;

    const down = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      dragging = true;
      id = e.pointerId;
      startX = lastX = e.clientX;
      startPos = posRef.current.v;
      lastT = performance.now();
      vel = 0;
      tweenRef.current?.kill();
      stage.setPointerCapture?.(e.pointerId);
      stage.dataset.dragging = "true";
    };
    const move = (e: PointerEvent) => {
      if (!dragging || e.pointerId !== id) return;
      const now = performance.now();
      const dt = Math.max(1, now - lastT) / 1000;
      const inst = (e.clientX - lastX) / perItem() / dt;
      vel = vel * 0.7 + inst * 0.3;
      lastX = e.clientX;
      lastT = now;
      posRef.current.v = startPos + (e.clientX - startX) / perItem();
      render();
    };
    const up = (e: PointerEvent) => {
      if (!dragging || e.pointerId !== id) return;
      dragging = false;
      delete stage.dataset.dragging;
      stage.releasePointerCapture?.(e.pointerId);
      // a pause before release kills the momentum
      if (performance.now() - lastT > 90) vel = 0;
      const projected = posRef.current.v + Math.max(-4, Math.min(4, vel * 0.28));
      const target = Math.round(projected);
      animateTo(target, Math.min(1.4, SNAP_S + Math.abs(target - posRef.current.v) * 0.1));
    };

    let acc = 0;
    let lockUntil = 0;
    let idle: ReturnType<typeof setTimeout> | undefined;
    const wheel = (e: WheelEvent) => {
      e.preventDefault();
      const now = performance.now();
      if (now < lockUntil) return;
      acc += Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      clearTimeout(idle);
      idle = setTimeout(() => (acc = 0), 180);
      if (Math.abs(acc) > 48) {
        step(acc > 0 ? 1 : -1);
        acc = 0;
        lockUntil = now + 650;
      }
    };

    const key = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    };

    stage.addEventListener("pointerdown", down);
    stage.addEventListener("pointermove", move);
    stage.addEventListener("pointerup", up);
    stage.addEventListener("pointercancel", up);
    stage.addEventListener("wheel", wheel, { passive: false });
    window.addEventListener("keydown", key);
    return () => {
      stage.removeEventListener("pointerdown", down);
      stage.removeEventListener("pointermove", move);
      stage.removeEventListener("pointerup", up);
      stage.removeEventListener("pointercancel", up);
      stage.removeEventListener("wheel", wheel);
      window.removeEventListener("keydown", key);
      clearTimeout(idle);
    };
  }, [render, animateTo, step]);

  useEffect(
    () => () => {
      tweenRef.current?.kill();
      onIndexChange(activeRef.current);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  /* ---------------------------------------------------------------- */
  const item = items[active];
  const nextIdx = wrap(active + 1, N);

  return (
    <section
      ref={rootRef}
      className={styles.lineup}
      data-ready={ready}
      aria-roledescription="carousel"
      aria-label="ORHANZA collection lineup"
    >
      <div className={styles.lineupTop}>
        <CrossFade id={active} className={styles.lineupInfo} reduced={reduced} live>
          <h2 className={styles.lineupTitle}>{item.title}</h2>
          <ReserveButton slug={item.slug} onReserve={onReserve} />
        </CrossFade>
        <CrossFade id={active} className={styles.pill} reduced={reduced}>
          <span aria-label={`Item ${active + 1} of ${N}`}>
            {active + 1} / {N}
          </span>
        </CrossFade>
      </div>

      <div ref={stageRef} className={styles.lineStage}>
        <div className={styles.baseline} aria-hidden="true" />
        {items.map((it, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={it.slug}
            ref={(el) => {
              imgRefs.current[i] = el;
            }}
            src={it.modelImage}
            alt={i === active ? `${it.title}, model wearing the piece` : ""}
            aria-hidden={i === active ? undefined : true}
            className={styles.lineModel}
            draggable={false}
            decoding="async"
          />
        ))}
      </div>

      <aside className={styles.listWrap} aria-label="Products">
        <div className={styles.listFrame}>
          <div ref={listRef} className={styles.listViewport}>
            {items.map((it, i) => (
              <div
                key={it.slug}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                className={styles.card}
                data-active={i === active}
              >
                <button
                  type="button"
                  className={styles.cardBtn}
                  onClick={() => goTo(i)}
                  aria-label={`${it.title}, ${it.price}`}
                  aria-current={i === active ? "true" : undefined}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={it.thumbImage} alt="" draggable={false} />
                  <span className={styles.cardText}>
                    <span className={styles.cardName}>{it.title}</span>
                    <span className={styles.cardPrice}>{it.price}</span>
                  </span>
                  {i === nextIdx && <span className={styles.cardTag}>Next</span>}
                </button>
              </div>
            ))}
          </div>
          <div className={styles.listArrows}>
            <button type="button" onClick={() => step(-1)} aria-label="Previous product">
              <Chevron dir={mobile ? "left" : "up"} />
            </button>
            <button type="button" onClick={() => step(1)} aria-label="Next product">
              <Chevron dir={mobile ? "right" : "down"} />
            </button>
          </div>
        </div>
        <p className={styles.dragPill}>Drag or scroll</p>
      </aside>
    </section>
  );
}
