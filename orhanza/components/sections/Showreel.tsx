"use client";

/** 6 — Showreel: the atelier film, autoplaying muted + looped inside the ExpandOnScroll block. Pauses when off-screen. */
import { useEffect, useRef } from "react";
import { useInView } from "motion/react";
import { ExpandOnScroll, LineMaskReveal } from "@/components/motion";

export function Showreel() {
  const wrap = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const near = useInView(wrap, { margin: "30% 0px 30% 0px" });

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (near) v.play().catch(() => {});
    else v.pause();
  }, [near]);

  return (
    <section className="bg-white" aria-label="Showreel">
      <ExpandOnScroll className="h-[100svh]">
        <div ref={wrap} className="h-full w-full bg-black">
          <video
            ref={video}
            src="/videos/showreel.mp4"
            poster="/videos/showreel-poster.jpg"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-label="A tailor measuring a client in the Orhanza atelier"
            className="h-full w-full object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
          <div className="absolute inset-x-0 bottom-0 pb-8 text-ivory md:pb-12">
            <div className="container-x">
              <LineMaskReveal as="p" className="text-[clamp(1.6rem,3.6vw,3.5rem)] font-semibold leading-[1.02] tracking-[-0.04em]" lines={["Measured twice.", "Cut once."]} />
            </div>
          </div>
        </div>
      </ExpandOnScroll>
    </section>
  );
}
