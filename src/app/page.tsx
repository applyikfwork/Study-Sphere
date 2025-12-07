import { HeroSection } from "@/components/home/hero-section";
import { FeaturesSection } from "@/components/home/features-section";
import { SubjectsSection } from "@/components/home/subjects-section";
import { ExamSection } from "@/components/home/exam-section";

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <SubjectsSection />
      <ExamSection />
    </>
  );
}
