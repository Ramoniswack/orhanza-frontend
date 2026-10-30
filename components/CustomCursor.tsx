"use client";

/**
 * Custom cursor (replaces the default arrow on mouse devices): a small dot that follows instantly + a ring that trails on a spring.
 * The ring grows over links/buttons and the whole cursor hides over text fields (they keep the native I-beam). Touch devices are untouched.
 */
import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";

const INTERACTIVE = "a, button, [role='button'], summary, label, select, [data-cursor='hover']";
const FIELD = "input, textarea";

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hover, setHover] = useState(false);
  const [down, setDown] = useState(false);
  const [field, setField] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 260, damping: 26, mass: 0.5 });
  const ry = useSpring(y, { stiffness: 260, damping: 26, mass: 0.5 });

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
    document.documentElement.classList.add("has-cursor");

    const move = (e: MouseEvent) => {
      x.set(e.clientX); y.set(e.clientY);
      setVisible(true);
      const t = e.target as Element | null;
      setField(!!t?.closest(FIELD));
      setHover(!!t?.closest(INTERACTIVE));
    };
    const leave = () => setVisible(false);
    const enter = () => setVisible(true);
    const dn = () => setDown(true);
    const up = () => setDown(false);

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mousedown", dn);
    window.addEventListener("mouseup", up);
    document.documentElement.addEventListener("mouseleave", leave);
    document.documentElement.addEventListener("mouseenter", enter);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", dn);
      window.removeEventListener("mouseup", up);
      document.documentElement.removeEventListener("mouseleave", leave);
      document.documentElement.removeEventListener("mouseenter", enter);
    };
  }, [x, y]);

  if (!enabled) return null;
  const show = visible && !field;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[9999] mix-blend-difference">
      <motion.div style={{ x: rx, y: ry }} className="absolute left-0 top-0">
        <motion.div
          animate={{ scale: !show ? 0 : down ? 0.8 : hover ? 1.9 : 1, opacity: show ? 1 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
          className="-ml-[18px] -mt-[18px] h-9 w-9 rounded-full border border-white"
          style={{ background: hover ? "rgba(255,255,255,1)" : "transparent" }}
        />
      </motion.div>
      <motion.div style={{ x, y }} className="absolute left-0 top-0">
        <motion.div animate={{ scale: show && !hover ? 1 : 0 }} transition={{ duration: 0.15 }} className="-ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full bg-white" />
      </motion.div>
    </div>
  );
}
