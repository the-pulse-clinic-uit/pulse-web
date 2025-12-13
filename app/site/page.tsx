import HeroSection from "@/app/site/(patient)/components/HeroSection";
import AboutSection from "@/app/site/(patient)/components/AboutSection";
import CoreValuesSection from "@/app/site/(patient)/components/CoreValuesSection";
import MedicalTeamSection from "@/app/site/(patient)/components/MedicalTeamSection";

export default function SitePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <CoreValuesSection />
      <MedicalTeamSection />
    </>
  );
}
