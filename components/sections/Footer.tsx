"use client";

/**
 * 13 — Footer (sticky reveal). The footer is fixed to the bottom of the viewport inside a clipped, in-flow spacer,
 * so the page above slides off to uncover it. The giant wordmark starts small + grey and scales up / darkens as it rises.
 */
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";
import { site } from "@/lib/site";

function useSubscribe() {
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
  return { state, subscribe };
}

/** Phone footer: a normal (non-sticky) footer — newsletter, collapsible link groups, wordmark. */
function Accordion({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-t border-ink/10">
      <button type="button" aria-expanded={open} onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between py-4 text-left text-[11px] font-semibold uppercase tracking-[0.2em]">
        {title}
        <span aria-hidden className="relative block h-3 w-3">
          <span className="absolute left-0 top-1/2 h-px w-full bg-current" />
          <span className={`absolute left-1/2 top-0 h-full w-px bg-current transition-transform duration-500 ${open ? "rotate-90" : ""}`} />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.ul initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden">
            {children}
            <li className="pb-3" />
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

function MobileFooter() {
  const { state, subscribe } = useSubscribe();
  const row = "block py-2 text-[15px] text-ink/80 active:text-ink";
  return (
    <footer className="bg-white text-ink md:hidden">
      <div className="container-x pt-12">
        <p className="eyebrow text-slate">Newsletter</p>
        <p className="mt-3 max-w-[22rem] text-[1.35rem] font-light leading-snug tracking-[-0.02em]">New cloths, collections and fitting dates — only when there is something worth saying.</p>
        <form onSubmit={subscribe} className="mt-6 flex items-end gap-4 border-b border-ink/40 pb-2">
          <input name="email" type="email" required autoComplete="email" placeholder="Your email" className="min-w-0 flex-1 bg-transparent py-2 text-base outline-none placeholder:text-mute" />
          <button disabled={state === "sending"} className="shrink-0 py-2 text-[11px] font-semibold uppercase tracking-[0.2em]">{state === "done" ? "Thank you" : state === "error" ? "Try again" : "Subscribe"}</button>
        </form>

        <div className="mt-10">
          <Accordion title="Customer care">
            <li><Link href="/#book" className={row}>Book a consultation</Link></li>
            <li><Link href="/contact" className={row}>Contact</Link></li>
            <li><Link href="/custom-made" className={row}>Custom made</Link></li>
            <li><Link href="/try-on" className={row}>Try on</Link></li>
            {site.phone && <li><a href={`tel:${site.phone}`} className={row}>{site.phone}</a></li>}
            {site.email && <li><a href={`mailto:${site.email}`} className={row}>{site.email}</a></li>}
          </Accordion>
          <Accordion title="Explore">
            <li><Link href="/shop" className={row}>Shop</Link></li>
            <li><Link href="/collections" className={row}>Collections</Link></li>
            <li><Link href="/about" className={row}>About</Link></li>
          </Accordion>
          <Accordion title="Follow us">
            <li><a href={site.instagram} target="_blank" rel="noopener noreferrer" className={row}>Instagram {site.handle}</a></li>
          </Accordion>
          <div className="border-t border-ink/10" />
        </div>

        <p className="mt-6 text-[13px] text-slate">{site.location}</p>
      </div>

      <p aria-hidden className="mt-8 overflow-hidden whitespace-nowrap text-center text-[19vw] font-extrabold uppercase leading-[0.85] tracking-[-0.06em] text-[#0B0B0D]">ORHANZA</p>
      <div className="container-x flex items-center gap-2 py-5 text-[11px] text-slate pb-[max(1.25rem,env(safe-area-inset-bottom))]">
        <svg viewBox="0 0 24 24" className="h-3 w-3 fill-gold" aria-hidden><rect x="5" y="5" width="14" height="14" /><rect x="5" y="5" width="14" height="14" transform="rotate(45 12 12)" /></svg>
        © {new Date().getFullYear()} Orhanza. All rights reserved.
      </div>
    </footer>
  );
}

export function Footer() {
  return (
    <>
      <MobileFooter />
      <DesktopFooter />
    </>
  );
}

function DesktopFooter() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const scale = useTransform(p, [0, 1], [0.55, 1]);
  const y = useTransform(p, [0, 1], ["30%", "-16%"]);
  const color = useTransform(p, [0, 0.7, 1], ["#C9C9CB", "#6B6B70", "#0B0B0D"]);
  const { state, subscribe } = useSubscribe();

  return (
    <footer ref={ref} className="relative hidden h-[100svh] bg-white md:block" style={{ clipPath: "inset(0)" }}>
      <div className="fixed bottom-0 left-0 flex h-[100svh] w-full flex-col justify-between overflow-hidden bg-white text-ink">
        <div className="relative flex-1 overflow-hidden">
          <motion.p aria-hidden style={{ scale, y, color }} className="absolute inset-x-0 bottom-0 origin-bottom whitespace-nowrap text-center text-[20vw] font-extrabold uppercase leading-[0.8] tracking-[-0.06em]">
            ORHANZA
          </motion.p>
        </div>

        <div className="container-x relative z-10 flex flex-col items-stretch justify-between gap-8 border-t hairline bg-white py-8 sm:flex-row sm:items-end">
          <form onSubmit={subscribe} className="flex w-full max-w-sm flex-col items-stretch gap-3 border-b border-ink/30 pb-2 sm:flex-row sm:items-end">
            <input name="email" type="email" required placeholder="Your email" className="w-full bg-transparent text-base outline-none placeholder:text-mute" />
            <button disabled={state === "sending"} className="group flex shrink-0 items-center justify-between gap-3 text-sm font-semibold sm:justify-start">{state === "done" ? "Thank you" : state === "error" ? "Try again" : "Subscribe"}<span className="block h-px w-8 bg-ink transition-all duration-500 group-hover:w-16" /></button>
          </form>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <li><Link href="/shop" className="hover:underline">Shop</Link></li>
            <li><Link href="/collections" className="hover:underline">Collections</Link></li>
            <li><a href={site.instagram} target="_blank" rel="noopener noreferrer" className="hover:underline">Instagram</a></li>
            <li><Link href="/contact" className="hover:underline">Contact</Link></li>
          </ul>
        </div>

        <div className="container-x flex flex-col items-start justify-between gap-2 bg-white py-4 text-[11px] text-slate sm:flex-row sm:items-center">
          <span className="flex items-center gap-2">
            <svg viewBox="0 0 24 24" className="h-3 w-3 fill-gold" aria-hidden><rect x="5" y="5" width="14" height="14" /><rect x="5" y="5" width="14" height="14" transform="rotate(45 12 12)" /></svg>
            © {new Date().getFullYear()} Orhanza. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}
