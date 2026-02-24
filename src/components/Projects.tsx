import styled from "styled-components";
import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import { useState, useEffect } from "react";
import {
  gradientTextMixin,
  badgeMixin,
  sectionDividerTop,
  sectionDividerBottom,
} from "../styles/mixins";
import { ImageWithFallback } from "./ImageWithFallback";
import { getData } from "../firebase/firestore";
import { ProjectSkeletonLayout } from "./SkeletonLoader";
import type { ProjectsDoc } from "../interfaces/firestore.interface";

// ─── Styled Components ────────────────────────────────────────────────────────

const Section = styled.section`
  position: relative;
  padding: 7rem 1.5rem;
  background: ${({ theme }) => theme.backgroundAlt};
  overflow: hidden;
  ${sectionDividerTop};
  ${sectionDividerBottom};
`;

const OrbLeft = styled.div`
  position: absolute;
  top: 50%;
  left: -5rem;
  transform: translateY(-50%);
  width: 320px;
  height: 320px;
  border-radius: 50%;
  background: ${({ theme }) => theme.gradientOrbA};
  filter: blur(100px);
  pointer-events: none;
  will-change: transform;
  
  @media (max-width: 640px) {
    filter: blur(60px);
    width: 240px;
    height: 240px;
    left: -4rem;
  }
  
  @media (prefers-reduced-motion: reduce) {
    animation: none;
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
  font-family: "Plus Jakarta Sans", sans-serif;
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
  gap: 1.75rem;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const Card = styled(motion.div)<{ $accentStart: string; $accentEnd: string }>`
  position: relative;
  background: ${({ theme }) => theme.backgroundCard};
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.borderCard};
  box-shadow: ${({ theme }) => theme.shadowCard};
  transition:
    box-shadow 0.4s ease,
    transform 0.3s ease;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(
      90deg,
      ${({ $accentStart }) => $accentStart},
      ${({ $accentEnd }) => $accentEnd}
    );
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 2;
  }

  &:hover {
    box-shadow: ${({ theme }) => theme.shadowCardHover};

    &::before {
      opacity: 1;
    }
  }
`;

const ImgArea = styled.div`
  position: relative;
  height: 210px;
  overflow: hidden;
`;

const CardImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.7s ease;

  ${Card}:hover & {
    transform: scale(1.08);
  }
`;

const ImgOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(2, 8, 23, 0.85),
    rgba(2, 8, 23, 0.3),
    transparent
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  padding: 16px;

  ${Card}:hover & {
    opacity: 1;
  }
`;

const OverlayActions = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionBtn = styled(motion.a)`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: #ffffff;
  color: #0f172a;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition:
    background 0.2s ease,
    color 0.2s ease;

  &:hover {
    background: #6366f1;
    color: #ffffff;
  }
`;

const CardBody = styled.div`
  padding: 1.5rem;
`;

const CardTitle = styled.h3`
  font-size: 1.05rem;
  font-weight: 700;
  color: ${({ theme }) => theme.foreground};
  margin-bottom: 0.5rem;
  font-family: "Plus Jakarta Sans", sans-serif;
  transition: color 0.2s ease;

  ${Card}:hover & {
    color: ${({ theme }) => theme.primary};
  }
`;

const CardDesc = styled.p`
  font-size: 0.875rem;
  line-height: 1.7;
  color: ${({ theme }) => theme.foregroundMuted};
  margin-bottom: 1rem;
`;

const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Tag = styled.span`
  padding: 4px 12px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 600;
  font-family: "Plus Jakarta Sans", sans-serif;
  background: ${({ theme }) => theme.backgroundTag};
  color: ${({ theme }) => theme.primary};
  border: 1px solid ${({ theme }) => theme.borderTag};
`;

// ─── Component ───────────────────────────────────────────────────────────���────

export function Projects() {
  const [projectsData, setProjectsData] = useState<ProjectsDoc | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadProjectsData = async () => {
      const data = await getData("siteContent", "projects");
      if (isMounted) setProjectsData(data);
    };

    loadProjectsData();
    return () => {
      isMounted = false;
    };
  }, []);

  if (!projectsData) {
    return (
      <Section id="projects">
        <Container>
          <Header>
            <Badge>Portfolio</Badge>
            <Title>
              Recent <GradientWord>Projects</GradientWord>
            </Title>
          </Header>
          <Grid>
            <ProjectSkeletonLayout count={3} />
          </Grid>
        </Container>
      </Section>
    );
  }

  const displayProjects = projectsData.projects;

  return (
    <Section id="projects">
      <OrbLeft />

      <Container>
        <Header
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Badge>Portfolio</Badge>
          <Title>
            Recent <GradientWord>Projects</GradientWord>
          </Title>
          <Subtitle>{projectsData.description}</Subtitle>
        </Header>

        <Grid>
          {displayProjects.map((p, i) => (
            <Card
              key={p.title}
              $accentStart={p.accentStart || "#6366f1"}
              $accentEnd={p.accentEnd || "#8b5cf6"}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              whileHover={{ y: -6 }}
            >
              <ImgArea>
                <CardImg
                  as={ImageWithFallback as any}
                  src={p.image}
                  alt={p.title}
                />
                <ImgOverlay>
                  <OverlayActions>
                    {p.liveUrl && (
                      <ActionBtn
                        href={p.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.12 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ExternalLink size={15} />
                      </ActionBtn>
                    )}

                    {p.repoUrl && (
                      <ActionBtn
                        href={p.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.12 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Github size={15} />
                      </ActionBtn>
                    )}
                  </OverlayActions>
                </ImgOverlay>
              </ImgArea>

              <CardBody>
                <CardTitle>{p.title}</CardTitle>
                <CardDesc>{p.description}</CardDesc>
                <TagList>
                  {p.tags?.map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </TagList>
              </CardBody>
            </Card>
          ))}
        </Grid>
      </Container>
    </Section>
  );
}
