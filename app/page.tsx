import { Booking } from "@/components/sections/Booking";
import { Clients } from "@/components/sections/Clients";
import { Craft } from "@/components/sections/Craft";
import { Expertise } from "@/components/sections/Expertise";
import { Faq } from "@/components/sections/Faq";
import { HomeTailoring } from "@/components/sections/HomeTailoring";
import { SuitStory } from "@/components/sections/SuitStory";
import { CustomMadeTeaser } from "@/components/sections/CustomMadeTeaser";
import { ShopPreview } from "@/components/sections/ShopPreview";
import { Showreel } from "@/components/sections/Showreel";

export default function Home() {
  return (
    <>
      <SuitStory />         {/* landing — pinned suit, headlines, then the selected commissions float up */}
      <ShopPreview />       {/* shop — men / women, links straight to product pages */}
      <CustomMadeTeaser />  {/* made to measure — cloth cross-fade on scroll */}
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
