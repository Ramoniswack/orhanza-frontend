import type { Metadata } from "next";
import { Lookbook } from "@/components/sections/Lookbook";

export const metadata: Metadata = {
  title: "Men's Collection — Made-to-Measure Tailoring",
  description: "Browse Orhanza’s made-to-measure menswear, tailored in Nepal.",
  alternates: { canonical: "/collections/men" },
};

export default function MenCollectionPage() {
  return <Lookbook initial="men" />;
}
