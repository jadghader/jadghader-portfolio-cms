import React, { useState, useEffect } from "react";
import { ThemeProvider } from "styled-components";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import GlobalStyles from "./styles/GlobalStyles";
import { lightTheme, darkTheme } from "./styles/theme";
import Header from "./components/header/Header";
import HeroSection from "./components/hero/Hero";
import AboutSection from "./components/about/About";
import SkillsSection from "./components/skills/Skills";
import ProjectsSection from "./components/projects/Project";
import ContactForm from "./components/contact/Contact";
import Footer from "./components/footer/Footer";
import Login from "./components/auth/Login";
import { useAuth } from "./context/AuthContext";
import Settings from "./components/admin/Settings";
import { CircularProgress, Box } from "@mui/material"; // Import MUI CircularProgress
import NotFoundPage from "./components/404/NotFound";
import styled from "styled-components"; // Import styled-components

// Create a styled component for the loader wrapper
const StyledLoaderWrapper = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: ${(props) =>
    props.theme.background}; // Access background from the theme
`;

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const cv = `${process.env.PUBLIC_URL}/cv/Jad-Ghader-CV.docx`;
  const { isLoading: authLoading } = useAuth(); // Authentication loading state

  // Check localStorage for saved theme preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("isDarkMode");
    if (savedTheme !== null) {
      setIsDarkMode(JSON.parse(savedTheme)); // Parse the saved value and set the theme
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem("isDarkMode", JSON.stringify(newMode)); // Save the theme to localStorage
      return newMode;
    });
  };

  const downloadCV = () => {
    const link = document.createElement("a");
    link.href = cv;
    link.download = "Jad-Ghader-CV.docx";
    link.click();
  };

  if (authLoading) {
    // Show a loader if auth is loading
    return (
      <StyledLoaderWrapper>
        <CircularProgress />
      </StyledLoaderWrapper>
    );
  }

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <GlobalStyles />
      <Router>
        <Routes>
          <Route path="/auth/login" element={<Login />} />
          <Route path="/admin/*" element={<ProtectedAdminRoutes />} />
          <Route
            path="/"
            element={
              <>
                <Header
                  onDownloadCV={downloadCV}
                  toggleTheme={toggleTheme}
                  isDarkMode={isDarkMode}
                />
                <Home />
              </>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Footer />
      </Router>
    </ThemeProvider>
  );
};

// Protected Routes for Admin
const ProtectedAdminRoutes: React.FC = () => {
  const { isAdmin, isLoading } = useAuth();

  if (isLoading) return null; // Show nothing while loading

  return isAdmin ? (
    <Routes>
      <Route path="settings" element={<Settings />} />
      <Route path="*" element={<Navigate to="/admin/settings" />} />
    </Routes>
  ) : (
    <Navigate to="/auth/login" />
  );
};

// Home Component (Combines all public sections)
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

export default App;

