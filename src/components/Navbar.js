import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { FaBars, FaTimes, FaCode, FaHome, FaUser, FaCog, FaBriefcase, FaBlog, FaEnvelope, FaSun, FaMoon, FaCompass } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

const NavContainer = styled(motion.nav)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: var(--bg-card, #fffcf5);
  border-bottom: 3px solid var(--border-card, #111);
  box-shadow: ${props => props.$scrolled
    ? '0 6px 0 var(--shadow-color, #111)'
    : '0 4px 0 var(--shadow-color, #111)'};
  transition: box-shadow 0.25s ease;
`;

const NavInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${props => props.$scrolled ? '0.625rem' : '1rem'} clamp(1rem, 4vw, 2rem);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: clamp(0.5rem, 2vw, 1rem);
  transition: padding 0.25s ease;

  @media (max-width: 480px) {
    padding: ${props => props.$scrolled ? '0.5rem' : '0.75rem'} clamp(0.75rem, 3vw, 1.25rem);
  }

  @media (max-height: 500px) and (orientation: landscape) {
    padding: 0.5rem clamp(1rem, 3vw, 2rem);
  }
`;

const Logo = styled.a`
  display: flex;
  align-items: center;
  gap: clamp(0.5rem, 2vw, 0.75rem);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-primary, #000);
  text-decoration: none;
  cursor: pointer;
  flex-shrink: 0;
  position: relative;
  -webkit-tap-highlight-color: transparent;

  &:active {
    transform: scale(0.96);
  }

  &:focus-visible {
    outline: 3px solid var(--green, #43a047);
    outline-offset: 3px;
  }
`;

const LogoIcon = styled(motion.div)`
  width: ${props => props.$scrolled ? '2.25rem' : '2.5rem'};
  height: ${props => props.$scrolled ? '2.25rem' : '2.5rem'};
  background: var(--accent, #111);
  border: 2px solid var(--border-card, #111);
  border-radius: var(--radius-sm, 10px);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent-inverse, #fff);
  font-size: ${props => props.$scrolled ? '1rem' : '1.125rem'};
  box-shadow: var(--shadow-hard-sm, 3px 3px 0 #111);
  transition: width 0.25s ease, height 0.25s ease, font-size 0.25s ease;
  flex-shrink: 0;

  @media (max-width: 360px) {
    width: 2rem;
    height: 2rem;
    font-size: 0.875rem;
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
  gap: clamp(0.125rem, 0.4vw, 0.375rem);
  min-width: 0;

  @media (max-width: 968px) {
    display: none;
  }
`;

const MenuItem = styled.a`
  padding: clamp(0.4rem, 0.8vw, 0.55rem) clamp(0.5rem, 1vw, 0.8rem);
  font-size: clamp(0.6875rem, 0.95vw, 0.8125rem);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  white-space: nowrap;
  text-decoration: none;
  cursor: pointer;
  border-radius: var(--radius-sm, 10px);
  border: 2px solid ${props => props.$active ? 'var(--border-card, #111)' : 'transparent'};
  background: ${props => props.$active ? 'var(--accent, #111)' : 'transparent'};
  color: ${props => props.$active ? 'var(--accent-inverse, #fff)' : 'var(--text-secondary, #666)'};
  box-shadow: ${props => props.$active ? 'var(--shadow-hard-sm, 3px 3px 0 #111)' : 'none'};
  transition: all 0.15s ease;

  @media (hover: hover) {
    &:hover {
      color: ${props => props.$active ? 'var(--accent-inverse, #fff)' : 'var(--text-primary, #000)'};
      background: ${props => props.$active ? 'var(--accent, #111)' : 'var(--tag-bg, #f2e9d8)'};
      border-color: var(--border-card, #111);
      box-shadow: var(--shadow-hard-sm, 3px 3px 0 #111);
      transform: translate(-2px, -2px);
    }
  }

  &:active {
    transform: translate(0, 0);
    box-shadow: none;
  }

  &:focus-visible {
    outline: 3px solid var(--green, #43a047);
    outline-offset: 2px;
  }

  /* Tight range between hamburger collapse and full width: shave tracking */
  @media (max-width: 1100px) {
    letter-spacing: 0;
  }
`;

const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: clamp(0.5rem, 1.5vw, 0.75rem);
  flex-shrink: 0;
`;

const IconButton = styled(motion.button)`
  background: var(--tag-bg, #f2e9d8);
  border: 2px solid var(--border-card, #111);
  cursor: pointer;
  border-radius: var(--radius-sm, 10px);
  color: var(--text-primary, #000);
  font-size: 1.125rem;
  min-width: 44px;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
  -webkit-tap-highlight-color: transparent;

  @media (hover: hover) {
    &:hover {
      box-shadow: var(--shadow-hard-sm, 3px 3px 0 #111);
      transform: translate(-2px, -2px);
    }
  }

  &:active {
    transform: translate(0, 0);
    box-shadow: none;
  }

  &:focus-visible {
    outline: 3px solid var(--green, #43a047);
    outline-offset: 2px;
  }

  @media (max-width: 360px) {
    min-width: 40px;
    min-height: 40px;
    font-size: 1rem;
  }
`;

const MobileMenuButton = styled(IconButton)`
  display: none;

  @media (max-width: 968px) {
    display: flex;
  }
`;

const ProgressBar = styled(motion.div)`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: var(--green, #43a047);
  transform-origin: left;

  @media (max-width: 480px) {
    height: 3px;
  }
`;

const MobileMenu = styled(motion.div)`
  position: fixed;
  top: 0;
  right: 0;
  width: min(100%, 380px);
  height: 100vh;
  height: 100dvh;
  background: var(--bg-card, #fffcf5);
  border-left: 3px solid var(--border-card, #111);
  box-shadow: -6px 0 0 var(--shadow-color, #111);
  padding: clamp(1.25rem, 4vw, 1.75rem);
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  z-index: 1001;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;

  @media (max-width: 360px) {
    width: 100%;
    border-left: none;
    box-shadow: none;
    padding: 1rem;
  }

  @media (max-height: 500px) and (orientation: landscape) {
    padding: 1rem;
    gap: 0.375rem;
  }
`;

const MobileMenuHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  border-bottom: 3px solid var(--border-card, #111);
  margin-bottom: 1rem;
`;

const MobileMenuLogo = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--text-primary, #000);
`;

const MobileMenuItem = styled(motion.a)`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.875rem 1rem;
  min-height: 52px;
  font-size: 0.9375rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  text-decoration: none;
  cursor: pointer;
  border-radius: var(--radius-sm, 10px);
  border: 2px solid ${props => props.$active ? 'var(--border-card, #111)' : 'var(--border-color, rgba(0, 0, 0, 0.15))'};
  background: ${props => props.$active ? 'var(--accent, #111)' : 'transparent'};
  color: ${props => props.$active ? 'var(--accent-inverse, #fff)' : 'var(--text-secondary, #666)'};
  box-shadow: ${props => props.$active ? 'var(--shadow-hard-sm, 3px 3px 0 #111)' : 'none'};
  transition: all 0.15s ease;
  -webkit-tap-highlight-color: transparent;

  @media (hover: hover) {
    &:hover {
      color: ${props => props.$active ? 'var(--accent-inverse, #fff)' : 'var(--text-primary, #000)'};
      background: ${props => props.$active ? 'var(--accent, #111)' : 'var(--tag-bg, #f2e9d8)'};
      border-color: var(--border-card, #111);
      transform: translateX(4px);
    }
  }

  &:active {
    transform: scale(0.98);
  }

  &:focus-visible {
    outline: 3px solid var(--green, #43a047);
    outline-offset: 2px;
  }

  svg {
    font-size: 1.125rem;
    flex-shrink: 0;
    opacity: ${props => props.$active ? 1 : 0.6};
  }

  @media (max-width: 360px) {
    min-height: 48px;
    padding: 0.75rem 0.875rem;
    font-size: 0.875rem;
  }

  @media (max-height: 500px) and (orientation: landscape) {
    min-height: 44px;
    padding: 0.5rem 0.875rem;
  }
`;

const ItemIndex = styled.span`
  font-size: 0.6875rem;
  min-width: 1.375rem;
  opacity: 0.5;
`;

const MobileMenuFooter = styled.div`
  margin-top: auto;
  padding-top: 1.25rem;
  border-top: 3px solid var(--border-card, #111);
`;

const ContactCTA = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  width: 100%;
  min-height: 52px;
  padding: 0.875rem 1.5rem;
  background: var(--accent, #111);
  color: var(--accent-inverse, #fff);
  border: 2px solid var(--border-card, #111);
  border-radius: var(--radius-sm, 10px);
  box-shadow: var(--shadow-hard-sm, 3px 3px 0 #111);
  font-size: 0.875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.15s ease;
  -webkit-tap-highlight-color: transparent;

  @media (hover: hover) {
    &:hover {
      box-shadow: var(--shadow-hard, 4px 4px 0 #111);
      transform: translate(-2px, -2px);
    }
  }

  &:active {
    transform: translate(0, 0);
    box-shadow: none;
  }

  &:focus-visible {
    outline: 3px solid var(--green, #43a047);
    outline-offset: 2px;
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  z-index: 999;
`;

const HiddenFactBubble = styled(motion.div)`
  position: absolute;
  top: calc(100% + 14px);
  left: 0;
  background: var(--accent, #111);
  color: var(--accent-inverse, #fff);
  border: 2px solid var(--border-card, #111);
  padding: 0.75rem 1.25rem;
  border-radius: var(--radius-sm, 10px);
  font-size: 0.8125rem;
  font-weight: 500;
  white-space: nowrap;
  z-index: 1002;
  box-shadow: var(--shadow-hard-sm, 3px 3px 0 #111);
  pointer-events: none;

  @media (max-width: 480px) {
    font-size: 0.75rem;
    padding: 0.5rem 1rem;
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

const hiddenFacts = [
  "🎮 I once debugged code in my dreams!",
  "☕ My first program was a calculator in Java",
  "🌍 I want to visit every continent",
  "🎵 I can code for 8 hours with the right playlist",
  "🚀 I deployed my first app at 3 AM",
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [scrollProgress, setScrollProgress] = useState(0);
  const { isDark, toggleTheme } = useTheme();
  const [logoClicks, setLogoClicks] = useState(0);
  const [showFact, setShowFact] = useState(false);
  const reduceMotion = useReducedMotion();
  const drawerRef = useRef(null);
  const menuButtonRef = useRef(null);

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

  // While the drawer is open: Escape closes it and Tab cycles within it.
  // On close, focus returns to the hamburger via the effect cleanup.
  useEffect(() => {
    if (!isOpen) return undefined;

    const menuButton = menuButtonRef.current;

    const getFocusable = () =>
      drawerRef.current
        ? Array.from(drawerRef.current.querySelectorAll('a[href], button:not([disabled])'))
        : [];

    getFocusable()[0]?.focus();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        return;
      }
      if (e.key !== 'Tab') return;

      const focusable = getFocusable();
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      menuButton?.focus();
    };
  }, [isOpen]);

  // Logo click easter egg: 7 clicks reveals a hidden fact
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
        behavior: reduceMotion ? 'auto' : 'smooth'
      });
    }
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <NavContainer
        $scrolled={scrolled}
        initial={reduceMotion ? false : { y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      >
        <NavInner $scrolled={scrolled}>
          <Logo
            href="#hero"
            onClick={(e) => { handleLinkClick('#hero', e); handleLogoEasterEgg(); }}
            aria-label="SM, go to home"
          >
            <LogoIcon
              $scrolled={scrolled}
              whileHover={reduceMotion ? undefined : { rotate: 360 }}
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
                aria-current={activeSection === link.href.slice(1) ? 'true' : undefined}
                onClick={(e) => handleLinkClick(link.href, e)}
              >
                {link.label}
              </MenuItem>
            ))}
          </Menu>

          <NavActions>
            <IconButton
              onClick={toggleTheme}
              whileTap={{ scale: 0.92 }}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              title={isDark ? 'Light mode' : 'Dark mode'}
            >
              <AnimatePresence mode="wait">
                {isDark ? (
                  <motion.div
                    key="sun"
                    initial={reduceMotion ? false : { rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={reduceMotion ? undefined : { rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ display: 'flex' }}
                  >
                    <FaSun />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={reduceMotion ? false : { rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={reduceMotion ? undefined : { rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ display: 'flex' }}
                  >
                    <FaMoon />
                  </motion.div>
                )}
              </AnimatePresence>
            </IconButton>

            <MobileMenuButton
              ref={menuButtonRef}
              onClick={toggleMenu}
              whileTap={{ scale: 0.92 }}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
              aria-controls="mobile-nav-drawer"
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={reduceMotion ? false : { rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={reduceMotion ? undefined : { rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ display: 'flex' }}
                  >
                    <FaTimes />
                  </motion.div>
                ) : (
                  <motion.div
                    key="open"
                    initial={reduceMotion ? false : { rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={reduceMotion ? undefined : { rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ display: 'flex' }}
                  >
                    <FaBars />
                  </motion.div>
                )}
              </AnimatePresence>
            </MobileMenuButton>
          </NavActions>
        </NavInner>

        <ProgressBar
          initial={{ scaleX: 0 }}
          animate={{ scaleX: scrollProgress / 100 }}
          transition={{ duration: reduceMotion ? 0 : 0.1 }}
        />
      </NavContainer>

      <AnimatePresence>
        {isOpen && (
          <>
            <Overlay
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.2 }}
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />
            <MobileMenu
              ref={drawerRef}
              id="mobile-nav-drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Site navigation"
              initial={reduceMotion ? { x: 0, opacity: 0 } : { x: '100%' }}
              animate={{ x: 0, opacity: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { x: '100%' }}
              transition={reduceMotion
                ? { duration: 0.05 }
                : { type: 'spring', stiffness: 300, damping: 30 }}
            >
              <MobileMenuHeader>
                <MobileMenuLogo>Menu</MobileMenuLogo>
                <IconButton
                  onClick={toggleMenu}
                  whileTap={{ scale: 0.92 }}
                  aria-label="Close menu"
                >
                  <FaTimes />
                </IconButton>
              </MobileMenuHeader>

              {links.map((link, index) => (
                <MobileMenuItem
                  key={link.href}
                  href={link.href}
                  $active={activeSection === link.href.slice(1)}
                  aria-current={activeSection === link.href.slice(1) ? 'true' : undefined}
                  onClick={(e) => handleLinkClick(link.href, e)}
                  initial={reduceMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.25, delay: reduceMotion ? 0 : index * 0.05 }}
                >
                  <ItemIndex aria-hidden="true">{String(index + 1).padStart(2, '0')}</ItemIndex>
                  <link.icon />
                  {link.label}
                </MobileMenuItem>
              ))}

              <MobileMenuFooter>
                <ContactCTA
                  href="#contact"
                  onClick={(e) => handleLinkClick('#contact', e)}
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
