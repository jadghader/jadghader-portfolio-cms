import React, { useEffect, useState } from "react";
import { getData, updateData } from "../../firebase/firestore";
import {
  experienceSection,
  skillsSection,
  projectSection,
} from "../../interfaces/firestore.interface";
import styled from "styled-components";
import { FaTrash, FaPlus } from "react-icons/fa";
import { useParams } from "react-router-dom";

const SettingsWrapper = styled.div`
  padding: 30px;
  background-color: ${({ theme }) => theme.background};
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;

`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  color: ${({ theme }) => theme.accent};
  margin-bottom: 10px;
`;

const SectionCard = styled.div`
  background-color: ${({ theme }) => theme.background};
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 5px;
  width: 100%;
  max-width: 900px;
`;

const InputField = styled.input`
  padding: 10px;
  margin: 5px 0;
  width: 100%;
  border: 1px solid ${({ theme }) => theme.accent};
  border-radius: 4px;
`;

const Button = styled.button`
  background-color: ${({ theme }) => theme.accent};
  color: ${({ theme }) => theme.text};
  padding: 10px 20px;
  margin-bottom: 5px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;

  &:hover {
    background-color: ${({ theme }) => theme.accentDark};
  }
`;

const DeleteButton = styled.button`
  background-color: ${({ theme }) => theme.danger};
  color: white;
  margin: 5px 0px;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;

  &:hover {
    background-color: ${({ theme }) => theme.danger};
  }
`;

const Settings: React.FC = () => {
  const { section } = useParams(); // Capture the section from the URL
  const [experience, setExperience] = useState<experienceSection | null>(null);
  const [skills, setSkills] = useState<skillsSection | null>(null);
  const [projects, setProjects] = useState<projectSection | null>(null);
  const [newExperience, setNewExperience] = useState({
    company: "",
    title: "",
    location: "",
    description: "",
    companyLogo: "",
  });
  const [newSkill, setNewSkill] = useState({
    category: "",
    name: "",
    icon: "",
  });
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    images: [] as string[], // Change image to an array of strings
  });

  useEffect(() => {
    const fetchData = async () => {
      const experienceData = await getData("homePage", "experienceSection");
      const skillsData = await getData("homePage", "skillsSection");
      const projectsData = await getData("homePage", "projectSection");

      if (experienceData) setExperience(experienceData as experienceSection);
      if (skillsData) setSkills(skillsData as skillsSection);
      if (projectsData) setProjects(projectsData as projectSection);
    };

    fetchData();
  }, []);

  // Experience Section
  const handleAddExperience = async () => {
    if (experience) {
      const updatedExperience = {
        ...experience,
        workExperienceData: [
          ...experience.workExperienceData,
          {
            company: newExperience.company,
            title: newExperience.title,
            location: newExperience.location,
            description: newExperience.description,
            companyLogo: newExperience.companyLogo, // Add the companyLogo
          },
        ],
      };
      await updateData("homePage", "experienceSection", updatedExperience);
      setExperience(updatedExperience);
      setNewExperience({
        company: "",
        title: "",
        location: "",
        description: "",
        companyLogo: "", // Add the companyLogo
      });
    }
  };

  const handleDeleteExperience = async (index: number) => {
    if (experience) {
      const updatedExperience = {
        ...experience,
        workExperienceData: experience.workExperienceData.filter(
          (_, i) => i !== index
        ),
      };
      await updateData("homePage", "experienceSection", updatedExperience);
      setExperience(updatedExperience);
    }
  };

  // Skills Section
  const handleAddSkill = async () => {
    if (skills) {
      const categoryExists = skills.skillsData.find(
        (item) => item.category === newSkill.category
      );
      if (categoryExists) {
        categoryExists.skills.push({
          name: newSkill.name,
          icon: newSkill.icon,
        });
      } else {
        skills.skillsData.push({
          category: newSkill.category,
          skills: [{ name: newSkill.name, icon: newSkill.icon }],
        });
      }

      await updateData("homePage", "skillsSection", skills);
      setSkills({ ...skills });
      setNewSkill({ category: "", name: "", icon: "" });
    }
  };

  const handleDeleteSkill = async (category: string, index: number) => {
    if (skills) {
      const categoryIndex = skills.skillsData.findIndex(
        (item) => item.category === category
      );
      if (categoryIndex !== -1) {
        skills.skillsData[categoryIndex].skills.splice(index, 1);
        await updateData("homePage", "skillsSection", skills);
        setSkills({ ...skills });
      }
    }
  };

  // Projects Section
  const handleAddProject = async () => {
    if (projects) {
      const updatedProjects = {
        ...projects,
        projects: [
          ...projects.projects,
          {
            title: newProject.title,
            description: newProject.description,
            images: newProject.images, // Now we push the array of images
          },
        ],
      };
      await updateData("homePage", "projectSection", updatedProjects);
      setProjects(updatedProjects);
      setNewProject({
        title: "",
        description: "",
        images: [], // Reset to empty array
      });
    }
  };

  const handleDeleteProject = async (index: number) => {
    if (projects) {
      const updatedProjects = {
        ...projects,
        projects: projects.projects.filter((_, i) => i !== index),
      };
      await updateData("homePage", "projectSection", updatedProjects);
      setProjects(updatedProjects);
    }
  };

  // Input field for adding more images
  const handleAddImage = () => {
    setNewProject((prev) => ({
      ...prev,
      images: [...prev.images, ""], // Add an empty string as placeholder for the new image URL
    }));
  };

  // Render based on selected section
  const renderSection = () => {
    switch (
      section // Use the section from the URL
    ) {
      case "experience":
        return (
          <SectionCard>
            <SectionTitle>Experience</SectionTitle>
            {experience &&
              experience.workExperienceData.map((item, index) => (
                <div key={index}>
                  <p>
                    {item.title} at {item.company}
                  </p>
                  <DeleteButton onClick={() => handleDeleteExperience(index)}>
                    <FaTrash /> Delete
                  </DeleteButton>
                </div>
              ))}
            <InputField
              type="text"
              name="company"
              placeholder="Company"
              value={newExperience.company}
              onChange={(e) =>
                setNewExperience({ ...newExperience, company: e.target.value })
              }
            />
            <InputField
              type="text"
              name="title"
              placeholder="Title"
              value={newExperience.title}
              onChange={(e) =>
                setNewExperience({ ...newExperience, title: e.target.value })
              }
            />
            <InputField
              type="text"
              name="location"
              placeholder="Location"
              value={newExperience.location}
              onChange={(e) =>
                setNewExperience({ ...newExperience, location: e.target.value })
              }
            />
            <InputField
              type="text"
              name="companyLogo"
              placeholder="Company Logo URL"
              value={newExperience.companyLogo}
              onChange={(e) =>
                setNewExperience({
                  ...newExperience,
                  companyLogo: e.target.value,
                })
              }
            />
            <InputField
              type="text"
              name="description"
              placeholder="Description"
              value={newExperience.description}
              onChange={(e) =>
                setNewExperience({
                  ...newExperience,
                  description: e.target.value,
                })
              }
            />
            <Button onClick={handleAddExperience}>
              <FaPlus /> Experience
            </Button>
          </SectionCard>
        );
      case "skills":
        return (
          <SectionCard>
            <SectionTitle>Skills</SectionTitle>
            {skills &&
              skills.skillsData.map((category, categoryIndex) => (
                <div key={categoryIndex}>
                  <h3>{category.category}</h3>
                  {category.skills.map((item, skillIndex) => (
                    <div key={skillIndex}>
                      <p>{item.name}</p>
                      <DeleteButton
                        onClick={() =>
                          handleDeleteSkill(category.category, skillIndex)
                        }
                      >
                        <FaTrash /> Delete
                      </DeleteButton>
                    </div>
                  ))}
                </div>
              ))}
            <InputField
              type="text"
              name="category"
              placeholder="Category"
              value={newSkill.category}
              onChange={(e) =>
                setNewSkill({ ...newSkill, category: e.target.value })
              }
            />
            <InputField
              type="text"
              name="name"
              placeholder="Skill Name"
              value={newSkill.name}
              onChange={(e) =>
                setNewSkill({ ...newSkill, name: e.target.value })
              }
            />
            <InputField
              type="text"
              name="icon"
              placeholder="Icon URL"
              value={newSkill.icon}
              onChange={(e) =>
                setNewSkill({ ...newSkill, icon: e.target.value })
              }
            />
            <Button onClick={handleAddSkill}>
              <FaPlus /> Skill
            </Button>
          </SectionCard>
        );
      case "projects":
        return (
          <SectionCard>
            <SectionTitle>Projects</SectionTitle>
            {projects &&
              projects.projects.map((item, index) => (
                <div key={index}>
                  <p>{item.title}</p>
                  <DeleteButton onClick={() => handleDeleteProject(index)}>
                    <FaTrash /> Delete
                  </DeleteButton>
                </div>
              ))}
            <InputField
              type="text"
              name="title"
              placeholder="Project Title"
              value={newProject.title}
              onChange={(e) =>
                setNewProject({ ...newProject, title: e.target.value })
              }
            />
            <InputField
              type="text"
              name="description"
              placeholder="Project Description"
              value={newProject.description}
              onChange={(e) =>
                setNewProject({ ...newProject, description: e.target.value })
              }
            />
            {/* Button to add more images */}
            <Button onClick={handleAddImage}>
              <FaPlus /> Image
            </Button>
            {newProject.images.map((image, index) => (
              <InputField
                key={index}
                type="text"
                name={`image-${index}`}
                placeholder="Image URL"
                value={image}
                onChange={(e) => {
                  const updatedImages = [...newProject.images];
                  updatedImages[index] = e.target.value;
                  setNewProject({ ...newProject, images: updatedImages });
                }}
              />
            ))}
            <Button onClick={handleAddProject}>
              <FaPlus /> Project
            </Button>
          </SectionCard>
        );
      default:
        return <div>Please select a section to edit.</div>;
    }
  };

  return <SettingsWrapper>{renderSection()}</SettingsWrapper>;
};

export default Settings;
