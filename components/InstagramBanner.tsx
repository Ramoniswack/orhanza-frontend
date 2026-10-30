import Image from "next/image";
import { site } from "@/lib/site";
import { Reveal } from "./Reveal";

/** Template's dark photographic newsletter banner → Instagram follow banner. */
export function InstagramBanner() {
  return (
    <section className="relative overflow-hidden bg-charcoal text-ivory" aria-labelledby="ig-h">
      <Image src="/images/banners/instagram.webp" alt="" fill sizes="100vw" className="object-cover object-center opacity-40" />
      <div className="absolute inset-0 bg-charcoal/55" />
      <Reveal className="container-x relative flex flex-col items-start justify-between gap-8 py-20 md:flex-row md:items-center md:py-28">
        <div>
          <p className="eyebrow text-gold">Instagram</p>
          <h2 id="ig-h" className="h-display mt-3 text-[clamp(2.4rem,5vw,4.5rem)]">Follow {site.handle}</h2>
          <p className="mt-4 max-w-md text-ivory/80">See our latest fabrics, client commissions, styling ideas, and tailoring stories.</p>
        </div>
        <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-light">Follow on Instagram</a>
      </Reveal>
    </section>
  );
}
