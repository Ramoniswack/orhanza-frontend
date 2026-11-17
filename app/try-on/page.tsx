import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Try On — Orhanza Runway",
  description: "Explore complete Orhanza looks on the runway and open any piece in Custom Made.",
  alternates: { canonical: "/try-on" },
};

export default function TryOnPage() {
  return (
    <section aria-label="Try On runway" className="pt-16">
      <h1 className="sr-only">Try On — Orhanza Runway</h1>
      <iframe
        title="Orhanza Try On runway"
        src="/custom-made/runway/index.html?gender=men"
        className="block h-[calc(100svh-4rem)] w-full border-0"
      />
    </section>
  );
}
