import styled, { keyframes } from 'styled-components';
import { motion } from 'motion/react';
import { Briefcase, Calendar, MapPin, CheckCircle2, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import {
  gradientTextMixin,
  badgeMixin,
  sectionDividerTop,
  sectionDividerBottom,
} from '../styles/mixins';
import { onDocSnapshot } from '../firebase/firestore';
import { ExperienceSkeletonLayout } from './SkeletonLoader';
import type { ExperienceDoc } from '../interfaces/firestore.interface';

// ─── Styled Components ────────────────────────────────────────────────────────

const expandAnim = keyframes`
  from { opacity: 0; transform: translateY(-8px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const Section = styled.section`
  position: relative;
  padding: 7rem 1.5rem;
  background: ${({ theme }) => theme.background};
  overflow: hidden;
  ${sectionDividerTop};
  ${sectionDividerBottom};
`;

const OrbTop = styled.div`
  position: absolute;
  top: 10%;
  right: -6rem;
  width: 360px;
  height: 360px;
  border-radius: 50%;
  background: ${({ theme }) => theme.gradientOrbA};
  filter: blur(110px);
  pointer-events: none;
  will-change: transform;
  
  @media (max-width: 640px) {
    filter: blur(60px);
    width: 260px;
    height: 260px;
    right: -4rem;
  }
`;

const OrbBot = styled.div`
  position: absolute;
  bottom: 10%;
  left: -5rem;
  width: 280px;
  height: 280px;
  border-radius: 50%;
  background: ${({ theme }) => theme.gradientOrbC};
  filter: blur(90px);
  pointer-events: none;
  will-change: transform;
  
  @media (max-width: 640px) {
    filter: blur(60px);
    width: 200px;
    height: 200px;
    left: -3rem;
  }
`;

const Container = styled.div`
  max-width: 1000px;
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

// ── Timeline ──

const Timeline = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const TimelineLine = styled.div`
  position: absolute;
  left: 28px;
  top: 56px;
  bottom: 56px;
  width: 2px;
  background: ${({ theme }) =>
    theme.isDark
      ? 'linear-gradient(to bottom, rgba(99,102,241,0.6), rgba(139,92,246,0.4), rgba(99,102,241,0.15))'
      : 'linear-gradient(to bottom, rgba(99,102,241,0.45), rgba(139,92,246,0.3), rgba(99,102,241,0.08))'};

  @media (min-width: 640px) {
    left: 36px;
  }
`;

// ── Entry row ──

const Entry = styled(motion.div)`
  position: relative;
  display: flex;
  gap: 1.25rem;
  padding-bottom: 2.5rem;

  @media (min-width: 640px) {
    gap: 1.75rem;
  }

  &:last-child {
    padding-bottom: 0;
  }
`;

// ── Left — dot + logo ──

const DotCol = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
`;

const LogoCircle = styled.div<{ $gs: string; $ge: string; $hasImage?: boolean }>`
  width: 58px;
  height: 58px;
  border-radius: 16px;
  background: ${({ $hasImage, $gs, $ge }) =>
    $hasImage ? 'transparent' : `linear-gradient(135deg, ${$gs}, ${$ge})`};
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-weight: 900;
  font-size: 0.875rem;
  color: #ffffff;
  letter-spacing: 0.05em;
  box-shadow: ${({ $hasImage, $gs }) => ($hasImage ? '0 8px 24px rgba(0,0,0,0.2)' : `0 8px 24px ${$gs}55`)};
  position: relative;
  z-index: 1;
  flex-shrink: 0;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: 4px;
  }
`;

// ── Right — card ──

const Card = styled(motion.div)<{ $accent: string; $isOpen: boolean }>`
  flex: 1;
  background: ${({ theme }) => theme.backgroundCard};
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.borderCard};
  box-shadow: ${({ theme }) => theme.shadowCard};
  overflow: hidden;
  transition: box-shadow 0.3s ease, border-color 0.3s ease;
  cursor: pointer;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadowCardHover};
    border-color: ${({ $accent }) => $accent}44;
  }

  /* Top accent bar */
  &::before {
    content: '';
    display: block;
    height: 3px;
    background: linear-gradient(90deg, ${({ $accent }) => $accent}, ${({ $accent }) => $accent}88);
    opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: 1;
  }
`;

const CardHeader = styled.div`
  padding: 1.5rem 1.5rem 1.25rem;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;

  @media (min-width: 640px) {
    padding: 1.75rem 2rem 1.5rem;
  }
`;

const CardHeaderLeft = styled.div`
  flex: 1;
`;

const RoleRow = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 4px;
`;

const Role = styled.h3`
  font-size: 1.05rem;
  font-weight: 800;
  color: ${({ theme }) => theme.foreground};
  font-family: 'Plus Jakarta Sans', sans-serif;

  @media (min-width: 640px) {
    font-size: 1.15rem;
  }
`;

const TypeBadge = styled.span<{ $color: string }>`
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 700;
  font-family: 'Plus Jakarta Sans', sans-serif;
  background: ${({ $color }) => $color}18;
  color: ${({ $color }) => $color};
  border: 1px solid ${({ $color }) => $color}33;
  letter-spacing: 0.02em;
`;

const CompanyRow = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 6px;
`;

const CompanyName = styled.span`
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${({ theme }) => theme.foregroundMuted};
`;

const MetaItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.foregroundSubtle};

  svg {
    opacity: 0.7;
  }
`;

const MetaDot = styled.span`
  color: ${({ theme }) => theme.foregroundSubtle};
  font-size: 0.6rem;
`;

const ChevronBtn = styled(motion.div)<{ $open: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: ${({ theme }) =>
    theme.isDark ? 'rgba(30,41,59,0.8)' : 'rgba(241,245,249,1)'};
  border: 1px solid ${({ theme }) => theme.borderCard};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.foregroundMuted};
  flex-shrink: 0;
  rotate: ${({ $open }) => ($open ? '180deg' : '0deg')};
  transition: rotate 0.3s ease, background 0.2s ease, color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.primary};
    background: ${({ theme }) =>
      theme.isDark ? 'rgba(99,102,241,0.1)' : 'rgba(99,102,241,0.06)'};
  }
`;

// ── Expanded body ──

const CardBody = styled(motion.div)`
  padding: 0 1.5rem 1.5rem;
  animation: ${expandAnim} 0.25s ease both;

  @media (min-width: 640px) {
    padding: 0 2rem 2rem;
  }
`;

const Divider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.gradientDividerFaint};
  margin-bottom: 1.25rem;
`;

const Description = styled.p`
  font-size: 0.9375rem;
  line-height: 1.75;
  color: ${({ theme }) => theme.foregroundMuted};
  margin-bottom: 1.25rem;
`;

const HighlightsTitle = styled.p`
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.foregroundSubtle};
  margin-bottom: 0.75rem;
  font-family: 'Plus Jakarta Sans', sans-serif;
`;

const HighlightList = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 1.5rem;
`;

const HighlightItem = styled.li<{ $color: string }>`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 0.9rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.foregroundMuted};

  svg {
    color: ${({ $color }) => $color};
    flex-shrink: 0;
    margin-top: 2px;
  }
`;

const SkillsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const SkillChip = styled.span<{ $color: string }>`
  padding: 5px 13px;
  border-radius: 10px;
  font-size: 0.78rem;
  font-weight: 600;
  font-family: 'Plus Jakarta Sans', sans-serif;
  background: ${({ $color }) => $color}14;
  color: ${({ $color }) => $color};
  border: 1px solid ${({ $color }) => $color}30;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ $color }) => $color}22;
    border-color: ${({ $color }) => $color}55;
    transform: translateY(-1px);
  }
`;


// ─── Component ────────────────────────────────────────────────────────────────

interface LogoDisplayProps {
  image?: string;
  initials: string;
  logoGradStart: string;
  logoGradEnd: string;
  isOpen: boolean;
}

function LogoDisplay({ image, initials, logoGradStart, logoGradEnd, isOpen }: LogoDisplayProps) {
  const [imageError, setImageError] = useState(false);
  const hasImage = Boolean(image && !imageError);

  return (
    <LogoCircle
      $gs={logoGradStart}
      $ge={logoGradEnd}
      $hasImage={hasImage}
      style={
        isOpen
          ? { transform: 'scale(1.08)', boxShadow: `0 12px 32px ${logoGradStart}55` }
          : {}
      }
    >
      {hasImage ? (
        <img
          src={image}
          alt="Company logo"
          onError={() => setImageError(true)}
        />
      ) : (
        initials
      )}
    </LogoCircle>
  );
}

export function Experience() {
  const [experienceData, setExperienceData] = useState<ExperienceDoc | null>(null);
  const [openId, setOpenId] = useState<number | null>(1);

  useEffect(() => {
    // Subscribe to experience data from Firestore
    const unsubscribe = onDocSnapshot('siteContent', 'experience', (data) => {
      setExperienceData(data);
    });

    return () => unsubscribe();
  }, []);

  if (!experienceData) {
    return (
      <Section id="experience">
        <OrbTop />
        <OrbBot />
        <Container>
          <Header>
            <Badge><Briefcase size={13} />Experience</Badge>
            <Title>
              Professional <GradientWord>Journey</GradientWord>
            </Title>
          </Header>
          <Timeline>
            <TimelineLine />
            <ExperienceSkeletonLayout count={4} />
          </Timeline>
        </Container>
      </Section>
    );
  }

  const displayData = experienceData;

  const toggle = (id: number) => setOpenId(openId === id ? null : id);

  return (
    <Section id="experience">
      <OrbTop />
      <OrbBot />

      <Container>
        <Header
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Badge><Briefcase size={13} />{displayData.sectionTitle}</Badge>
          <Title>
            Professional <GradientWord>Journey</GradientWord>
          </Title>
          <Subtitle>{displayData.subtitle}</Subtitle>
        </Header>

        <Timeline>
          <TimelineLine />

          {displayData.items.map((exp, i) => (
            <Entry
              key={exp.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              {/* Left — logo */}
              <DotCol>
                <LogoDisplay
                  image={exp.image}
                  initials={exp.initials}
                  logoGradStart={exp.logoGradStart}
                  logoGradEnd={exp.logoGradEnd}
                  isOpen={openId === exp.id}
                />
              </DotCol>

              {/* Right — card */}
              <Card
                $accent={exp.accentColor}
                $isOpen={openId === exp.id}
                onClick={() => toggle(exp.id)}
                layout
              >
                <CardHeader>
                  <CardHeaderLeft>
                    <RoleRow>
                      <Role>{exp.role}</Role>
                      <TypeBadge $color={exp.accentColor}>{exp.type}</TypeBadge>
                    </RoleRow>
                    <CompanyRow>
                      <CompanyName>{exp.company}</CompanyName>
                      <MetaDot>·</MetaDot>
                      <MetaItem>
                        <Calendar size={12} />
                        {exp.duration}
                      </MetaItem>
                      <MetaDot>·</MetaDot>
                      <MetaItem>
                        <MapPin size={12} />
                        {exp.location}
                      </MetaItem>
                    </CompanyRow>
                  </CardHeaderLeft>

                  <ChevronBtn $open={openId === exp.id} whileTap={{ scale: 0.9 }}>
                    <ChevronDown size={16} />
                  </ChevronBtn>
                </CardHeader>

                {openId === exp.id && (
                  <CardBody>
                    <Divider />
                    <Description>{exp.description}</Description>

                    <HighlightsTitle>Key Achievements</HighlightsTitle>
                    <HighlightList>
                      {exp.highlights.map((h, j) => (
                        <HighlightItem key={j} $color={exp.accentColor}>
                          <CheckCircle2 size={16} />
                          {h}
                        </HighlightItem>
                      ))}
                    </HighlightList>

                    <HighlightsTitle style={{ marginBottom: '0.75rem' }}>
                      Tech Stack
                    </HighlightsTitle>
                    <SkillsRow>
                      {exp.skills.map((s) => (
                        <SkillChip key={s} $color={exp.accentColor}>
                          {s}
                        </SkillChip>
                      ))}
                    </SkillsRow>
                  </CardBody>
                )}
              </Card>
            </Entry>
          ))}
        </Timeline>
      </Container>
    </Section>
  );
}
