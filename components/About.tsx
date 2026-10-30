import Image from "next/image";
import { Reveal, SectionHeading } from "./Reveal";

const values = ["Precision fit", "Premium fabrics", "Personal styling", "Modern elegance", "Made-to-measure craftsmanship"];

export function About() {
  return (
    <section className="bg-[#000] text-[#f4f4f4]" aria-labelledby="about">
      <div className="container-x grid items-center gap-12 py-24 md:grid-cols-2 md:gap-20 md:py-32">
        <div>
          <span id="about" className="sr-only">About Orhanza</span>
          <SectionHeading eyebrow="About Orhanza" title="Tailoring made personal." light>
            <p>
              Orhanza is a premium shirting and suiting brand based in Nepal. We combine careful craftsmanship, quality fabrics, and personalized fitting to create clothing that feels genuinely yours.
            </p>
            <p className="mt-4">From business tailoring to wedding attire, every Orhanza commission begins with understanding the person who will wear it.</p>
          </SectionHeading>
          <Reveal delay={0.1}>
            <ul className="mt-10 grid gap-x-8 gap-y-3 sm:grid-cols-2">
              {values.map((v) => (
                <li key={v} className="flex items-center gap-3 border-b border-[#f4f4f4]/10 pb-3 text-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold" /> {v}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
        <Reveal>
          <div className="relative aspect-[4/5] overflow-hidden rounded-card">
            <Image src="/images/banners/craft.webp" alt="Made-to-measure tailoring in Nepal — a navy double-breasted suit by Orhanza" fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover object-center" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
