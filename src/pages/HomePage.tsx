import { useSeo } from "@/hooks/use-seo";
import { Hero } from "@/components/portfolio/Hero";
import { StudioAutomationExamples } from "@/components/portfolio/StudioAutomationExamples";
import { Contact } from "@/components/portfolio/Contact";
import { TourProvider } from "@/components/portfolio/tour/TourProvider";
import { LauraGuide } from "@/components/portfolio/tour/LauraGuide";
import { StudioAbout, StudioFaq, StudioFooter, StudioNav, StudioProcess, StudioServices, StudioWork } from "@/components/portfolio/StudioSections";
import { HOME, HOME_SCHEMA } from "@/lib/home-content.mjs";
import "@/components/portfolio/studio.css";

export function HomePage() {
  useSeo({
    title: HOME.title,
    description: HOME.description,
    path: "/",
    customSchema: HOME_SCHEMA,
  });

  return (
    <TourProvider>
    <div className="portfolio-studio relative min-h-screen overflow-x-clip">
      <StudioNav />
      <main>
        <Hero />
        <StudioServices />
        <StudioWork />
        <StudioAutomationExamples />
        <StudioAbout />
        <StudioProcess />
        <StudioFaq />
        <Contact studio />
      </main>
      <StudioFooter />
      <LauraGuide />
    </div>
    </TourProvider>
  );
}
