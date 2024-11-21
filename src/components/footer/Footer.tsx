import React from "react";
import styled from "styled-components";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <FooterContainer>
      <FooterContent>
        <Copyright>
          &copy; {currentYear} <span>Jad Ghader</span>. All rights reserved.
        </Copyright>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;

// Styled Components

const FooterContainer = styled.footer`
  background-color: ${({ theme }) => theme.footerBackground};
  color: ${({ theme }) => theme.text};
  padding: 20px 0;
  text-align: center;
  font-size: 0.9rem;
  position: relative;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  padding: 0 20px;
`;

const Copyright = styled.p`
  margin: 0;
  font-size: 1rem;
  color: ${({ theme }) => theme.text};

  span {
    font-weight: bold;
  }
`;
