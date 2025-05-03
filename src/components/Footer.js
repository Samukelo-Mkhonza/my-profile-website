import React from 'react';
import styled from 'styled-components';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

const Container = styled.footer`
  width: 100%;
  padding: clamp(2rem, 5vw, 3rem) clamp(1rem, 5vw, 2rem);
  background: #000;
  color: #fff;
  text-align: center;
`;

const Social = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: clamp(1rem, 3vw, 1.5rem);
  margin-bottom: 1rem;

  @media (max-width: 480px) {
    gap: 1rem;
  }
`;

const IconLink = styled.a`
  font-size: clamp(1.5rem, 4vw, 2rem);
  transition: opacity 0.3s, transform 0.3s;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 0.7;
    transform: scale(1.1);
  }

  @media (max-width: 480px) {
    font-size: 1.75rem;
  }
`;

const FooterText = styled.p`
  font-size: clamp(0.875rem, 2vw, 1rem);
  margin: 0;
`;

function Footer() {
  return (
    <Container id="contact">
      <Social>
        <IconLink
          href="https://github.com/Samukelo-Mkhonza"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
        >
          <FaGithub />
        </IconLink>
        <IconLink
          href="https://www.linkedin.com/in/samukelo-mkhonza-a27340215/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
        >
          <FaLinkedin />
        </IconLink>
        {/* <IconLink
          href="https://twitter.com/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Twitter"
        >
          <FaTwitter />
        </IconLink> */}
      </Social>
      <FooterText>&copy; {new Date().getFullYear()} Samukelo Mkhonza</FooterText>
    </Container>
  );
}

export default Footer;
