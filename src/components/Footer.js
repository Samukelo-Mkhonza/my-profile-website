import React from 'react';
import styled from 'styled-components';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

const Container = styled.footer`
  padding: 3rem 2rem;
  background: #000;
  color: #fff;
  text-align: center;
`;
const Social = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 1rem;
`;
const IconLink = styled.a`
  font-size: 1.25rem;
  transition: opacity 0.3s;
  &:hover { opacity: 0.7; }
`;

function Footer() {
  return (
    <Container id="contact">
      <Social>
        <IconLink href="https://github.com/" target="_blank" rel="noopener noreferrer"><FaGithub /></IconLink>
        <IconLink href="https://linkedin.com/" target="_blank" rel="noopener noreferrer"><FaLinkedin /></IconLink>
        <IconLink href="https://twitter.com/" target="_blank" rel="noopener noreferrer"><FaTwitter /></IconLink>
      </Social>
      <p>&copy; {new Date().getFullYear()} Samukelo Mkhonza</p>
    </Container>
  );
}

export default Footer;