import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import ImageGallery from "../image/ImageGallery";

const ProjectsSection: React.FC = () => {
  const [projectsData, setProjectsData] = useState<any>(null);

  useEffect(() => {
    const fetchProjectsContent = async () => {
      try {
        const docRef = doc(db, "homePage", "projectSection");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProjectsData(docSnap.data());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error getting document:", error);
      }
    };

    fetchProjectsContent();
  }, []);

  if (!projectsData) {
    return (
      <SkeletonContainer>
        {[...Array(3)].map((_, index) => (
          <SkeletonCard key={index}>
            <SkeletonImage />
            <SkeletonContent>
              <SkeletonTitle />
              <SkeletonDescription />
            </SkeletonContent>
          </SkeletonCard>
        ))}
      </SkeletonContainer>
    );
  }

  return (
    <SectionContainer id="projects">
      <SectionTitle>Projects</SectionTitle>
      <ProjectGrid>
        {projectsData.projects.map((project: any, index: number) => (
          <ProjectCard key={index}>
            <ImageWrapper>
              <ImageGallery images={project.images} />
            </ImageWrapper>
            <ProjectContent>
              <ProjectTitle>{project.title}</ProjectTitle>
              <ProjectDescription>{project.description}</ProjectDescription>
            </ProjectContent>
          </ProjectCard>
        ))}
      </ProjectGrid>
    </SectionContainer>
  );
};

export default ProjectsSection;

// Styled Components
const SectionContainer = styled.section`
  position: relative;
  padding: 60px 10px;
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  border-bottom: 2px solid ${({ theme }) => theme.accent};
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 40px;
`;

const ProjectGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  align-items: center;
`;

const ProjectCard = styled.div`
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.cardBackground};
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  width: 75%;
  max-width: 850px;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }

  @media (max-width: 768px) {
    flex-direction: column;
    width: 90%;
  }
`;

const ImageWrapper = styled.div`
  width: 45%;
  height: 90%;
  padding: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 2px solid ${({ theme }) => theme.accent};

  @media (max-width: 768px) {
    width: 90%;
    padding: 20px;
    border-right: none;
    border-bottom: 2px solid ${({ theme }) => theme.accent};
  }
`;


const ProjectContent = styled.div`
  padding: 20px;
  flex: 1;
`;

const ProjectTitle = styled.h3`
  font-weight: bold;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.accent};
`;

const ProjectDescription = styled.p`
  font-size: 1rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.text};
`;

const SkeletonContainer = styled.section`
  padding: 60px 20px;
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  display: flex;
  flex-direction: column;
  gap: 40px;
  align-items: center;
`;

const SkeletonCard = styled.div`
  display: flex;
  align-items: center;
  background-color: #ccc;
  border-radius: 12px;
  width: 75%;
  max-width: 850px;
  padding: 20px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
`;

const SkeletonImage = styled.div`
  width: 40%;
  height: 100px;
  background-color: #bbb;
  border-radius: 8px;
`;

const SkeletonContent = styled.div`
  flex: 1;
  padding-left: 20px;
  padding-right: 20px;
`;

const SkeletonTitle = styled.div`
  width: 60%;
  height: 20px;
  background-color: #ccc;
  margin-bottom: 10px;
  border-radius: 4px;
`;

const SkeletonDescription = styled.div`
  width: 80%;
  height: 15px;
  background-color: #ccc;
  border-radius: 4px;
`;
