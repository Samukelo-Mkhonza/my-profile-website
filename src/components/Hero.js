import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

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
    <Content initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6 }}>
      <Title>SAMUKELO MKHONZA</Title>
      <Subtitle>SOFTWARE DEVELOPER</Subtitle>
    </Content>
  </Section>
);
export default Hero;