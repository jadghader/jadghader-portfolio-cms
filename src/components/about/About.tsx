import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import Skeleton from "@mui/material/Skeleton"; // Importing Skeleton loader

const AboutSection: React.FC = () => {
  const [aboutContent, setAboutContent] = useState<any>(null);

  useEffect(() => {
    const fetchAboutContent = async () => {
      try {
        const docRef = doc(db, "homePage", "experienceSection");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setAboutContent(docSnap.data());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error getting document:", error);
      }
    };

    fetchAboutContent();
  }, []);

  const totalItems = aboutContent?.workExperienceData?.length || 0; // Count number of cards

  return (
    <SectionContainer id="about">
      <Title>Work Experience</Title>
      <CardGrid totalItems={totalItems}>
        {/* Show Skeleton Loader if content is not loaded yet */}
        {totalItems === 0
          ? [...Array(2)].map((_, index) => (
              <Card key={index} isLeftCard={index % 2 === 0}>
                <Skeleton variant="text" width={250} height={30} />
                <Skeleton variant="text" width={250} height={20} />
                <Skeleton variant="text" width={250} height={250} />
                <Skeleton variant="text" width={250} height={15} />
              </Card>
            ))
          : aboutContent.workExperienceData?.map((job: any, index: number) => (
              <Card key={index} isLeftCard={index % 2 === 0}>
                <CardHeader>
                  <JobTitle>{job.title}</JobTitle>
                  <Company>{job.company}</Company>
                </CardHeader>
                <Location>{job.location}</Location>
                <Description>
                  <ul>
                    {job.description
                      .split("\n")
                      .map((line: string, idx: number) => (
                        <li key={idx}>{line}</li>
                      ))}
                  </ul>
                </Description>
              </Card>
            ))}
      </CardGrid>
    </SectionContainer>
  );
};

export default AboutSection;

// Styled Components
const SectionContainer = styled.section`
  padding: 60px 30px;
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  min-height: 100vh;
  border-bottom: 2px solid ${({ theme }) => theme.accent};
  position: relative;
  overflow: hidden;
`;

const Title = styled.h2`
  font-size: 2.5rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 30px;
`;

const CardGrid = styled.div<{ totalItems: number }>`
  display: grid;
  grid-template-columns: ${(props) =>
    props.totalItems === 1 ? "1fr" : "repeat(2, 1fr)"};
  gap: 50px;
  padding: 0 10%;

  @media (max-width: 768px) {
    grid-template-columns: 1fr; /* Single column for mobile */
    gap: 20px;
    padding: 0 0;
    /* Reduce gap for better spacing on smaller screens */
  }
`;

const Card = styled.div<{ isLeftCard: boolean }>`
  background-color: ${({ theme }) => theme.cardBackground};
  border-radius: 12px;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
  padding: 40px;
  position: relative;
  background: url("/patterns/pattern-1.svg") no-repeat center center,
    radial-gradient(circle, rgba(255, 255, 255, 0.1), rgba(0, 0, 0, 0.05));
  background-size: cover, 250% 250%;
  color: ${({ theme }) => theme.text};
  overflow: hidden;
  max-width: 480px;
  margin: 0 auto;

  &::before {
    content: "";
    position: absolute;
    top: 50%;
    ${(props) => (props.isLeftCard ? "left: -50px;" : "right: -50px;")}
    width: 80px;
    height: 80px;
    background-color: ${({ theme }) => theme.accent};
    border-radius: 50%;
    opacity: 0.2;
    z-index: 1;
    transform: translateY(-50%);
  }
`;

const CardHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`;

const JobTitle = styled.h3`
  font-size: 1.9rem;
  font-weight: bold;
  text-align: center;
`;

const Company = styled.p`
  font-size: 1.3rem;
  text-align: center;
  color: ${({ theme }) => theme.accent};
`;

const Location = styled.p`
  font-size: 1.1rem;
  text-align: center;
  color: ${({ theme }) => theme.text};
  margin: 10px 0;
`;

const Description = styled.div`
  ul {
    list-style-type: disc;
    padding-left: 20px;
    color: ${({ theme }) => theme.text};

    li {
      font-size: 1rem;
      line-height: 1.6;
    }
  }
`;
