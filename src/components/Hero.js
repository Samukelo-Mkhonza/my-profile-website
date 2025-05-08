import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

// Cursor blink animation
const blink = keyframes`
  0%, 100% { opacity: 1; }
  50%      { opacity: 0; }
`;

// Styled cursor element
const Cursor = styled.span`
  display: inline-block;
  margin-left: 2px;
  width: 1ch;
  background-color: currentColor;
  animation: ${blink} 1s step-start infinite;
`;

// TypingText component: types out text character by character with blinking cursor
const TypingText = ({ text, speed = 50 }) => {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    let index = 0;
    setDisplayed('');
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, index + 1));
      index++;
      if (index > text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <span>
      {displayed}
      <Cursor />
    </span>
  );
};

const Section = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(2rem, 10vw, 4rem) 1rem;
  background: #ffffff; /* Changed from #f7f7f7 to white */
`;

const Content = styled(motion.div)`
  max-width: 900px;
  width: 100%;
  text-align: center;
`;

const Title = styled.h1`
  font-size: clamp(2.5rem, 8vw, 4rem);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  margin-bottom: clamp(0.5rem, 2vw, 1rem);

  @media (max-width: 480px) {
    letter-spacing: 0.1em;
  }
`;

const Subtitle = styled.p`
  font-size: clamp(1rem, 4vw, 1.25rem);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #333;

  @media (max-width: 480px) {
    letter-spacing: 0.05em;
  }
`;

const Hero = () => (
  <Section id="hero">
    <Content
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Title>
        <TypingText text="SAMUKELO MKHONZA" speed={100} />
      </Title>
      <Subtitle>
        <TypingText text="SOFTWARE DEVELOPER" speed={80} />
      </Subtitle>
    </Content>
  </Section>
);

export default Hero;