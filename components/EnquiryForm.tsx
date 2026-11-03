"use client";

/** The consultation enquiry form — shared by the home page booking section and the /contact page. Posts to /api/enquiry. */
import { AnimatePresence, motion } from "motion/react";
import { useState, type FormEvent } from "react";
import { resolveSaved } from "@/lib/saved";
import { useShortlist } from "./ShortlistProvider";

const serviceOptions = ["Suit", "Shirt", "Coat-pant", "Wedding wear", "Fabric consultation"];
const field = "w-full rounded-[10px] border border-transparent bg-field px-4 py-3 text-[0.95rem] outline-none transition-colors placeholder:text-charcoal/40 focus:border-gold focus:bg-white";

export function EnquiryForm() {
  const { items } = useShortlist();
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const shortlisted = items.map((s) => resolveSaved(s)?.name).filter(Boolean) as string[];

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

  return (
    <div className="relative rounded-[24px] border border-charcoal/10 bg-card p-6 md:p-8">
      <AnimatePresence mode="wait">
        {status === "sent" ? (
          <motion.div key="ok" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex min-h-[420px] flex-col items-center justify-center text-center">
            <h3 className="text-3xl font-semibold">Thank you.</h3>
            <p className="mt-3 max-w-xs text-slate">We will be in touch shortly to arrange your consultation.</p>
            <button onClick={() => setStatus("idle")} className="mt-6 text-sm underline underline-offset-4">Send another enquiry</button>
          </motion.div>
        ) : (
          <motion.form key="form" onSubmit={onSubmit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium">Full name<input name="name" required autoComplete="name" placeholder="Your name" className={`${field} mt-1.5`} /></label>
              <label className="block text-sm font-medium">Phone number<input name="phone" type="tel" required autoComplete="tel" placeholder="+977 98…" className={`${field} mt-1.5`} /></label>
            </div>
            <label className="block text-sm font-medium">Email <span className="font-normal text-slate">(optional)</span><input name="email" type="email" autoComplete="email" placeholder="you@example.com" className={`${field} mt-1.5`} /></label>
            <label className="block text-sm font-medium">Service needed
              <select name="service" required defaultValue="" className={`${field} mt-1.5`}>
                <option value="" disabled>Select…</option>
                {serviceOptions.map((s) => <option key={s}>{s}</option>)}
              </select>
            </label>
            {shortlisted.length > 0 && (
              <p className="rounded-[10px] bg-field px-4 py-3 text-sm text-slate">
                <span className="font-medium text-charcoal">From your shortlist:</span> {shortlisted.join(", ")}
              </p>
            )}
            <label className="block text-sm font-medium">Message<textarea name="message" rows={4} placeholder="Tell us about the occasion, the look and your date" className={`${field} mt-1.5 resize-y`} /></label>
            <button disabled={status === "sending"} className="btn btn-burgundy w-full disabled:opacity-60 sm:w-auto">{status === "sending" ? "Sending…" : "Book a Consultation"}</button>
            {status === "error" && <p role="alert" className="text-sm text-burgundy">Something went wrong. Please try again.</p>}
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
