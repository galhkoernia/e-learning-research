import { AboutLearning } from "./AboutLearning";
import { Benefits } from "./Benefits";
import { CTA } from "./CTA";
import { FeaturedLearning } from "./FeaturedLearning";
import { Footer } from "./Footer";
import { Hero } from "./Hero";
import { LearningProcess } from "./LearningProcess";
import { Navbar } from "./Navbar";

export function LandingPage() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <Benefits />
        <AboutLearning />
        <FeaturedLearning />
        <LearningProcess />
        <CTA />
      </main>

      <Footer />
    </>
  );
}