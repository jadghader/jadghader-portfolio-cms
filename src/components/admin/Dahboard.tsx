import React, { useEffect, useState } from "react";
import {
  experienceSection,
  skillsSection,
  projectSection,
} from "../../interfaces/firestore.interface";
import { getData } from "../../firebase/firestore";
import styled from "styled-components";
import { FaPen } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useTheme } from "styled-components"; // Use for theme management

const DashboardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${(props) => props.theme.background};
  min-height: 100vh;
  padding: 40px 20px;
  position: relative;
  transition: background-color 0.3s ease;
`;

const Header = styled.h1`
  font-size: 2.5rem;
  color: ${(props) => props.theme.text};
  margin-bottom: 30px;
  transition: color 0.3s ease;
`;

const SectionWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  background: ${(props) => props.theme.cardBackground};
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px ${(props) => props.theme.shadow};
  transition: background 0.3s ease, box-shadow 0.3s ease;
`;

const Section = styled.div`
  padding: 15px 30px;
  border-bottom: 1px solid ${(props) => props.theme.borderColor};
  position: relative;

  &:last-child {
    border-bottom: none;
  }

  h2 {
    font-size: 1.8rem;
    color: ${(props) => props.theme.text};
    margin-bottom: 10px;
  }

  p {
    font-size: 1rem;
    color: ${(props) => props.theme.text};
  }
`;

const EditIcon = styled(FaPen)`
  position: absolute;
  top: 15px;
  right: 15px;
  font-size: 1.5rem;
  color: ${(props) => props.theme.accent};
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: ${(props) => props.theme.hoverAccent};
  }
`;

const AdminDashboard: React.FC = () => {
  const [experience, setExperience] = useState<experienceSection | null>(null);
  const [skills, setSkills] = useState<skillsSection | null>(null);
  const [projects, setProjects] = useState<projectSection | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const experienceData = await getData("homePage", "experienceSection");
      const skillsData = await getData("homePage", "skillsSection");
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

      if (projectsData && (projectsData as projectSection).projects) {
        setProjects(projectsData as projectSection);
      }
    };

    fetchData();
  }, []);

  const handleEdit = (section: string) => {
    navigate(`/admin/settings/${section}`);
  };

  return (
    <DashboardWrapper>
      <Header>Admin Dashboard</Header>
      <SectionWrapper>
        <Section>
          <h2>Experience</h2>
          <p>
            Total Work Experiences:{" "}
            {experience ? experience.workExperienceData.length : 0}
          </p>
          <EditIcon onClick={() => handleEdit("experience")} />
        </Section>
        <Section>
          <h2>Skills</h2>
          <p>Total Skill Categories: {skills ? skills.skillsData.length : 0}</p>
          <EditIcon onClick={() => handleEdit("skills")} />
        </Section>
        <Section>
          <h2>Projects</h2>
          <p>Total Projects: {projects ? projects.projects.length : 0}</p>
          <EditIcon onClick={() => handleEdit("projects")} />
        </Section>
      </SectionWrapper>
    </DashboardWrapper>
  );
};

export default AdminDashboard;
