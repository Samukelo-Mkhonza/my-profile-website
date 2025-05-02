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
const TypingText = ({ text, speed = 40 }) => {
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
  padding: 5rem 2rem;
  background: #f7f7f7;
`;

const Container = styled(motion.div)`
  max-width: 720px;
  margin: 0 auto;
  text-align: center;
`;

const Heading = styled.h2`
  font-size: 2.5rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  margin-bottom: 1rem;
`;

const Text = styled.p`
  font-size: 1rem;
  color: #111;
  line-height: 1.8;
`;

const About = () => (
  <Section id="about">
    <Container
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <Heading>
        <TypingText text="About Me" speed={100} />
      </Heading>
      <Text>
        <TypingText
          text={
            "I’m a passionate software developer specializing in cloud-native infrastructures and high-performance applications. Currently, I architect solutions at CloudZA, leveraging AWS to build scalable, secure systems."
          }
          speed={30}
        />
      </Text>
    </Container>
  </Section>
);

export default About;
