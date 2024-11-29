import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import Skeleton from "@mui/material/Skeleton";

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

  const totalItems = aboutContent?.workExperienceData?.length || 0;

  return (
    <SectionContainer id="about">
      <Title>Work Experience</Title>
      <CardList>
        {totalItems === 0
          ? [...Array(2)].map((_, index) => (
              <ExperienceCard key={index}>
                <Skeleton variant="circular" width={60} height={60} />
                <Skeleton variant="text" width={200} height={30} />
                <Skeleton variant="text" width={150} height={20} />
                <Skeleton variant="rectangular" width="100%" height={50} />
              </ExperienceCard>
            ))
          : aboutContent.workExperienceData?.map((job: any, index: number) => (
              <ExperienceCard key={index}>
                <CompanyLogo
                  src={job.companyLogo || "/icons/default-company.svg"}
                  alt={`${job.company} logo`}
                />
                <CardContent>
                  <CardHeader>
                    <JobTitle>{job.title}</JobTitle>
                    <Company>{job.company}</Company>
                    <Details>
                      <Location>{job.location}</Location>
                    </Details>
                  </CardHeader>
                  <Separator />
                  <Description>
                    {job.description
                      .split("\n")
                      .map((line: string, idx: number) => (
                        <p key={idx}>{line}</p>
                      ))}
                  </Description>
                </CardContent>
              </ExperienceCard>
            ))}
      </CardList>
    </SectionContainer>
  );
};

export default AboutSection;

// Styled Components
const SectionContainer = styled.section`
  padding: 60px 20px;
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h2`
  font-size: 2.5rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 40px;
`;

const CardList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  width: 100%;
  max-width: 1200px;
  justify-content: center;
`;

const ExperienceCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  padding: 20px;
  background-color: ${({ theme }) => theme.cardBackground};
  border-radius: 12px;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s ease-in-out;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 20px rgba(0, 0, 0, 0.2);
  }
`;

const CompanyLogo = styled.img`
  width: 75px;
  height: 75px;
  border-radius: 50%;
  object-fit: contain;
  border: 2px solid ${({ theme }) => theme.accent};
`;

const CardContent = styled.div`
  flex: 1;
  width: 100%;
`;

const CardHeader = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
`;

const Separator = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${({ theme }) => theme.accent};
  margin: 10px 0;
`;

const JobTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
  color: ${({ theme }) => theme.text};
`;

const Company = styled.p`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.accent};
  margin: 5px 0;
`;

const Details = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 20px;
  font-size: 1rem;
  color: ${({ theme }) => theme.textSecondary};
`;

const Location = styled.span`
  color: ${({ theme }) => theme.text};
`;

const Description = styled.div`
  margin-top: 15px;
  font-size: 1rem;
  color: ${({ theme }) => theme.text};
  line-height: 1.5;

  p {
    margin: 0 0 10px;
  }
`;
