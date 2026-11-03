import type { Metadata } from "next";
import { ContactCards } from "@/components/contact/ContactCards";
import { ContactSteps } from "@/components/contact/ContactSteps";
import { EnquiryForm } from "@/components/EnquiryForm";
import { Reveal } from "@/components/Reveal";
import { SectionLabel } from "@/components/SectionLabel";

export const metadata: Metadata = {
  title: "Contact — Book a Fitting in Jhamsikhel, Kathmandu",
  description: "Book a made-to-measure consultation with Orhanza. Visit the studio in Jhamsikhel, Lalitpur, call, WhatsApp or send an enquiry and we will arrange your fitting.",
  alternates: { canonical: "/contact" },
};

/** Header and Footer come from app/layout.tsx. */
export default function ContactPage() {
  return (
    <>
      <section aria-labelledby="contact-h" className="container-x pb-14 pt-28 md:pb-20 md:pt-36">
        <SectionLabel label="Contact" />
        <Reveal>
          <h1 id="contact-h" className="h-display mt-5 max-w-4xl text-[clamp(2.8rem,7vw,6.5rem)]">Let’s talk about your fit.</h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-slate md:text-lg">
            Tell us about the occasion and we will arrange a consultation — at our studio in Jhamsikhel, or at your door.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-8 md:mt-16 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
          <Reveal><ContactCards /></Reveal>
          <Reveal delay={0.1}><EnquiryForm /></Reveal>
        </div>
      </section>

      <ContactSteps />
    </>
  );
}
