import styled from 'styled-components';
import { motion } from 'motion/react';
import { Briefcase } from 'lucide-react';
import * as Icons from 'lucide-react';
import { useState, useEffect } from 'react';
import {
  gradientTextMixin,
  gradientBgMixin,
  badgeMixin,
  primaryButtonMixin,
  sectionDividerTop,
  sectionDividerBottom,
} from '../styles/mixins';
import { getData } from '../firebase/firestore';
import { AboutSkeletonLayout } from './SkeletonLoader';
import type { AboutDoc } from '../interfaces/firestore.interface';

// ─── Styled Components ────────────────────────────────────────────────────────

const Section = styled.section`
  position: relative;
  padding: 7rem 1.5rem;
  background: ${({ theme }) => theme.background};
  overflow: hidden;
  ${sectionDividerTop};
  ${sectionDividerBottom};
`;

const OrbRight = styled.div`
  position: absolute;
  top: 50%;
  right: -5rem;
  transform: translateY(-50%);
  width: 320px;
  height: 320px;
  border-radius: 50%;
  background: ${({ theme }) => theme.gradientOrbA};
  filter: blur(80px);
  pointer-events: none;
  will-change: transform;
  
  @media (max-width: 640px) {
    filter: blur(50px);
    width: 240px;
    height: 240px;
    right: -4rem;
  }
`;

const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  position: relative;
`;

const Header = styled(motion.div)`
  text-align: center;
  margin-bottom: 5rem;
`;

const Badge = styled.div`
  ${badgeMixin};
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-size: clamp(2rem, 4vw, 3.25rem);
  font-weight: 800;
  color: ${({ theme }) => theme.foreground};
  margin-bottom: 1rem;
  font-family: 'Plus Jakarta Sans', sans-serif;
  line-height: 1.15;
`;

const GradientWord = styled.span`
  ${gradientTextMixin};
`;

const ContentGrid = styled.div`
  display: grid;
  align-items: center;
  gap: 3rem;

  @media (min-width: 1024px) {
    grid-template-columns: 2fr 3fr;
    gap: 3.5rem;
  }
`;

// ── Experience card ──

const ExpCard = styled(motion.div)`
  position: relative;
  padding: 2.5rem;
  border-radius: 24px;
  overflow: hidden;
  ${gradientBgMixin};
  box-shadow: ${({ theme }) => theme.shadowPrimary};
`;

const CardCircleTop = styled.div`
  position: absolute;
  top: -2.5rem;
  right: -2.5rem;
  width: 10rem;
  height: 10rem;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
`;

const CardCircleBot = styled.div`
  position: absolute;
  bottom: -2.5rem;
  left: -2.5rem;
  width: 8rem;
  height: 8rem;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.06);
`;

const ExpCenter = styled.div`
  position: relative;
  text-align: center;
  color: #fff;
  margin-bottom: 2rem;
`;

const ExpIcon = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
  opacity: 0.85;
`;

const ExpNumber = styled.div`
  font-size: 4.5rem;
  font-weight: 900;
  font-family: 'Plus Jakarta Sans', sans-serif;
  line-height: 1;
  margin-bottom: 0.25rem;
`;

const ExpLabel = styled.div`
  font-size: 1.0625rem;
  font-weight: 600;
  opacity: 0.9;
`;

const MiniGrid = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`;

const MiniItem = styled.div`
  background: rgba(255, 255, 255, 0.15);
  border-radius: 14px;
  padding: 12px 10px;
  text-align: center;
  color: #fff;
  backdrop-filter: blur(4px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
`;

const MiniLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 700;
  font-family: 'Plus Jakarta Sans', sans-serif;
`;

const MiniSub = styled.span`
  font-size: 0.65rem;
  opacity: 0.75;
`;

// ── Summary ──

const Summary = styled(motion.div)``;

const SummaryTitle = styled.h3`
  font-size: 1.75rem;
  font-weight: 800;
  color: ${({ theme }) => theme.foreground};
  margin-bottom: 1.5rem;
  font-family: 'Plus Jakarta Sans', sans-serif;
`;

const SummaryText = styled.p`
  font-size: 1rem;
  line-height: 1.8;
  color: ${({ theme }) => theme.foregroundMuted};
  margin-bottom: 1.25rem;
`;

const Divider = styled.hr`
  height: 1px;
  background: ${({ theme }) => theme.gradientDivider};
  border: none;
  margin: 2rem 0;
`;

const CTABtn = styled(motion.button)`
  ${primaryButtonMixin};
`;

// ── Highlights Grid ──

const HighlightIcon = styled.div<{ $gradient?: string }>`
  width: 56px;
  height: 56px;
  border-radius: 14px;
  background: ${({ $gradient }) => $gradient || 'linear-gradient(135deg, #6366f1, #8b5cf6)'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-bottom: 1.25rem;
  box-shadow: 0 8px 20px ${({ $gradient }) => 'rgba(99, 102, 241, 0.35)'};
  transition: transform 0.4s cubic-bezier(0.23, 1, 0.320, 1);
`;

const HighlightsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 2rem;
  margin: 3rem 0 2rem 0;
`;

const HighlightItem = styled(motion.div)<{ $index?: number }>`
  position: relative;
  padding: 2rem;
  border-radius: 20px;
  background: ${({ theme }) => theme.isDark 
    ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.6), rgba(15, 23, 42, 0.8))'
    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.5), rgba(248, 250, 252, 0.8))'
  };
  border: 1.5px solid ${({ theme }) => theme.isDark
    ? 'rgba(51, 65, 85, 0.5)'
    : 'rgba(226, 232, 240, 0.6)'
  };
  backdrop-filter: blur(10px);
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.23, 1, 0.320, 1);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #6366f1, #8b5cf6, #d946ef);
    opacity: 0;
    transition: opacity 0.4s ease;
  }

  &:hover {
    border-color: ${({ theme }) => theme.isDark ? 'rgba(99, 102, 241, 0.5)' : 'rgba(99, 102, 241, 0.3)'};
    background: ${({ theme }) => theme.isDark
      ? 'linear-gradient(135deg, rgba(51, 65, 85, 0.8), rgba(30, 41, 59, 0.9))'
      : 'linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(248, 250, 252, 0.95))'
    };
    box-shadow: 0 20px 40px ${({ theme }) => theme.isDark 
      ? 'rgba(99, 102, 241, 0.15)' 
      : 'rgba(99, 102, 241, 0.1)'
    };
    transform: translateY(-8px);

    &::before {
      opacity: 1;
    }

    ${HighlightIcon} {
      transform: scale(1.15) rotate(-5deg);
    }
  }
`;

const HighlightTitle = styled.h4`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${({ theme }) => theme.foreground};
  margin-bottom: 0.75rem;
  font-family: 'Plus Jakarta Sans', sans-serif;
  letter-spacing: -0.01em;
`;

const HighlightDesc = styled.p`
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.foregroundMuted};
  line-height: 1.7;
  font-weight: 400;
`;

// ─── Component ────────────────────────────────────────────────────────────────

export function About() {
  const [aboutData, setAboutData] = useState<AboutDoc | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadAboutData = async () => {
      const data = await getData('siteContent', 'about');
      if (isMounted) setAboutData(data);
    };

    loadAboutData();
    return () => {
      isMounted = false;
    };
  }, []);

  if (!aboutData) {
    return (
      <Section id="about">
        <OrbRight />
        <Container>
          <Header>
            <Badge>About Me</Badge>
            <Title>
              Crafting the Future with{' '}
              <GradientWord>Code &amp; AI</GradientWord>
            </Title>
          </Header>
          <AboutSkeletonLayout hasImage={true} />
        </Container>
      </Section>
    );
  }

  const displayData = aboutData;

  return (
    <Section id="about">
      <OrbRight />

      <Container>
        <Header
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Badge>About Me</Badge>
          <Title>
            Crafting the Future with{' '}
            <GradientWord>Code &amp; AI</GradientWord>
          </Title>
        </Header>

        <ContentGrid>
          {/* Left — experience card */}
          <ExpCard
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <CardCircleTop />
            <CardCircleBot />

            <ExpCenter>
              <ExpIcon><Briefcase size={38} /></ExpIcon>
              <ExpNumber>{displayData.yearsOfExperience}</ExpNumber>
              <ExpLabel>Years of Experience</ExpLabel>
            </ExpCenter>

            <MiniGrid>
              {displayData.stats && displayData.stats.map((s) => {
                const StatIcon = (Icons as any)[s.icon] || Briefcase;
                return (
                  <MiniItem key={s.label}>
                    <StatIcon size={18} style={{ opacity: 0.85 }} />
                    <MiniLabel>{s.label}</MiniLabel>
                    <MiniSub>{s.sub}</MiniSub>
                  </MiniItem>
                );
              })}
            </MiniGrid>
          </ExpCard>

          {/* Right — summary */}
          <Summary
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <SummaryTitle>Professional Summary</SummaryTitle>
            <SummaryText>
              {displayData.content}
            </SummaryText>
            
            {/* Highlights Grid */}
            {displayData.highlights && displayData.highlights.length > 0 && (
              <HighlightsGrid>
                {displayData.highlights.map((highlight, idx) => {
                  // Get icon component from lucide-react by name
                  const IconComponent = (Icons as any)[highlight.icon] || Briefcase;
                  
                  // Color gradients for each highlight
                  const gradients = [
                    'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    'linear-gradient(135deg, #3b82f6, #6366f1)',
                    'linear-gradient(135deg, #8b5cf6, #d946ef)',
                    'linear-gradient(135deg, #06b6d4, #3b82f6)',
                  ];
                  const gradient = gradients[idx % gradients.length];
                  
                  return (
                    <HighlightItem
                      key={idx}
                      $index={idx}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.12, duration: 0.5 }}
                    >
                      <HighlightIcon $gradient={gradient}>
                        <IconComponent size={28} strokeWidth={1.5} />
                      </HighlightIcon>
                      <HighlightTitle>{highlight.title}</HighlightTitle>
                      <HighlightDesc>{highlight.description}</HighlightDesc>
                    </HighlightItem>
                  );
                })}
              </HighlightsGrid>
            )}
            
            <Divider />
            <CTABtn
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Start a Conversation →
            </CTABtn>
          </Summary>
        </ContentGrid>
      </Container>
    </Section>
  );
}
