import type { Metadata } from "next";
import { Lookbook } from "@/components/sections/Lookbook";

export const metadata: Metadata = {
  title: "Collection — Custom Suits, Shirts & Coat-Pant Sets",
  description: "Browse Orhanza’s made-to-measure business suits, wedding suits, coat-pant sets and custom shirts, tailored in Nepal.",
  alternates: { canonical: "/collections" },
};

export default function CollectionsPage() {
  return (
    <Lookbook />
  );
}
