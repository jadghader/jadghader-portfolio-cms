import React, { useEffect, useState } from "react";
import { getData, updateData } from "../../firebase/firestore";
import {
  experienceSection,
  skillsSection,
  heroSection,
  projectSection,
} from "../../interfaces/firestore.interface";
import styled from "styled-components";

// Styled components for a modern UI/UX
const SettingsWrapper = styled.div`
  padding: 30px;
  background-color: #f8f9fa;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  color: #333;
  margin-bottom: 20px;
`;

const SectionCard = styled.div`
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
  width: 100%;
  max-width: 800px;
`;

const InputField = styled.input`
  padding: 10px;
  margin: 10px 0;
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const ToggleSection = styled.div`
  margin-top: 20px;
`;

const Settings: React.FC = () => {
  const [experience, setExperience] = useState<experienceSection | null>(null);
  const [skills, setSkills] = useState<skillsSection | null>(null);
  const [hero, setHero] = useState<heroSection | null>(null);
  const [projects, setProjects] = useState<projectSection | null>(null);

  const [newExperience, setNewExperience] = useState({
    company: "",
    description: "",
    location: "",
    title: "",
  });

  const [newHeroText, setNewHeroText] = useState<string>("");
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    link: "",
  });

  const [showExperience, setShowExperience] = useState<boolean>(true);
  const [showSkills, setShowSkills] = useState<boolean>(true);
  const [showHero, setShowHero] = useState<boolean>(true);
  const [showProjects, setShowProjects] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      const experienceData = await getData("homePage", "experienceSection");
      const skillsData = await getData("homePage", "skillsSection");
      const heroData = await getData("homePage", "heroSection");
      const projectsData = await getData("homePage", "projectSection");

      if (experienceData) setExperience(experienceData as experienceSection);
      if (skillsData) setSkills(skillsData as skillsSection);
      if (heroData) setHero(heroData as heroSection);
      if (projectsData) setProjects(projectsData as projectSection);
    };

    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewExperience({
      ...newExperience,
      [e.target.name]: e.target.value,
    });
  };

  const handleHeroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewHeroText(e.target.value);
  };

  const handleProjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewProject({
      ...newProject,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddExperience = async () => {
    if (experience) {
      const updatedExperience = {
        ...experience,
        workExperienceData: [...experience.workExperienceData, newExperience],
      };
      await updateData("homePage", "experienceSection", updatedExperience);
      setExperience(updatedExperience);
      setNewExperience({
        company: "",
        description: "",
        location: "",
        title: "",
      });
    }
  };

  const handleUpdateHero = async () => {
    if (hero) {
      const updatedHero = { ...hero, heroText: newHeroText };
      await updateData("homePage", "heroSection", updatedHero);
      setHero(updatedHero);
      setNewHeroText("");
    }
  };

  const handleAddProject = async () => {
    if (projects) {
      const updatedProjects = {
        ...projects,
        projects: [...projects.projects, newProject],
      };
      await updateData("homePage", "projectSection", updatedProjects);
      setProjects(updatedProjects as projectSection);
      setNewProject({ title: "", description: "", link: "" });
    }
  };

  const handleSectionToggle = (section: string) => {
    switch (section) {
      case "experience":
        setShowExperience(!showExperience);
        break;
      case "skills":
        setShowSkills(!showSkills);
        break;
      case "hero":
        setShowHero(!showHero);
        break;
      case "projects":
        setShowProjects(!showProjects);
        break;
      default:
        break;
    }
  };

  return (
    <SettingsWrapper>
      <SectionTitle>Settings</SectionTitle>

      <SectionCard>
        <h3>Toggle Sections</h3>
        <ToggleSection>
          <label>
            <input
              type="checkbox"
              checked={showExperience}
              onChange={() => handleSectionToggle("experience")}
            />
            Edit Experience Section
          </label>
          <br />
          <label>
            <input
              type="checkbox"
              checked={showSkills}
              onChange={() => handleSectionToggle("skills")}
            />
            Edit Skills Section
          </label>
          <br />
          <label>
            <input
              type="checkbox"
              checked={showHero}
              onChange={() => handleSectionToggle("hero")}
            />
            Edit Hero Section
          </label>
          <br />
          <label>
            <input
              type="checkbox"
              checked={showProjects}
              onChange={() => handleSectionToggle("projects")}
            />
            Edit Projects Section
          </label>
        </ToggleSection>
      </SectionCard>

      {/* Experience Section */}
      {showExperience && (
        <SectionCard>
          <SectionTitle>Update Experience Section</SectionTitle>
          {experience && (
            <div>
              <h3>Current Work Experiences</h3>
              <ul>
                {experience.workExperienceData.map((item, index) => (
                  <li key={index}>
                    {item.title} at {item.company}
                  </li>
                ))}
              </ul>

              <h3>Add New Work Experience</h3>
              <InputField
                type="text"
                name="company"
                placeholder="Company"
                value={newExperience.company}
                onChange={handleInputChange}
              />
              <InputField
                type="text"
                name="title"
                placeholder="Title"
                value={newExperience.title}
                onChange={handleInputChange}
              />
              <InputField
                type="text"
                name="location"
                placeholder="Location"
                value={newExperience.location}
                onChange={handleInputChange}
              />
              <InputField
                type="text"
                name="description"
                placeholder="Description"
                value={newExperience.description}
                onChange={handleInputChange}
              />
              <Button onClick={handleAddExperience}>Add Experience</Button>
            </div>
          )}
        </SectionCard>
      )}

      {/* Hero Section */}
      {showHero && (
        <SectionCard>
          <SectionTitle>Update Hero Section</SectionTitle>
          {hero && (
            <div>
              <h3>Current Hero Text</h3>
              <p>{hero.heroText}</p>
              <h3>Edit Hero Text</h3>
              <InputField
                type="text"
                value={newHeroText}
                onChange={handleHeroChange}
                placeholder="Enter new hero text"
              />
              <Button onClick={handleUpdateHero}>Update Hero Text</Button>
            </div>
          )}
        </SectionCard>
      )}

      {/* Projects Section */}
      {showProjects && (
        <SectionCard>
          <SectionTitle>Update Projects Section</SectionTitle>
          {projects && (
            <div>
              <h3>Current Projects</h3>
              <ul>
                {projects.projects.map((project, index) => (
                  <li key={index}>
                    {project.title} - {project.description}
                  </li>
                ))}
              </ul>

              <h3>Add New Project</h3>
              <InputField
                type="text"
                name="title"
                placeholder="Project Title"
                value={newProject.title}
                onChange={handleProjectChange}
              />
              <InputField
                type="text"
                name="description"
                placeholder="Project Description"
                value={newProject.description}
                onChange={handleProjectChange}
              />
              <InputField
                type="text"
                name="link"
                placeholder="Project Link"
                value={newProject.link}
                onChange={handleProjectChange}
              />
              <Button onClick={handleAddProject}>Add Project</Button>
            </div>
          )}
        </SectionCard>
      )}
    </SettingsWrapper>
  );
};

export default Settings;
