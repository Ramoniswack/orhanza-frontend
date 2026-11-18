import Link from "next/link";

const categories = [
  { label: "New Arrivals", href: "/shop" },
  { label: "Try On", href: "/try-on" },
  { label: "Custom Made", href: "/custom-made" },
  { label: "About", href: "/about" },
  { label: "Book a Consultation", href: "/contact" },
];

export function EditorialHero() {
  return (
    <section aria-label="ORHANZA menswear" className="relative h-screen min-h-[650px] w-full overflow-hidden">
      <video
        aria-hidden="true"
        autoPlay
        className="absolute inset-0 h-full w-full object-cover object-center"
        loop
        muted
        playsInline
        poster="/hero/hero-poster.jpg"
        preload="auto"
      >
        <source src="/hero/hero-720.mp4" type="video/mp4" media="(max-width: 767px)" />
        <source src="/hero/hero.mp4" type="video/mp4" />
      </video>
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/70 via-black/20 to-transparent" />

      <nav aria-label="Shop by category" className="group absolute bottom-10 left-6 z-10 flex flex-col md:bottom-12 md:left-8">
        {categories.map((category) => (
          <Link
            key={category.label}
            href={category.href}
            className="origin-left text-lg font-semibold leading-[1.45] tracking-[-0.01em] text-white transition-[opacity,transform] duration-300 ease-out group-hover:opacity-60 hover:!scale-[1.08] hover:!opacity-100 focus-visible:scale-[1.08] md:text-[22px]"
          >
            {category.label}
          </Link>
        ))}
      </nav>
    </section>
  );
}
