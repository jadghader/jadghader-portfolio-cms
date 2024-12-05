import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { doc, getDoc } from "firebase/firestore"; // Import Firestore methods
import { db } from "../../firebase";
import { useDeviceType } from "../../hooks/useDeviceType"; // Import the custom hook

const SkillsSection: React.FC = () => {
  const [skillsData, setSkillsData] = useState<any>(null); // State to hold Firestore content
  const deviceType = useDeviceType(); // Use the hook to get device type

  useEffect(() => {
    const fetchSkillsContent = async () => {
      try {
        const docRef = doc(db, "homePage", "skillsSection"); // Get skillsSection document
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSkillsData(docSnap.data());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error getting document:", error);
      }
    };

    fetchSkillsContent();
  }, []); // Empty dependency array to run once when the component mounts

  if (!skillsData) {
    return (
      <SkeletonContainer>
        {[...Array(3)].map((_, index) => (
          <SkeletonCategory key={index}>
            <SkeletonTitle />
            <SkeletonList>
              {[...Array(3)].map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </SkeletonList>
          </SkeletonCategory>
        ))}
      </SkeletonContainer>
    );
  }

  return (
    <SkillsSectionContainer id="skills" deviceType={deviceType}>
      {skillsData.skillsData.map((category: any, index: number) => (
        <SkillCategory key={index}>
          <CategoryTitle>{category.category}</CategoryTitle>
          <SkillsList deviceType={deviceType}>
            {category.skills.map((skill: any, index: number) => (
              <SkillCard key={index} deviceType={deviceType}>
                <Icon src={skill.icon} alt={skill.name} />
                <SkillText>{skill.name}</SkillText>
              </SkillCard>
            ))}
          </SkillsList>
        </SkillCategory>
      ))}
      <LeftCircle deviceType={deviceType} />
      <RightCircle deviceType={deviceType} />
    </SkillsSectionContainer>
  );
};

export default SkillsSection;

// Styled Components
const SkillsSectionContainer = styled.section<{
  deviceType: "mobile" | "tablet" | "desktop";
}>`
  padding: 60px 30px;
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  display: grid;
  grid-template-columns: ${({ deviceType }) =>
    deviceType === "desktop"
      ? "repeat(4, 1fr)"
      : deviceType === "tablet"
      ? "repeat(2, 1fr)"
      : "1fr"};
  gap: 40px;
  position: relative;
  border-bottom: 2px solid ${({ theme }) => theme.accent};
  overflow: hidden;
`;

const SkillCategory = styled.div`
  grid-column: span 4;
  text-align: center;
  margin-bottom: 30px;
`;

const CategoryTitle = styled.h3`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.text};
`;

const SkillsList = styled.div<{ deviceType: "mobile" | "tablet" | "desktop" }>`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
`;

const SkillCard = styled.div<{ deviceType: "mobile" | "tablet" | "desktop" }>`
  background-color: ${({ theme }) => theme.cardBackground};
  border-radius: 12px;
  padding: 20px;
  width: ${({ deviceType }) =>
    deviceType === "mobile" ? "calc(50% - 10px)" : "180px"};
  text-align: center;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    transform: translateY(-10px);
  }
`;

const Icon = styled.img`
  width: 40px;
  height: 40px;
  margin-bottom: 10px;
`;

const SkillText = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.text};
  margin-top: 10px;
`;

// Skeleton Styled Components
const SkeletonContainer = styled.section`
  padding: 60px 30px;
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;
  position: relative;
  border-bottom: 2px solid ${({ theme }) => theme.accent};
  overflow: hidden;
`;

const SkeletonCategory = styled.div`
  grid-column: span 4;
  text-align: center;
  margin-bottom: 30px;
`;

const SkeletonTitle = styled.div`
  width: 200px;
  height: 30px;
  background: #ccc;
  margin: 10px auto;
  border-radius: 5px;
`;

const SkeletonList = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
`;

const SkeletonCard = styled.div`
  background-color: #ccc;
  border-radius: 12px;
  padding: 20px;
  width: 180px;
  text-align: center;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  position: relative;
  height: 150px;
`;

const LeftCircle = styled.div<{ deviceType: "mobile" | "tablet" | "desktop" }>`
  content: "";
  position: absolute;
  top: 50%;
  left: ${({ deviceType }) => (deviceType === "desktop" ? "-100px" : "-50px")};
  width: ${({ deviceType }) => (deviceType === "desktop" ? "200px" : "100px")};
  height: ${({ deviceType }) => (deviceType === "desktop" ? "200px" : "100px")};
  background-color: ${({ theme }) => theme.accent};
  border-radius: 50%;
  opacity: 0.2;
  z-index: 1;
  transform: translateY(-50%);
`;

const RightCircle = styled.div<{ deviceType: "mobile" | "tablet" | "desktop" }>`
  content: "";
  position: absolute;
  top: 50%;
  right: ${({ deviceType }) => (deviceType === "desktop" ? "-100px" : "-50px")};
  width: ${({ deviceType }) => (deviceType === "desktop" ? "200px" : "100px")};
  height: ${({ deviceType }) => (deviceType === "desktop" ? "200px" : "100px")};
  background-color: ${({ theme }) => theme.accent};
  border-radius: 50%;
  opacity: 0.2;
  z-index: 1;
  transform: translateY(-50%);
`;
