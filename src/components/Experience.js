import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const Section = styled.section`
  padding: 5rem 2rem;
  background: #f7f7f7;
`;
const Container = styled.div`
  max-width: 720px;
  margin: 0 auto;
`;
const Heading = styled.h2`
  font-size: 2.5rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  text-align: center;
  margin-bottom: 2rem;
`;
const Timeline = styled.div`
  position: relative;
  &:before {
    content: '';
    position: absolute;
    left: 50%;
    top: 0;
    width: 3px;
    height: 100%;
    background: #ddd;
    transform: translateX(-50%);
  }
`;
const Entry = styled(motion.div)`
  position: relative;
  width: 50%;
  padding: 1rem 2rem;
  background: #ffffff;
  border-radius: 4px;
  margin-bottom: 2rem;
  ${props => (props.align === 'left' ? 'left: 0; text-align: right;' : 'left: 50%; text-align: left;')}
`;
const Circle = styled.div`
  position: absolute;
  top: 1rem;
  left: 50%;
  width: 12px;
  height: 12px;
  background: #000;
  border-radius: 50%;
  transform: translateX(-50%);
`;

const events = [
  { period: '2021 – Present', role: 'Software Developer at CloudZA', desc: 'Architecting cloud-native solutions and building scalable web applications.' },
  { period: '2019 – 2021', role: 'Junior Developer at TechCorp', desc: 'Developed React front-ends and Node.js APIs.' }
];

const Experience = () => (
  <Section id="experience">
    <Container>
      <Heading>Experience</Heading>
      <Timeline>
        {events.map((e, i) => (
          <Entry
            key={i}
            align={i % 2 === 0 ? 'left' : 'right'}
            initial={{ opacity: 0, x: i % 2 === 0 ? -100 : 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Circle />
            <h3 style={{ margin: '0.5rem 0' }}>{e.period}</h3>
            <h4 style={{ margin: '0.25rem 0', fontWeight: 500 }}>{e.role}</h4>
            <p style={{ marginTop: '0.5rem', color: '#333' }}>{e.desc}</p>
          </Entry>
        ))}
      </Timeline>
    </Container>
  </Section>
);
export default Experience;