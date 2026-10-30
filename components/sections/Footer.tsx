"use client";

/**
 * 13 — Footer (sticky reveal). The footer is fixed to the bottom of the viewport inside a clipped, in-flow spacer,
 * so the page above slides off to uncover it. The giant wordmark starts small + grey and scales up / darkens as it rises.
 */
import { motion, useScroll, useTransform } from "motion/react";
import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";
import { site } from "@/lib/site";

export function Footer() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const scale = useTransform(p, [0, 1], [0.55, 1]);
  const y = useTransform(p, [0, 1], ["30%", "-16%"]);
  const color = useTransform(p, [0, 0.7, 1], ["#C9C9CB", "#6B6B70", "#0B0B0D"]);
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function subscribe(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = String(new FormData(form).get("email") ?? "");
    setState("sending");
    try {
      const r = await fetch("/api/subscribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      if (!r.ok) throw new Error();
      setState("done");
      form.reset();
    } catch { setState("error"); }
  }

  return (
    <footer ref={ref} className="relative h-[100svh] bg-white" style={{ clipPath: "inset(0)" }}>
      <div className="fixed bottom-0 left-0 flex h-[100svh] w-full flex-col justify-between overflow-hidden bg-white text-ink">
        <div className="relative flex-1 overflow-hidden">
          <motion.p aria-hidden style={{ scale, y, color }} className="absolute inset-x-0 bottom-0 origin-bottom whitespace-nowrap text-center text-[20vw] font-extrabold uppercase leading-[0.8] tracking-[-0.06em]">
            ORHANZA
          </motion.p>
        </div>

        <div className="container-x relative z-10 flex flex-wrap items-end justify-between gap-8 border-t hairline bg-white py-8">
          <form onSubmit={subscribe} className="flex w-full max-w-sm items-end gap-4 border-b border-ink/30 pb-2">
            <input name="email" type="email" required placeholder="Your email" className="w-full bg-transparent text-base outline-none placeholder:text-mute" />
            <button disabled={state === "sending"} className="group flex shrink-0 items-center gap-3 text-sm font-semibold">{state === "done" ? "Thank you" : state === "error" ? "Try again" : "Subscribe"}<span className="block h-px w-8 bg-ink transition-all duration-500 group-hover:w-16" /></button>
          </form>
          <ul className="flex gap-6 text-sm">
            <li><Link href="/collections" className="hover:underline">Collections</Link></li>
            <li><a href={site.instagram} target="_blank" rel="noopener noreferrer" className="hover:underline">Instagram</a></li>
            <li><Link href="/#book" className="hover:underline">Contact</Link></li>
          </ul>
        </div>

        <div className="container-x flex items-center justify-between gap-4 bg-white py-4 text-[11px] text-slate">
          <span className="flex items-center gap-2">
            <svg viewBox="0 0 24 24" className="h-3 w-3 fill-gold" aria-hidden><rect x="5" y="5" width="14" height="14" /><rect x="5" y="5" width="14" height="14" transform="rotate(45 12 12)" /></svg>
            © {new Date().getFullYear()} Orhanza. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}
