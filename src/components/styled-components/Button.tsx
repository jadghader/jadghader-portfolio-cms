// src/components/Button.tsx
import React from "react";
import styled from "styled-components";

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

const ButtonContainer = styled.button<ButtonProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
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

const Button: React.FC<ButtonProps> = ({ onClick, children, icon }) => {
  return (
    <ButtonContainer onClick={onClick}>
      {icon && icon}
      {children}
    </ButtonContainer>
  );
};

export default Button;
