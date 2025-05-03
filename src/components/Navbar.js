import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes } from 'react-icons/fa';

const Nav = styled(motion.nav)`
  position: fixed;
  top: 0;
  width: 100%;
  padding: clamp(0.75rem, 3vw, 1.5rem) clamp(1rem, 5vw, 2rem);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  z-index: 1000;
`;

const Logo = styled.a`
  font-size: clamp(1rem, 4vw, 1.5rem);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: #000;
`;

const Menu = styled.div`
  display: flex;
  gap: clamp(1rem, 3vw, 1.5rem);

  @media (max-width: 768px) {
    display: none;
  }
`;

const MenuItem = styled.a`
  font-size: clamp(0.75rem, 2.5vw, 0.875rem);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  transition: opacity 0.3s;
  color: #000;

  &:hover {
    opacity: 0.7;
  }
`;

const Burger = styled.div`
  display: none;
  cursor: pointer;
  font-size: clamp(1.5rem, 5vw, 2rem);

  @media (max-width: 768px) {
    display: block;
  }
`;

// Mobile slide-in menu
const MobileMenu = styled(motion.div)`
  position: fixed;
  top: 0;
  right: 0;
  width: 70%;
  max-width: 300px;
  height: 100vh;
  background: #fff;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  z-index: 1001;
`;

const MobileItem = styled.a`
  font-size: 1rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: #000;
  transition: opacity 0.3s;

  &:hover {
    opacity: 0.7;
  }
`;

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const links = [
    { href: '#about', label: 'About' },
    { href: '#skills', label: 'Skills' },
    { href: '#experience', label: 'Experience' },
    { href: '#contact', label: 'Contact' },
  ];

  return (
    <>
      <Nav
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Logo href="#hero">SM</Logo>
        <Menu>
          {links.map((l) => (
            <MenuItem key={l.href} href={l.href}>
              {l.label}
            </MenuItem>
          ))}
        </Menu>
        <Burger onClick={() => setOpen((o) => !o)}>
          {open ? <FaTimes /> : <FaBars />}
        </Burger>
      </Nav>

      <AnimatePresence>
        {open && (
          <MobileMenu
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {links.map((l) => (
              <MobileItem
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </MobileItem>
            ))}
          </MobileMenu>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;