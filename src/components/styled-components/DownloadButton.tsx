// src/components/DownloadButton.tsx
import React from "react";
import styled from "styled-components";
import { FaRegFilePdf } from "react-icons/fa";

interface ButtonProps {
  onClick: () => void;
}

const ButtonContainer = styled.button<ButtonProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px; /* Smaller padding */
  font-size: 1.2rem; /* Adjust font size slightly for balance */
  font-weight: 600;
  border: 2px solid ${({ theme }) => theme.accent}; /* Softer border */
  border-radius: 8px;
  cursor: pointer;
  background-color: transparent;
  color: ${({ theme }) => theme.accent};
  transition: background-color 0.3s ease, color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.accent};
    color: ${({ theme }) => theme.background};
    transform: scale(1.05);
  }

  &:focus {
    outline: none;
  }

  svg {
    margin-right: 8px;
    font-size: 1.2rem; /* Adjust icon size if needed */
  }
`;

const DownloadButton: React.FC<ButtonProps> = ({ onClick }) => {
  return (
    <ButtonContainer onClick={onClick}>
      <FaRegFilePdf />
      Download CV
    </ButtonContainer>
  );
};

export default DownloadButton;
