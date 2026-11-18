"use client";

import { site } from "@/lib/site";
import { EnquiryForm } from "../EnquiryForm";
import { Reveal } from "../Reveal";

export function Booking() {
  const contacts = [
    site.phone && { label: "Call", value: site.phone, href: `tel:${site.phone.replace(/\s/g, "")}` },
    site.whatsapp && { label: "WhatsApp", value: "Message us", href: `https://wa.me/${site.whatsapp}` },
    site.email && { label: "Email", value: site.email, href: `mailto:${site.email}` },
    { label: "Instagram", value: site.handle, href: site.instagram },
  ].filter(Boolean) as { label: string; value: string; href: string }[];

  return (
    <section id="book" className="container-x section-y" aria-labelledby="book-h">
      <div className="grid gap-8 lg:grid-cols-[1fr_1.05fr] lg:gap-14">
        <Reveal className="flex flex-col justify-between gap-6 lg:gap-12">
          <div>
            <h2 id="book-h" className="t-h2 mt-5">Book a Consultation</h2>
          </div>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {contacts.map((c) => (
              <li key={c.label}><a href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="underline-offset-4 hover:underline">{c.label}</a></li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.1}>
          <EnquiryForm />
        </Reveal>
      </div>
    </section>
  );
}
