import Image from "next/image";
import { Booking } from "@/components/sections/Booking";
import { EditorialHero } from "@/components/sections/EditorialHero";
import { Expertise } from "@/components/sections/Expertise";
import { HomeTailoring } from "@/components/sections/HomeTailoring";
import { SelectedPieces } from "@/components/sections/SelectedPieces";

export default function Home() {
  return (
    <>
      <EditorialHero />
      <SelectedPieces />
      <HomeTailoring />
      <section aria-label="The Orhanza atelier" className="relative h-[58svh] min-h-[24rem] max-h-[52rem] overflow-hidden">
        <Image
          src="/images/banners/craft-hands.webp"
          alt="A tailor working at the Orhanza atelier workbench"
          fill
          sizes="100vw"
          className="object-cover"
        />
      </section>
      <Expertise />
      <Booking />
    </>
  );
}
