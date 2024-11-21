// src/styles/GlobalStyles.ts
import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Montserrat', sans-serif;

  }
  html, body {
    overflow-x: hidden; /* Prevent horizontal scroll */
    width: 100%; /* Ensure the body takes up full width */
  }

  body {
    font-size: 16px;
    background-color: ${(props) => props.theme.background};
    color: ${(props) => props.theme.text};
    transition: background-color 0.3s, color 0.3s;
  }

  h1 {
    font-size: 2.5rem;
  }

  p {
    font-size: 1rem;
  }

  @media (max-width: 768px) {
    body {
      font-size: 14px;
    }

    h1 {
      font-size: 2rem;
    }

    p {
      font-size: 0.9rem;
    }
  }

  @media (max-width: 480px) {
    body {
      font-size: 12px;
    }

    h1 {
      font-size: 1.75rem;
    }

    p {
      font-size: 0.85rem;
    }
  }
`;

export default GlobalStyles;
