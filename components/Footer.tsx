import Link from "next/link";
import { categories } from "@/lib/data";
import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="bg-[#000] text-[#f4f4f4]">
      <div className="container-x">
        <div className="gold-rule" />
        <div className="grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr_1.4fr]">
          <div>
            <p className="h-display text-4xl tracking-[0.28em]">ORHANZA</p>
            <p className="mt-4 max-w-xs text-body text-[#6f6f6f]">Premium made-to-measure suits and shirts, tailored in Nepal. {site.tagline}.</p>
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-body text-[#6f6f6f]">
              <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-[#f4f4f4]">Instagram</a>
              {site.whatsapp && <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener noreferrer" className="hover:text-[#f4f4f4]">WhatsApp</a>}
            </div>
          </div>

          <div>
            <h3 className="eyebrow text-[#6f6f6f]">Pages</h3>
            <ul className="mt-4 space-y-2 text-body">
              <li><Link href="/" className="hover:underline">Home</Link></li>
              <li><Link href="/collections" className="hover:underline">Collections</Link></li>
              <li><Link href="/#process" className="hover:underline">Process</Link></li>
              <li><Link href="/#book" className="hover:underline">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="eyebrow text-[#6f6f6f]">Collections</h3>
            <ul className="mt-4 space-y-2 text-body">
              {categories.map((c) => (
                <li key={c.slug}><Link href={`/collections?category=${c.slug}`} className="hover:underline">{c.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="eyebrow text-[#6f6f6f]">Atelier</h3>
            <p className="mt-4 text-body leading-relaxed">{site.location}</p>
            {site.hours && <p className="mt-2 text-body text-[#6f6f6f]">{site.hours}</p>}
            {site.mapUrl && <a href={site.mapUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-body underline-offset-4 hover:underline">View on map</a>}
          </div>
        </div>
        <div className="flex flex-wrap justify-between gap-2 border-t border-[#f4f4f4]/10 py-6 text-meta text-[#6f6f6f]">
          <span>© {new Date().getFullYear()} Orhanza. All rights reserved.</span>
          <span>Reference layout: Homelander template by Tomiwa Olaide</span>
        </div>
      </div>
    </footer>
  );
}
