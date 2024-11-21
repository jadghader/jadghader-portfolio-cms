import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import styled from "styled-components";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import { Logout } from "@mui/icons-material"; // Material UI logout icon
import {
  CircularProgress,
  Typography,
  IconButton,
  Button,
  TextField,
} from "@mui/material";
import { DocumentContent } from "../../interfaces/firestore.interface";

const Settings: React.FC = () => {
  const { user, isAdmin, isLoading, logout } = useAuth();
  const [documents, setDocuments] = useState<DocumentContent[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<DocumentContent | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all documents from Firestore collection
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "homePage"));
        const docs: DocumentContent[] = [];
        querySnapshot.forEach((doc) => {
          docs.push({ id: doc.id, ...doc.data() } as DocumentContent);
        });
        setDocuments(docs);
        setSelectedDoc(docs[0] || null); // Default to the first document
      } catch (err) {
        setError("Failed to fetch content. Please try again.");
      }
    };

    fetchDocuments();
  }, []);

  const handleInputChange = (path: string, value: any) => {
    if (!selectedDoc) return;

    const updatedDoc = { ...selectedDoc };
    const keys = path.split(".");
    let current: any = updatedDoc;

    keys.forEach((key, idx) => {
      if (idx === keys.length - 1) {
        // Ensure key is a valid property of the current object
        current[key as keyof typeof current] = value;
      } else {
        current = current[key as keyof typeof current]; // Navigate deeper in the structure
      }
    });

    setSelectedDoc(updatedDoc);
  };

  const saveChanges = async () => {
    if (!selectedDoc || !user) return;

    setIsSaving(true);
    setError(null);

    try {
      const docRef = doc(db, "homePage", selectedDoc.id);
      const { id, ...data } = selectedDoc; // Exclude `id` before saving
      const updatedData = {
        ...data,
        lastModifiedBy: user.uid,
        lastModifiedAt: new Date(),
      };
      await updateDoc(docRef, updatedData);
    } catch (err) {
      setError("Failed to save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <CircularProgress />;
  if (!user || !isAdmin) return <Navigate to="/auth/login" />;

  return (
    <Container>
      <Header>
        <Typography variant="h5">Admin Settings</Typography>
        <LogoutIcon onClick={logout}>
          <Logout />
        </LogoutIcon>
      </Header>

      <Typography variant="body1" gutterBottom>
        Edit the homepage content below:
      </Typography>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <DocumentSelector>
        <Select
          value={selectedDoc?.id || ""}
          onChange={(e) =>
            setSelectedDoc(
              documents.find((doc) => doc.id === e.target.value) || null
            )
          }
        >
          {documents.map((doc) => (
            <option key={doc.id} value={doc.id}>
              {doc.id}
            </option>
          ))}
        </Select>
      </DocumentSelector>

      {selectedDoc && (
        <FormContainer>
          {/* Hero Section */}
          <SectionTitle>Hero Section</SectionTitle>
          <TextField
            label="Hero Text"
            value={selectedDoc.heroSection?.heroText}
            onChange={(e) =>
              handleInputChange("heroSection.heroText", e.target.value)
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="Info Text"
            value={selectedDoc.heroSection?.infoText}
            onChange={(e) =>
              handleInputChange("heroSection.infoText", e.target.value)
            }
            fullWidth
            margin="normal"
          />
          <SectionTitle>Social Links</SectionTitle>
          {selectedDoc.heroSection?.socialLinks.map((link, index) => (
            <div key={index}>
              <TextField
                label={`Link Name ${index + 1}`}
                value={link.name}
                onChange={(e) =>
                  handleInputChange(
                    `heroSection.socialLinks.${index}.name`,
                    e.target.value
                  )
                }
                fullWidth
                margin="normal"
              />
              <TextField
                label={`Link URL ${index + 1}`}
                value={link.url}
                onChange={(e) =>
                  handleInputChange(
                    `heroSection.socialLinks.${index}.url`,
                    e.target.value
                  )
                }
                fullWidth
                margin="normal"
              />
            </div>
          ))}

          {/* Work Experience */}
          <SectionTitle>Work Experience</SectionTitle>
          {selectedDoc.workExperience?.map((exp, index) => (
            <div key={index}>
              <TextField
                label={`Title ${index + 1}`}
                value={exp.title}
                onChange={(e) =>
                  handleInputChange(
                    `workExperience.${index}.title`,
                    e.target.value
                  )
                }
                fullWidth
                margin="normal"
              />
              <TextField
                label={`Company ${index + 1}`}
                value={exp.company}
                onChange={(e) =>
                  handleInputChange(
                    `workExperience.${index}.company`,
                    e.target.value
                  )
                }
                fullWidth
                margin="normal"
              />
              <TextField
                label={`Location ${index + 1}`}
                value={exp.location}
                onChange={(e) =>
                  handleInputChange(
                    `workExperience.${index}.location`,
                    e.target.value
                  )
                }
                fullWidth
                margin="normal"
              />
              <TextField
                label={`Description ${index + 1}`}
                value={exp.description}
                onChange={(e) =>
                  handleInputChange(
                    `workExperience.${index}.description`,
                    e.target.value
                  )
                }
                fullWidth
                margin="normal"
              />
            </div>
          ))}

          {/* Projects */}
          <SectionTitle>Projects</SectionTitle>
          {selectedDoc.projects?.map((project, index) => (
            <div key={index}>
              <TextField
                label={`Project Title ${index + 1}`}
                value={project.title}
                onChange={(e) =>
                  handleInputChange(`projects.${index}.title`, e.target.value)
                }
                fullWidth
                margin="normal"
              />
              <TextField
                label={`Project Description ${index + 1}`}
                value={project.description}
                onChange={(e) =>
                  handleInputChange(
                    `projects.${index}.description`,
                    e.target.value
                  )
                }
                fullWidth
                margin="normal"
              />
              <TextField
                label={`Project Image URL ${index + 1}`}
                value={project.image}
                onChange={(e) =>
                  handleInputChange(`projects.${index}.image`, e.target.value)
                }
                fullWidth
                margin="normal"
              />
            </div>
          ))}

          {/* Skills Category */}
          <SectionTitle>Skills</SectionTitle>
          {selectedDoc.skillsCategory?.map((category, index) => (
            <div key={index}>
              <TextField
                label={`Category Name ${index + 1}`}
                value={category.category}
                onChange={(e) =>
                  handleInputChange(
                    `skillsCategory.${index}.category`,
                    e.target.value
                  )
                }
                fullWidth
                margin="normal"
              />
              {category.skills.map((skill, skillIndex) => (
                <div key={skillIndex}>
                  <TextField
                    label={`Skill Name ${skillIndex + 1}`}
                    value={skill.name}
                    onChange={(e) =>
                      handleInputChange(
                        `skillsCategory.${index}.skills.${skillIndex}.name`,
                        e.target.value
                      )
                    }
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    label={`Skill Icon ${skillIndex + 1}`}
                    value={skill.icon}
                    onChange={(e) =>
                      handleInputChange(
                        `skillsCategory.${index}.skills.${skillIndex}.icon`,
                        e.target.value
                      )
                    }
                    fullWidth
                    margin="normal"
                  />
                </div>
              ))}
            </div>
          ))}
        </FormContainer>
      )}

      <SaveButton onClick={saveChanges} disabled={isSaving}>
        {isSaving ? "Saving..." : "Save Changes"}
      </SaveButton>
    </Container>
  );
};

export default Settings;

// Styled Components
const Container = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const LogoutIcon = styled(IconButton)`
  color: ${({ theme }) => theme.text};
  &:hover {
    color: ${({ theme }) => theme.accent};
  }
`;

const DocumentSelector = styled.div`
  width: 300px;
  margin-bottom: 1rem;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
`;

const FormContainer = styled.div`
  background-color: #f7f7f7;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
`;

const SectionTitle = styled.h3`
  margin-top: 1.5rem;
  font-size: 1.2rem;
`;

const SaveButton = styled(Button)`
  background-color: ${({ theme }) => theme.accent};
  color: white;
  width: 100%;
  padding: 1rem;
  border-radius: 8px;
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled(Typography)`
  color: red;
  font-size: 1rem;
  margin-bottom: 1rem;
`;
