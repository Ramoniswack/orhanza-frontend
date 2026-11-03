"use client";

import { AboutCta } from "./AboutCta";
import { AboutHero } from "./AboutHero";
import { AboutJourney } from "./AboutJourney";
import { AboutMaker } from "./AboutMaker";

export function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutMaker />
      <AboutJourney />
      <AboutCta />
    </>
  );
}
