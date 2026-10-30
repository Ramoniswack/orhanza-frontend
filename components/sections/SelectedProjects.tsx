"use client";

/** 1 — Selected commissions: staggered collage, per-row parallax, cards scale .92→1 as they centre, hover label + cursor bubble. Ends on MORE → BgFlip to white. */
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BgFlip, LineMaskReveal } from "@/components/motion";
import { productImage, products } from "@/lib/data";

const rows = [
  { speed: 70, cells: ["md:col-span-7 aspect-[7/6]", "md:col-span-5 aspect-[5/6]"] },
  { speed: -50, cells: ["md:col-span-4 aspect-[4/5]", "md:col-span-4 aspect-[4/5]", "md:col-span-4 aspect-[4/5]"] },
  { speed: 60, cells: ["md:col-span-5 aspect-[5/6]", "md:col-span-7 aspect-[7/6]"] },
  { speed: -40, cells: ["md:col-span-4 aspect-[4/5]", "md:col-span-4 aspect-[4/5]", "md:col-span-4 aspect-[4/5]"] },
  { speed: 50, cells: ["md:col-span-6 aspect-[6/5]", "md:col-span-6 aspect-[6/5]"] },
];

function Card({ index, cls, onHover }: { index: number; cls: string; onHover: (v: boolean) => void }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const p = products[index % products.length];
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 98%", "center 62%"] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.92, 1]);
  return (
    <motion.div style={{ scale }} className={`${cls} relative`}>
      <Link ref={ref} href={`/collections/${p.slug}`} onMouseEnter={() => onHover(true)} onMouseLeave={() => onHover(false)} className="group relative block h-full w-full overflow-hidden bg-[#111]">
        <Image src={productImage(p, "a")} alt={`${p.name} — made-to-measure tailoring in Nepal`} fill sizes="(min-width:768px) 40vw, 100vw" className="object-cover object-top transition-transform duration-[1200ms] ease-out group-hover:scale-105" />
        <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-14 text-sm opacity-0 transition-opacity duration-500 group-hover:opacity-100">{p.name}</span>
      </Link>
    </motion.div>
  );
}

function Row({ speed, cells, start, onHover }: { speed: number; cells: string[]; start: number; onHover: (v: boolean) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [speed, -speed]);
  return (
    <motion.div ref={ref} style={{ y }} className="grid grid-cols-1 gap-2 md:grid-cols-12">
      {cells.map((c, i) => <Card key={i} index={start + i} cls={c} onHover={onHover} />)}
    </motion.div>
  );
}

export function SelectedProjects() {
  const [hover, setHover] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 400, damping: 40 });
  const sy = useSpring(y, { stiffness: 400, damping: 40 });
  useEffect(() => {
    const move = (e: MouseEvent) => { x.set(e.clientX); y.set(e.clientY); };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);

  let n = 0;
  return (
    <BgFlip tone="dark" id="work" className="pb-24 pt-14 md:pt-20">
      <div className="container-x">
        <div className="mx-auto max-w-4xl text-center">
          <LineMaskReveal as="h2" className="h-section" lines={["SELECTED", "COMMISSIONS"]} />
          <p className="label-micro mt-6 text-ivory/60">Tailored in Nepal · Made to measure</p>
        </div>
        <div className="mt-10 space-y-2 md:mt-14">
          {rows.map((r, i) => {
            const start = n;
            n += r.cells.length;
            return <Row key={i} speed={r.speed} cells={r.cells} start={start} onHover={setHover} />;
          })}
        </div>
        <div className="mt-40 text-center md:mt-56">
          <Link href="/collections" className="group inline-block">
            <LineMaskReveal as="span" className="h-section" lines={["MORE COMMISSIONS"]} />
            <span className="mt-4 block h-px w-full origin-left scale-x-0 bg-gold transition-transform duration-700 group-hover:scale-x-100" />
          </Link>
        </div>
      </div>
      <motion.div
        aria-hidden
        style={{ x: sx, y: sy }}
        animate={{ scale: hover ? 1 : 0, opacity: hover ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="label-micro pointer-events-none fixed left-0 top-0 z-[80] -ml-10 -mt-10 flex h-20 w-20 items-center justify-center rounded-full bg-ivory text-charcoal"
      >
        View
      </motion.div>
    </BgFlip>
  );
}
