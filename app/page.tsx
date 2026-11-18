import { Booking } from "@/components/sections/Booking";
import { Clients } from "@/components/sections/Clients";
import { Craft } from "@/components/sections/Craft";
import { Expertise } from "@/components/sections/Expertise";
import { Faq } from "@/components/sections/Faq";
import { HeroVideo } from "@/components/sections/HeroVideo";
import { HomeTailoring } from "@/components/sections/HomeTailoring";
import { SelectedPieces } from "@/components/sections/SelectedPieces";
import { Showreel } from "@/components/sections/Showreel";

export default function Home() {
  return (
    <>
      <HeroVideo />         {/* hero — film of the atelier */}
      <SelectedPieces />    {/* selected pieces — pinned horizontal card slider */}
      <HomeTailoring />     {/* process — measuring-tape step list */}
      <Craft />             {/* 4  */}
      <Showreel />          {/* 6  expand on scroll */}
      <Expertise />         {/* 8  bento */}
      <Clients />           {/* 11 */}
      <Faq />               {/* 12 */}
      <Booking />           {/* booking form (id="book") */}
    </>
  );
}
