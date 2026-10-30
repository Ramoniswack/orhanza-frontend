"use client";

/** 6 — Showreel: ExpandOnScroll block. There is no film yet, so "play" replays the hero frame sequence at 24fps (swap in a <video> later). */
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ExpandOnScroll } from "@/components/motion";
import frames from "@/lib/frames.json";

const COUNT = frames.count;

export function Showreel() {
  const [playing, setPlaying] = useState(false);
  const [frame, setFrame] = useState(COUNT - 1);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => { if (timer.current) clearInterval(timer.current); }, []);

  const play = () => {
    if (playing) return;
    setPlaying(true);
    let f = 0;
    setFrame(0);
    timer.current = setInterval(() => {
      f++;
      if (f >= COUNT) {
        if (timer.current) clearInterval(timer.current);
        setPlaying(false);
        setFrame(COUNT - 1);
        return;
      }
      setFrame(f);
    }, 1000 / 24);
  };

  return (
    <section className="bg-white" aria-label="Showreel">
      <ExpandOnScroll className="h-[110svh]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/frames/frame-${String(frame + 1).padStart(4, "0")}.webp`} alt="Orhanza showreel — a tailored navy suit" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/25" />
        <p className="label-micro absolute left-6 top-24 text-ivory">ORHANZA / THE FIT</p>
        <AnimatePresence>
          {!playing && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.08 }}
              onClick={play}
              aria-label="Play showreel"
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <svg viewBox="0 0 100 100" className="h-24 w-24 md:h-36 md:w-36" fill="none" stroke="#EDE5D6" strokeWidth="1.5"><path d="M30 18 L82 50 L30 82 Z" strokeLinejoin="round" /></svg>
            </motion.button>
          )}
        </AnimatePresence>
      </ExpandOnScroll>
    </section>
  );
}
