"use client";

/** 10 — Commissions: an editorial index. Numbered rows, large type, a real photograph that swaps to its second frame on hover. */
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { KineticNumber, StaircaseHeadline } from "@/components/motion";
import { SectionLabel } from "@/components/SectionLabel";
import { commissions } from "@/lib/content";
import { productImage, products } from "@/lib/data";

export function Commissions() {
  return (
    <section id="commissions" className="bg-white py-14 text-ink md:py-20">
      <div className="container-x">
        <SectionLabel label="Commissions" />
        <StaircaseHeadline
          className="mt-5 md:mt-6"
          lines={[{ text: "THE RIGHT BRIEF", tone: "setup" }, { text: "MAKES THE RIGHT", tone: "punch" }, { text: "GARMENT", tone: "punch" }]}
          indents={[0, 0.6, 1.2]}
        />

        <ul className="mt-8 border-t hairline md:mt-10">
          {commissions.map((c, i) => {
            const p = products.find((x) => x.category === c.cat) ?? products[0];
            return (
              <motion.li
                key={c.name}
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 }}
                className="border-b hairline"
              >
                <Link href={`/collections?category=${c.cat}`} className="group grid grid-cols-[2.5rem_1fr_auto] items-center gap-4 py-6 md:grid-cols-[4rem_1fr_auto_auto] md:gap-10 md:py-8">
                  <span className="self-start pt-2 text-sm text-mute md:pt-4"><KineticNumber value={i + 1} pad={2} /></span>
                  <h3 className="text-[clamp(1.75rem,4.6vw,4.5rem)] font-extrabold leading-none tracking-[-0.045em] transition-transform duration-500 ease-out group-hover:translate-x-3">{c.name}</h3>
                  <span className="relative h-28 w-[5.25rem] overflow-hidden bg-card md:h-36 md:w-28">
                    <Image src={productImage(p, "a")} alt="" fill sizes="112px" className="object-cover object-top transition-opacity duration-700 group-hover:opacity-0" />
                    <Image src={productImage(p, "b")} alt="" fill sizes="112px" className="object-cover object-top opacity-0 transition-all duration-700 group-hover:scale-105 group-hover:opacity-100" />
                  </span>
                  <span aria-hidden className="hidden h-12 w-12 items-center justify-center rounded-full border border-ink/20 text-lg transition-colors duration-300 group-hover:bg-ink group-hover:text-white md:flex">→</span>
                </Link>
              </motion.li>
            );
          })}
        </ul>

        <div className="mt-8 flex justify-end">
          <Link href="/#book" className="btn btn-burgundy">Book a Consultation</Link>
        </div>
      </div>
    </section>
  );
}
