import styled from 'styled-components';
import { motion } from 'motion/react';
import { Code, Database, Server, Brain } from 'lucide-react';
import { useState, useEffect } from 'react';
import {
  gradientTextMixin,
  badgeMixin,
  sectionDividerTop,
  sectionDividerBottom,
} from '../styles/mixins';
import { getData } from '../firebase/firestore';
import { SkillsSkeletonLayout } from './SkeletonLoader';
import type { SkillsDoc } from '../interfaces/firestore.interface';

// ─── Styled Components ────────────────────────────────────────────────────────

const Section = styled.section`
  position: relative;
  padding: 7rem 1.5rem;
  background: ${({ theme }) => theme.background};
  overflow: hidden;
  ${sectionDividerTop};
  ${sectionDividerBottom};
`;

const OrbBottom = styled.div`
  position: absolute;
  bottom: 0;
  right: 25%;
  width: 320px;
  height: 320px;
  border-radius: 50%;
  background: ${({ theme }) => theme.gradientOrbB};
  filter: blur(100px);
  pointer-events: none;
  will-change: transform;
  
  @media (max-width: 640px) {
    filter: blur(60px);
    width: 240px;
    height: 240px;
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
`;

const GradientWord = styled.span`
  ${gradientTextMixin};
`;

const Subtitle = styled.p`
  font-size: 1.0625rem;
  color: ${({ theme }) => theme.foregroundMuted};
  max-width: 480px;
  margin: 0 auto;
`;

const Grid = styled.div`
  display: grid;
  gap: 1.5rem;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const Card = styled(motion.div)<{ $bg: string; $bgDark: string; $border: string; $borderDark: string }>`
  position: relative;
  padding: 1.75rem;
  border-radius: 20px;
  background: ${({ $bg, $bgDark, theme }) => (theme.isDark ? $bgDark : $bg)};
  border: 1px solid ${({ $border, $borderDark, theme }) => (theme.isDark ? $borderDark : $border)};
  overflow: hidden;
  transition: box-shadow 0.3s ease;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(99,102,241,0.05), rgba(139,92,246,0.05));
    opacity: 0;
    transition: opacity 0.3s ease;
    border-radius: inherit;
    pointer-events: none;
  }

  &:hover {
    box-shadow: ${({ theme }) => theme.shadowCardHover};

    &::after {
      opacity: 1;
    }
  }
`;

const IconWrap = styled.div<{ $gradStart: string; $gradEnd: string }>`
  width: 60px;
  height: 60px;
  border-radius: 16px;
  background: linear-gradient(135deg, ${({ $gradStart }) => $gradStart}, ${({ $gradEnd }) => $gradEnd});
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  box-shadow: 0 8px 20px rgba(99, 102, 241, 0.25);
  transition: transform 0.3s ease;

  ${Card}:hover & {
    transform: scale(1.1);
  }
`;

const CardTitle = styled.h3`
  font-size: 0.9375rem;
  font-weight: 700;
  color: ${({ theme }) => theme.foreground};
  text-align: center;
  margin-bottom: 1.25rem;
  font-family: 'Plus Jakarta Sans', sans-serif;
`;

const Divider = styled.div<{ $gradStart: string; $gradEnd: string }>`
  height: 1px;
  background: linear-gradient(90deg, ${({ $gradStart }) => $gradStart}, ${({ $gradEnd }) => $gradEnd});
  opacity: 0.3;
  margin: 0 8px 1.25rem;
`;

const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
`;

const SkillTag = styled(motion.span)`
  padding: 6px 12px;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: 500;
  background: ${({ theme }) => theme.skillTagBg};
  color: ${({ theme }) => theme.skillTagText};
  border: 1px solid ${({ theme }) => theme.skillTagBorder};
  cursor: default;
  transition: all 0.2s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover {
    background: ${({ theme }) => theme.skillTagHoverBg};
    border-color: ${({ theme }) => theme.skillTagHoverBorder};
    color: ${({ theme }) => theme.skillTagHoverText};
  }
`;

const SkillIcon = styled.img`
  width: 16px;
  height: 16px;
  object-fit: contain;
  opacity: 0.9;
  transition: opacity 0.2s ease;

  ${SkillTag}:hover & {
    opacity: 1;
  }
`;

// ─── Component ────────────────────────────────────────────────────────────────

const skillCategoryColors: Record<string, { gradientStart: string; gradientEnd: string; cardBg: string; cardBorder: string; cardBgDark: string; cardBorderDark: string }> = {
  'Frontend Development': {
    gradientStart: '#6366f1', gradientEnd: '#3b82f6',
    cardBg: 'rgba(99,102,241,0.07)',
    cardBorder: 'rgba(99,102,241,0.22)',
    cardBgDark: 'rgba(99,102,241,0.09)',
    cardBorderDark: 'rgba(99,102,241,0.25)',
  },
  'Backend Development': {
    gradientStart: '#8b5cf6', gradientEnd: '#6366f1',
    cardBg: 'rgba(139,92,246,0.07)',
    cardBorder: 'rgba(139,92,246,0.22)',
    cardBgDark: 'rgba(139,92,246,0.09)',
    cardBorderDark: 'rgba(139,92,246,0.25)',
  },
  'Database & Cloud': {
    gradientStart: '#3b82f6', gradientEnd: '#06b6d4',
    cardBg: 'rgba(59,130,246,0.07)',
    cardBorder: 'rgba(59,130,246,0.22)',
    cardBgDark: 'rgba(59,130,246,0.09)',
    cardBorderDark: 'rgba(59,130,246,0.25)',
  },
  'AI Tools & Technologies': {
    gradientStart: '#d946ef', gradientEnd: '#8b5cf6',
    cardBg: 'rgba(217,70,239,0.07)',
    cardBorder: 'rgba(217,70,239,0.22)',
    cardBgDark: 'rgba(217,70,239,0.09)',
    cardBorderDark: 'rgba(217,70,239,0.25)',
  },
};

export function Skills() {
  const [skillsData, setSkillsData] = useState<SkillsDoc | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadSkillsData = async () => {
      const data = await getData('siteContent', 'skills');
      if (isMounted) setSkillsData(data);
    };

    loadSkillsData();
    return () => {
      isMounted = false;
    };
  }, []);

  if (!skillsData) {
    return (
      <Section id="skills">
        <OrbBottom />
        <Container>
          <Header>
            <Badge>Expertise</Badge>
            <Title>Skills &amp; <GradientWord>Technologies</GradientWord></Title>
          </Header>
          <Grid>
            <SkillsSkeletonLayout count={4} />
          </Grid>
        </Container>
      </Section>
    );
  }

  const displayCategories = skillsData.categories;

  return (
    <Section id="skills">
      <OrbBottom />

      <Container>
        <Header
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Badge>Expertise</Badge>
          <Title>Skills &amp; <GradientWord>Technologies</GradientWord></Title>
          <Subtitle>{skillsData.description}</Subtitle>
        </Header>

        <Grid>
          {displayCategories.map((cat, i) => {
            const colors = skillCategoryColors[cat.category] || skillCategoryColors['Frontend Development'];
            return (
            <Card
              key={cat.category}
              $bg={colors.cardBg}
              $bgDark={colors.cardBgDark}
              $border={colors.cardBorder}
              $borderDark={colors.cardBorderDark}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -4 }}
            >
              <IconWrap $gradStart={colors.gradientStart} $gradEnd={colors.gradientEnd}>
                {i === 0 && <Code color="#ffffff" size={26} />}
                {i === 1 && <Server color="#ffffff" size={26} />}
                {i === 2 && <Database color="#ffffff" size={26} />}
                {i === 3 && <Brain color="#ffffff" size={26} />}
              </IconWrap>

              <CardTitle>{cat.category}</CardTitle>

              <Divider $gradStart={colors.gradientStart} $gradEnd={colors.gradientEnd} />

              <TagList>
                {cat.skills.map((skill) => (
                  <SkillTag key={skill.name} whileHover={{ scale: 1.05 }}>
                    {skill.icon && (
                      <SkillIcon
                        src={skill.icon}
                        alt={skill.name}
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    )}
                    {skill.name}
                  </SkillTag>
                ))}
              </TagList>
            </Card>
          );
          })}
        </Grid>
      </Container>
    </Section>
  );
}
