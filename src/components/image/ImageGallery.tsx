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
        <ImageContainer deviceType={deviceType}>
          <StyledImage
            src={images[currentIndex]}
            alt={`Gallery image ${currentIndex + 1}`}
          />
        </ImageContainer>
        <Navigation>
          <NavButton direction="left" onClick={prevImage}>
            <FaArrowLeft />
          </NavButton>
          <NavButton direction="right" onClick={nextImage}>
            <FaArrowRight />
          </NavButton>
        </Navigation>
      </ModalContent>
    </ModalOverlay>
  );

  return (
    <>
      <GalleryContainer deviceType={deviceType} onClick={openModal}>
        <GalleryImage src={images[0]} alt="Gallery Thumbnail" />
      </GalleryContainer>
      {isModalOpen && ReactDOM.createPortal(modal, document.body)}
    </>
  );
};

// Styled Components
const GalleryContainer = styled.div<{
  deviceType: "mobile" | "tablet" | "desktop";
}>`
  width: 100%;
  height: ${({ deviceType }) =>
    deviceType === "mobile"
      ? "150px"
      : "250px"}; /* Adjust thumbnail container height */
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const GalleryImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover; /* Ensure consistent display in thumbnails */
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
      ? "95%"
      : deviceType === "tablet"
      ? "90%"
      : "800px"}; /* Adjust modal width for devices */
  max-height: 95vh;
  background: ${({ theme }) => theme.cardBackground};
  border-radius: 12px;
  padding: ${({ deviceType }) =>
    deviceType === "mobile" ? "20px" : "40px"}; /* Adjust padding */
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto; /* Center the modal */
  overflow-y: auto; /* Handle overflow gracefully */
`;

const ImageContainer = styled.div<{
  deviceType: "mobile" | "tablet" | "desktop";
}>`
  width: 100%;
  max-height: ${({ deviceType }) =>
    deviceType === "mobile"
      ? "60vh"
      : deviceType === "tablet"
      ? "70vh"
      : "80vh"}; /* Adjust heights for device types */
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  border-radius: 12px;
  background: white;
  margin: 20px 0; /* Add spacing around the image */
`;

const StyledImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain; /* Ensure the image fits without distortion */
  border-radius: 8px; /* Optional: Add rounded corners to images */
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.text};
  font-size: 1.2rem;
  cursor: pointer;
  z-index: 1001;

  &:hover {
    color: ${({ theme }) => theme.hoverAccent};
  }
`;

const Navigation = styled.div`
  position: absolute;
  top: 50%;
  width: calc(100% - 24px); /* Adjust for modal padding and spacing */
  display: flex;
  justify-content: space-between;
  transform: translateY(-50%);
  z-index: 1001;
`;

const NavButton = styled.button<{ direction: "left" | "right" }>`
  background: rgba(0, 0, 0, 0.4);
  color: white;
  border: none;
  font-size: 1.5rem;
  width: 40px; /* Circular button width */
  height: 40px; /* Circular button height */
  border-radius: 50%; /* Make it circular */
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;

  /* Position the buttons near the border frame */
  ${({ direction }) => (direction === "left" ? "left: 25px;" : "right: 25px;")}
  top: 50%; /* Center vertically */
  transform: translateY(-50%);

  /* Button hover effects */
  &:hover {
    background: ${({ theme }) => theme.hoverAccent};
  }

  /* Adjustments for mobile devices */
  @media (max-width: 768px) {
    font-size: 1rem; /* Smaller icon size */
    width: 30px; /* Smaller circular button */
    height: 30px;
    ${({ direction }) =>
      direction === "left"
        ? "left: 8px;"
        : "right: 8px;"}/* Closer to border */
  }
`;

export default ImageGallery;
