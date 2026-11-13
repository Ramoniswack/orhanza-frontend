import { Booking } from "@/components/sections/Booking";
import { Clients } from "@/components/sections/Clients";
import { Commissions } from "@/components/sections/Commissions";
import { Craft } from "@/components/sections/Craft";
import { Expertise } from "@/components/sections/Expertise";
import { Fabrics } from "@/components/sections/Fabrics";
import { Faq } from "@/components/sections/Faq";
import { HomeTailoring } from "@/components/sections/HomeTailoring";
import { SuitStory } from "@/components/sections/SuitStory";
import { SelectedProjects } from "@/components/sections/SelectedProjects";
import { CustomMadeTeaser } from "@/components/sections/CustomMadeTeaser";
import { ShopPreview } from "@/components/sections/ShopPreview";
import { Showreel } from "@/components/sections/Showreel";
import { Testimonials } from "@/components/sections/Testimonials";

export default function Home() {
  return (
    <>
      <SuitStory />         {/* 0  landing — pinned scroll-driven suit story ("Cut once") */}
      <SelectedProjects />  {/* 1  dark, 3 rows */}
      <ShopPreview />       {/* shop — men / women, links straight to product pages */}
      <CustomMadeTeaser />  {/* made to measure — cloth cross-fade on scroll */}
      <Fabrics />           {/* 2  white, pinned horizontal */}
      <HomeTailoring />     {/* 3  dark timeline (replaces Services + Process) */}
      <Craft />             {/* 4  */}
      <Showreel />          {/* 6  expand on scroll */}
      <Expertise />         {/* 8  bento */}
      <Testimonials />      {/* 9  dark */}
      <Commissions />       {/* 10 */}
      <Clients />           {/* 11 */}
      <Faq />               {/* 12 */}
      <Booking />           {/* booking form (id="book") */}
    </>
  );
}
