import type { MetadataRoute } from "next";
import { products } from "@/lib/data";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: site.url, lastModified: now, priority: 1 },
    { url: `${site.url}/collections`, lastModified: now, priority: 0.8 },
    ...products.map((p) => ({ url: `${site.url}/collections/${p.slug}`, lastModified: now, priority: 0.6 })),
  ];
}
