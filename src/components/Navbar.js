import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const Nav = styled(motion.nav)`
  position: fixed;
  top: 0;
  width: 100%;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: transparent;
  z-index: 1000;
`;
const Logo = styled.a`
  font-size: 1.25rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: #000;
`;
const Menu = styled.div`
  display: flex;
  gap: 1.5rem;
`;
const MenuItem = styled.a`
  font-size: 0.875rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  transition: opacity 0.3s;
  &:hover { opacity: 0.7; }
`;

const Navbar = () => (
  <Nav initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4 }}>
    <Logo href="#hero">SM</Logo>
    <Menu>
      <MenuItem href="#about">About</MenuItem>
      <MenuItem href="#skills">Skills</MenuItem>
      <MenuItem href="#experience">Experience</MenuItem>
      <MenuItem href="#contact">Contact</MenuItem>
    </Menu>
  </Nav>
);
export default Navbar;