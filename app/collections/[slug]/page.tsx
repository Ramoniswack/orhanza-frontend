import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductActions } from "@/components/ProductActions";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { categoryLabel, getProduct, productImage, products, testimonials } from "@/lib/data";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return {};
  return {
    title: `${p.name} — Made-to-Measure in Nepal`,
    description: `${p.summary} ${p.description}`.slice(0, 160),
    alternates: { canonical: `/collections/${p.slug}` },
    openGraph: { images: [productImage(p)] },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) notFound();
  const related = products.filter((x) => x.category === p.category && x.slug !== p.slug).concat(products.filter((x) => x.category !== p.category)).slice(0, 4);

  return (
    <>
      <div className="container-x pb-24 pt-28 md:pt-36">
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-slate">
          <Link href="/collections" className="hover:underline">Collections</Link> <span aria-hidden>/</span>{" "}
          <Link href={`/collections?category=${p.category}`} className="hover:underline">{categoryLabel(p.category)}</Link>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          <div className="grid grid-cols-2 gap-3">
            {(["a", "b"] as const).map((w) => (
              <Reveal key={w} delay={w === "b" ? 0.1 : 0}>
                <div className="relative aspect-[3/4.4] overflow-hidden rounded-card bg-field">
                  <Image src={productImage(p, w)} alt={`${p.name} — ${w === "a" ? "front" : "alternate"} view`} fill priority sizes="(min-width:1024px) 28vw, 50vw" className="object-cover object-top" />
                </div>
              </Reveal>
            ))}
          </div>

          <div className="lg:sticky lg:top-28 lg:self-start">
            {p.badge && <span className="rounded-full bg-gold px-3 py-1 text-[0.68rem] font-semibold">{p.badge}</span>}
            <h1 className="h-display mt-4 text-[clamp(2.6rem,5vw,4.6rem)]">{p.name}</h1>
            <p className="mt-2 text-slate">Made to measure · priced after consultation</p>
            <p className="mt-6 max-w-lg leading-relaxed">{p.description}</p>

            <h2 className="eyebrow mt-8 text-slate">Top details</h2>
            <ul className="mt-3 space-y-2">
              {p.details.map((d) => (
                <li key={d} className="flex items-center gap-3 border-b border-charcoal/10 pb-2 text-sm"><span className="h-1.5 w-1.5 rounded-full bg-gold" />{d}</li>
              ))}
            </ul>
            <h2 className="eyebrow mt-8 text-slate">Fabric</h2>
            <p className="mt-2 text-sm">{p.fabric}</p>

            <ProductActions slug={p.slug} />
          </div>
        </div>
      </div>

      <section className="relative overflow-hidden bg-charcoal text-ivory">
        <Image src="/images/banners/craft.webp" alt="" fill sizes="100vw" className="object-cover opacity-35" />
        <div className="container-x relative py-24 md:py-36">
          <Reveal>
            <p className="eyebrow text-gold">Widely crafted</p>
            <h2 className="h-display mt-3 max-w-3xl text-[clamp(2.4rem,5vw,4.6rem)]">Tailored in Nepal, around you.</h2>
            <p className="mt-5 max-w-xl text-ivory/80">Careful craftsmanship, quality fabrics, and personalized fitting — so every garment feels genuinely yours.</p>
          </Reveal>
        </div>
      </section>

      <section className="container-x py-20 md:py-28">
        <Reveal className="mx-auto max-w-3xl text-center">
          <blockquote className="font-serif text-3xl leading-snug md:text-4xl">“{testimonials[0].quote}”</blockquote>
          <p className="mt-5 text-sm text-slate">— {testimonials[0].name}</p>
        </Reveal>
      </section>

      <section className="container-x pb-24">
        <h2 className="h-display text-4xl md:text-5xl">You may also like</h2>
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
          {related.map((r) => <ProductCard key={r.slug} product={r} />)}
        </div>
      </section>
    </>
  );
}
