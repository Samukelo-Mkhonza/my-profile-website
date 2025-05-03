import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const Section = styled.section`
  padding: clamp(2rem, 5vw, 5rem) clamp(1rem, 5vw, 2rem);
  background: #f7f7f7;
`;

const Container = styled.div`
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const Heading = styled.h2`
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  text-align: center;
  margin-bottom: 2rem;
`;

const Timeline = styled.div`
  position: relative;

  /* central line */
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

  @media (max-width: 768px) {
    &:before {
      left: 1rem;
      transform: none;
    }
  }
`;

const Entry = styled(motion.div)`
  position: relative;
  width: 50%;
  padding: 1rem 2rem;
  background: #fff;
  border-radius: 4px;
  margin-bottom: 2rem;

  /* alternate sides */
  ${({ align }) =>
    align === 'left'
      ? `
    left: 0;
    text-align: right;
    padding-right: 3rem;
  `
      : `
    left: 50%;
    text-align: left;
    padding-left: 3rem;
  `}

  @media (max-width: 768px) {
    width: 100%;
    left: 0 !important;
    text-align: left !important;
    padding: 1rem 1.5rem !important;
    margin-left: 2rem;
  }
`;

const Circle = styled.div`
  position: absolute;
  top: 1rem;
  width: 12px;
  height: 12px;
  background: #000;
  border-radius: 50%;
  ${({ align }) => (align === 'left' ? 'right: -6px;' : 'left: -6px;')}

  @media (max-width: 768px) {
    left: -6px !important;
    right: auto !important;
  }
`;

const events = [
  {
    period: '2023 – Present',
    role: 'Cloud Technologist at CloudZA',
    desc: 'Architecting cloud-native solutions and building scalable web applications.',
  },
];

const Experience = () => (
  <Section id="experience">
    <Container>
      <Heading>Experience</Heading>
      <Timeline>
        {events.map((e, i) => {
          const alignment = i % 2 === 0 ? 'left' : 'right';
          return (
            <Entry
              key={i}
              align={alignment}
              initial={{ opacity: 0, x: alignment === 'left' ? -100 : 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Circle align={alignment} />
              <h3 style={{ margin: '0.5rem 0' }}>{e.period}</h3>
              <h4 style={{ margin: '0.25rem 0', fontWeight: 500 }}>{e.role}</h4>
              <p style={{ marginTop: '0.5rem', color: '#333' }}>{e.desc}</p>
            </Entry>
          );
        })}
      </Timeline>
    </Container>
  </Section>
);

export default Experience;