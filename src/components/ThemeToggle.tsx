import styled, { keyframes } from 'styled-components';
import { motion } from 'motion/react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const swapIn = keyframes`
  from { transform: translateY(-16px) rotate(-30deg); opacity: 0; }
  to   { transform: translateY(0) rotate(0deg); opacity: 1; }
`;

const ToggleBtn = styled(motion.button)`
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: 1.5px solid ${({ theme }) => theme.borderCard};
  background: ${({ theme }) => theme.backgroundIconPill};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
  transition: border-color 0.2s ease, background 0.2s ease;
  color: ${({ theme }) => theme.isDark ? theme.primary : theme.foregroundMuted};

  &:hover {
    border-color: ${({ theme }) => theme.primary};
  }

  svg {
    animation: ${swapIn} 0.22s ease both;
  }
`;

export function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <ToggleBtn
      onClick={toggleTheme}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      aria-label="Toggle theme"
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </ToggleBtn>
  );
}
