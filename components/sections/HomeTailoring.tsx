"use client";

/**
 * Process — Home Tailoring Service. Instead of a drawn timeline, the section borrows the tailor's own instrument: a measuring tape.
 * A tape runs down the left with one mark per step; as each step reaches the middle of the screen the gold marker slides to its
 * mark, the big step number changes over, and the other steps rest at low contrast. Nothing is scroll-jacked and nothing is drawn
 * behind the text — it only reads the position, so it stays calm.
 */
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { SectionLabel } from "@/components/SectionLabel";

const steps = [
  { title: "Home consultation", body: "We visit you to talk through the occasion, the look and the budget." },
  { title: "Fabric & design selection", body: "Cloths, colours and details, chosen together at your door." },
  { title: "Measurement", body: "Detailed body measurements for a fit that is yours alone." },
  { title: "Trial fitting", body: "A first fitting to refine the line before final finishing." },
  { title: "Delivery", body: "Your finished garment, delivered to you." },
  { title: "Alteration support", body: "Adjustments afterwards, whenever you need them." },
];

const SMOOTH = "duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]";
const pad = (n: number) => String(n).padStart(2, "0");

export function HomeTailoring() {
  const [active, setActive] = useState(0);
  const rows = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i)); }),
      { rootMargin: "-45% 0px -45% 0px" },
    );
    rows.current.forEach((r) => r && io.observe(r));
    return () => io.disconnect();
  }, []);

  const last = steps.length - 1;
  return (
    <section id="process" aria-labelledby="process-h" className="bg-white section-y text-ink">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <SectionLabel label="Process" />
            <h2 id="process-h" className="t-h2 mt-5 md:mt-6">Home tailoring service</h2>
          </div>
          <p className="t-lead md:max-w-sm">Six steps, from the first conversation to the last adjustment. We come to you.</p>
        </div>

        <div className="section-gap grid gap-x-10 md:grid-cols-12">
          {/* the tape + current step (desktop) */}
          <div aria-hidden className="relative hidden self-start md:sticky md:top-28 md:col-span-5 md:block">
            <div className="flex gap-8">
              <div className="relative h-[min(62svh,30rem)] w-14 shrink-0">
                {/* minor graduations */}
                <div className="absolute inset-y-0 left-0 w-2.5" style={{ backgroundImage: "repeating-linear-gradient(to bottom, rgba(27,27,29,0.35) 0 1px, transparent 1px 9px)" }} />
                <div className="absolute inset-y-0 left-0 w-px bg-ink/40" />
                {/* one major mark per step */}
                {steps.map((_, i) => (
                  <div key={i} className="absolute left-0 flex items-center gap-2" style={{ top: `${(i / last) * 100}%` }}>
                    <span className={`block h-px w-6 -translate-y-1/2 transition-colors ${SMOOTH} ${i === active ? "bg-ink" : "bg-ink/40"}`} />
                    <span className={`-translate-y-1/2 text-[11px] font-semibold tabular-nums transition-colors ${SMOOTH} ${i === active ? "text-ink" : "text-ink/35"}`}>{i + 1}</span>
                  </div>
                ))}
                {/* marker */}
                <span className={`absolute -left-1 h-[3px] w-12 -translate-y-1/2 bg-gold transition-[top] ${SMOOTH}`} style={{ top: `${(active / last) * 100}%` }} />
              </div>
              <div className="relative h-[clamp(6rem,13vw,11rem)] flex-1">
                {steps.map((_, i) => (
                  <span key={i} className={`absolute left-0 top-0 text-[clamp(6rem,13vw,11rem)] font-bold leading-[0.85] tracking-[-0.06em] transition-[opacity,transform] ${SMOOTH} ${i === active ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>{pad(i + 1)}</span>
                ))}
              </div>
            </div>
          </div>

          <ol className="md:col-span-7">
            {steps.map((s, i) => (
              <li
                key={s.title}
                ref={(el) => { rows.current[i] = el; }}
                data-i={i}
                className={`relative border-t border-ink/15 py-9 pl-12 transition-opacity md:py-14 md:pl-0 ${SMOOTH} ${i === active ? "opacity-100" : "opacity-40 md:opacity-30"}`}
              >
                {/* phone timeline: a rail that turns gold down to the current step, a square node and a gold tick on the step you are reading */}
                <span aria-hidden className="md:hidden">
                  <span className={`absolute left-[7px] top-0 w-px bg-ink/20 ${i === last ? "h-[2.7rem]" : "bottom-0"}`} />
                  <span className={`absolute left-[7px] top-0 w-px bg-gold transition-[height] ${SMOOTH}`} style={{ height: i < active ? (i === last ? "2.7rem" : "100%") : i === active ? "2.7rem" : "0%" }} />
                  <span className={`absolute left-0 top-[2.15rem] h-[15px] w-[15px] border transition-[background-color,border-color,transform] ${SMOOTH} ${i === active ? "scale-110 border-gold bg-gold" : i < active ? "border-gold bg-white" : "border-ink/30 bg-white"}`} />
                  <span className={`absolute left-[15px] top-[2.15rem] h-px origin-left bg-gold transition-[width,opacity] ${SMOOTH} ${i === active ? "w-5 opacity-100" : "w-0 opacity-0"}`} />
                </span>
                <p className={`label-micro transition-colors ${SMOOTH} md:hidden ${i === active ? "text-gold" : "text-ink/40"}`}>Step {pad(i + 1)}</p>
                <h3 className="mt-2 text-[clamp(1.5rem,2.6vw,2.5rem)] font-semibold leading-[1.1] tracking-[-0.035em] md:mt-0">{s.title}</h3>
                <p className="mt-3 max-w-md text-base leading-relaxed text-slate md:text-[1.0625rem]">{s.body}</p>
              </li>
            ))}
            <li className="border-t border-ink/15 pt-8 md:pt-10">
              <Link href="/#book" className="group inline-flex items-center gap-4 text-sm font-semibold">
                Book a consultation
                <span aria-hidden className="block h-px w-12 bg-ink transition-all duration-500 group-hover:w-24" />
              </Link>
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
}
