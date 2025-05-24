import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes, FaCode, FaHome, FaUser, FaCog, FaBriefcase, FaBlog, FaEnvelope } from 'react-icons/fa';

const NavContainer = styled(motion.nav)`
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
  transition: all 0.3s ease;
`;

const NavContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${props => props.$scrolled ? '0.75rem' : '1rem'} clamp(1rem, 5vw, 2rem);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${props => props.$scrolled 
    ? 'rgba(255, 255, 255, 0.95)' 
    : 'rgba(255, 255, 255, 0.9)'};
  backdrop-filter: blur(12px);
  border-radius: ${props => props.$scrolled ? '0' : '0 0 12px 12px'};
  border: 1px solid ${props => props.$scrolled 
    ? 'rgba(0, 0, 0, 0.1)' 
    : 'rgba(0, 0, 0, 0.05)'};
  box-shadow: ${props => props.$scrolled 
    ? '0 4px 20px rgba(0, 0, 0, 0.1)' 
    : '0 2px 10px rgba(0, 0, 0, 0.05)'};
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    padding: ${props => props.$scrolled ? '0.5rem' : '0.75rem'} 1rem;
  }
`;

const Logo = styled(motion.a)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: clamp(1.25rem, 3vw, 1.5rem);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: #000;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const LogoIcon = styled(motion.div)`
  width: ${props => props.$scrolled ? '2.5rem' : '3rem'};
  height: ${props => props.$scrolled ? '2.5rem' : '3rem'};
  background: linear-gradient(135deg, #000, #333);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: ${props => props.$scrolled ? '1rem' : '1.25rem'};
  font-weight: 700;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

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

  &:hover:before {
    left: 100%;
  }

  @media (max-width: 768px) {
    width: 2.5rem;
    height: 2.5rem;
    font-size: 1rem;
  }
`;

const LogoText = styled.span`
  @media (max-width: 480px) {
    display: none;
  }
`;

const Menu = styled.div`
  display: flex;
  align-items: center;
  gap: clamp(0.5rem, 2vw, 1rem);

  @media (max-width: 768px) {
    display: none;
  }
`;

const MenuItem = styled(motion.a)`
  position: relative;
  padding: 0.75rem 1rem;
  font-size: clamp(0.75rem, 2vw, 0.875rem);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${props => props.$active ? '#000' : '#666'};
  text-decoration: none;
  border-radius: 6px;
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    width: ${props => props.$active ? '80%' : '0'};
    height: 2px;
    background: #000;
    transform: translateX(-50%);
    transition: width 0.3s ease;
  }

  &:hover {
    color: #000;
    background: rgba(0, 0, 0, 0.05);
    transform: translateY(-2px);

    &:before {
      width: 80%;
    }
  }

  svg {
    font-size: 0.875rem;
    opacity: 0.7;
  }
`;

const ProgressBar = styled(motion.div)`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, #000, #333);
  transform-origin: left;
  z-index: 10;
`;

const MobileMenuButton = styled(motion.button)`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.75rem;
  border-radius: 6px;
  color: #000;
  font-size: 1.25rem;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.1);
    transform: scale(1.1);
  }

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const MobileMenu = styled(motion.div)`
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  max-width: 350px;
  height: 100vh;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  border-left: 1px solid rgba(0, 0, 0, 0.1);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  z-index: 1001;
  box-shadow: -10px 0 30px rgba(0, 0, 0, 0.1);
`;

const MobileMenuHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
`;

const MobileMenuLogo = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: #000;
`;

const CloseButton = styled(motion.button)`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  color: #000;
  font-size: 1.5rem;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.1);
    transform: rotate(90deg);
  }
`;

const MobileMenuItem = styled(motion.a)`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${props => props.$active ? '#000' : '#666'};
  text-decoration: none;
  border-radius: 8px;
  border: 1px solid transparent;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;

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

  &:hover {
    color: #000;
    background: rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.1);
    transform: translateX(8px);

    &:before {
      left: 100%;
    }
  }

  svg {
    font-size: 1.125rem;
    width: 20px;
  }
`;

const MobileMenuFooter = styled.div`
  margin-top: auto;
  padding-top: 2rem;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const ContactCTA = styled(motion.a)`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  background: #000;
  color: #fff;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

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

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);

    &:before {
      width: 120%;
      height: 120%;
    }
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
  }

  &:hover span,
  &:hover svg {
    color: #000;
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
`;

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [scrollProgress, setScrollProgress] = useState(0);

  const links = [
    { href: '#hero', label: 'Home', icon: FaHome },
    // { href: '#about', label: 'About', icon: FaUser },
    { href: '#skills', label: 'Skills', icon: FaCog },
    // { href: '#experience', label: 'Experience', icon: FaBriefcase },
    { href: '#blog', label: 'Blog', icon: FaBlog },
    { href: '#contact', label: 'Contact', icon: FaEnvelope },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      
      setScrolled(scrollTop > 50);
      setScrollProgress(progress);

      // Update active section
      const sections = links.map(link => link.href.slice(1));
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });

      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (href, e) => {
    e.preventDefault();
    setIsOpen(false);
    
    const targetId = href.slice(1);
    const element = document.getElementById(targetId);
    
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
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
        transition={{ duration: 0.6 }}
      >
        <NavContent $scrolled={scrolled}>
          <Logo
            href="#hero"
            onClick={(e) => handleLinkClick('#hero', e)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <LogoIcon $scrolled={scrolled}>
              <FaCode />
            </LogoIcon>
            <LogoText>SM</LogoText>
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
              >
                <link.icon />
                {link.label}
              </MenuItem>
            ))}
          </Menu>

          <MobileMenuButton
            onClick={toggleMenu}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isOpen ? <FaTimes /> : <FaBars />}
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