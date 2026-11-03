import type { Metadata } from "next";
import { AboutPage } from "@/components/about/AboutPage";

export const metadata: Metadata = {
  title: "About — Tailoring House in Jhamsikhel, Kathmandu",
  description: "Meet Orhanza: a made-to-measure tailoring house in Jhamsikhel, Kathmandu, founded by Kriti Maharjan. Precision tailoring, curated fabrics and a fit that is yours alone.",
  alternates: { canonical: "/about" },
};

/** Header and Footer come from app/layout.tsx — this page only renders its own sections. */
export default function About() {
  return <AboutPage />;
}
