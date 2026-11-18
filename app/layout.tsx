import type { Metadata, Viewport } from "next";
import { Jost } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/sections/Footer";
import { Shell } from "@/components/Shell";
import { site } from "@/lib/site";

// One typeface for the whole site: Jost — a quiet, geometric, minimal sans (the fashion-house look). Headlines are the same face, just light.
const jost = Jost({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"], variable: "--font-jost", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: "%s | Orhanza" },
  description: site.description,
  keywords: site.keywords,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    title: site.title,
    description: site.description,
    siteName: "Orhanza",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Orhanza — premium made-to-measure suits in Nepal" }],
  },
  twitter: { card: "summary_large_image", title: site.title, description: site.description, images: ["/og.jpg"] },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#111318" };

const jsonLd = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "ClothingStore"],
  name: "Orhanza",
  description: site.description,
  url: site.url,
  sameAs: [site.instagram],
  address: { "@type": "PostalAddress", addressLocality: "Jhamsikhel, Lalitpur", addressCountry: "NP" },
  founder: { "@type": "Person", name: "Kriti Maharjan" },
  knowsAbout: ["bespoke tailoring", "made-to-measure suits", "custom shirts", "wedding wear"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={jost.variable}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <Shell>
          <main className="relative z-10 bg-white">{children}</main>
          <Footer />
        </Shell>
      </body>
    </html>
  );
}
