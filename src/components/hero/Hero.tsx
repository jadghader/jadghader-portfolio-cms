import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import Skeleton from "@mui/material/Skeleton";

const HeroSection: React.FC = () => {
  const [typedText, setTypedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);
  const [heroContent, setHeroContent] = useState<any>(null);
  const imageUrl = `${process.env.PUBLIC_URL}/images/Jad-Ghader.jpeg`;

  // Fetch Firestore data
  useEffect(() => {
    const fetchHeroContent = async () => {
      try {
        const docRef = doc(db, "homePage", "heroSection");
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

  // Typing effect
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
  }, [charIndex, isDeleting, heroContent]);

  if (!heroContent) {
    return (
      <HeroContainer>
        <ContentWrapper>
          <TextContainer>
            <Skeleton variant="text" width="80%" height={40} />
            <Skeleton variant="text" width="60%" height={30} />
            <Skeleton variant="rectangular" width={100} height={60} />
          </TextContainer>
          <ImageContainer>
            <Skeleton variant="circular" width={320} height={320} />
          </ImageContainer>
        </ContentWrapper>
      </HeroContainer>
    );
  }

  return (
    <HeroContainer>
      <ContentWrapper>
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
      </ContentWrapper>
    </HeroContainer>
  );
};

export default HeroSection;

// Styled Components

const HeroContainer = styled.section`
  display: flex;
  justify-content: center;
  background-color: ${({ theme }) => theme.background};
  border-bottom: 2px solid ${({ theme }) => theme.accent};
  position: relative;
  overflow: hidden;
  padding: 60px 20px;


  @media (max-width: 768px) {
    padding: 48px 20px 60px;

    &:before {
      top: -80px;
      left: -80px;
      width: 260px;
      height: 260px;
    }
  }
`;

// Wrap content to center and add max-width
const ContentWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(32px, 6vw, 120px);
  flex-wrap: wrap;
  width: 100%;
  max-width: 1200px; // centered content with left/right space
`;

const TextContainer = styled.div`
  flex: 1;
  max-width: 520px;
  color: ${({ theme }) => theme.text};
  z-index: 2;

  h1 {
    font-size: clamp(2.2rem, 3vw, 2.8rem);
    font-weight: 700;
    margin-bottom: 16px;
    line-height: 1.2;
  }

  p {
    font-size: 1.1rem;
    line-height: 1.6;
    margin-bottom: 18px;
    max-width: 460px;
  }

  @media (max-width: 768px) {
    text-align: center;
    max-width: 100%;

    p {
      margin: 0 auto 18px;
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
  flex: 1.2;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;

  @media (max-width: 768px) {
    flex: 1;
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  width: clamp(340px, 38vw, 440px);
  height: clamp(340px, 38vw, 440px);
  padding: 8px;
  background-color: ${({ theme }) => theme.accent};
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.18);

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
    border: 7px solid ${({ theme }) => theme.background};
    transition: transform 0.35s ease;

    &:hover {
      transform: scale(1.07);
    }
  }

  @media (max-width: 1024px) {
    width: 360px;
    height: 360px;
  }

  @media (max-width: 768px) {
    width: 300px;
    height: 300px;
    padding: 6px;
  }
`;
