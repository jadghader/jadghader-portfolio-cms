import React, { useState } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import { FaTimes, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useDeviceType } from "../../hooks/useDeviceType";

const ImageGallery: React.FC<{ images: string[] }> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const deviceType = useDeviceType(); // Use the hook to detect the device type

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const nextImage = () =>
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);

  const prevImage = () =>
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );

  const modal = (
    <ModalOverlay onClick={closeModal}>
      <ModalContent
        deviceType={deviceType} // Pass the deviceType for dynamic styling
        onClick={(e) => e.stopPropagation()}
      >
        <CloseButton onClick={closeModal}>
          <FaTimes />
        </CloseButton>
        <ImageContainer>
          <StyledImage
            src={images[currentIndex]}
            alt={`Gallery image ${currentIndex + 1}`}
          />
        </ImageContainer>
        <Navigation>
          <NavButton onClick={prevImage}>
            <FaArrowLeft />
          </NavButton>
          <NavButton onClick={nextImage}>
            <FaArrowRight />
          </NavButton>
        </Navigation>
      </ModalContent>
    </ModalOverlay>
  );

  return (
    <>
      <GalleryContainer onClick={openModal}>
        <GalleryImage src={images[0]} alt="Gallery Thumbnail" />
      </GalleryContainer>
      {isModalOpen && ReactDOM.createPortal(modal, document.body)}
    </>
  );
};

// Styled Components
const GalleryContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  @media (max-width: 768px) {
    height: 200px;
  }
`;

const GalleryImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 4px 10px ${({ theme }) => theme.shadow};
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div<{
  deviceType: "mobile" | "tablet" | "desktop";
}>`
  position: relative;
  width: ${({ deviceType }) =>
    deviceType === "mobile"
      ? "90%"
      : deviceType === "tablet"
      ? "90%"
      : "800px"};
  max-height: 90vh;
  background: ${({ theme }) => theme.cardBackground};
  border-radius: 12px;
  padding: 40px; /* Added padding for space around the image */
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto; // Ensures horizontal centering


  @media (max-width: 768px) {
    padding: 20px; /* Adjust padding for smaller screens */
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  max-height: 80vh; /* Limit image height */
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  border: 12px solid ${({ theme }) => theme.background}; /* Border around image */
  border-radius: 12px;
  background: ${({ theme }) =>
    theme.background}; /* Ensure padding background is visible */
`;

const StyledImage = styled.img`
  max-width: 100%; /* Scale image within container */
  max-height: 100%; /* Keep aspect ratio intact */
  object-fit: contain; /* Ensures image fits without distortion */
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px; /* Position relative to modal padding */
  right: 10px;
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.text};
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 1001;

  &:hover {
    color: ${({ theme }) => theme.hoverAccent};
  }
`;

const Navigation = styled.div`
  position: absolute;
  top: 50%;
  width: calc(100% - 80px); /* Adjust width based on modal padding */
  display: flex;
  justify-content: space-between;
  transform: translateY(-50%);
  z-index: 1001;
`;

const NavButton = styled.button`
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  font-size: 2rem;
  padding: 10px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${({ theme }) => theme.hoverAccent};
  }
`;

export default ImageGallery;
