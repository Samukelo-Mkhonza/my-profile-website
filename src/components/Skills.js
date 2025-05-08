import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { SiJavascript, SiReact, SiPython } from 'react-icons/si';
import { FaAws, FaNodeJs } from 'react-icons/fa';

const Section = styled.section`
  padding: clamp(2rem, 5vw, 5rem) clamp(1rem, 5vw, 2rem);
  background: #ffffff;
`;

const Container = styled.div`
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
  padding: 0 1rem;
  text-align: center;
`;

const Heading = styled.h2`
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  margin-bottom: clamp(1rem, 4vw, 2rem);
`;

const Grid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(clamp(80px, 20%, 120px), 1fr)
  );
  gap: clamp(1rem, 3vw, 1.5rem);
  margin: 0 auto;
`;

// Modified SkillCard to use motion.div for hover animation
const SkillCard = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
`;

const IconWrapper = styled(motion.div)`
  font-size: clamp(1.5rem, 6vw, 2.5rem);
`;

const Label = styled.p`
  margin-top: 0.5rem;
  font-size: clamp(0.75rem, 2.5vw, 0.875rem);
`;

const skills = [
  { icon: SiJavascript, name: 'JavaScript' },
  { icon: SiReact, name: 'React' },
  { icon: FaAws, name: 'AWS' },
  { icon: FaNodeJs, name: 'Node.js' },
  { icon: SiPython, name: 'Python' },
];

const Skills = () => (
  <Section id="skills">
    <Container>
      <Heading>Skills</Heading>
      <Grid
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.15 } },
        }}
      >
        {skills.map((s, idx) => (
          <motion.div
            key={idx}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <SkillCard
              whileHover={{
                scale: 1.2,
                transition: { type: "spring", stiffness: 400, damping: 10 }
              }}
            >
              <IconWrapper>
                <s.icon />
              </IconWrapper>
              <Label>{s.name}</Label>
            </SkillCard>
          </motion.div>
        ))}
      </Grid>
    </Container>
  </Section>
);

export default Skills;