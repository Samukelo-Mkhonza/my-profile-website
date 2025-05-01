import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

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
    <Container initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
      <Heading>About Me</Heading>
      <Text>
        I’m a passionate software developer specializing in cloud-native infrastructures and high-performance applications.
        Currently, I architect solutions at CloudZA, leveraging AWS to build scalable, secure systems.
      </Text>
    </Container>
  </Section>
);
export default About;