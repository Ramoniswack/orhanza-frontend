import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Gallery } from "@/components/shop/Gallery";
import { ProductActions } from "@/components/shop/ProductActions";
import { ShopCard } from "@/components/shop/ShopCard";
import { genderLabel, getShopProduct, productAbout, shopProducts } from "@/lib/shop";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return shopProducts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = getShopProduct(slug);
  if (!p) return {};
  return {
    title: `${p.name} — Made-to-Measure in Nepal`,
    description: p.lines.join(" ").slice(0, 160),
    alternates: { canonical: `/shop/${p.slug}` },
    openGraph: { images: [p.image] },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const p = getShopProduct(slug);
  if (!p) notFound();
  const related = shopProducts.filter((x) => x.gender === p.gender && x.slug !== p.slug).slice(0, 4);
  const a = productAbout(p.type);
  const steps = ["Book a consultation — we visit you or you visit us in Jhamsikhel.", "Choose the cloth and details.", "Measurements are taken and your pattern is drafted.", "Trial fitting, then final finishing and delivery.", "Free alterations support afterwards, whenever you need it."];
  const facts = [["For", genderLabel(p.gender)], ["Type", p.type], ["Occasion", p.occasion], ["Made", "To measure, in Nepal"]];

  return (
    <>
      <div className="container-x pb-20 pt-28 md:pt-36">
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-slate">
          <Link href="/shop" className="hover:underline">Shop</Link> <span aria-hidden>/</span>{" "}
          <Link href={`/shop?gender=${p.gender}`} className="hover:underline">{genderLabel(p.gender)}</Link> <span aria-hidden>/</span>{" "}
          <Link href={`/shop?gender=${p.gender}&type=${p.type.toLowerCase()}`} className="hover:underline">{p.type}</Link>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <Gallery name={p.name} image={p.image} flat={p.flat} />

          <div className="lg:sticky lg:top-28 lg:self-start">
            <h1 className="h-display text-[clamp(2.2rem,4.4vw,4rem)]">{p.name}</h1>
            <p className="mt-2 text-slate">Made to measure · priced after consultation</p>
            <p className="mt-6 max-w-lg leading-relaxed">{p.lines.join(" ")}</p>

            <dl className="mt-8 grid max-w-lg grid-cols-2 gap-x-6">
              {facts.map(([k, v]) => (
                <div key={k} className="border-b border-charcoal/10 py-3">
                  <dt className="label-micro text-slate">{k}</dt>
                  <dd className="mt-1 text-sm font-medium">{v}</dd>
                </div>
              ))}
            </dl>

            <ProductActions itemKey={p.key} />
          </div>
        </div>
      </div>

      <section className="container-x grid gap-12 border-t border-charcoal/10 pb-20 pt-14 md:grid-cols-3 md:gap-10">
        <div>
          <h2 className="label-micro text-slate">About this piece</h2>
          <p className="mt-4 leading-relaxed">{a.intro}</p>
        </div>
        <div>
          <h2 className="label-micro text-slate">How it is made</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {a.make.map((m) => <li key={m} className="flex items-start gap-3 border-b border-charcoal/10 pb-3"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />{m}</li>)}
          </ul>
        </div>
        <div>
          <h2 className="label-micro text-slate">Fabric &amp; care</h2>
          <p className="mt-4 text-sm leading-relaxed">{a.fabric}</p>
          <p className="mt-3 text-sm leading-relaxed text-slate">Dry clean only. Store on a wide wooden hanger and let it rest a day between wears.</p>
        </div>
      </section>

      <section className="container-x pb-20">
        <h2 className="label-micro text-slate">From consultation to delivery</h2>
        <ol className="mt-6 grid gap-6 md:grid-cols-5">
          {steps.map((x, k) => (
            <li key={x} className="border-t border-charcoal pt-4">
              <span className="text-sm text-slate">{String(k + 1).padStart(2, "0")}</span>
              <p className="mt-2 text-sm leading-relaxed">{x}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="container-x pb-24">
        <h2 className="h-display text-3xl md:text-5xl">You may also like</h2>
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
          {related.map((r) => <ShopCard key={r.slug} product={r} />)}
        </div>
      </section>
    </>
  );
}
