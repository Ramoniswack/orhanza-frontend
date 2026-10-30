import { Booking } from "@/components/sections/Booking";
import { Clients } from "@/components/sections/Clients";
import { Commissions } from "@/components/sections/Commissions";
import { Craft } from "@/components/sections/Craft";
import { Expertise } from "@/components/sections/Expertise";
import { Fabrics } from "@/components/sections/Fabrics";
import { Faq } from "@/components/sections/Faq";
import { HomeTailoring } from "@/components/sections/HomeTailoring";
import { Hero } from "@/components/sections/Hero";
import { SelectedProjects } from "@/components/sections/SelectedProjects";
import { Showreel } from "@/components/sections/Showreel";
import { Stats } from "@/components/sections/Stats";
import { Testimonials } from "@/components/sections/Testimonials";

export default function Home() {
  return (
    <>
      <Hero />              {/* 0  */}
      <SelectedProjects />  {/* 1  dark, 3 rows */}
      <Fabrics />           {/* 2  white, pinned horizontal */}
      <HomeTailoring />     {/* 3  dark timeline (replaces Services + Process) */}
      <Craft />             {/* 4  */}
      <Stats />             {/* 5  odometer rows */}
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
