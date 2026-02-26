import styled, { css } from "styled-components";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";
import {
  gradientTextMixin,
  gradientBgMixin,
  glassMixin,
  pulseGlowAnim,
  primaryButtonMixin,
  ghostButtonMixin,
} from "../styles/mixins";
import { ImageWithFallback } from "./ImageWithFallback";
import { useSiteContent } from "../context/SiteContentContext";
import { HeroSkeletonLayout } from "./SkeletonLoader";
import type { HeroDoc } from "../interfaces/firestore.interface";

// ─── Styled Components ────────────────────────────────────────────────────────

const Section = styled.section`
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 1.5rem 40px;
  overflow: hidden;
  background: ${({ theme }) => theme.background};
`;

const OrbA = styled.div`
  position: absolute;
  top: 25%;
  left: -8rem;
  width: 24rem;
  height: 24rem;
  border-radius: 50%;
  background: ${({ theme }) => theme.gradientOrbA};
  filter: blur(100px);
  pointer-events: none;
  animation: ${pulseGlowAnim} 4s ease-in-out infinite;
`;

const OrbB = styled.div`
  position: absolute;
  bottom: 25%;
  right: -8rem;
  width: 24rem;
  height: 24rem;
  border-radius: 50%;
  background: ${({ theme }) => theme.gradientOrbB};
  filter: blur(100px);
  pointer-events: none;
  animation: ${pulseGlowAnim} 4s ease-in-out infinite 2s;
`;

const OrbC = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background: ${({ theme }) =>
    theme.isDark ? "rgba(99,102,241,0.06)" : "rgba(99,102,241,0.05)"};
  filter: blur(120px);
  pointer-events: none;
`;

const Container = styled.div`
  position: relative;
  max-width: 1280px;
  width: 100%;
  margin: 0 auto;
  z-index: 1;
`;

const Grid = styled.div`
  display: grid;
  align-items: center;
  gap: 3rem;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
    gap: 5rem;
  }
`;

const LeftCol = styled(motion.div)``;

const Heading = styled.h1`
  font-size: clamp(2.5rem, 5vw, 4.5rem);
  font-weight: 800;
  color: ${({ theme }) => theme.foreground};
  margin-bottom: 1.25rem;
  line-height: 1.1;
  font-family: "Plus Jakarta Sans", sans-serif;
`;

const GradientName = styled.span`
  ${gradientTextMixin};
`;

const Subtitle = styled.p`
  font-size: clamp(1.1rem, 2vw, 1.375rem);
  font-weight: 500;
  color: ${({ theme }) => theme.foregroundMuted};
  margin-bottom: 1.25rem;
  letter-spacing: 0.02em;
`;

const Description = styled.p`
  font-size: 1rem;
  line-height: 1.75;
  color: ${({ theme }) => theme.foregroundMuted};
  margin-bottom: 2.5rem;
  max-width: 480px;
`;

const ButtonRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 2.5rem;

  @media (min-width: 480px) {
    flex-direction: row;
  }
`;

const PrimaryBtn = styled(motion.button)`
  ${primaryButtonMixin};
`;

const GhostBtn = styled(motion.button)`
  ${ghostButtonMixin};
`;

const SocialRow = styled.div`
  display: flex;
  gap: 12px;
`;

const SocialBtn = styled(motion.a)`
  width: 46px;
  height: 46px;
  border-radius: 12px;
  background: ${({ theme }) => theme.backgroundIconPill};
  border: 1.5px solid ${({ theme }) => theme.borderCard};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.foregroundMuted};
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  &:hover {
    ${gradientBgMixin};
    color: #ffffff;
    border-color: transparent;
    box-shadow: 0 8px 24px rgba(99, 102, 241, 0.35);
    transform: translateY(-2px);
  }
`;

// ─── Right — profile image ────────────────────────────────────────────────────

const RightCol = styled(motion.div)`
  display: flex;
  justify-content: center;
`;

const ImageWrapper = styled.div`
  position: relative;
`;

const GlowRing = styled.div`
  position: absolute;
  inset: 0;
  border-radius: 50%;
  filter: blur(28px);
  opacity: ${({ theme }) => (theme.isDark ? 0.45 : 0.3)};
  transform: scale(1.12);
`;

const SpinRing = styled.div`
  position: absolute;
  inset: -12px;
  border-radius: 50%;
  border: 2px dashed
    ${({ theme }) =>
      theme.isDark ? "rgba(129,140,248,0.3)" : "rgba(99,102,241,0.25)"};
`;

const GradientBorder = styled.div`
  padding: 4px;
  border-radius: 50%;
  ${gradientBgMixin};
  box-shadow: ${({ theme }) => theme.shadowGlow};
`;

const ProfileImg = styled.div`
  width: 270px;
  height: 270px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid ${({ theme }) => theme.background};

  @media (min-width: 1024px) {
    width: 320px;
    height: 320px;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ChipBase = css`
  position: absolute;
  ${glassMixin};
  padding: 10px 16px;
  border-radius: 16px;
  box-shadow: ${({ theme }) => theme.shadowChip};
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ChipLeft = styled(motion.div)`
  ${ChipBase};
  top: 12%;
  left: -40px;
`;

// const ChipRight = styled(motion.div)`
//   ${ChipBase};
//   bottom: 18%;
//   right: -40px;
// `;

const ChipIcon = styled.div<{ $violet?: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 800;
  color: #fff;
  font-family: "Plus Jakarta Sans", sans-serif;
  background: ${({ $violet, theme }) =>
    $violet ? "#8b5cf6" : theme.gradientPrimary};
  flex-shrink: 0;
`;

const ChipText = styled.div``;
const ChipLabel = styled.p`
  font-size: 0.7rem;
  font-weight: 800;
  color: ${({ theme }) => theme.foreground};
  font-family: "Plus Jakarta Sans", sans-serif;
`;
const ChipSub = styled.p`
  font-size: 0.65rem;
  color: ${({ theme }) => theme.foregroundSubtle};
`;

// ─── Scroll indicator ─────────────────────────────────────────────────────────

const ScrollIndicator = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-top: 4rem;
`;

const ScrollLabel = styled.span`
  font-size: 0.7rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.foregroundSubtle};
`;

const ScrollMouse = styled(motion.div)`
  width: 22px;
  height: 34px;
  border-radius: 11px;
  border: 2px solid
    ${({ theme }) =>
      theme.isDark ? "rgba(99,102,241,0.3)" : "rgba(99,102,241,0.25)"};
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 6px;
`;

const ScrollDot = styled(motion.div)`
  width: 4px;
  height: 8px;
  border-radius: 2px;
  ${gradientBgMixin};
`;

// ─── Component ────────────────────────────────────────────────────────────────

const imageUrl = `${process.env.PUBLIC_URL}/images/Jad-Ghader.jpeg`;

export function Hero() {
  const { docs, loaded } = useSiteContent();
  const heroData = (docs.hero as HeroDoc | null) || null;

  if (!loaded || !heroData) {
    return (
      <Section id="home">
        <OrbA />
        <OrbB />
        <OrbC />
        <Container>
          <HeroSkeletonLayout />
        </Container>
      </Section>
    );
  }
  const displayData = heroData;

  const socialIconMap: Record<string, React.ReactNode> = {
    Github: <Github size={20} />,
    Linkedin: <Linkedin size={20} />,
    Mail: <Mail size={20} />,
  };

  return (
    <Section id="home">
      <OrbA />
      <OrbB />
      <OrbC />

      <Container>
        <Grid>
          {/* Left */}
          <LeftCol
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Heading>
              Hi, I'm <GradientName>Jad Ghader</GradientName>
            </Heading>

            <Subtitle>{displayData.heroText}</Subtitle>

            <Description>{displayData.infoText}</Description>

            <ButtonRow>
              <PrimaryBtn
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() =>
                  document
                    .querySelector("#projects")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                View My Work
              </PrimaryBtn>
              <GhostBtn
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() =>
                  document
                    .querySelector("#contact")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Contact Me
              </GhostBtn>
            </ButtonRow>

            <SocialRow>
              {displayData.socialLinks?.map(({ name, url, icon }) => (
                <SocialBtn
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                  whileHover={{ scale: 1.12 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {socialIconMap[(icon || "Github") as string] || (
                    <Github size={20} />
                  )}
                </SocialBtn>
              ))}
            </SocialRow>
          </LeftCol>

          {/* Right */}
          <RightCol
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <ImageWrapper>
              <GlowRing />
              <SpinRing />
              <GradientBorder>
                <ProfileImg>
                  <ImageWithFallback
                    src={imageUrl}
                    alt="Jad Ghader"
                    className="w-full h-full object-cover"
                  />
                </ProfileImg>
              </GradientBorder>

              {/* Floating chips */}
              <ChipLeft
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
              >
                <ChipIcon>{displayData.yearsOfExperience}</ChipIcon>
                <ChipText>
                  <ChipLabel>Years</ChipLabel>
                  <ChipSub>Experience</ChipSub>
                </ChipText>
              </ChipLeft>
            </ImageWrapper>
          </RightCol>
        </Grid>

        {/* Scroll indicator */}
        <ScrollIndicator
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <ScrollLabel>Scroll</ScrollLabel>
          <ScrollMouse>
            <ScrollDot
              animate={{ y: [0, 8, 0] }}
              transition={{
                repeat: Infinity,
                duration: 1.8,
                ease: "easeInOut",
              }}
            />
          </ScrollMouse>
        </ScrollIndicator>
      </Container>
    </Section>
  );
}
