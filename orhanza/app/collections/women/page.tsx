import type { Metadata } from "next";
import { Lookbook } from "@/components/sections/Lookbook";

export const metadata: Metadata = {
  title: "Women's Collection — Made-to-Measure Tailoring",
  description: "Browse Orhanza’s made-to-measure womenswear, tailored in Nepal.",
  alternates: { canonical: "/collections/women" },
};

export default function WomenCollectionPage() {
  return <Lookbook initial="women" />;
}
