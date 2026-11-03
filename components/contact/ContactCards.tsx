import { site } from "@/lib/site";

/** Curvy contact cards. Details that are not configured in .env (phone, WhatsApp, email, map, hours) are simply left out. */
export function ContactCards() {
  const cards = [
    {
      title: "Visit the studio",
      lines: [site.location, site.hours].filter(Boolean),
      action: site.mapUrl ? { label: "Open in Maps", href: site.mapUrl } : null,
    },
    site.phone || site.whatsapp
      ? {
          title: "Call or WhatsApp",
          lines: [site.phone].filter(Boolean),
          action: site.whatsapp ? { label: "Message on WhatsApp", href: `https://wa.me/${site.whatsapp}` } : { label: "Call us", href: `tel:${site.phone.replace(/\s/g, "")}` },
        }
      : null,
    site.email ? { title: "Email", lines: [site.email], action: { label: "Write to us", href: `mailto:${site.email}` } } : null,
    { title: "Instagram", lines: [site.handle], action: { label: "Send a message", href: site.instagram } },
  ].filter(Boolean) as { title: string; lines: string[]; action: { label: string; href: string } | null }[];

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
      {cards.map((c) => (
        <li key={c.title} className="rounded-[22px] bg-card p-6 md:p-7">
          <p className="label-micro text-gold">{c.title}</p>
          {c.lines.map((l) => <p key={l} className="mt-3 text-lg font-semibold leading-snug tracking-[-0.02em]">{l}</p>)}
          {c.action && (
            <a href={c.action.href} target={c.action.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="group mt-5 inline-flex items-center gap-3 text-sm font-semibold">
              {c.action.label}
              <span className="block h-px w-8 bg-ink transition-all duration-500 group-hover:w-14" />
            </a>
          )}
        </li>
      ))}
    </ul>
  );
}
