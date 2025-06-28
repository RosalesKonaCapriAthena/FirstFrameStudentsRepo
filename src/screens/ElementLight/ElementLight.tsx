import React from "react";
import { HeroSection } from "./sections/HeroSection/HeroSection";
import { BenefitsOverviewSection } from "./sections/BenefitsOverviewSection/BenefitsOverviewSection";
import { ProcessOverviewSection } from "./sections/ProcessOverviewSection/ProcessOverviewSection";
import { CaseStudiesSection } from "./sections/CaseStudiesSection/CaseStudiesSection";
import { MainContentSection } from "./sections/MainContentSection/MainContentSection";
import { NavigationSection } from "./sections/NavigationSection/NavigationSection";

export const ElementLight = (): JSX.Element => {
  return (
    <div className="flex flex-col w-full items-start relative bg-neutral-900 min-h-screen">
      <NavigationSection />
      <HeroSection />
      <BenefitsOverviewSection />
      <ProcessOverviewSection />
      <CaseStudiesSection />
      <MainContentSection />
    </div>
  );
};