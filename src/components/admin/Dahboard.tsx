import React, { useEffect, useState } from "react";
import {
  experienceSection,
  skillsSection,
  heroSection,
  projectSection,
} from "../../interfaces/firestore.interface";
import { getData } from "../../firebase/firestore";
import styled from "styled-components";

const DashboardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f8f9fa;
  height: 100vh;
  padding: 20px;
`;

const Header = styled.h1`
  font-size: 2rem;
  color: #333;
  margin-bottom: 30px;
`;

const SectionWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  width: 100%;
  max-width: 1200px;
`;

const Card = styled.div`
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 250px;
  text-align: center;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }

  h2 {
    font-size: 1.5rem;
    margin-bottom: 10px;
    color: #495057;
  }

  p {
    font-size: 1rem;
    color: #6c757d;
  }
`;

const AdminDashboard: React.FC = () => {
  const [experience, setExperience] = useState<experienceSection | null>(null);
  const [skills, setSkills] = useState<skillsSection | null>(null);
  const [hero, setHero] = useState<heroSection | null>(null);
  const [projects, setProjects] = useState<projectSection | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const experienceData = await getData("homePage", "experienceSection");
      const skillsData = await getData("homePage", "skillsSection");
      const heroData = await getData("homePage", "heroSection");
      const projectsData = await getData("homePage", "projectSection");

      if (
        experienceData &&
        (experienceData as experienceSection).workExperienceData
      ) {
        setExperience(experienceData as experienceSection);
      }

      if (skillsData && (skillsData as skillsSection).skillsData) {
        setSkills(skillsData as skillsSection);
      }

      if (heroData && (heroData as heroSection).heroText) {
        setHero(heroData as heroSection);
      }

      if (projectsData && (projectsData as projectSection).projects) {
        setProjects(projectsData as projectSection);
      }
    };

    fetchData();
  }, []);

  return (
    <DashboardWrapper>
      <Header>Admin Dashboard</Header>
      <SectionWrapper>
        <Card>
          <h2>Experience Section</h2>
          <p>
            Total Work Experiences:{" "}
            {experience ? experience.workExperienceData.length : 0}
          </p>
        </Card>
        <Card>
          <h2>Skills Section</h2>
          <p>Total Skill Categories: {skills ? skills.skillsData.length : 0}</p>
        </Card>
        <Card>
          <h2>Hero Section</h2>
          <p>Hero Text: {hero ? hero.heroText : "No Data"}</p>
        </Card>
        <Card>
          <h2>Projects Section</h2>
          <p>Total Projects: {projects ? projects.projects.length : 0}</p>
        </Card>
      </SectionWrapper>
    </DashboardWrapper>
  );
};

export default AdminDashboard;
