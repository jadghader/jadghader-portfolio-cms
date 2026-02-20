import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useReducedMotion } from '../hooks/useReducedMotion';

const CursorLayer = styled.div`
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
`;

const CursorRing = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 34px;
  height: 34px;
  border-radius: 999px;
  border: 1.5px solid ${({ theme }) =>
    theme.isDark ? 'rgba(129, 140, 248, 0.8)' : 'rgba(99, 102, 241, 0.75)'};
  background: ${({ theme }) =>
    theme.isDark ? 'rgba(129, 140, 248, 0.08)' : 'rgba(99, 102, 241, 0.06)'};
  box-shadow: ${({ theme }) =>
    theme.isDark
      ? '0 0 24px rgba(129, 140, 248, 0.35)'
      : '0 0 24px rgba(99, 102, 241, 0.25)'};
  transform: translate3d(-9999px, -9999px, 0);
  opacity: 0;
  transition:
    opacity 160ms ease,
    width 160ms ease,
    height 160ms ease,
    border-color 160ms ease,
    background 160ms ease;
  will-change: transform, opacity, width, height;
`;

const CursorDot = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: ${({ theme }) => (theme.isDark ? '#a5b4fc' : '#6366f1')};
  box-shadow: ${({ theme }) =>
    theme.isDark
      ? '0 0 16px rgba(129, 140, 248, 0.65)'
      : '0 0 16px rgba(99, 102, 241, 0.5)'};
  transform: translate3d(-9999px, -9999px, 0);
  opacity: 0;
  transition: opacity 120ms ease, width 120ms ease, height 120ms ease;
  will-change: transform, opacity, width, height;
`;

const isInteractiveTarget = (target: EventTarget | null) => {
  if (!(target instanceof Element)) return false;
  return Boolean(
    target.closest(
      'a, button, [role="button"], [data-cursor="interactive"], input, textarea, select, label, summary'
    )
  );
};

export function CustomCursor() {
  const prefersReducedMotion = useReducedMotion();
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    document.body.classList.add('custom-cursor-enabled');

    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ring = { x: pointer.x, y: pointer.y };
    let visible = false;
    let hoveringInteractive = false;
    let pressed = false;
    let rafId = 0;

    const setVisibility = (nextVisible: boolean) => {
      if (!ringRef.current || !dotRef.current) return;
      visible = nextVisible;
      const opacity = visible ? '1' : '0';
      ringRef.current.style.opacity = opacity;
      dotRef.current.style.opacity = opacity;
    };

    const updateShape = () => {
      if (!ringRef.current || !dotRef.current) return;

      if (hoveringInteractive) {
        ringRef.current.style.width = pressed ? '28px' : '52px';
        ringRef.current.style.height = pressed ? '28px' : '52px';
        dotRef.current.style.width = pressed ? '7px' : '6px';
        dotRef.current.style.height = pressed ? '7px' : '6px';
      } else {
        ringRef.current.style.width = pressed ? '30px' : '34px';
        ringRef.current.style.height = pressed ? '30px' : '34px';
        dotRef.current.style.width = pressed ? '6px' : '8px';
        dotRef.current.style.height = pressed ? '6px' : '8px';
      }
    };

    const animate = () => {
      if (!ringRef.current || !dotRef.current) return;

      ring.x += (pointer.x - ring.x) * 0.2;
      ring.y += (pointer.y - ring.y) * 0.2;

      const ringOffset = ringRef.current.offsetWidth / 2;
      const dotOffset = dotRef.current.offsetWidth / 2;

      ringRef.current.style.transform = `translate3d(${ring.x - ringOffset}px, ${ring.y - ringOffset}px, 0)`;
      dotRef.current.style.transform = `translate3d(${pointer.x - dotOffset}px, ${pointer.y - dotOffset}px, 0)`;

      rafId = window.requestAnimationFrame(animate);
    };

    const onPointerMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      if (!visible) setVisibility(true);
    };

    const onMouseOver = (e: MouseEvent) => {
      const nextInteractive = isInteractiveTarget(e.target);
      if (nextInteractive !== hoveringInteractive) {
        hoveringInteractive = nextInteractive;
        updateShape();
      }
    };

    const onMouseDown = () => {
      pressed = true;
      updateShape();
    };

    const onMouseUp = () => {
      pressed = false;
      updateShape();
    };

    const onMouseLeaveViewport = () => setVisibility(false);
    const onMouseEnterViewport = () => setVisibility(true);

    updateShape();
    rafId = window.requestAnimationFrame(animate);

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('mouseover', onMouseOver, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.documentElement.addEventListener('mouseleave', onMouseLeaveViewport);
    document.documentElement.addEventListener('mouseenter', onMouseEnterViewport);

    return () => {
      window.cancelAnimationFrame(rafId);
      document.body.classList.remove('custom-cursor-enabled');
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('mouseover', onMouseOver);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.documentElement.removeEventListener('mouseleave', onMouseLeaveViewport);
      document.documentElement.removeEventListener('mouseenter', onMouseEnterViewport);
    };
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) return null;

  return (
    <CursorLayer aria-hidden="true">
      <CursorRing ref={ringRef} />
      <CursorDot ref={dotRef} />
    </CursorLayer>
  );
}
