import React from "react";
import AboutSection from '../about/About';
import HeroSection from '../hero/Hero';
import ContactForm from "../contact/Contact";
import ProjectsSection from "../projects/Project";
import SkillsSection from "../skills/Skills";

const Home: React.FC = () => (
  <>
    <HeroSection />
    <div id="about">
      <AboutSection />
    </div>
    <div id="skills">
      <SkillsSection />
    </div>
    <div id="projects">
      <ProjectsSection />
    </div>
    <div id="contact">
      <ContactForm />
    </div>
  </>
);

export default Home;
