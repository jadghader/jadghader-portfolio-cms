import React, { useState, useEffect } from "react";
import { Link } from "react-scroll";
import { FaSun, FaMoon } from "react-icons/fa";
import styled from "styled-components";
import DownloadButton from "../styled-components/DownloadButton";
import { useDeviceType } from "../../hooks/useDeviceType";
import { ReactComponent as LightMenuBar } from "../../assets/light/light-menu.svg";
import { ReactComponent as LightCloseBar } from "../../assets/light/light-close.svg";
import { ReactComponent as DarkMenuBar } from "../../assets/dark/dark-menu.svg";
import { ReactComponent as DarkCloseBar } from "../../assets/dark/dark-close.svg";

interface HeaderProps {
  onDownloadCV: () => void;
  toggleTheme: () => void;
  isDarkMode: boolean;
}

const Header: React.FC<HeaderProps> = ({
  onDownloadCV,
  toggleTheme,
  isDarkMode,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const deviceType = useDeviceType();

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden"; // lock page scroll
      document.documentElement.style.overflow = "hidden"; // extra safety
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <>
      <NavContainer isDarkMode={isDarkMode} deviceType={deviceType}>
        {deviceType === "desktop" ? (
          <DesktopHeader
            onDownloadCV={onDownloadCV}
            toggleTheme={toggleTheme}
            isDarkMode={isDarkMode}
            isMenuOpen={isMenuOpen}
          />
        ) : (
          <MobileHeader
            onDownloadCV={onDownloadCV}
            toggleTheme={toggleTheme}
            isDarkMode={isDarkMode}
            isMenuOpen={isMenuOpen}
            toggleMenu={toggleMenu}
            closeMenu={closeMenu}
          />
        )}
      </NavContainer>
    </>
  );
};

// ==================== Desktop Header ====================
const DesktopHeader: React.FC<HeaderProps & { isMenuOpen: boolean }> = ({
  onDownloadCV,
  toggleTheme,
  isDarkMode,
  isMenuOpen,
}) => {
  return (
    <>
      <Logo to="/">
        <span>Jad Ghader</span>
      </Logo>
      <NavLinks isMenuOpen={isMenuOpen}>
        <NavItem to="about" smooth duration={500}>
          About
        </NavItem>
        <NavItem to="skills" smooth duration={500}>
          Skills
        </NavItem>
        <NavItem to="projects" smooth duration={500}>
          Projects
        </NavItem>
        <NavItem to="contact" smooth duration={500}>
          Contact
        </NavItem>
        <DownloadButton onClick={onDownloadCV} />
        <ThemeToggleButton onClick={toggleTheme}>
          {isDarkMode ? <FaMoon /> : <FaSun />}
        </ThemeToggleButton>
      </NavLinks>
    </>
  );
};

// ==================== Mobile Header ====================
const MobileHeader: React.FC<
  HeaderProps & {
    isMenuOpen: boolean;
    toggleMenu: () => void;
    closeMenu: () => void;
  }
> = ({
  onDownloadCV,
  toggleTheme,
  isDarkMode,
  isMenuOpen,
  toggleMenu,
  closeMenu,
}) => {
  return (
    <>
      <Logo to="/">
        <span>Jad Ghader</span>
      </Logo>
      <HamburgerButton onClick={toggleMenu}>
        <IconWrapper isMenuOpen={isMenuOpen}>
          {isDarkMode ? (
            isMenuOpen ? (
              <DarkCloseBar />
            ) : (
              <DarkMenuBar />
            )
          ) : isMenuOpen ? (
            <LightCloseBar />
          ) : (
            <LightMenuBar />
          )}
        </IconWrapper>
      </HamburgerButton>
      <NavLinks isMenuOpen={isMenuOpen}>
        <NavItem to="about" smooth duration={500} onClick={closeMenu}>
          About
        </NavItem>
        <NavItem to="skills" smooth duration={500} onClick={closeMenu}>
          Skills
        </NavItem>
        <NavItem to="projects" smooth duration={500} onClick={closeMenu}>
          Projects
        </NavItem>
        <NavItem to="contact" smooth duration={500} onClick={closeMenu}>
          Contact
        </NavItem>
        <DownloadButton onClick={onDownloadCV} />
        <ThemeToggleButton onClick={toggleTheme}>
          {isDarkMode ? <FaMoon /> : <FaSun />}
        </ThemeToggleButton>
      </NavLinks>
      {isMenuOpen && <Overlay onClick={closeMenu} isMenuOpen={isMenuOpen} />}
    </>
  );
};

export default Header;

// ==================== Styled Components ====================
const NavContainer = styled.nav<{
  isDarkMode: boolean;
  deviceType: "mobile" | "tablet" | "desktop";
}>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  position: sticky;
  top: 0;
  width: 100%;
  z-index: 100;
  backdrop-filter: blur(10px);
  background: ${({ isDarkMode }) =>
    isDarkMode ? "rgba(31,31,31,0.6)" : "rgba(255,255,255,0.7)"};
  transition: background-color 0.3s ease-in-out;
  @media (max-width: 768px) {
    align-items: flex-start;
  }
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  gap: 10px;

  &::before {
    content: "J";
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    background-color: ${({ theme }) => theme.inputText};
    border-radius: 50%;
    font-size: 24px;
    font-weight: bold;
    color: ${({ theme }) => theme.background};
  }

  span {
    font-size: 20px;
    font-weight: bold;
    color: ${({ theme }) => theme.text};
  }
`;

const HamburgerButton = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 102;
  @media (max-width: 768px) {
    display: block;
  }
`;

const IconWrapper = styled.div<{ isMenuOpen: boolean }>`
  position: relative;
  width: 36px;
  height: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    transition: transform 0.3s ease, opacity 0.3s ease;
    transform: ${({ isMenuOpen }) =>
      isMenuOpen ? "rotate(180deg)" : "rotate(0deg)"};
  }
`;

const NavItem = styled(Link)`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.text};
  text-decoration: none;
  &:hover {
    color: ${({ theme }) => theme.accent};
  }
`;

const ThemeToggleButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.text};
  font-size: 1.5rem;
  margin-top: 5px;
  cursor: pointer;
  &:hover {
    color: ${({ theme }) => theme.accent};
  }
`;

const NavLinks = styled.div<{ isMenuOpen: boolean }>`
  display: flex;
  align-items: center;
  gap: 20px;
  transition: transform 0.3s ease, opacity 0.3s ease;
  z-index: 101;

@media (max-width: 768px) {
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh; // MUST be 100vh
  background: ${({ theme }) => theme.background};
  border-left: 2px solid ${({ theme }) => theme.border};
  transform: ${({ isMenuOpen }) =>
    isMenuOpen ? "translate3d(0,0,0)" : "translate3d(100%,0,0)"};
  opacity: ${({ isMenuOpen }) => (isMenuOpen ? 1 : 0)};
  padding: 40px 20px;
  box-shadow: -2px 0px 10px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  z-index: 101;
  overflow-y: auto;   // scroll inside menu if needed
  overflow-x: hidden;
}

`;

const Overlay = styled.div<{ isMenuOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  transition: opacity 0.3s ease;
  opacity: ${({ isMenuOpen }) => (isMenuOpen ? 1 : 0)};
  pointer-events: ${({ isMenuOpen }) => (isMenuOpen ? "auto" : "none")};
  cursor: pointer;
`;
