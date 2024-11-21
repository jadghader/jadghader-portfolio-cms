import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { doc, getDoc } from "firebase/firestore"; // Import Firestore methods
import { db } from "../../firebase";
import Skeleton from "@mui/material/Skeleton"; // Import MUI Skeleton for loader

const HeroSection: React.FC = () => {
  const [typedText, setTypedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);
  const [heroContent, setHeroContent] = useState<any>(null); // State to hold Firestore content
  const imageUrl = `${process.env.PUBLIC_URL}/images/Jad-Ghader.jpeg`;

  // Fetch Firestore data
  useEffect(() => {
    const fetchHeroContent = async () => {
      try {
        const docRef = doc(db, "homePage", "heroSection"); // Get hero content document
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setHeroContent(docSnap.data());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error getting document:", error);
      }
    };

    fetchHeroContent();
  }, []);

  useEffect(() => {
    if (!heroContent) return;

    const handleTyping = () => {
      if (!isDeleting && charIndex < heroContent.heroText.length) {
        setTypedText((prev) => prev + heroContent.heroText[charIndex]);
        setCharIndex((prev) => prev + 1);
      } else if (isDeleting && charIndex > 0) {
        setTypedText((prev) => prev.slice(0, -1));
        setCharIndex((prev) => prev - 1);
      } else if (charIndex === heroContent.heroText.length) {
        setTimeout(() => setIsDeleting(true), 1500);
      } else if (isDeleting && charIndex === 0) {
        setIsDeleting(false);
      }
    };

    const typingDelay = isDeleting ? 50 : 100;
    const timer = setTimeout(handleTyping, typingDelay);

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, heroContent]); // Run when heroContent changes
  if (!heroContent) {
    return (
      <HeroContainer>
        <TextContainer>
          <Skeleton variant="text" width="100%" height={40} />
          <Skeleton variant="text" width="100%" height={30} />
          <Skeleton variant="rectangular" width="100px" height="60px" />
        </TextContainer>
        <ImageContainer>
          <Skeleton variant="circular" width={320} height={320} />
        </ImageContainer>
      </HeroContainer>
    );
  }

  return (
    <HeroContainer>
      <TextContainer>
        <h1>{typedText}</h1>
        <p>{heroContent.infoText}</p>
        <SocialIcons>
          {heroContent.socialLinks.map((link: any) => (
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              key={link.name}
            >
              {link.name === "LinkedIn" ? <FaLinkedin /> : <FaGithub />}
            </a>
          ))}
        </SocialIcons>
      </TextContainer>
      <ImageContainer>
        <ImageWrapper>
          <img src={imageUrl} alt="Jad Ghader" />
        </ImageWrapper>
      </ImageContainer>
    </HeroContainer>
  );
};

export default HeroSection;

// Styled Components
const HeroContainer = styled.section`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 60px 20px 80px;
  height: 100vh;
  background-color: ${({ theme }) => theme.background};
  border-bottom: 2px solid ${({ theme }) => theme.accent};
  position: relative;
  overflow: hidden;
  flex-wrap: wrap; /* Allow wrapping in smaller screens */

  &:before {
    content: "";
    position: absolute;
    top: -200px;
    left: -200px;
    width: 600px;
    height: 600px;
    background-color: ${({ theme }) => theme.accent};
    border-radius: 50%;
    opacity: 0.15;
    z-index: 1;
    transform: rotate(45deg);
  }

  @media (max-width: 768px) {
    flex-direction: column; /* Stack content and image */
    height: 85vh; /* Allow height to adjust */
    padding: 40px 20px;

    &:before {
      /* Adjust the size and position of the circle on mobile */
      top: -100px; /* Reduce the top offset */
      left: -100px; /* Reduce the left offset */
      width: 300px; /* Reduce the size of the circle */
      height: 300px; /* Reduce the size of the circle */
    }
  }
`;
const TextContainer = styled.div`
  flex: 1;
  max-width: 50%;
  color: ${({ theme }) => theme.text};
  z-index: 2;

  h1 {
    font-size: 2.8rem;
    font-weight: bold;
    margin-bottom: 20px;
    line-height: 1.2;
  }

  p {
    font-size: 1.2rem;
    max-width: 450px;
    line-height: 1.6;
    margin-bottom: 20px;
  }

  @media (max-width: 768px) {
    text-align: center;
    max-width: 100%; /* Full width on smaller screens */
    h1 {
      font-size: 2rem; /* Smaller font size */
    }
    p {
      font-size: 1rem; /* Smaller font size */
    }
  }
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 15px;

  a {
    color: ${({ theme }) => theme.text};
    font-size: 1.8rem;
    transition: color 0.3s ease-in-out;

    &:hover {
      color: ${({ theme }) => theme.accent};
    }
  }

  @media (max-width: 768px) {
    justify-content: center;
    margin-top: 20px;
  }
`;

const ImageContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  @media (max-width: 768px) {
    width: 100%; /* Make image take full width on small screens */
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 320px;
  height: 320px;
  padding: 5px;
  background-color: ${({ theme }) => theme.accent};
  border-radius: 50%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
    border: 6px solid ${({ theme }) => theme.background};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    transition: transform 0.3s ease-in-out;

    &:hover {
      transform: scale(1.05);
    }
  }

  @media (max-width: 768px) {
    width: 280px; /* Reduce image size */
    height: 280px; /* Maintain circular shape */
  }
`;
