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
  padding-top: 4rem;
`;

const Content = styled(motion.div)`
  text-align: center;
`;

const Title = styled.h1`
  font-size: 4rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-size: 1.125rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: #333;
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
