// Single source of truth for both the SHOWCASE and LINEUP views.
// Replace the placeholder values below with real data (or fetch it and pass the
// array to <CollectionPage items={...} />). Image paths live in /public/collection/.
//   modelImage -> transparent full-body cutout   (N.png,   848x1264)
//   thumbImage -> flat-lay / small preview       (N.1.png, 1024x1024)

export type CollectionItem = {
  slug: string;
  title: string;
  description: string;
  price: string;
  modelImage: string;
  thumbImage: string;
};

export const collectionItems: CollectionItem[] = [
  {
    slug: "orhanza-product-1",
    title: "ORHANZA Product 1",
    description:
      "Placeholder description for ORHANZA Product 1. Replace with the real copy: fabric, fit and finishing details in two short lines.",
    price: "NPR 18,500",
    modelImage: "/collection/1.webp",
    thumbImage: "/collection/1.1.webp",
  },
  {
    slug: "orhanza-product-2",
    title: "ORHANZA Product 2",
    description:
      "Placeholder description for ORHANZA Product 2. Replace with the real copy: fabric, fit and finishing details in two short lines.",
    price: "NPR 21,900",
    modelImage: "/collection/2.webp",
    thumbImage: "/collection/2.1.webp",
  },
  {
    slug: "orhanza-product-3",
    title: "ORHANZA Product 3",
    description:
      "Placeholder description for ORHANZA Product 3. Replace with the real copy: fabric, fit and finishing details in two short lines.",
    price: "NPR 24,500",
    modelImage: "/collection/3.webp",
    thumbImage: "/collection/3.1.webp",
  },
  {
    slug: "orhanza-product-4",
    title: "ORHANZA Product 4",
    description:
      "Placeholder description for ORHANZA Product 4. Replace with the real copy: fabric, fit and finishing details in two short lines.",
    price: "NPR 26,900",
    modelImage: "/collection/4.webp",
    thumbImage: "/collection/4.1.webp",
  },
  {
    slug: "orhanza-product-5",
    title: "ORHANZA Product 5",
    description:
      "Placeholder description for ORHANZA Product 5. Replace with the real copy: fabric, fit and finishing details in two short lines.",
    price: "NPR 19,800",
    modelImage: "/collection/5.webp",
    thumbImage: "/collection/5.1.webp",
  },
  {
    slug: "orhanza-product-6",
    title: "ORHANZA Product 6",
    description:
      "Placeholder description for ORHANZA Product 6. Replace with the real copy: fabric, fit and finishing details in two short lines.",
    price: "NPR 32,500",
    modelImage: "/collection/6.webp",
    thumbImage: "/collection/6.1.webp",
  },
  {
    slug: "orhanza-product-7",
    title: "ORHANZA Product 7",
    description:
      "Placeholder description for ORHANZA Product 7. Replace with the real copy: fabric, fit and finishing details in two short lines.",
    price: "NPR 28,900",
    modelImage: "/collection/7.webp",
    thumbImage: "/collection/7.1.webp",
  },
  {
    slug: "orhanza-product-8",
    title: "ORHANZA Product 8",
    description:
      "Placeholder description for ORHANZA Product 8. Replace with the real copy: fabric, fit and finishing details in two short lines.",
    price: "NPR 23,400",
    modelImage: "/collection/8.webp",
    thumbImage: "/collection/8.1.webp",
  },
  {
    slug: "orhanza-product-9",
    title: "ORHANZA Product 9",
    description:
      "Placeholder description for ORHANZA Product 9. Replace with the real copy: fabric, fit and finishing details in two short lines.",
    price: "NPR 17,600",
    modelImage: "/collection/9.webp",
    thumbImage: "/collection/9.1.webp",
  },
  {
    slug: "orhanza-product-10",
    title: "ORHANZA Product 10",
    description:
      "Placeholder description for ORHANZA Product 10. Replace with the real copy: fabric, fit and finishing details in two short lines.",
    price: "NPR 35,900",
    modelImage: "/collection/10.webp",
    thumbImage: "/collection/10.1.webp",
  },
  {
    slug: "orhanza-product-11",
    title: "ORHANZA Product 11",
    description:
      "Placeholder description for ORHANZA Product 11. Replace with the real copy: fabric, fit and finishing details in two short lines.",
    price: "NPR 22,700",
    modelImage: "/collection/11.webp",
    thumbImage: "/collection/11.1.webp",
  },
  {
    slug: "orhanza-product-12",
    title: "ORHANZA Product 12",
    description:
      "Placeholder description for ORHANZA Product 12. Replace with the real copy: fabric, fit and finishing details in two short lines.",
    price: "NPR 27,500",
    modelImage: "/collection/12.webp",
    thumbImage: "/collection/12.1.webp",
  },
  {
    slug: "orhanza-product-13",
    title: "ORHANZA Product 13",
    description:
      "Placeholder description for ORHANZA Product 13. Replace with the real copy: fabric, fit and finishing details in two short lines.",
    price: "NPR 20,900",
    modelImage: "/collection/13.webp",
    thumbImage: "/collection/13.1.webp",
  },
  {
    slug: "orhanza-product-14",
    title: "ORHANZA Product 14",
    description:
      "Placeholder description for ORHANZA Product 14. Replace with the real copy: fabric, fit and finishing details in two short lines.",
    price: "NPR 31,200",
    modelImage: "/collection/14.webp",
    thumbImage: "/collection/14.1.webp",
  },
  {
    slug: "orhanza-product-15",
    title: "ORHANZA Product 15",
    description:
      "Placeholder description for ORHANZA Product 15. Replace with the real copy: fabric, fit and finishing details in two short lines.",
    price: "NPR 25,800",
    modelImage: "/collection/15.webp",
    thumbImage: "/collection/15.1.webp",
  },
];
