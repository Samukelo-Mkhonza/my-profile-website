import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, useScroll, useTransform, useReducedMotion, animate } from 'framer-motion';
import emailjs from '@emailjs/browser';
import {
  FaArrowDown,
  FaEnvelope,
  FaCode,
  FaCloud,
  FaRocket,
  FaMapMarkerAlt,
  FaPaperPlane,
  FaEye,
  FaPhone,
  FaLinkedin,
  FaCertificate,
  FaGraduationCap,
  FaBriefcase,
  FaCheckCircle,
  FaExclamationCircle,
  FaServer,
  FaCoins
} from 'react-icons/fa';
import Modal, { ModalHeader, ModalTitle } from './ui/Modal';

// Floating animation for background elements
const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
`;

// Cursor blink animation
const blink = keyframes`
  0%, 100% { opacity: 1; }
  50%      { opacity: 0; }
`;

// Background gradient animation
const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Availability pill dot pulse
const pulse = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.75); }
`;

// Styled cursor element
const Cursor = styled.span`
  display: inline-block;
  margin-left: 2px;
  width: 1ch;
  background-color: currentColor;
  animation: ${blink} 1s step-start infinite;
  @media (prefers-reduced-motion: reduce) { animation: none; }
`;

// TypingText component with enhanced functionality
const TypingText = ({ texts, speed = 50, pause = 2000 }) => {
  const [displayed, setDisplayed] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  // Users who prefer reduced motion get the first role as static text
  // instead of the endless type/delete cycle.
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const currentText = texts[currentIndex];

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayed.length < currentText.length) {
          setDisplayed(currentText.slice(0, displayed.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), pause);
        }
      } else {
        if (displayed.length > 0) {
          setDisplayed(displayed.slice(0, -1));
        } else {
          setIsDeleting(false);
          setCurrentIndex((prev) => (prev + 1) % texts.length);
        }
      }
    }, isDeleting ? speed / 2 : speed);

    return () => clearTimeout(timeout);
  }, [displayed, currentIndex, isDeleting, texts, speed, pause, reducedMotion]);

  if (reducedMotion) {
    return <span>{texts[0]}</span>;
  }

  return (
    <span>
      {displayed}
      <Cursor />
    </span>
  );
};

// Counts a stat up from 0 once its card has animated in; reduced-motion
// users see the final value immediately.
const CountUp = ({ value, suffix = '', decimals = 0, delay = 0, duration = 1 }) => {
  const reducedMotion = useReducedMotion();
  const [display, setDisplay] = useState(reducedMotion ? value : 0);

  useEffect(() => {
    if (reducedMotion) {
      setDisplay(value);
      return undefined;
    }
    const controls = animate(0, value, {
      delay,
      duration,
      ease: 'easeOut',
      onUpdate: (latest) => setDisplay(latest)
    });
    return () => controls.stop();
  }, [value, delay, duration, reducedMotion]);

  return <>{display.toFixed(decimals)}{suffix}</>;
};

const Section = styled.section`
  min-height: 100vh;
  min-height: 100dvh; /* Dynamic viewport height for mobile */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(1.5rem, 5vw, 4rem) clamp(1rem, 3vw, 2rem);
  /* Keep content clear of the fixed navbar */
  padding-top: clamp(6.5rem, 12vh, 8rem);
  /* Translucent so the fixed page-wide 3D scene shows through */
  background: linear-gradient(-45deg, var(--bg-primary-glass, rgba(255, 255, 255, 0.86)), var(--bg-secondary-glass, rgba(247, 247, 247, 0.86)), var(--bg-primary-glass, rgba(255, 255, 255, 0.86)), var(--bg-secondary-glass, rgba(247, 247, 247, 0.86)));
  background-size: 400% 400%;
  animation: ${gradientShift} 15s ease infinite;
  position: relative;
  overflow: hidden;
  @media (prefers-reduced-motion: reduce) { animation: none; }

  /* Small mobile devices: tighter vertical rhythm so name, role and the
     primary CTA share the first screen */
  @media (max-width: 480px) {
    padding-top: clamp(5rem, 16vw, 6rem);
    padding-bottom: clamp(2.5rem, 8vw, 4rem);
  }

  /* Tablets and small laptops */
  @media (min-width: 481px) and (max-width: 1024px) {
    padding: clamp(3rem, 8vw, 6rem) clamp(1.5rem, 4vw, 3rem);
    padding-top: clamp(6.5rem, 12vh, 8rem);
  }

  /* Landscape mobile */
  @media (max-height: 600px) and (orientation: landscape) {
    min-height: auto;
    padding: 5.5rem 2rem 3rem;
  }

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 80%, rgba(0, 0, 0, 0.02) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(0, 0, 0, 0.02) 0%, transparent 50%);
    pointer-events: none;
  }
`;

const BackgroundElements = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  pointer-events: none;

  /* Hide on very small screens to improve performance */
  @media (max-width: 360px) {
    display: none;
  }
`;

const FloatingIcon = styled(motion.div)`
  position: absolute;
  color: rgba(0, 0, 0, 0.05);
  font-size: ${props => props.size || '2rem'};
  animation: ${float} ${props => props.duration || '6s'} ease-in-out infinite;
  animation-delay: ${props => props.delay || '0s'};
  @media (prefers-reduced-motion: reduce) { animation: none; }

  /* Reduce size on mobile */
  @media (max-width: 768px) {
    font-size: calc(${props => props.size || '2rem'} * 0.7);
  }
`;

const Container = styled(motion.div)`
  max-width: 1200px;
  width: 100%;
  display: grid;
  /* Asymmetric: the headline column leads, the stats column supports */
  grid-template-columns: 1.15fr 0.85fr;
  gap: clamp(1.5rem, 4vw, 4rem);
  align-items: center;
  z-index: 1;

  /* Tablets */
  @media (max-width: 1024px) {
    gap: clamp(1.5rem, 3vw, 3rem);
  }

  /* Mobile */
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    text-align: center;
    gap: clamp(1.25rem, 3.5vw, 2rem);
  }

  /* Landscape mobile */
  @media (max-height: 600px) and (orientation: landscape) {
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }
`;

const MainContent = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: clamp(0.75rem, 2vw, 1.5rem);

  @media (max-width: 768px) {
    order: 1;
    align-items: center;
  }

  /* Very small screens */
  @media (max-width: 360px) {
    gap: 0.75rem;
  }
`;

const Greeting = styled(motion.div)`
  font-size: clamp(0.875rem, 2vw, 1.125rem);
  color: var(--text-secondary, #666);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;

  @media (max-width: 768px) {
    justify-content: center;
  }

  @media (max-width: 360px) {
    font-size: 0.75rem;
    letter-spacing: 0.05em;
  }
`;

/* Status pill above the headline: the "hire me" signal, first thing read */
const AvailabilityPill = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  align-self: flex-start;
  padding: 0.375rem 0.875rem;
  background: var(--bg-card, #fffcf5);
  border: 2px solid var(--border-card, #111);
  border-radius: var(--radius-pill, 999px);
  box-shadow: var(--shadow-hard-sm, 3px 3px 0 #111);
  font-size: clamp(0.625rem, 1.5vw, 0.75rem);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-primary, #000);

  @media (max-width: 768px) {
    align-self: center;
  }
`;

const PulseDot = styled.span`
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: var(--green, #43a047);
  flex-shrink: 0;
  animation: ${pulse} 2s ease-in-out infinite;
  @media (prefers-reduced-motion: reduce) { animation: none; }
`;

const Title = styled(motion.h1)`
  font-size: clamp(1.75rem, 6vw, 4.5rem);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  line-height: 1.1;
  color: var(--text-primary, #000);
  margin: 0;

  /* Tablets */
  @media (min-width: 769px) and (max-width: 1024px) {
    font-size: clamp(2.5rem, 5vw, 3.5rem);
  }

  /* Small mobile */
  @media (max-width: 480px) {
    font-size: clamp(1.5rem, 7vw, 2.5rem);
    letter-spacing: 0.02em;
  }

  /* Very small screens */
  @media (max-width: 360px) {
    font-size: 1.375rem;
    letter-spacing: 0.01em;
  }

  /* Landscape mobile */
  @media (max-height: 600px) and (orientation: landscape) {
    font-size: clamp(1.5rem, 4vw, 2.5rem);
  }
`;

/* Marker-highlight block on the surname: the poster focal point.
   Fixed ink text — 5.5:1 on the orange in both themes. */
const TitleHighlight = styled.span`
  display: inline-block;
  background: var(--accent-orange, #ee5a24);
  color: #111111;
  padding: 0 0.15em;
  margin-top: 0.08em;
  transform: rotate(-1.5deg);
  box-shadow: var(--shadow-hard-sm, 3px 3px 0 #111);
`;

/* Terminal-style chip framing the typing text so it reads as a deliberate
   element; role is now subordinate to the name, not competing with it */
const DynamicRole = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  align-self: flex-start;
  min-width: min(26ch, 100%);
  min-height: 2.75rem;
  padding: 0.5rem 1rem;
  margin: clamp(0.25rem, 1.5vw, 0.75rem) 0;
  background: var(--bg-card, #fffcf5);
  border: 2px solid var(--border-card, #111);
  border-radius: var(--radius-sm, 10px);
  box-shadow: var(--shadow-hard-sm, 3px 3px 0 #111);
  font-size: clamp(0.875rem, 2vw, 1.25rem);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-primary, #333);
  text-align: left;

  @media (max-width: 768px) {
    align-self: center;
  }

  @media (max-width: 480px) {
    font-size: 0.875rem;
    letter-spacing: 0.05em;
    min-height: 2.5rem;
    padding: 0.375rem 0.875rem;
  }
`;

const RolePrompt = styled.span`
  color: var(--accent-orange, #ee5a24);
  font-weight: 800;
  flex-shrink: 0;
`;

const Description = styled(motion.p)`
  font-size: clamp(0.875rem, 2vw, 1.125rem);
  line-height: 1.6;
  color: var(--text-secondary, #555);
  margin: clamp(0.5rem, 1.5vw, 1rem) 0;
  max-width: 500px;

  @media (max-width: 768px) {
    margin: 0.5rem auto;
    max-width: 90%;
  }

  @media (max-width: 360px) {
    font-size: 0.8125rem;
    line-height: 1.5;
  }
`;

const ButtonGroup = styled(motion.div)`
  display: flex;
  gap: clamp(0.75rem, 2vw, 1rem);
  margin-top: clamp(1rem, 2.5vw, 2rem);
  flex-wrap: wrap;
  justify-content: flex-start;

  @media (max-width: 768px) {
    justify-content: center;
  }

  /* Phones: keep both CTAs on one row (flex-wrap stacks them again on very
     narrow screens) so the fold stays short */
  @media (max-width: 480px) {
    width: 100%;
    max-width: 400px;
    gap: 0.625rem;
  }

  /* Landscape mobile */
  @media (max-height: 600px) and (orientation: landscape) {
    margin-top: 1rem;
  }
`;

const Button = styled(motion.a)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: clamp(0.625rem, 1.5vw, 1rem) clamp(1.25rem, 2.5vw, 2rem);
  border-radius: var(--radius-pill, 999px);
  font-size: clamp(0.8125rem, 1.5vw, 1rem);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  min-width: min(200px, 100%);
  white-space: nowrap;
  
  /* Touch-friendly size for mobile */
  @media (max-width: 768px) {
    min-height: 44px;
    touch-action: manipulation;
  }

  @media (max-width: 480px) {
    flex: 1 1 auto;
    min-width: 0;
    min-height: 48px;
    padding: 0.875rem 1rem;
  }

  @media (max-width: 360px) {
    font-size: 0.75rem;
    letter-spacing: 0.05em;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
  }

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 0%;
    height: 100%;
    transition: all 0.3s ease;
    z-index: 0;
  }

  span {
    position: relative;
    z-index: 1;
  }

  svg {
    position: relative;
    z-index: 1;
    transition: transform 0.3s ease;
    flex-shrink: 0;
  }

  @media (hover: hover) {
    &:hover svg {
      transform: translateX(4px);
    }
  }

  /* Touch feedback for mobile */
  &:active {
    transform: scale(0.98);
  }
`;

const PrimaryButton = styled(Button)`
  background: var(--accent, #000);
  color: var(--accent-inverse, #fff);
  border: 2px solid var(--border-card, #000);
  box-shadow: var(--shadow-hard-sm, 3px 3px 0 #111);

  &:before {
    background: var(--accent-inverse, #fff);
  }

  @media (hover: hover) {
    &:hover {
      color: var(--accent, #000);
      transform: translateY(-2px);
      box-shadow: var(--shadow-hard, 4px 4px 0 #111);

      &:before {
        width: 100%;
      }
    }
  }
`;

const SecondaryButton = styled(Button)`
  background: var(--bg-card, transparent);
  color: var(--text-primary, #000);
  border: 2px solid var(--border-card, #000);
  box-shadow: var(--shadow-hard-sm, 3px 3px 0 #111);

  &:before {
    background: var(--accent, #000);
  }

  @media (hover: hover) {
    &:hover {
      color: var(--accent-inverse, #fff);
      transform: translateY(-2px);
      box-shadow: var(--shadow-hard, 4px 4px 0 #111);

      &:before {
        width: 100%;
      }
    }
  }
`;

/* Bare column — the old glass wrapper card made a box-in-box-in-box stack
   that competed with the headline; the tiles now stand on their own */
const StatsSection = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: clamp(1rem, 2vw, 1.25rem);

  @media (max-width: 768px) {
    order: 2;
    width: 100%;
    max-width: 480px;
    margin: 0 auto;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: clamp(0.875rem, 2vw, 1.25rem);

  /* Phones: keep the 2x2 grid but tighten it so all four stats share a
     single glance instead of stacking into a tall column */
  @media (max-width: 640px) {
    gap: 0.625rem;
  }
`;

const StatCard = styled(motion.div)`
  text-align: center;
  padding: clamp(0.875rem, 2vw, 1.25rem) clamp(0.75rem, 1.5vw, 1rem);
  background: var(--bg-card, #fffcf5);
  border-radius: var(--radius-sm, 10px);
  border: 2px solid var(--border-card, #111);
  box-shadow: var(--shadow-hard, 4px 4px 0 #111);
  transition: all 0.3s ease;

  /* Anchor tile: fixed ink text on the orange (5.5:1 in both themes) */
  ${props => props.$accent && `
    background: var(--accent-orange, #ee5a24);
    --stat-number-color: #111111;
    --stat-label-color: rgba(17, 17, 17, 0.85);
    --stat-icon-bg: #111111;
    --stat-icon-color: #fffcf5;
  `}

  @media (hover: hover) {
    &:hover {
      box-shadow: var(--shadow-hard-lg, 6px 6px 0 #111);
    }
  }

  @media (max-width: 640px) {
    padding: 0.75rem 0.5rem;
  }
`;

const StatIcon = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  color: var(--stat-icon-color, var(--on-orange, #fff));
  background: var(--stat-icon-bg, var(--accent-orange, #ee5a24));
  border: 2px solid var(--border-card, #111);
  border-radius: var(--radius-sm, 10px);
  box-shadow: 2px 2px 0 var(--shadow-color, #111);

  @media (max-width: 640px) {
    width: 1.75rem;
    height: 1.75rem;
    margin-bottom: 0.375rem;
    font-size: 0.8125rem;
  }
`;

const StatNumber = styled.div`
  font-size: clamp(1.375rem, 3vw, 2.125rem);
  font-weight: 800;
  line-height: 1.1;
  color: var(--stat-number-color, var(--text-primary, #000));
  margin-bottom: 0.25rem;
  font-variant-numeric: tabular-nums; /* keeps width steady while counting up */

  @media (max-width: 640px) {
    font-size: 1.375rem;
  }

  @media (max-width: 360px) {
    font-size: 1.125rem;
  }
`;

const StatLabel = styled.div`
  font-size: clamp(0.625rem, 1.5vw, 0.8125rem);
  color: var(--stat-label-color, var(--text-secondary, #666));
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 700;

  @media (max-width: 360px) {
    font-size: 0.625rem;
    letter-spacing: 0.05em;
  }
`;

const QuickInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: clamp(0.5rem, 1.5vw, 0.75rem);

  @media (max-width: 768px) {
    justify-content: center;
  }

  @media (max-width: 360px) {
    gap: 0.375rem;
  }
`;

/* Sticker-style chips at every width (was mobile-only) */
const InfoItem = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: clamp(0.6875rem, 1.5vw, 0.8125rem);
  font-weight: 700;
  color: var(--text-primary, #000);
  background: var(--tag-bg, #f2e9d8);
  border: 2px solid var(--border-card, #111);
  border-radius: var(--radius-pill, 999px);
  padding: 0.375rem 0.875rem;
  box-shadow: 2px 2px 0 var(--shadow-color, #111);

  @media (max-width: 360px) {
    font-size: 0.625rem;
    padding: 0.25rem 0.625rem;
  }
`;

const InfoIcon = styled.div`
  display: flex;
  justify-content: center;
  flex-shrink: 0;
  font-size: 0.8125rem;
  color: var(--accent-orange, #ee5a24);
`;

const ScrollIndicator = styled(motion.div)`
  position: absolute;
  bottom: clamp(1rem, 3vw, 2rem);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary, #666);
  cursor: pointer;

  /* Hide on very short screens */
  @media (max-height: 600px) {
    display: none;
  }

  @media (max-width: 360px) {
    bottom: 0.75rem;
  }
`;

const ScrollText = styled.span`
  font-size: clamp(0.625rem, 1.5vw, 0.75rem);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 500;
`;

// Modal content (frame and behaviour come from the shared Modal component)
const ModalSubtitle = styled.p`
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.6;
  font-size: clamp(0.875rem, 2vw, 1rem);

  @media (max-width: 360px) {
    font-size: 0.8125rem;
    line-height: 1.5;
  }
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: clamp(1rem, 2.5vw, 1.5rem);

  @media (max-width: 360px) {
    gap: 0.875rem;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 600;
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: clamp(0.75rem, 1.5vw, 0.875rem);

  @media (max-width: 360px) {
    font-size: 0.75rem;
  }
`;

const Input = styled.input`
  padding: clamp(0.75rem, 2vw, 1rem);
  border: 2px solid var(--border-card);
  border-radius: var(--radius-sm, 10px);
  font-size: clamp(0.875rem, 2vw, 1rem);
  transition: all 0.3s ease;
  background: var(--bg-secondary);
  color: var(--text-primary);

  &:focus {
    outline: none;
    border-color: var(--accent);
    box-shadow: 0 0 0 3px var(--border-color);
  }

  &::placeholder {
    color: var(--text-muted);
  }

  @media (max-width: 360px) {
    padding: 0.625rem;
    font-size: 0.875rem;
    border-radius: 6px;
  }
`;

const TextArea = styled.textarea`
  padding: clamp(0.75rem, 2vw, 1rem);
  border: 2px solid var(--border-card);
  border-radius: var(--radius-sm, 10px);
  font-size: clamp(0.875rem, 2vw, 1rem);
  min-height: clamp(100px, 20vw, 120px);
  resize: vertical;
  font-family: inherit;
  transition: all 0.3s ease;
  background: var(--bg-secondary);
  color: var(--text-primary);

  &:focus {
    outline: none;
    border-color: var(--accent);
    box-shadow: 0 0 0 3px var(--border-color);
  }

  &::placeholder {
    color: var(--text-muted);
  }

  @media (max-width: 360px) {
    padding: 0.625rem;
    font-size: 0.875rem;
    min-height: 80px;
    border-radius: 6px;
  }
`;

const SubmitButton = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: clamp(0.875rem, 2vw, 1rem) clamp(1.5rem, 3vw, 2rem);
  background: var(--accent);
  color: var(--accent-inverse);
  border: 2px solid var(--border-card, #111);
  border-radius: var(--radius-pill, 999px);
  font-size: clamp(0.875rem, 2vw, 1rem);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: clamp(0.5rem, 2vw, 1rem);
  min-height: 44px;
  box-shadow: var(--shadow-hard-sm, 3px 3px 0 #111);

  @media (hover: hover) {
    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: var(--shadow-hard, 4px 4px 0 #111);
    }
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  svg {
    transition: transform 0.3s ease;
    flex-shrink: 0;
  }

  @media (hover: hover) {
    &:hover:not(:disabled) svg {
      transform: translateX(4px);
    }
  }

  @media (max-width: 360px) {
    padding: 0.75rem 1.25rem;
    font-size: 0.75rem;
    gap: 0.5rem;
    letter-spacing: 0.05em;
  }
`;

// CV Modal Styles
const CVContent = styled.div`
  width: 100%;
`;

const CVSection = styled.div`
  margin-bottom: clamp(1.5rem, 3vw, 2rem);
  padding-bottom: clamp(1rem, 2vw, 1.5rem);
  border-bottom: 1px solid var(--border-card);

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }

  @media (max-width: 360px) {
    margin-bottom: 1.25rem;
    padding-bottom: 0.875rem;
  }
`;

const CVSectionTitle = styled.h3`
  font-size: clamp(1rem, 2.5vw, 1.25rem);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: clamp(0.75rem, 2vw, 1rem);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  svg {
    font-size: clamp(0.875rem, 2vw, 1rem);
    color: var(--text-secondary);
    flex-shrink: 0;
  }

  @media (max-width: 360px) {
    font-size: 0.9375rem;
    gap: 0.5rem;
    letter-spacing: 0.02em;
  }
`;

const CVText = styled.p`
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 0.75rem;
  font-size: clamp(0.875rem, 2vw, 1rem);

  @media (max-width: 360px) {
    font-size: 0.8125rem;
    line-height: 1.5;
  }
`;

const CVList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: clamp(0.5rem, 1.5vw, 0.75rem);

  @media (max-width: 360px) {
    gap: 0.375rem;
  }
`;

const CVListItem = styled.li`
  background: var(--tag-bg);
  padding: clamp(0.375rem, 1.5vw, 0.5rem) clamp(0.75rem, 2vw, 1rem);
  border: 2px solid var(--border-card, #111);
  border-radius: var(--radius-pill, 999px);
  font-size: clamp(0.75rem, 1.75vw, 0.875rem);
  font-weight: 600;
  color: var(--text-primary);
  transition: all 0.3s ease;

  @media (hover: hover) {
    &:hover {
      background: var(--accent);
      color: var(--accent-inverse);
    }
  }

  @media (max-width: 360px) {
    padding: 0.375rem 0.625rem;
    font-size: 0.75rem;
  }
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: clamp(0.375rem, 1vw, 0.5rem);
  margin-top: 0.5rem;
`;

const ContactItem = styled.a`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.3s ease;
  font-size: clamp(0.875rem, 2vw, 1rem);
  word-break: break-word;

  @media (hover: hover) {
    &:hover {
      color: var(--text-primary);
    }
  }

  svg {
    font-size: clamp(0.875rem, 2vw, 1rem);
    color: var(--text-primary);
    flex-shrink: 0;
  }

  @media (max-width: 360px) {
    font-size: 0.8125rem;
    gap: 0.5rem;
  }
`;

const WorkExperience = styled.div`
  margin-top: clamp(0.75rem, 2vw, 1rem);
`;

const JobTitle = styled.h4`
  font-size: clamp(1rem, 2.5vw, 1.125rem);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;

  @media (max-width: 360px) {
    font-size: 0.9375rem;
  }
`;

const Company = styled.p`
  color: var(--text-secondary);
  font-style: italic;
  margin-bottom: 0.5rem;
  font-size: clamp(0.875rem, 2vw, 1rem);

  @media (max-width: 360px) {
    font-size: 0.8125rem;
  }
`;

const Duration = styled.span`
  font-size: clamp(0.75rem, 1.75vw, 0.875rem);
  color: var(--text-muted);
`;

const roles = [
  "Software Developer",
  "Cloud Architect", 
  "Full Stack Engineer",
  "Problem Solver"
];

const StatusBanner = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  border-radius: var(--radius-sm, 10px);
  font-size: 0.9rem;
  font-weight: 600;
  background: var(--bg-card);
  color: ${p => p.$type === 'success' ? 'var(--green, #43a047)' : '#e05252'};
  border: 2px solid var(--border-card, #111);
  box-shadow: var(--shadow-hard-sm, 3px 3px 0 #111);
  svg { flex-shrink: 0; font-size: 1rem; }
`;

const ContactModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(null); // 'success' | 'error' | null

  useEffect(() => {
    const key = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;
    if (key) emailjs.init({ publicKey: key });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (status) setStatus(null);
  };

  const handleClose = useCallback(() => {
    setStatus(null);
    onClose();
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    const serviceId         = process.env.REACT_APP_EMAILJS_SERVICE_ID;
    const templateId        = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
    const autoReplyId       = process.env.REACT_APP_EMAILJS_AUTOREPLY_TEMPLATE_ID;
    const publicKey         = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      setStatus('error');
      setIsSubmitting(false);
      return;
    }

    const params = {
      from_name:  formData.name,
      from_email: formData.email,
      subject:    formData.subject,
      message:    formData.message,
      to_name:    'Samukelo',
    };

    try {
      // 1 — Notify Samukelo
      await emailjs.send(serviceId, templateId, params);

      // 2 — Auto-reply to the person who submitted
      if (autoReplyId) {
        await emailjs.send(serviceId, autoReplyId, params);
      }

      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch {
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      labelledBy="contact-modal-title"
    >
      <ModalHeader>
        <ModalTitle id="contact-modal-title">Get In Touch</ModalTitle>
      </ModalHeader>
      <ModalSubtitle>
        Have a project in mind or want to collaborate? I'd love to hear from you.
        Send me a message and let's create something amazing together!
      </ModalSubtitle>

      {status === 'success' && (
        <StatusBanner
          $type="success"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <FaCheckCircle />
          Message sent! I'll get back to you soon.
        </StatusBanner>
      )}

      {status === 'error' && (
        <StatusBanner
          $type="error"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <FaExclamationCircle />
          Something went wrong. Please try again or email me directly.
        </StatusBanner>
      )}

      <FormContainer onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="name">Your Name *</Label>
          <Input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="email">Email Address *</Label>
          <Input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your.email@example.com"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="subject">Subject *</Label>
          <Input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="What's this about?"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="message">Message *</Label>
          <TextArea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Tell me about your project, ideas, or just say hello..."
            required
          />
        </FormGroup>

        <SubmitButton
          type="submit"
          disabled={isSubmitting || status === 'success'}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          {isSubmitting ? 'Sending…' : status === 'success' ? 'Sent!' : 'Send Message'}
          <FaPaperPlane />
        </SubmitButton>
      </FormContainer>
    </Modal>
  );
};

const CVModal = ({ isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      labelledBy="cv-modal-title"
    >
      <ModalHeader>
        <ModalTitle id="cv-modal-title">Curriculum Vitae</ModalTitle>
      </ModalHeader>

      <CVContent>
        <CVSection>
          <CVSectionTitle>
            <FaPhone />
            Contact
          </CVSectionTitle>
          <ContactInfo>
            <ContactItem href="mailto:samukelo.mkhonza@outlook.com">
              <FaEnvelope />
              samukelo.mkhonza@outlook.com
            </ContactItem>
            <ContactItem href="https://www.linkedin.com/in/samukelo-mkhonza-a27340215/" target="_blank" rel="noopener noreferrer">
              <FaLinkedin />
              LinkedIn Profile
            </ContactItem>
          </ContactInfo>
        </CVSection>

        <CVSection>
          <CVSectionTitle>
            <FaGraduationCap />
            Education
          </CVSectionTitle>
          <JobTitle>National Diploma in ICT - Applications Development</JobTitle>
          <Company>Durban University of Technology • 2022</Company>
          <CVText style={{ marginTop: '0.5rem' }}>
            4-Year Extended Curriculum Programme focusing on software development, web technologies, and database management.
          </CVText>
        </CVSection>

        <CVSection>
          <CVSectionTitle>
            <FaBriefcase />
            Experience
          </CVSectionTitle>
          <WorkExperience>
            <JobTitle>Junior Cloud Technologist (Intern)</JobTitle>
            <Company>CloudZA • <Duration>Dec 2023 - Dec 2024</Duration></Company>
            <CVText>
              Assisted in implementing and maintaining cloud infrastructure, contributed to AWS architecture documentation, 
              and collaborated with senior technologists to optimize AWS solutions.
            </CVText>
          </WorkExperience>
        </CVSection>

        <CVSection>
          <CVSectionTitle>
            <FaCode />
            Technical Skills
          </CVSectionTitle>
          <CVList>
            <CVListItem>Java</CVListItem>
            <CVListItem>Python</CVListItem>
            <CVListItem>JavaScript</CVListItem>
            <CVListItem>React.js</CVListItem>
            <CVListItem>Node.js</CVListItem>
            <CVListItem>AWS Cloud</CVListItem>
            <CVListItem>SQL</CVListItem>
            <CVListItem>Git/GitHub</CVListItem>
          </CVList>
        </CVSection>

        <CVSection>
          <CVSectionTitle>
            <FaCertificate />
            Key Certifications
          </CVSectionTitle>
          <CVList>
            <CVListItem>AWS Cloud Practitioner</CVListItem>
            <CVListItem>AWS Solutions Architect</CVListItem>
            <CVListItem>Fortinet NSE 1-3</CVListItem>
            <CVListItem>Cisco Network Security</CVListItem>
            <CVListItem>Python Essentials</CVListItem>
          </CVList>
        </CVSection>
      </CVContent>
    </Modal>
  );
};

const Hero = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isCVModalOpen, setIsCVModalOpen] = useState(false);
  const sectionRef = useRef(null);
  const reducedMotion = useReducedMotion();

  // Parallax: background drifts down, content drifts up as you scroll away
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const yBg = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const yContent = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const fadeOut = useTransform(scrollYProgress, [0, 0.9], [1, 0.3]);

  const scrollToAbout = () => {
    const target = document.getElementById('about');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const viewCV = () => {
    setIsCVModalOpen(true);
  };

  const openContact = () => {
    setIsContactModalOpen(true);
  };

  const closeContact = () => {
    setIsContactModalOpen(false);
  };

  const closeCV = () => {
    setIsCVModalOpen(false);
  };

  return (
    <>
      <Section id="hero" ref={sectionRef}>
        <BackgroundElements style={{ y: yBg }}>
          <FloatingIcon size="3rem" duration="8s" delay="0s" style={{ top: '10%', left: '10%' }}>
            <FaCode />
          </FloatingIcon>
          <FloatingIcon size="2.5rem" duration="6s" delay="2s" style={{ top: '70%', right: '15%' }}>
            <FaCloud />
          </FloatingIcon>
          <FloatingIcon size="2rem" duration="7s" delay="4s" style={{ top: '30%', right: '25%' }}>
            <FaRocket />
          </FloatingIcon>
          <FloatingIcon size="2.5rem" duration="9s" delay="1s" style={{ bottom: '20%', left: '20%' }}>
            <FaCode />
          </FloatingIcon>
        </BackgroundElements>

        <Container style={{ y: yContent, opacity: fadeOut }}>
          <MainContent
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <AvailabilityPill
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <PulseDot />
              Available for Projects
            </AvailabilityPill>

            <Greeting
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span>Hello, I'm</span>
            </Greeting>

            <Title
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Samukelo
              <br />
              <TitleHighlight>Mkhonza</TitleHighlight>
            </Title>

            <DynamicRole
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <RolePrompt>&gt;_</RolePrompt>
              <TypingText texts={roles} speed={100} pause={2000} />
            </DynamicRole>

            <Description
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              Passionate about building scalable cloud-native applications and 
              creating exceptional digital experiences. Currently architecting 
              solutions at CloudZA, transforming ideas into reality.
            </Description>

            <ButtonGroup
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              <PrimaryButton
                onClick={openContact}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>Get In Touch</span>
                <FaEnvelope />
              </PrimaryButton>
              <SecondaryButton
                onClick={viewCV}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>View CV</span>
                <FaEye />
              </SecondaryButton>
            </ButtonGroup>
          </MainContent>

          <StatsSection
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <StatsGrid>
              <StatCard
                whileHover={{ y: -4 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.2 }}
              >
                <StatIcon><FaBriefcase /></StatIcon>
                <StatNumber><CountUp value={5} suffix="+" delay={1.2} /></StatNumber>
                <StatLabel>Years in Tech</StatLabel>
              </StatCard>
              <StatCard
                whileHover={{ y: -4 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.4 }}
              >
                <StatIcon><FaCode /></StatIcon>
                <StatNumber><CountUp value={12} delay={1.4} /></StatNumber>
                <StatLabel>Technologies</StatLabel>
              </StatCard>
              <StatCard
                whileHover={{ y: -4 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.6 }}
              >
                <StatIcon><FaServer /></StatIcon>
                <StatNumber><CountUp value={99.9} suffix="%" decimals={1} delay={1.6} /></StatNumber>
                <StatLabel>Uptime Achieved</StatLabel>
              </StatCard>
              <StatCard
                whileHover={{ y: -4 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.8 }}
              >
                <StatIcon><FaCoins /></StatIcon>
                <StatNumber><CountUp value={35} suffix="%" delay={1.8} /></StatNumber>
                <StatLabel>Costs Cut</StatLabel>
              </StatCard>
            </StatsGrid>

            <QuickInfo>
              <InfoItem>
                <InfoIcon><FaMapMarkerAlt /></InfoIcon>
                <span>Bellville, Western Cape</span>
              </InfoItem>
              <InfoItem>
                <InfoIcon><FaCloud /></InfoIcon>
                <span>Cloud Solutions Expert</span>
              </InfoItem>
            </QuickInfo>
          </StatsSection>
        </Container>

        <ScrollIndicator
          onClick={scrollToAbout}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 2 }}
          whileHover={{ y: 4 }}
        >
          <ScrollText>Explore More</ScrollText>
          <motion.div
            animate={reducedMotion ? {} : { y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <FaArrowDown />
          </motion.div>
        </ScrollIndicator>
      </Section>

      <ContactModal isOpen={isContactModalOpen} onClose={closeContact} />
      <CVModal isOpen={isCVModalOpen} onClose={closeCV} />
    </>
  );
};

export default Hero;