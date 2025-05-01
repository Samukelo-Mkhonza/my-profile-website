import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { SiJavascript, SiReact, SiPython } from 'react-icons/si';
import { FaAws, FaNodeJs } from 'react-icons/fa';

const Section = styled.section`
  padding: 5rem 2rem;
  background: #ffffff;
`;

const Container = styled.div`
  max-width: 720px;
  margin: 0 auto;
  text-align: center;
`;

const Heading = styled.h2`
  font-size: 2.5rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  margin-bottom: 2rem;
`;

// Modified Grid to be centered
const Grid = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: center;
  margin: 0 auto;
`;

const SkillCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80px;
`;

const skills = [
  { icon: SiJavascript, name: 'JavaScript' },
  { icon: SiReact, name: 'React' },
  { icon: FaAws, name: 'AWS' },
  { icon: FaNodeJs, name: 'Node.js' },
  { icon: SiPython, name: 'Python' }
];

const Skills = () => (
  <Section id="skills">
    <Container>
      <Heading>Skills</Heading>
      <Grid
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }}
      >
        {skills.map((s, idx) => (
          <motion.div
            key={idx}
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          >
            <SkillCard>
              <s.icon size={36} />
              <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>{s.name}</p>
            </SkillCard>
          </motion.div>
        ))}
      </Grid>
    </Container>
  </Section>
);

export default Skills;