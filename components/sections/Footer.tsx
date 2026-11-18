"use client";

/**
 * 13 — Footer (sticky reveal). The footer is fixed to the bottom of the viewport inside a clipped, in-flow spacer,
 * so the page above slides off to uncover it. The giant wordmark starts small + grey and scales up / darkens as it rises.
 */
import { motion, useScroll, useTransform } from "motion/react";
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

const groups: { title: string; links: { label: string; href: string; external?: boolean; desktopOnly?: boolean }[] }[] = [
  {
    title: "Explore",
    links: [
      { label: "Shop", href: "/shop" },
      { label: "Men", href: "/shop?gender=men" },
      { label: "Women", href: "/shop?gender=women" },
      { label: "Collections", href: "/collections" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Custom made", href: "/custom-made" },
      { label: "Try on", href: "/try-on" },
      { label: "Home tailoring", href: "/#process", desktopOnly: true },
      { label: "Book a consultation", href: "/#book" },
    ],
  },
  {
    title: "Atelier",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Instagram", href: site.instagram, external: true },
    ],
  },
];

const blurb = "Premium made-to-measure suits, shirts and coat-pant sets, cut and finished in our Jhamsikhel atelier.";

function FooterLink({ link, className = "" }: { link: { label: string; href: string; external?: boolean; desktopOnly?: boolean }; className?: string }) {
  return link.external
    ? <a href={link.href} target="_blank" rel="noopener noreferrer" className={className}>{link.label}</a>
    : <Link href={link.href} className={className}>{link.label}</Link>;
}

/** Visit / contact details, shown under the wordmark on every screen size. */
function VisitBlock({ className = "" }: { className?: string }) {
  const item = "block text-[15px] text-ink/80 underline-offset-4 hover:text-ink hover:underline md:text-sm";
  return (
    <div className={className}>
      <p className="label-micro text-slate">Visit</p>
      <ul className="mt-3 space-y-1.5 md:mt-4">
        <li className="text-[15px] leading-snug text-ink/80 md:text-sm">{site.location}</li>
        {site.hours && <li className="text-[15px] leading-snug text-ink/80 md:text-sm">{site.hours}</li>}
        {site.phone && <li><a href={`tel:${site.phone.replace(/\s/g, "")}`} className={item}>{site.phone}</a></li>}
        {site.whatsapp && <li><a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener noreferrer" className={item}>WhatsApp</a></li>}
        {site.email && <li><a href={`mailto:${site.email}`} className={`${item} break-all`}>{site.email}</a></li>}
        <li><a href={site.instagram} target="_blank" rel="noopener noreferrer" className={item}>{site.handle}</a></li>
      </ul>
    </div>
  );
}

function Newsletter({ className = "" }: { className?: string }) {
  const { state, subscribe } = useSubscribe();
  return (
    <form onSubmit={subscribe} className={`flex items-end gap-4 border-b border-ink/40 pb-2 ${className}`}>
      <input name="email" type="email" required autoComplete="email" placeholder="Your email" className="min-w-0 flex-1 bg-transparent py-1.5 text-base outline-none placeholder:text-mute" />
      <button disabled={state === "sending"} className="group flex shrink-0 items-center gap-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] md:text-sm md:normal-case md:tracking-normal">
        {state === "done" ? "Thank you" : state === "error" ? "Try again" : "Subscribe"}
        <span aria-hidden className="hidden h-px w-8 bg-ink transition-all duration-500 group-hover:w-14 md:block" />
      </button>
    </form>
  );
}

function Legal({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 text-[11px] text-slate ${className}`}>
      <svg viewBox="0 0 24 24" className="h-3 w-3 fill-gold" aria-hidden><rect x="5" y="5" width="14" height="14" /><rect x="5" y="5" width="14" height="14" transform="rotate(45 12 12)" /></svg>
      © {new Date().getFullYear()} Orhanza. All rights reserved.
    </div>
  );
}

/** Phone footer: a normal (non-sticky) footer — wordmark first, then everything else stacked tightly beneath it. */
function MobileFooter() {
  return (
    <footer className="bg-white text-ink md:hidden">
      <p aria-hidden className="overflow-hidden whitespace-nowrap pt-8 text-center text-[19vw] font-extrabold uppercase leading-[0.85] tracking-[-0.06em] text-[#0B0B0D]">ORHANZA</p>

      <div className="container-x mt-6 border-t border-ink/10 pt-6">
        <p className="text-[1.15rem] font-light leading-snug tracking-[-0.01em]">{site.tagline}</p>
        <p className="mt-2 max-w-[24rem] text-[15px] leading-relaxed text-slate">{blurb}</p>

        <p className="label-micro mt-6 text-slate">Newsletter</p>
        <Newsletter className="mt-2" />

        <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-7">
          {groups.map((g) => (
            <div key={g.title}>
              <p className="label-micro text-slate">{g.title}</p>
              <ul className="mt-2.5">
                {g.links.filter((l) => !l.desktopOnly).map((l) => <li key={l.label}><FooterLink link={l} className="block py-1.5 text-[15px] text-ink/80 active:text-ink" /></li>)}
              </ul>
            </div>
          ))}
          <VisitBlock />
        </div>
      </div>

      <div className="container-x mt-8 border-t border-ink/10 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <Legal />
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

  return (
    <footer ref={ref} className="relative hidden h-[100svh] bg-white md:block" style={{ clipPath: "inset(0)" }}>
      <div className="fixed bottom-0 left-0 flex h-[100svh] w-full flex-col overflow-hidden bg-white text-ink">
        <div className="relative min-h-0 flex-1 overflow-hidden">
          <motion.p aria-hidden style={{ scale, y, color }} className="absolute inset-x-0 bottom-0 origin-bottom whitespace-nowrap text-center text-[min(20vw,27svh)] font-extrabold uppercase leading-[0.8] tracking-[-0.06em]">
            ORHANZA
          </motion.p>
        </div>

        {/* everything below the wordmark */}
        <div className="container-x relative z-10 grid grid-cols-12 gap-x-8 gap-y-8 border-t hairline bg-white pb-8 pt-8">
          <div className="col-span-12 lg:col-span-4 xl:col-span-3">
            <p className="text-xl font-light leading-snug tracking-[-0.01em]">{site.tagline}</p>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-slate">{blurb}</p>
            <Newsletter className="mt-5 max-w-sm" />
          </div>
          <div className="col-span-12 grid grid-cols-2 gap-x-8 gap-y-6 lg:col-span-8 lg:grid-cols-4 xl:col-span-9">
            {groups.map((g) => (
              <div key={g.title}>
                <p className="label-micro text-slate">{g.title}</p>
                <ul className="mt-4 space-y-1.5">
                  {g.links.map((l) => <li key={l.label}><FooterLink link={l} className="text-sm underline-offset-4 hover:underline" /></li>)}
                </ul>
              </div>
            ))}
            <VisitBlock />
          </div>
        </div>

        <div className="container-x flex items-center justify-between gap-2 border-t hairline bg-white py-3.5">
          <Legal />
          <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="text-[11px] text-slate underline-offset-4 hover:underline">{site.handle}</a>
        </div>
      </div>
    </footer>
  );
}
