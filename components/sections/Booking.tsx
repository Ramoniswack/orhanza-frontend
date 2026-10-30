"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState, type FormEvent } from "react";
import { getProduct } from "@/lib/data";
import { site } from "@/lib/site";
import { Reveal } from "../Reveal";
import { useShortlist } from "../ShortlistProvider";

const serviceOptions = ["Suit", "Shirt", "Coat-pant", "Wedding wear", "Fabric consultation"];
const field = "w-full rounded-[10px] border border-transparent bg-field px-4 py-3 text-[0.95rem] outline-none transition-colors placeholder:text-charcoal/40 focus:border-gold focus:bg-white";

export function Booking() {
  const { items } = useShortlist();
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const shortlisted = items.map((s) => getProduct(s)?.name).filter(Boolean) as string[];

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus("sending");
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, shortlist: shortlisted }),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  const contacts = [
    site.phone && { label: "Call", value: site.phone, href: `tel:${site.phone.replace(/\s/g, "")}` },
    site.whatsapp && { label: "WhatsApp", value: "Message us", href: `https://wa.me/${site.whatsapp}` },
    site.email && { label: "Email", value: site.email, href: `mailto:${site.email}` },
    { label: "Instagram", value: site.handle, href: site.instagram },
  ].filter(Boolean) as { label: string; value: string; href: string }[];

  return (
    <section id="book" className="container-x py-14 md:py-20" aria-labelledby="book-h">
      <div className="grid gap-14 lg:grid-cols-[1fr_1.05fr]">
        <Reveal className="flex flex-col justify-between gap-12">
          <div>
            <h2 id="book-h" className="h-display mt-3 text-[clamp(2.4rem,5vw,4.6rem)]">Book a Consultation</h2>
          </div>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {contacts.map((c) => (
              <li key={c.label}><a href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="underline-offset-4 hover:underline">{c.label}</a></li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="relative rounded-[24px] border border-charcoal/10 bg-card p-6 md:p-8">
            <AnimatePresence mode="wait">
              {status === "sent" ? (
                <motion.div key="ok" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex min-h-[420px] flex-col items-center justify-center text-center">
                  <h3 className="text-3xl font-semibold">Thank you.</h3>
                  <button onClick={() => setStatus("idle")} className="mt-6 text-sm underline underline-offset-4">Send another enquiry</button>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={onSubmit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block text-sm font-medium">Full name<input name="name" required autoComplete="name" placeholder="Your name" className={`${field} mt-1.5`} /></label>
                    <label className="block text-sm font-medium">Phone number<input name="phone" type="tel" required autoComplete="tel" placeholder="+977 98…" className={`${field} mt-1.5`} /></label>
                  </div>
                  <div className="grid gap-4">
                    <label className="block text-sm font-medium">Service needed
                      <select name="service" required defaultValue="" className={`${field} mt-1.5`}>
                        <option value="" disabled>Select…</option>
                        {serviceOptions.map((s) => <option key={s}>{s}</option>)}
                      </select>
                    </label>
                  </div>
                  {shortlisted.length > 0 && (
                    <p className="rounded-[10px] bg-field px-4 py-3 text-sm text-slate">
                      <span className="font-medium text-charcoal">From your shortlist:</span> {shortlisted.join(", ")}
                    </p>
                  )}
                  <label className="block text-sm font-medium">Message<textarea name="message" rows={4} placeholder="Message" className={`${field} mt-1.5 resize-y`} /></label>
                  <button disabled={status === "sending"} className="btn btn-burgundy w-full disabled:opacity-60 sm:w-auto">{status === "sending" ? "Sending…" : "Book a Consultation"}</button>
                  {status === "error" && <p role="alert" className="text-sm text-burgundy">Something went wrong. Please try again.</p>}
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
