"use client";

/**
 * Selected commissions — two tight rows of tiles (narrow · wide · narrow, then three equal), edge to edge with hairline gaps.
 * On black; each tile shows the upper half of a look. Slow reveal, slow hover.
 */
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { BgFlip, LineMaskReveal } from "@/components/motion";
import { looks } from "@/lib/lookbook-data";

const SLOW = [0.22, 1, 0.36, 1] as const;

type Tile = { id: number; name: string; tag: string; span: string; bg: string; fg: string; dark: boolean };
const tiles: Tile[] = [
  { id: 6, name: "Ombré double-breasted", tag: "Evening", span: "md:col-span-3", bg: "#EAEAEA", fg: "#111", dark: false },
  { id: 7, name: "Cream double-breasted", tag: "Wedding", span: "md:col-span-6 col-span-12", bg: "#151515", fg: "#F4F4F4", dark: true },
  { id: 3, name: "Herringbone overcoat", tag: "Outerwear", span: "md:col-span-3", bg: "#D2D2D2", fg: "#111", dark: false },
  { id: 5, name: "Olive dinner suit", tag: "Black tie", span: "md:col-span-4", bg: "#F5F5F5", fg: "#111", dark: false },
  { id: 9, name: "Emerald pantsuit", tag: "Business", span: "md:col-span-4", bg: "#C8C8C8", fg: "#111", dark: false },
  { id: 12, name: "White cape suit", tag: "Occasion", span: "md:col-span-4 col-span-12", bg: "#0B0B0B", fg: "#F4F4F4", dark: true },
];

export function SelectedProjects() {
  return (
    <BgFlip tone="dark" id="work" className="pb-14 pt-14 md:pb-24 md:pt-24">
      <div className="px-2 md:px-2">
        <div className="mx-auto max-w-4xl pb-10 text-center md:pb-16">
          <LineMaskReveal as="h2" className="h-section" lines={["Selected", "commissions"]} />
        </div>

        <div className="grid grid-cols-12 gap-1 md:auto-rows-[32rem]">
          {tiles.map((t, i) => {
            const look = looks[t.id - 1];
            const wide = t.span.includes("col-span-6");
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 1.4, ease: SLOW, delay: (i % 3) * 0.12 }}
                className={`${t.span} min-w-0 ${t.span.includes("col-span-12") ? "" : "col-span-6"}`}
              >
                <Link
                  href="/collections"
                  className={`group relative block overflow-hidden rounded-[6px] md:h-full ${wide ? "aspect-[4/3]" : "aspect-[3/4]"} md:aspect-auto`}
                  style={{ background: t.dark ? "radial-gradient(ellipse at 50% 30%, #3a3a3a, #161616 85%)" : t.bg, color: t.fg }}
                >
                  <Image
                    src={`/lookbook/${look.model}`}
                    alt={`${t.name} — made to measure by Orhanza`}
                    width={look.trimModel.w}
                    height={look.trimModel.h}
                    sizes="(min-width:768px) 30vw, 60vw"
                    className="absolute left-1/2 top-[4%] h-auto w-[78%] max-w-none -translate-x-1/2 grayscale transition-[filter,transform] duration-[1600ms] ease-out group-hover:scale-[1.04] group-hover:grayscale-0 md:w-[19rem]"
                  />
                  <span aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5" style={{ background: `linear-gradient(to top, ${t.dark ? "#0b0b0b" : t.bg}, transparent)` }} />
                  <span className="absolute inset-x-0 bottom-0 flex flex-col items-center p-5 text-center md:p-7">
                    <span className="text-[1.35rem] font-semibold leading-tight tracking-[-0.035em] md:text-[1.75rem]">{t.name}</span>
                    <span className="mt-1 text-sm opacity-60">{t.tag}</span>
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-20 text-center md:mt-32">
          <Link href="/collections" className="group inline-block">
            <LineMaskReveal as="span" className="h-section" lines={["More commissions"]} />
            <span className="mt-4 block h-px w-full origin-left scale-x-0 bg-ivory transition-transform duration-[1400ms] group-hover:scale-x-100" />
          </Link>
        </div>
      </div>
    </BgFlip>
  );
}
