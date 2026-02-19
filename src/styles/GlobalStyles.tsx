import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background-color: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.foreground};
    line-height: 1.6;
    transition: background-color 0.3s ease, color 0.3s ease;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'Plus Jakarta Sans', sans-serif;
    line-height: 1.2;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  button {
    font-family: 'Inter', sans-serif;
    cursor: pointer;
  }

  input, textarea {
    font-family: 'Inter', sans-serif;
  }

  img {
    max-width: 100%;
    display: block;
  }

  ::selection {
    background: rgba(99, 102, 241, 0.25);
    color: ${({ theme }) => theme.foreground};
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 6px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.background};
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) =>
      theme.isDark ? 'rgba(129,140,248,0.3)' : 'rgba(99,102,241,0.3)'};
    border-radius: 3px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) =>
      theme.isDark ? 'rgba(129,140,248,0.5)' : 'rgba(99,102,241,0.5)'};
  }
`;
