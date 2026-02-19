import styled from "styled-components";
import { Navigation } from "./components/Navigation";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Projects } from "./components/Projects";
import { Skills } from "./components/Skills";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { FloatingSocial } from "./components/FloatingSocial";
import { AppThemeProvider } from "./context/ThemeContext";
import { Experience } from "./components/Experience";

const PageWrapper = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.foreground};
  transition:
    background 0.3s ease,
    color 0.3s ease;
`;

export default function App() {
  return (
    <AppThemeProvider>
      <PageWrapper>
        <Navigation />
        <FloatingSocial />
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Contact />
        <Footer />
      </PageWrapper>
    </AppThemeProvider>
  );
}
