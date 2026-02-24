import styled from "styled-components";
import { motion } from "framer-motion";
import { Menu, X, Download } from "lucide-react";
import { useState, useEffect } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { gradientBgMixin, gradientTextMixin } from "../styles/mixins";
import { getData } from "../firebase/firestore";

// ─── Styled Components ────────────────────────────────────────────────────────

const Nav = styled(motion.nav)<{ $scrolled: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  transition:
    background 0.5s ease,
    box-shadow 0.5s ease,
    border-color 0.5s ease,
    backdrop-filter 0.5s ease;
  background: ${({ $scrolled, theme }) =>
    $scrolled ? theme.backgroundNav : "transparent"};
  backdrop-filter: ${({ $scrolled }) => ($scrolled ? "blur(20px)" : "none")};
  -webkit-backdrop-filter: ${({ $scrolled }) =>
    $scrolled ? "blur(20px)" : "none"};
  border-bottom: ${({ $scrolled, theme }) =>
    $scrolled ? `1px solid ${theme.border}` : "1px solid transparent"};
  box-shadow: ${({ $scrolled, theme }) =>
    $scrolled ? theme.shadowNavScrolled : "none"};
`;

const NavInner = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1.5rem;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LogoArea = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
`;

const LogoMark = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 10px;
  ${gradientBgMixin};
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.35);
  font-family: "Plus Jakarta Sans", sans-serif;
  font-weight: 800;
  font-size: 0.8rem;
  color: #fff;
`;

const LogoText = styled.span`
  font-family: "Plus Jakarta Sans", sans-serif;
  font-size: 1.2rem;
  font-weight: 800;
  color: ${({ theme }) => theme.foreground};
`;

const LogoAccent = styled.span`
  ${gradientTextMixin};
`;

const DesktopLinks = styled.div`
  display: none;
  align-items: center;
  gap: 2px;

  @media (min-width: 768px) {
    display: flex;
  }
`;

const NavLink = styled.button`
  position: relative;
  padding: 8px 16px;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.foregroundMuted};
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  border-radius: 10px;
  transition:
    color 0.2s ease,
    background 0.2s ease;

  &::after {
    content: "";
    position: absolute;
    bottom: 4px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 2px;
    border-radius: 2px;
    background: ${({ theme }) => theme.gradientPrimary};
    transition: width 0.3s ease;
  }

  &:hover {
    color: ${({ theme }) => theme.primary};
    background: ${({ theme }) =>
      theme.isDark ? "rgba(99,102,241,0.08)" : "rgba(99,102,241,0.06)"};

    &::after {
      width: 60%;
    }
  }
`;

const DesktopActions = styled.div`
  display: none;
  align-items: center;
  gap: 12px;

  @media (min-width: 768px) {
    display: flex;
  }
`;

const ResumeBtn = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 9px 20px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  font-family: "Plus Jakarta Sans", sans-serif;
  font-weight: 700;
  font-size: 0.875rem;
  color: #ffffff;
  ${gradientBgMixin};
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.3);
  transition:
    opacity 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    opacity: 0.9;
    box-shadow: 0 8px 28px rgba(99, 102, 241, 0.45);
  }
`;

const MobileActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  @media (min-width: 768px) {
    display: none;
  }
`;

const HamburgerBtn = styled.button`
  padding: 8px;
  border-radius: 10px;
  border: none;
  background: ${({ theme }) => theme.backgroundIconPill};
  color: ${({ theme }) => theme.foreground};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease;

  &:hover {
    background: ${({ theme }) =>
      theme.isDark ? "rgba(99,102,241,0.1)" : "rgba(99,102,241,0.08)"};
  }
`;

const MobileMenu = styled(motion.div)`
  background: ${({ theme }) =>
    theme.isDark ? "rgba(2,8,23,0.96)" : "rgba(255,255,255,0.97)"};
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-top: 1px solid ${({ theme }) => theme.border};

  @media (min-width: 768px) {
    display: none;
  }
`;

const MobileMenuInner = styled.div`
  padding: 16px 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const MobileLink = styled.button`
  width: 100%;
  text-align: left;
  padding: 12px 16px;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.foreground};
  font-size: 1rem;
  font-weight: 500;
  border-radius: 12px;
  cursor: pointer;
  transition:
    color 0.2s ease,
    background 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.primary};
    background: ${({ theme }) =>
      theme.isDark ? "rgba(99,102,241,0.08)" : "rgba(99,102,241,0.06)"};
  }
`;

const MobileResume = styled.button`
  margin-top: 8px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 13px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  font-family: "Plus Jakarta Sans", sans-serif;
  font-weight: 700;
  font-size: 0.9375rem;
  color: #ffffff;
  ${gradientBgMixin};
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.3);
`;

// ─── Component ────────────────────────────────────────────────────────────────

const navItems = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadResumeUrl = async () => {
      const data = await getData("siteContent", "navbar");
      if (isMounted) setResumeUrl(data?.resumeUrl || null);
    };

    loadResumeUrl();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    setIsOpen(false);
  };

  const handleResumeClick = () => {
    if (resumeUrl) {
      let downloadUrl = resumeUrl;
      
      // Convert Google Docs link to PDF export
      const googleDocsMatch = resumeUrl.match(/\/document\/d\/([a-zA-Z0-9-_]+)/);
      if (googleDocsMatch) {
        const docId = googleDocsMatch[1];
        downloadUrl = `https://docs.google.com/document/d/${docId}/export?format=pdf`;
      }
      
      // Create a temporary anchor element to trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'Jad-Ghader-Resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert("Resume URL not available");
    }
  };

  return (
    <Nav
      $scrolled={scrolled}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <NavInner>
        {/* Logo */}
        <LogoArea
          whileHover={{ scale: 1.02 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <LogoMark>JG</LogoMark>
          <LogoText>
            Jad <LogoAccent>Ghader</LogoAccent>
          </LogoText>
        </LogoArea>

        {/* Desktop links */}
        <DesktopLinks>
          {navItems.map((item) => (
            <NavLink key={item.href} onClick={() => scrollTo(item.href)}>
              {item.label}
            </NavLink>
          ))}
        </DesktopLinks>

        {/* Desktop actions */}
        <DesktopActions>
          <ThemeToggle />
          <ResumeBtn
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleResumeClick}
          >
            <Download size={16} />
            Resume
          </ResumeBtn>
        </DesktopActions>

        {/* Mobile actions */}
        <MobileActions>
          <ThemeToggle />
          <HamburgerBtn onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </HamburgerBtn>
        </MobileActions>
      </NavInner>

      {/* Mobile menu */}
      {isOpen && (
        <MobileMenu
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <MobileMenuInner>
            {navItems.map((item) => (
              <MobileLink key={item.href} onClick={() => scrollTo(item.href)}>
                {item.label}
              </MobileLink>
            ))}
            <MobileResume
              onClick={handleResumeClick}
            >
              <Download size={16} />
              Download Resume
            </MobileResume>
          </MobileMenuInner>
        </MobileMenu>
      )}
    </Nav>
  );
}
