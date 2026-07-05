import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes, FaCode, FaHome, FaUser, FaCog, FaBriefcase, FaBlog, FaEnvelope, FaSun, FaMoon, FaCompass } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

const NavContainer = styled(motion.nav)`
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
`;

const NavContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${props => props.$scrolled 
    ? 'clamp(0.625rem, 2vw, 1rem)' 
    : 'clamp(0.875rem, 2.5vw, 1.25rem)'} clamp(1rem, 4vw, 2rem);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${props => props.$scrolled 
    ? 'var(--glass-bg, rgba(255, 255, 255, 0.98))' 
    : 'var(--glass-bg, rgba(255, 255, 255, 0.95))'};
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: ${props => props.$scrolled ? '0' : '0 0 16px 16px'};
  border: 1px solid var(--border-color, rgba(0, 0, 0, 0.05));
  box-shadow: ${props => props.$scrolled 
    ? '0 4px 20px var(--shadow-color, rgba(0, 0, 0, 0.1))' 
    : '0 2px 10px var(--shadow-color, rgba(0, 0, 0, 0.05))'};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;

  /* Small mobile */
  @media (max-width: 480px) {
    padding: ${props => props.$scrolled 
      ? 'clamp(0.5rem, 2vw, 0.75rem)' 
      : 'clamp(0.625rem, 3vw, 1rem)'} clamp(0.75rem, 3vw, 1.25rem);
    border-radius: 0;
  }

  /* Very small screens */
  @media (max-width: 360px) {
    padding: ${props => props.$scrolled ? '0.5rem' : '0.625rem'} 0.625rem;
  }

  /* Landscape mobile */
  @media (max-height: 500px) and (orientation: landscape) {
    padding: 0.5rem clamp(1rem, 3vw, 2rem);
  }
`;

const Logo = styled(motion.a)`
  display: flex;
  align-items: center;
  gap: clamp(0.5rem, 2vw, 0.875rem);
  font-size: clamp(1.125rem, 2.5vw, 1.5rem);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-primary, #000);
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;
  -webkit-tap-highlight-color: transparent;

  @media (hover: hover) {
    &:hover {
      transform: scale(1.05);
    }
  }

  &:active {
    transform: scale(0.95);
  }

  /* Small mobile */
  @media (max-width: 480px) {
    font-size: clamp(1rem, 4vw, 1.25rem);
    gap: 0.625rem;
    letter-spacing: 0.05em;
  }

  /* Very small screens */
  @media (max-width: 360px) {
    font-size: 0.9375rem;
  }
`;

const LogoIcon = styled(motion.div)`
  width: ${props => props.$scrolled 
    ? 'clamp(2rem, 5vw, 2.5rem)' 
    : 'clamp(2.25rem, 6vw, 3rem)'};
  height: ${props => props.$scrolled 
    ? 'clamp(2rem, 5vw, 2.5rem)' 
    : 'clamp(2.25rem, 6vw, 3rem)'};
  background: linear-gradient(135deg, var(--accent, #000) 0%, var(--text-secondary, #333) 100%);
  border-radius: clamp(6px, 1.5vw, 10px);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: ${props => props.$scrolled 
    ? 'clamp(0.875rem, 2vw, 1.125rem)' 
    : 'clamp(1rem, 2.5vw, 1.375rem)'};
  font-weight: 700;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    transition: left 0.5s ease;
  }

  @media (hover: hover) {
    &:hover:before {
      left: 100%;
    }
  }

  /* Small mobile */
  @media (max-width: 480px) {
    width: ${props => props.$scrolled ? '2rem' : '2.25rem'};
    height: ${props => props.$scrolled ? '2rem' : '2.25rem'};
    font-size: ${props => props.$scrolled ? '0.875rem' : '1rem'};
  }

  /* Very small screens */
  @media (max-width: 360px) {
    width: ${props => props.$scrolled ? '1.875rem' : '2rem'};
    height: ${props => props.$scrolled ? '1.875rem' : '2rem'};
    font-size: 0.875rem;
    border-radius: 6px;
  }
`;

const LogoText = styled.span`
  font-size: clamp(1rem, 2.5vw, 1.25rem);
  
  @media (max-width: 480px) {
    display: none;
  }
`;

const Menu = styled.div`
  display: flex;
  align-items: center;
  gap: clamp(0.25rem, 1.5vw, 0.875rem);

  @media (max-width: 768px) {
    display: none;
  }
`;

const MenuItem = styled(motion.a)`
  position: relative;
  padding: clamp(0.625rem, 1.5vw, 0.875rem) clamp(0.875rem, 2vw, 1.25rem);
  font-size: clamp(0.75rem, 1.5vw, 0.9375rem);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${props => props.$active ? 'var(--text-primary, #000)' : 'var(--text-secondary, #666)'};
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: clamp(0.375rem, 1vw, 0.5rem);
  white-space: nowrap;

  &:before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    width: ${props => props.$active ? '80%' : '0'};
    height: 3px;
    background: var(--text-primary, #000);
    transform: translateX(-50%);
    transition: width 0.3s ease;
    border-radius: 2px;
  }

  @media (hover: hover) {
    &:hover {
      color: var(--text-primary, #000);
      background: rgba(128, 128, 128, 0.1);
      transform: translateY(-2px);

      &:before {
        width: 80%;
      }
    }
  }

  &:active {
    transform: scale(0.98);
  }

  svg {
    font-size: clamp(0.75rem, 1.5vw, 0.9375rem);
    opacity: 0.7;
  }

  /* Tablets */
  @media (max-width: 1024px) {
    padding: 0.625rem 0.875rem;
    font-size: 0.8125rem;
    
    svg {
      display: none;
    }
  }
`;

const ProgressBar = styled(motion.div)`
  position: absolute;
  bottom: -1px;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, #000 0%, #666 100%);
  transform-origin: left;
  z-index: 10;
  border-radius: 0 2px 2px 0;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);

  @media (max-width: 480px) {
    height: 2px;
  }
`;

const MobileMenuButton = styled(motion.button)`
  display: none;
  background: rgba(0, 0, 0, 0.05);
  border: 2px solid transparent;
  cursor: pointer;
  padding: clamp(0.625rem, 2vw, 0.875rem);
  border-radius: 8px;
  color: var(--text-primary, #000);
  font-size: clamp(1.125rem, 3vw, 1.375rem);
  transition: all 0.3s ease;
  min-width: 44px;
  min-height: 44px;
  align-items: center;
  justify-content: center;
  -webkit-tap-highlight-color: transparent;

  @media (hover: hover) {
    &:hover {
      background: rgba(128, 128, 128, 0.15);
      border-color: rgba(0, 0, 0, 0.1);
      transform: scale(1.05);
    }
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: 768px) {
    display: flex;
  }

  /* Small mobile */
  @media (max-width: 480px) {
    padding: 0.625rem;
    font-size: 1.125rem;
  }

  /* Very small screens */
  @media (max-width: 360px) {
    padding: 0.5rem;
    font-size: 1rem;
    min-width: 40px;
    min-height: 40px;
  }
`;

const MobileMenu = styled(motion.div)`
  position: fixed;
  top: 0;
  right: 0;
  width: min(100%, 400px);
  height: 100vh;
  height: 100dvh;
  background: var(--glass-bg, rgba(255, 255, 255, 0.98));
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-left: 1px solid var(--border-color, rgba(0, 0, 0, 0.1));
  padding: clamp(1.5rem, 4vw, 2rem);
  display: flex;
  flex-direction: column;
  gap: clamp(0.75rem, 2vw, 1rem);
  z-index: 1001;
  box-shadow: -10px 0 30px rgba(0, 0, 0, 0.15);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;

  /* Small mobile */
  @media (max-width: 480px) {
    width: min(100%, 320px);
    padding: clamp(1.25rem, 4vw, 1.75rem);
  }

  /* Very small screens */
  @media (max-width: 360px) {
    width: 100%;
    padding: 1rem;
  }

  /* Landscape mobile */
  @media (max-height: 500px) and (orientation: landscape) {
    padding: 1rem;
  }
`;

const MobileMenuHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: clamp(0.75rem, 2vw, 1rem);
  border-bottom: 1px solid var(--border-color, rgba(0, 0, 0, 0.1));
  margin-bottom: clamp(0.75rem, 2vw, 1rem);
`;

const MobileMenuLogo = styled.div`
  font-size: clamp(1.125rem, 3vw, 1.375rem);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-primary, #000);

  @media (max-width: 360px) {
    font-size: 1rem;
    letter-spacing: 0.05em;
  }
`;

const CloseButton = styled(motion.button)`
  background: rgba(128, 128, 128, 0.1);
  border: none;
  cursor: pointer;
  padding: clamp(0.5rem, 1.5vw, 0.625rem);
  border-radius: 8px;
  color: var(--text-primary, #000);
  font-size: clamp(1.25rem, 3vw, 1.5rem);
  transition: all 0.3s ease;
  min-width: 44px;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  -webkit-tap-highlight-color: transparent;

  @media (hover: hover) {
    &:hover {
      background: rgba(0, 0, 0, 0.1);
      transform: rotate(90deg);
    }
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: 360px) {
    font-size: 1.125rem;
    padding: 0.5rem;
    min-width: 40px;
    min-height: 40px;
  }
`;

const MobileMenuItem = styled(motion.a)`
  display: flex;
  align-items: center;
  gap: clamp(0.875rem, 2.5vw, 1.25rem);
  padding: clamp(0.875rem, 2.5vw, 1.125rem) clamp(1.25rem, 3vw, 1.75rem);
  font-size: clamp(0.875rem, 2.5vw, 1.0625rem);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${props => props.$active ? 'var(--text-primary, #000)' : 'var(--text-secondary, #666)'};
  text-decoration: none;
  border-radius: 12px;
  border: 2px solid ${props => props.$active ? 'var(--border-color, rgba(0, 0, 0, 0.1))' : 'transparent'};
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  background: ${props => props.$active ? 'rgba(128, 128, 128, 0.1)' : 'transparent'};
  min-height: 52px;
  -webkit-tap-highlight-color: transparent;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(0,0,0,0.05), transparent);
    transition: left 0.3s ease;
  }

  @media (hover: hover) {
    &:hover {
      color: var(--text-primary, #000);
      background: rgba(128, 128, 128, 0.1);
      border-color: var(--border-color, rgba(0, 0, 0, 0.1));
      transform: translateX(8px);

      &:before {
        left: 100%;
      }
    }
  }

  &:active {
    transform: scale(0.98);
  }

  svg {
    font-size: clamp(1rem, 2.5vw, 1.25rem);
    width: clamp(18px, 4vw, 24px);
    flex-shrink: 0;
  }

  /* Small mobile */
  @media (max-width: 480px) {
    padding: 0.875rem 1.25rem;
    font-size: 0.875rem;
    gap: 0.875rem;
    min-height: 48px;
  }

  /* Very small screens */
  @media (max-width: 360px) {
    padding: 0.75rem 1rem;
    font-size: 0.8125rem;
    gap: 0.75rem;
    letter-spacing: 0.03em;
    border-radius: 8px;
    min-height: 44px;
    
    svg {
      font-size: 0.9375rem;
      width: 16px;
    }
  }
`;

const MobileMenuFooter = styled.div`
  margin-top: auto;
  padding-top: clamp(1.5rem, 4vw, 2rem);
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  text-align: center;

  @media (max-width: 360px) {
    padding-top: 1rem;
  }

  /* Landscape mobile */
  @media (max-height: 500px) and (orientation: landscape) {
    padding-top: 1rem;
  }
`;

const ContactCTA = styled(motion.a)`
  display: inline-flex;
  align-items: center;
  gap: clamp(0.625rem, 2vw, 0.875rem);
  padding: clamp(0.875rem, 2.5vw, 1.125rem) clamp(1.5rem, 4vw, 2.25rem);
  background: #000;
  color: #fff;
  border-radius: 10px;
  font-size: clamp(0.8125rem, 2vw, 0.9375rem);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  width: 100%;
  justify-content: center;
  min-height: 48px;
  -webkit-tap-highlight-color: transparent;

  &:before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: #fff;
    border-radius: 50%;
    transition: all 0.3s ease;
    transform: translate(-50%, -50%);
  }

  @media (hover: hover) {
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);

      &:before {
        width: 120%;
        height: 120%;
      }
    }
  }

  &:active {
    transform: scale(0.98);
  }

  span {
    position: relative;
    z-index: 1;
    transition: color 0.3s ease;
  }

  svg {
    position: relative;
    z-index: 1;
    transition: color 0.3s ease;
    font-size: clamp(0.875rem, 2vw, 1rem);
  }

  @media (hover: hover) {
    &:hover span,
    &:hover svg {
      color: #000;
    }
  }

  /* Small mobile */
  @media (max-width: 480px) {
    padding: 0.875rem 1.5rem;
    font-size: 0.8125rem;
  }

  /* Very small screens */
  @media (max-width: 360px) {
    padding: 0.75rem 1.25rem;
    font-size: 0.75rem;
    gap: 0.5rem;
    letter-spacing: 0.03em;
    border-radius: 8px;
    min-height: 44px;
    
    svg {
      font-size: 0.8125rem;
    }
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
`;

const ThemeToggleBtn = styled(motion.button)`
  background: rgba(0, 0, 0, 0.05);
  border: 2px solid transparent;
  cursor: pointer;
  padding: clamp(0.5rem, 1.5vw, 0.625rem);
  border-radius: 50%;
  color: var(--text-primary, #000);
  font-size: clamp(1rem, 2.5vw, 1.25rem);
  transition: all 0.3s ease;
  min-width: 40px;
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  @media (hover: hover) {
    &:hover {
      background: rgba(0, 0, 0, 0.1);
      border-color: rgba(0, 0, 0, 0.1);
      transform: scale(1.1);
    }
  }

  &:active {
    transform: scale(0.95);
  }
`;

const HiddenFactBubble = styled(motion.div)`
  position: absolute;
  top: calc(100% + 12px);
  left: 50%;
  transform: translateX(-50%);
  background: var(--accent, #000);
  color: var(--accent-inverse, #fff);
  padding: 0.75rem 1.25rem;
  border-radius: 10px;
  font-size: 0.8125rem;
  font-weight: 500;
  white-space: nowrap;
  z-index: 1002;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  pointer-events: none;

  &:before {
    content: '';
    position: absolute;
    top: -6px;
    left: 50%;
    transform: translateX(-50%);
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-bottom: 6px solid var(--accent, #000);
  }

  @media (max-width: 480px) {
    font-size: 0.75rem;
    padding: 0.5rem 1rem;
    left: 0;
    transform: none;

    &:before {
      left: 20px;
    }
  }
`;

const links = [
  { href: '#hero', label: 'Home', icon: FaHome },
  { href: '#about', label: 'About', icon: FaUser },
  { href: '#experience', label: 'Experience', icon: FaBriefcase },
  { href: '#skills', label: 'Skills', icon: FaCog },
  { href: '#projects', label: 'Projects', icon: FaCode },
  { href: '#blog', label: 'Blog', icon: FaBlog },
  { href: '#explore', label: 'Explore', icon: FaCompass },
  { href: '#contact', label: 'Contact', icon: FaEnvelope },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [scrollProgress, setScrollProgress] = useState(0);
  const { isDark, toggleTheme } = useTheme();
  const [logoClicks, setLogoClicks] = useState(0);
  const [showFact, setShowFact] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min((scrollTop / docHeight) * 100, 100);
      
      setScrolled(scrollTop > 50);
      setScrollProgress(progress);

      // Update active section
      const sections = links.map(link => link.href.slice(1));
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          const viewportHeight = window.innerHeight;
          return rect.top <= viewportHeight * 0.3 && rect.bottom >= viewportHeight * 0.3;
        }
        return false;
      });

      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Call once on mount
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Logo click easter egg: 7 clicks reveals a hidden fact
  const hiddenFacts = [
    "🎮 I once debugged code in my dreams!",
    "☕ My first program was a calculator in Java",
    "🌍 I want to visit every continent",
    "🎵 I can code for 8 hours with the right playlist",
    "🚀 I deployed my first app at 3 AM",
  ];

  const handleLogoEasterEgg = useCallback(() => {
    const newCount = logoClicks + 1;
    setLogoClicks(newCount);
    if (newCount >= 7) {
      setShowFact(true);
      setLogoClicks(0);
      setTimeout(() => setShowFact(false), 4000);
    }
  }, [logoClicks]);

  const [currentFact] = useState(() =>
    hiddenFacts[Math.floor(Math.random() * hiddenFacts.length)]
  );

  const handleLinkClick = (href, e) => {
    e.preventDefault();
    setIsOpen(false);
    
    const targetId = href.slice(1);
    const element = document.getElementById(targetId);
    
    if (element) {
      const navHeight = 80; // Approximate navbar height
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - navHeight;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <NavContainer
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      >
        <NavContent $scrolled={scrolled}>
          <Logo
            href="#hero"
            onClick={(e) => { handleLinkClick('#hero', e); handleLogoEasterEgg(); }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Go to home"
            style={{ position: 'relative' }}
          >
            <LogoIcon 
              $scrolled={scrolled}
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <FaCode />
            </LogoIcon>
            <LogoText>SM</LogoText>
            <AnimatePresence>
              {showFact && (
                <HiddenFactBubble
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                >
                  {currentFact}
                </HiddenFactBubble>
              )}
            </AnimatePresence>
          </Logo>

          <Menu>
            {links.map((link) => (
              <MenuItem
                key={link.href}
                href={link.href}
                $active={activeSection === link.href.slice(1)}
                onClick={(e) => handleLinkClick(link.href, e)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                aria-label={link.label}
              >
                <link.icon />
                <span>{link.label}</span>
              </MenuItem>
            ))}
          </Menu>

          <ThemeToggleBtn
            onClick={toggleTheme}
            whileHover={{ scale: 1.1, rotate: 15 }}
            whileTap={{ scale: 0.9 }}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Light mode' : 'Dark mode'}
          >
            <AnimatePresence mode="wait">
              {isDark ? (
                <motion.div
                  key="sun"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FaSun />
                </motion.div>
              ) : (
                <motion.div
                  key="moon"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FaMoon />
                </motion.div>
              )}
            </AnimatePresence>
          </ThemeToggleBtn>

          <MobileMenuButton
            onClick={toggleMenu}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FaTimes />
                </motion.div>
              ) : (
                <motion.div
                  key="open"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FaBars />
                </motion.div>
              )}
            </AnimatePresence>
          </MobileMenuButton>

          <ProgressBar
            style={{ width: `${scrollProgress}%` }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: scrollProgress / 100 }}
            transition={{ duration: 0.1 }}
          />
        </NavContent>
      </NavContainer>

      <AnimatePresence>
        {isOpen && (
          <>
            <Overlay
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            <MobileMenu
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <MobileMenuHeader>
                <MobileMenuLogo>Menu</MobileMenuLogo>
                <CloseButton
                  onClick={toggleMenu}
                  whileHover={{ rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Close menu"
                >
                  <FaTimes />
                </CloseButton>
              </MobileMenuHeader>

              {links.map((link, index) => (
                <MobileMenuItem
                  key={link.href}
                  href={link.href}
                  $active={activeSection === link.href.slice(1)}
                  onClick={(e) => handleLinkClick(link.href, e)}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ x: 8 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <link.icon />
                  {link.label}
                </MobileMenuItem>
              ))}

              <MobileMenuFooter>
                <ContactCTA
                  href="#contact"
                  onClick={(e) => handleLinkClick('#contact', e)}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>Let's Work Together</span>
                  <FaEnvelope />
                </ContactCTA>
              </MobileMenuFooter>
            </MobileMenu>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;