import { Reveal } from "@/components/Reveal";

const steps = [
  { n: "01", title: "We reply", body: "Send the form and we get back to you to find a time that suits you." },
  { n: "02", title: "The consultation", body: "At the studio or at your door: the occasion, the look, the cloth and the budget." },
  { n: "03", title: "Measured and made", body: "Your measurements, a trial fitting, final finishing and delivery." },
];

export function ContactSteps() {
  return (
    <section aria-labelledby="next-h" className="container-x pb-16 md:pb-24">
      <Reveal>
        <h2 id="next-h" className="h-display text-[clamp(2rem,4vw,3.6rem)]">What happens next</h2>
      </Reveal>
      <ol className="mt-8 grid gap-4 md:mt-10 md:grid-cols-3">
        {steps.map((s, i) => (
          <li key={s.n}>
            <Reveal delay={i * 0.08} className="h-full rounded-[22px] bg-card p-6 md:p-8">
              <p className="label-micro text-gold">Step {s.n}</p>
              <h3 className="mt-4 text-xl font-semibold tracking-[-0.02em]">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate">{s.body}</p>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}
