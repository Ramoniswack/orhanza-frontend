import type { MetadataRoute } from "next";
import { shopProducts } from "@/lib/shop";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: site.url, lastModified: now, priority: 1 },
    { url: `${site.url}/shop`, lastModified: now, priority: 0.9 },
    { url: `${site.url}/contact`, lastModified: now, priority: 0.8 },
    { url: `${site.url}/about`, lastModified: now, priority: 0.7 },
    { url: `${site.url}/collections`, lastModified: now, priority: 0.8 },
    { url: `${site.url}/collections/men`, lastModified: now, priority: 0.8 },
    { url: `${site.url}/collections/women`, lastModified: now, priority: 0.8 },
    ...shopProducts.map((p) => ({ url: `${site.url}/shop/${p.slug}`, lastModified: now, priority: 0.6 })),
  ];
}
