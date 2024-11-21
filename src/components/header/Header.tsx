import React, { useState, useEffect } from "react";
import { Link } from "react-scroll";
import { FaSun, FaMoon, FaBars, FaTimes } from "react-icons/fa";
import styled from "styled-components";
import DownloadButton from "../styled-components/DownloadButton";

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

  const toggleMenu = () => {
    setIsMenuOpen((prevState) => !prevState);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Lock scroll behavior when the menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden"; // Disable vertical scrolling
      document.body.style.position = "fixed"; // Prevent horizontal movement
      document.body.style.width = "100%"; // Maintain full width
    } else {
      document.body.style.overflow = "auto"; // Restore scrolling
      document.body.style.position = "static";
      document.body.style.width = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
      document.body.style.position = "static";
      document.body.style.width = "auto";
    };
  }, [isMenuOpen]);

  return (
    <NavContainer isDarkMode={isDarkMode}>
      <Logo to="/">&lt;JG/&gt;</Logo>

      <HamburgerButton onClick={toggleMenu} isMenuOpen={isMenuOpen}>
        {isMenuOpen ? <FaTimes /> : <FaBars />}
      </HamburgerButton>

      <NavLinks isMenuOpen={isMenuOpen}>
        <NavItem to="about" smooth={true} duration={500} onClick={closeMenu}>
          About
        </NavItem>
        <NavItem to="skills" smooth={true} duration={500} onClick={closeMenu}>
          Skills
        </NavItem>
        <NavItem to="projects" smooth={true} duration={500} onClick={closeMenu}>
          Projects
        </NavItem>
        <NavItem to="contact" smooth={true} duration={500} onClick={closeMenu}>
          Contact
        </NavItem>
        <DownloadButton onClick={onDownloadCV} />
        <ThemeToggleButton onClick={toggleTheme}>
          {isDarkMode ? <FaMoon /> : <FaSun />}
        </ThemeToggleButton>
      </NavLinks>

      {isMenuOpen && <Overlay onClick={closeMenu} />}
    </NavContainer>
  );
};

export default Header;

// Styled Components
const NavContainer = styled.nav<{ isDarkMode: boolean }>`
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
    isDarkMode ? "rgba(31, 31, 31, 0.6)" : "rgba(255, 255, 255, 0.7)"};
  transition: background-color 0.3s ease-in-out;
`;

const Logo = styled(Link)`
  font-size: 1.6rem;
  font-weight: bold;
  color: ${({ theme }) => theme.text};
  text-decoration: none;
  transition: color 0.3s ease-in-out;
  z-index: 15;

  &:hover {
    color: ${({ theme }) => theme.accent};
  }
`;

const HamburgerButton = styled.button<{ isMenuOpen: boolean }>`
  display: none;
  background: none;
  border: none;
  color: ${({ theme }) => theme.text};
  font-size: 1.6rem;
  cursor: pointer;
  z-index: 102;

  @media (max-width: 768px) {
    display: block;
  }

  &:hover {
    color: ${({ theme }) => theme.accent};
  }
`;

const NavLinks = styled.div<{ isMenuOpen: boolean }>`
  display: flex;
  align-items: center;
  gap: 20px;
  transition: transform 0.3s ease-in-out;
  z-index: 101;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    right: 0;
    width: 100vw;
    height: 100vh;
    background: ${({ theme }) => theme.background};
    border-left: 2px solid ${({ theme }) => theme.border};
    transform: ${({ isMenuOpen }) =>
      isMenuOpen ? "translateX(0)" : "translateX(100%)"};
    padding: 40px 20px;
    box-shadow: -2px 0px 10px rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(10px);
    z-index: 101;
    overflow: hidden; /* Prevent horizontal and vertical scroll in the menu */
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

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  cursor: pointer;
`;
