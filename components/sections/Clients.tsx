"use client";

/**
 * 11 — Clients. An index of the three kinds of client we dress. The photograph beside it belongs to whichever row is in the middle of
 * the screen (or under the pointer): the new photograph is drawn up over the old one like a sheet of cloth being laid on the table,
 * while the previous one stays underneath, so nothing ever flashes. On phones each row carries its own photograph and reveals it the same way.
 */
import { motion } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { MaskLine } from "@/components/motion";
import { SectionLabel } from "@/components/SectionLabel";
import { audience } from "@/lib/content";

const EASE = [0.22, 1, 0.36, 1] as const;
const WIPE = "cubic-bezier(0.65, 0, 0.35, 1)";

export function Clients() {
  const [{ active, prev }, set] = useState({ active: 0, prev: -1 });
  const rows = useRef<(HTMLLIElement | null)[]>([]);
  const go = (i: number) => set((s) => (s.active === i ? s : { active: i, prev: s.active }));

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) go(Number((e.target as HTMLElement).dataset.i)); }),
      { rootMargin: "-42% 0px -42% 0px" },
    );
    rows.current.forEach((r) => r && io.observe(r));
    return () => io.disconnect();
  }, []);

  return (
    <section id="clients" aria-labelledby="clients-h" className="bg-white section-y text-ink">
      <div className="container-x">
        <SectionLabel label="Clients" />
        <h2 id="clients-h" className="t-h2 mt-5 md:mt-6">
          <MaskLine>The people we dress</MaskLine>
        </h2>

        <div className="section-gap grid gap-x-12 md:grid-cols-12">
          <ul className="md:col-span-7">
            {audience.map((a, i) => {
              const on = i === active;
              return (
                <li
                  key={a.role}
                  ref={(el) => { rows.current[i] = el; }}
                  data-i={i}
                  onMouseEnter={() => go(i)}
                  className="border-t border-ink/15 py-8 last:border-b md:py-14"
                >
                  <h3 className={`text-[clamp(1.75rem,3.6vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.045em] transition-opacity duration-[900ms] ${on ? "md:opacity-100" : "md:opacity-30"}`}>{a.role}</h3>
                  <div className={`grid transition-[grid-template-rows,opacity] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${on ? "md:grid-rows-[1fr] md:opacity-100" : "md:grid-rows-[0fr] md:opacity-0"}`}>
                    <p className="mt-3 max-w-sm overflow-hidden text-base leading-relaxed text-slate md:text-[1.0625rem]">{a.intro}</p>
                  </div>
                  {/* phones: the photograph travels with its row */}
                  <motion.div
                    initial={{ clipPath: "inset(0 0 100% 0)" }}
                    whileInView={{ clipPath: "inset(0 0 0% 0)" }}
                    viewport={{ once: true, amount: 0.35 }}
                    transition={{ duration: 1.3, ease: EASE }}
                    className="relative mt-6 aspect-[4/5] overflow-hidden rounded-[18px] bg-[#EDEDED] md:hidden"
                  >
                    <Image src={a.image} alt={a.role} fill sizes="100vw" className="object-cover object-top" />
                  </motion.div>
                </li>
              );
            })}
          </ul>

          <div aria-hidden className="relative hidden self-start md:sticky md:top-28 md:col-span-5 md:block">
            <div className="relative aspect-[4/5] max-h-[78svh] w-full overflow-hidden rounded-[18px] bg-[#EDEDED]">
              {audience.map((a, i) => {
                const on = i === active;
                const under = i === prev;
                return (
                  <div
                    key={a.role}
                    className="absolute inset-0"
                    style={{
                      zIndex: on ? 2 : under ? 1 : 0,
                      clipPath: on || under ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)",
                      transition: on ? `clip-path 1.2s ${WIPE}` : "none",
                    }}
                  >
                    <div className="absolute inset-0" style={{ transform: on ? "scale(1)" : "scale(1.1)", transition: on ? `transform 1.6s ${WIPE}` : "none" }}>
                      <Image src={a.image} alt="" fill sizes="40vw" className="object-cover object-top" priority={i === 0} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
