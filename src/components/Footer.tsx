import styled from "styled-components";
import { motion } from "framer-motion";
import { Github, Linkedin } from "lucide-react";
import { gradientBgMixin, gradientTextMixin } from "../styles/mixins";
import { useSiteContent } from "../context/SiteContentContext";
import type { FooterDoc } from "../interfaces/firestore.interface";

// ─── Styled Components ────────────────────────────────────────────────────────

const FooterEl = styled.footer`
  position: relative;
  background: ${({ theme }) => theme.backgroundFooter};
  color: #e2e8f0;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(99, 102, 241, 0.5),
      transparent
    );
  }
`;

const FooterGlow = styled.div`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 600px;
  height: 180px;
  background: rgba(99, 102, 241, 0.07);
  filter: blur(80px);
  border-radius: 50%;
  pointer-events: none;
`;

const Container = styled.div`
  position: relative;
  max-width: 1280px;
  margin: 0 auto;
  padding: 3.5rem 1.5rem 2rem;
`;

const TopGrid = styled.div`
  display: grid;
  gap: 2.5rem;
  margin-bottom: 3rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }
`;

// ── Brand ──

const BrandArea = styled.div``;

const LogoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 1rem;
`;

const LogoMark = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 10px;
  ${gradientBgMixin};
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Plus Jakarta Sans", sans-serif;
  font-weight: 800;
  font-size: 0.8rem;
  color: #fff;
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.35);
`;

const LogoText = styled.span`
  font-family: "Plus Jakarta Sans", sans-serif;
  font-size: 1.2rem;
  font-weight: 800;
  color: #e2e8f0;
`;

const LogoAccent = styled.span`
  ${gradientTextMixin};
`;

const BrandDesc = styled.p`
  font-size: 0.875rem;
  line-height: 1.7;
  color: #64748b;
  max-width: 260px;
`;

// ── Links ──

const LinksCol = styled.div``;

const ColTitle = styled.h4`
  font-size: 0.875rem;
  font-weight: 600;
  color: #cbd5e1;
  margin-bottom: 1.25rem;
  font-family: "Plus Jakarta Sans", sans-serif;
  letter-spacing: 0.02em;
`;

const LinkList = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const LinkItem = styled.button`
  background: none;
  border: none;
  color: #64748b;
  font-size: 0.875rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0;
  transition: color 0.2s ease;
  font-family: "Inter", sans-serif;
  padding: 0;

  &::before {
    content: "";
    display: inline-block;
    width: 0;
    height: 2px;
    border-radius: 2px;
    background: linear-gradient(90deg, #6366f1, #8b5cf6);
    margin-right: 0;
    transition:
      width 0.3s ease,
      margin-right 0.3s ease;
  }

  &:hover {
    color: #818cf8;

    &::before {
      width: 14px;
      margin-right: 8px;
    }
  }
`;

// ── Connect ──

const ConnectCol = styled.div``;

const SocialRow = styled.div`
  display: flex;
  gap: 10px;
`;

const SocialBtn = styled(motion.a)`
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(51, 65, 85, 0.6);
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    ${gradientBgMixin};
    color: #ffffff;
    border-color: transparent;
    box-shadow: 0 8px 20px rgba(99, 102, 241, 0.3);
  }
`;

// ── Bottom ──

const BottomBar = styled.div`
  border-top: 1px solid rgba(30, 41, 59, 0.8);
  padding-top: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  @media (min-width: 640px) {
    flex-direction: row;
    justify-content: space-between;
  }
`;

const Copyright = styled.p`
  font-size: 0.8125rem;
  color: #475569;
`;

// ─── Component ────────────────────────────────────────────────────────────────

const defaultQuickLinks = [
  { label: "About", id: "#about" },
  { label: "Experience", id: "#experience" },
  { label: "Projects", id: "#projects" },
  { label: "Skills", id: "#skills" },
  { label: "Contact", id: "#contact" },
];

export function Footer() {
  const { docs, loaded } = useSiteContent();
  const footerData = (docs.footer as FooterDoc | null) || null;
  const year = new Date().getFullYear();

  if (!loaded || !footerData) return null;
  const displayData = footerData;

  const scrollTo = (id: string) =>
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <FooterEl>
      <FooterGlow />

      <Container>
        <TopGrid>
          {/* Brand */}
          <BrandArea>
            <LogoRow>
              <LogoMark>JG</LogoMark>
              <LogoText>
                Jad <LogoAccent>Ghader</LogoAccent>
              </LogoText>
            </LogoRow>
            <BrandDesc>
              {displayData.companyDescription}
            </BrandDesc>
          </BrandArea>

          {/* Quick links */}
          <LinksCol>
            <ColTitle>Quick Links</ColTitle>
            <LinkList>
              {defaultQuickLinks.map((l) => (
                <li key={l.id}>
                  <LinkItem onClick={() => scrollTo(l.id)}>{l.label}</LinkItem>
                </li>
              ))}
            </LinkList>
          </LinksCol>

          {/* Connect */}
          <ConnectCol>
            <ColTitle>Connect</ColTitle>
            <SocialRow>
              {[
                { icon: Github, name: 'GitHub' },
                { icon: Linkedin, name: 'LinkedIn' },
              ].map(({ icon: Icon, name }) => {
                const socialLink = displayData.socialLinks?.find(s => s.name.includes(name));
                return (
                  <SocialBtn
                    key={name}
                    href={socialLink?.url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.12, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon size={18} />
                  </SocialBtn>
                );
              })}
            </SocialRow>
          </ConnectCol>
        </TopGrid>

        {/* Bottom */}
        <BottomBar>
          <Copyright>&copy; {year} Jad Ghader. All rights reserved.</Copyright>
        </BottomBar>
      </Container>
    </FooterEl>
  );
}
