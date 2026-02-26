import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Github, Linkedin } from 'lucide-react';
import { useEffect, useState } from 'react';
import { gradientBgMixin } from '../styles/mixins';
import { useSiteContent } from '../context/SiteContentContext';
import type { HeroDoc } from '../interfaces/firestore.interface';

// ─── Styled Components ────────────────────────────────────────────────────────

const Wrapper = styled(motion.div)`
  position: fixed;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  z-index: 40;
  display: none;
  flex-direction: column;
  align-items: flex-end;

  @media (min-width: 1024px) {
    display: flex;
  }
`;

const IconList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-right: 16px;
`;

const IconRow = styled(motion.button)`
  display: flex;
  align-items: center;
  cursor: pointer;
  text-decoration: none;
  border: none;
  background: none;
  padding: 0;
`;

const Tooltip = styled(motion.span)`
  margin-right: 12px;
  padding: 5px 12px;
  border-radius: 8px;
  background: ${({ theme }) => theme.isDark ? '#ffffff' : '#0f172a'};
  color: ${({ theme }) => theme.isDark ? '#0f172a' : '#ffffff'};
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  font-family: 'Plus Jakarta Sans', sans-serif;
`;

const IconBubble = styled(motion.div)`
  width: 42px;
  height: 42px;
  border-radius: 12px;
  ${gradientBgMixin};
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${({ theme }) => theme.shadowSocial};
  cursor: pointer;
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadowSocialHover};
  }
`;

const PeekBar = styled(motion.div)`
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 64px;
  border-radius: 4px 0 0 4px;
  ${gradientBgMixin};
  opacity: 0.7;
`;

// ─── Component ────────────────────────────────────────────────────────────────

export function FloatingSocial() {
  const { docs } = useSiteContent();
  const heroData = (docs.hero as HeroDoc | null) || null;
  const [pastHero, setPastHero] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const handler = () => {
      setPastHero(window.scrollY > window.innerHeight * 0.75);
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Filter out mail and get only social links
  const socialLinks =
    heroData?.socialLinks?.filter(
      (link) => link.url && !link.url.startsWith('mailto:')
    ) || [];

  const socialIconMap: Record<string, React.ReactNode> = {
    Github: <Github size={18} />,
    Linkedin: <Linkedin size={18} />,
  };

  if (!pastHero) return null;

  return (
    <Wrapper
      initial={{ opacity: 0, x: 80 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <IconList>
        {socialLinks.map(({ name, url, icon }, i) => (
          <IconRow
            key={name}
            as="a"
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={name}
            initial={{ x: 60, opacity: 0 }}
            animate={{ x: expanded ? 0 : 44, opacity: 1 }}
            transition={{ delay: i * 0.05, duration: 0.3, ease: 'easeOut' }}
            style={{ border: 'none', background: 'none', padding: 0, cursor: 'pointer' }}
          >
            {expanded && (
              <Tooltip
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
              >
                {name}
              </Tooltip>
            )}
            <IconBubble whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.92 }}>
              {socialIconMap[(icon || 'Github') as string] || <Github size={18} />}
            </IconBubble>
          </IconRow>
        ))}
      </IconList>

      {!expanded && (
        <PeekBar
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
        />
      )}
    </Wrapper>
  );
}
