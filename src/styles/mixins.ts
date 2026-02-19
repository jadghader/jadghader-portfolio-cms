import { css, keyframes } from 'styled-components';

// ─── Keyframes ────────────────────────────────────────────────────────────────

export const floatAnim = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33%       { transform: translateY(-15px) rotate(1deg); }
  66%       { transform: translateY(-8px) rotate(-1deg); }
`;

export const pulseGlowAnim = keyframes`
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50%       { opacity: 0.7; transform: scale(1.05); }
`;

export const spinAnim = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;

export const slideInRight = keyframes`
  from { transform: translateX(60px); opacity: 0; }
  to   { transform: translateX(0);    opacity: 1; }
`;

export const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

// ─── Mixins ──────────────────────────────────────────────────────────────────

/** Gradient text — indigo → violet */
export const gradientTextMixin = css`
  background: ${({ theme }) => theme.gradientText};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

/** Primary gradient background */
export const gradientBgMixin = css`
  background: ${({ theme }) => theme.gradientPrimary};
`;

/** Glass-morphism card surface */
export const glassMixin = css`
  background: ${({ theme }) => theme.backgroundGlass};
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid ${({ theme }) => theme.borderGlass};
`;

/** Indigo glow box-shadow */
export const glowMixin = css`
  box-shadow: ${({ theme }) => theme.shadowGlow};
`;

/** Dot-grid background */
export const dotGridMixin = css`
  background-image: radial-gradient(
    circle,
    ${({ theme }) => theme.dotColor} 1px,
    transparent 1px
  );
  background-size: 32px 32px;
`;

/** Section label badge */
export const badgeMixin = css`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 16px;
  border-radius: 999px;
  background: ${({ theme }) =>
    theme.isDark ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.07)'};
  border: 1px solid ${({ theme }) =>
    theme.isDark ? 'rgba(129,140,248,0.2)' : 'rgba(99,102,241,0.2)'};
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.foregroundBadge};
  font-family: 'Plus Jakarta Sans', sans-serif;
  letter-spacing: 0.01em;
`;

/** Section heading — gradient last word */
export const sectionTitleMixin = css`
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-weight: 800;
  color: ${({ theme }) => theme.foreground};
  line-height: 1.15;
`;

/** Thin gradient horizontal rule */
export const gradientDividerMixin = css`
  height: 1px;
  background: ${({ theme }) => theme.gradientDivider};
  border: none;
`;

/** Primary CTA button */
export const primaryButtonMixin = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 32px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-weight: 700;
  font-size: 0.9375rem;
  color: #ffffff;
  background: ${({ theme }) => theme.gradientPrimary};
  box-shadow: ${({ theme }) => theme.shadowPrimary};
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.9;
    box-shadow: ${({ theme }) => theme.shadowPrimaryHover};
    transform: translateY(-2px);
  }

  &:active {
    transform: scale(0.97);
  }
`;

/** Ghost / outline button */
export const ghostButtonMixin = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 32px;
  border-radius: 12px;
  cursor: pointer;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-weight: 700;
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.foreground};
  background: ${({ theme }) =>
    theme.isDark ? 'rgba(15,23,42,0.5)' : '#ffffff'};
  border: 1.5px solid ${({ theme }) => theme.borderCard};
  backdrop-filter: blur(8px);
  transition: all 0.3s ease;

  &:hover {
    border-color: ${({ theme }) => theme.primary};
    color: ${({ theme }) => theme.primary};
    transform: translateY(-2px);
  }

  &:active {
    transform: scale(0.97);
  }
`;

/** Floating section top/bottom gradient lines */
export const sectionDividerTop = css`
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: ${({ theme }) => theme.gradientDivider};
  }
`;

export const sectionDividerBottom = css`
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: ${({ theme }) => theme.gradientDividerFaint};
  }
`;
