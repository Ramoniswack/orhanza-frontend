import { About } from "@/components/About";
import { ContactForm } from "@/components/ContactForm";
import { Fabrics } from "@/components/Fabrics";
import { FeatureGrid } from "@/components/FeatureGrid";
import { Gallery } from "@/components/Gallery";
import { HeroScroll } from "@/components/HeroScroll";
import { InstagramBanner } from "@/components/InstagramBanner";
import { NewArrivals } from "@/components/NewArrivals";
import { Process } from "@/components/Process";
import { Services } from "@/components/Services";
import { Testimonials } from "@/components/Testimonials";

export default function Home() {
  return (
    <>
      <HeroScroll />
      <FeatureGrid />
      <NewArrivals />
      <About />
      <Services />
      <Process />
      <Fabrics />
      <Gallery />
      <Testimonials />
      <InstagramBanner />
      <ContactForm />
    </>
  );
}
