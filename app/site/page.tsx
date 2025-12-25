import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import CoreValuesSection from "@/components/CoreValuesSection";
import MedicalTeamSection from "@/components/MedicalTeamSection";

export default function HomePage() {
  return (
    <>
      <HeroSection id="home" />
      <AboutSection id="about" />
      <CoreValuesSection id="services" />
      <MedicalTeamSection id="team" />
    </>
  );
}
