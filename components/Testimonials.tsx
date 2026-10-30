import { testimonials } from "@/lib/data";
import { Reveal, SectionHeading } from "./Reveal";

export function Testimonials() {
  return (
    <section className="container-x py-24 md:py-32" aria-labelledby="testimonials-h">
      <span id="testimonials-h" className="sr-only">Testimonials</span>
      <SectionHeading eyebrow="Testimonials" title="Client Confidence" align="center" />
      <div className="mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-2">
        {testimonials.map((t, i) => (
          <Reveal key={i} delay={i * 0.1}>
            <figure className="h-full rounded-[24px] border border-[#111]/10 bg-[#dadada] p-8 md:p-10">
              <span className="h-display text-6xl leading-none text-gold" aria-hidden>"</span>
              <blockquote className="mt-2 h-editorial text-2xl leading-snug md:text-3xl">{t.quote}</blockquote>
              <figcaption className="mt-6 text-body text-[#6f6f6f]">— {t.name}</figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
