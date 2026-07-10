import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, useReducedMotion } from 'framer-motion';
import { FaArrowLeft } from 'react-icons/fa';

// Full-screen overlay "page" used by the hash routes (#/now, #/uses, …).
// Rendered above the main sections so the single-page layout underneath keeps
// its scroll position; Esc or the back button returns to it.

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  z-index: 1200;
  background: var(--bg-primary, #fff);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
`;

const Inner = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: clamp(1.5rem, 4vw, 3rem) clamp(1rem, 5vw, 2rem) clamp(3rem, 6vw, 5rem);
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: clamp(2rem, 4vw, 3rem);
`;

const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--bg-card, transparent);
  border: 2px solid var(--border-card, #e0e0e0);
  border-radius: var(--radius-pill, 999px);
  box-shadow: var(--shadow-hard-sm, 3px 3px 0 #111);
  padding: 0.6rem 1rem;
  font-family: inherit;
  font-size: 0.8125rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-primary, #000);
  cursor: pointer;
  min-height: 44px;
  transition: background 0.2s, color 0.2s;

  &:hover,
  &:focus-visible {
    background: var(--text-primary, #000);
    color: var(--accent-inverse, #fff);
  }
`;

const EscHint = styled.span`
  margin-left: auto;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-muted, #999);

  @media (max-width: 768px) {
    display: none;
  }
`;

const Title = styled.h1`
  font-size: clamp(1.75rem, 6vw, 2.5rem);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--text-primary, #000);
  margin-bottom: 0.75rem;
  position: relative;
  padding-bottom: 1rem;

  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: clamp(60px, 10vw, 100px);
    height: 3px;
    background: var(--text-primary, #000);
  }
`;

const Subtitle = styled.p`
  font-size: clamp(0.875rem, 2vw, 1rem);
  line-height: 1.7;
  color: var(--text-secondary, #666);
  margin-bottom: clamp(2rem, 4vw, 3rem);
  max-width: 640px;
`;

const PageShell = ({ title, subtitle, onClose, children }) => {
  const reducedMotion = useReducedMotion();
  const containerRef = useRef(null);

  // Lock the body scroll while the page overlay is open, and move focus into
  // the page so keyboard/screen-reader users land on the content.
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    containerRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <Overlay
      ref={containerRef}
      tabIndex={-1}
      role="region"
      aria-label={title}
      initial={reducedMotion ? false : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      <Inner>
        <TopBar>
          <BackButton onClick={onClose}>
            <FaArrowLeft aria-hidden="true" />
            Back to site
          </BackButton>
          <EscHint>Esc to close</EscHint>
        </TopBar>
        <Title>{title}</Title>
        {subtitle && <Subtitle>{subtitle}</Subtitle>}
        {children}
      </Inner>
    </Overlay>
  );
};

export default PageShell;
