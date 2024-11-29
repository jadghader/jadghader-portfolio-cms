// src/components/Button.tsx
import React from "react";
import styled from "styled-components";

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  icon?: React.ReactNode;
  size?: "small" | "medium" | "large"; // Allows different button sizes
  fontSize?: string; // Custom font size
  padding?: string; // Custom padding
  borderRadius?: string; // Custom border radius
}

const ButtonContainer = styled.button<ButtonProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ padding, size }) => {
    if (padding) return padding; // Use custom padding if provided
    switch (size) {
      case "small":
        return "8px 16px"; // Default small padding
      case "large":
        return "16px 32px"; // Default large padding
      case "medium":
      default:
        return "12px 24px"; // Default medium padding
    }
  }};
  font-size: ${({ fontSize, size }) => {
    if (fontSize) return fontSize; // Use custom font size if provided
    switch (size) {
      case "small":
        return "14px"; // Default small font size
      case "large":
        return "18px"; // Default large font size
      case "medium":
      default:
        return "16px"; // Default medium font size
    }
  }};
  font-weight: 600;
  border: none;
  border-radius: ${({ borderRadius }) =>
    borderRadius || "8px"}; // Custom border radius if provided
  cursor: pointer;
  background-color: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.background};
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.accent};
    transform: scale(1.05);
  }

  &:focus {
    outline: none;
  }

  svg {
    margin-right: 8px;
  }
`;

const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  icon,
  size = "medium", // Default to medium size if not provided
  fontSize,
  padding,
  borderRadius,
}) => {
  return (
    <ButtonContainer
      onClick={onClick}
      size={size}
      fontSize={fontSize}
      padding={padding}
      borderRadius={borderRadius}
    >
      {icon && icon}
      {children}
    </ButtonContainer>
  );
};

export default Button;
