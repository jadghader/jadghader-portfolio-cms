import React from "react";
import { ThemeProvider } from "styled-components";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import GlobalStyles from "./styles/GlobalStyles";
import { lightTheme, darkTheme } from "./styles/theme";
import { useTheme } from "./hooks/useTheme";
import NotFound from "./components/404/NotFound";
import Footer from "./components/footer/Footer";
import Header from "./components/header/Header";
import Loader from "./components/styled-components/Loader";
import { useAuth } from "./context/AuthContext";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import { downloadCV } from "./utils/downloadCV"; // Import the utility function
import Login from "./components/auth/Login";
import Home from "./components/home/Home";
import Settings from "./components/admin/Settings";
import AdminDashboard from "./components/admin/Dahboard";

const App: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { isLoading: authLoading } = useAuth();
  const cv = `${process.env.PUBLIC_URL}/cv/Jad-Ghader-CV.docx`;

  if (authLoading) return <Loader />;

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <GlobalStyles />
      <Router>
        <AppContent toggleTheme={toggleTheme} isDarkMode={isDarkMode} cv={cv} />
      </Router>
    </ThemeProvider>
  );
};

const AppContent = ({ toggleTheme, isDarkMode, cv }: any) => {
  const location = useLocation();
  const isHomePage = location.pathname === "/"; // Check if the current path is the home page

  return (
    <>
      {isHomePage && (
        <Header
          toggleTheme={toggleTheme}
          isDarkMode={isDarkMode}
          onDownloadCV={() => downloadCV(cv)}
        />
      )}

      <Routes>
        <Route path="/auth/login" element={<Login />} />

        <Route path="/admin/*" element={<ProtectedRoutes />}>
          <Route path="*" element={<Navigate to="/admin/dashboard" />} />

          <Route path="settings/:section" element={<Settings />} />
          <Route path="dashboard" element={<AdminDashboard />} />
        </Route>

        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
};

export default App;
