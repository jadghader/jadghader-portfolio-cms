import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { ThemeProvider as SCThemeProvider } from 'styled-components';
import { lightTheme, darkTheme } from '../styles/theme';
import { GlobalStyles } from '../styles/GlobalStyles';

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  toggleTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

/**
 * Detects the user's theme preference from:
 * 1. localStorage (if previously set)
 * 2. system preference (prefers-color-scheme)
 *
 * Safe to call in non-browser environments.
 */
function detectThemePreference(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    const saved = window.localStorage.getItem('sc-theme');
    if (saved) {
      return saved === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  } catch {
    return false;
  }
}

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState<boolean>(() => detectThemePreference());

  useEffect(() => {
    // Listen for system theme preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      // Only update if no user preference is saved
      if (!localStorage.getItem('sc-theme')) {
        setIsDark(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      localStorage.setItem('sc-theme', next ? 'dark' : 'light');
      return next;
    });
  };

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <SCThemeProvider theme={theme}>
        <GlobalStyles />
        {children}
      </SCThemeProvider>
    </ThemeContext.Provider>
  );
}
