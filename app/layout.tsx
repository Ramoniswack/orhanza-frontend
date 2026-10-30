import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/sections/Footer";
import { Shell } from "@/components/Shell";
import { site } from "@/lib/site";

const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600"], style: ["normal", "italic"], variable: "--font-cormorant", display: "swap" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-jakarta", display: "swap" });

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

export const viewport: Viewport = { themeColor: "#111318" };

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
    <html lang="en" className={`${jakarta.variable} ${cormorant.variable}`}>
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
