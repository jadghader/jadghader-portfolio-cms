import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  // Redirect to home automatically after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/"); // Redirects to home
    }, 2000); // Adjust the delay (in milliseconds) as needed

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Container>
      <Content>
        <ErrorCode>404</ErrorCode>
        <Message>
          Oops! The page you're looking for doesn't exist. You will be
          redirected to the homepage.
        </Message>
      </Content>
    </Container>
  );
};

export default NotFoundPage;

// Styled Components
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: ${({ theme }) =>
    theme.background}; /* Dynamically changes with the theme */
  color: ${({ theme }) => theme.text}; /* Dynamically changes with the theme */
  text-align: center;
`;

const Content = styled.div`
  padding: 2rem;
  background: ${({ theme }) =>
    theme.cardBackground}; /* Use card background based on the theme */
  border-radius: 8px;
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.1);
`;

const ErrorCode = styled.h1`
  font-size: 8rem;
  font-weight: 700;
  margin: 0;
  color: ${({ theme }) =>
    theme.accent}; /* Dynamically changes with the theme */
`;

const Message = styled.p`
  font-size: 1.25rem;
  margin: 1rem 0;
  color: ${({ theme }) => theme.text}; /* Dynamically changes with the theme */
`;
