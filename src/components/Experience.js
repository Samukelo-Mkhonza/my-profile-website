import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const Section = styled.section`
  padding: clamp(2rem, 5vw, 5rem) clamp(1rem, 5vw, 2rem);
  background: #f7f7f7;
`;

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const Heading = styled.h2`
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  text-align: center;
  margin-bottom: clamp(2rem, 4vw, 3rem);
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
      left: 1.5rem;
      transform: none;
    }
  }
`;

const Entry = styled(motion.div)`
  position: relative;
  width: 50%;
  padding: 0;
  margin-bottom: clamp(2rem, 4vw, 3rem);

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
    padding: 0 0 0 3rem !important;
  }
`;

const ExperienceCard = styled(motion.div)`
  background: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: clamp(1.5rem, 3vw, 2rem);
  position: relative;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
    border-color: #000;
  }

  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

const Circle = styled.div`
  position: absolute;
  top: 2rem;
  width: 16px;
  height: 16px;
  background: #000;
  border-radius: 50%;
  border: 3px solid #fff;
  box-shadow: 0 0 0 3px #ddd;
  z-index: 10;
  
  ${({ align }) => (align === 'left' ? 'right: -8px;' : 'left: -8px;')}

  @media (max-width: 768px) {
    left: -8px !important;
    right: auto !important;
  }
`;

const Period = styled.time`
  font-size: clamp(0.75rem, 2vw, 0.875rem);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #666;
  display: block;
  margin-bottom: 0.75rem;
  font-weight: 500;
`;

const Role = styled.h3`
  font-size: clamp(1.25rem, 3vw, 1.5rem);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 1rem;
  line-height: 1.3;
  color: #000;
`;

const Company = styled.h4`
  font-size: clamp(1rem, 2.5vw, 1.125rem);
  font-weight: 500;
  color: #333;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const Description = styled.p`
  font-size: clamp(0.875rem, 2.5vw, 1rem);
  line-height: 1.6;
  color: #333;
  margin-bottom: 1.5rem;
`;

const Skills = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  
  @media (max-width: 768px) {
    justify-content: flex-start;
  }
  
  ${({ align }) => align === 'left' && `
    @media (min-width: 769px) {
      justify-content: flex-end;
    }
  `}
`;

const SkillTag = styled.span`
  background: #f0f0f0;
  color: #333;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: clamp(0.75rem, 2vw, 0.875rem);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: all 0.3s ease;
  
  ${ExperienceCard}:hover & {
    background: #000;
    color: #fff;
  }
`;

const ViewMore = styled.span`
  font-size: clamp(0.75rem, 2vw, 0.875rem);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  display: inline-flex;
  align-items: center;
  margin-top: 1rem;
  transition: all 0.3s ease;
  color: #666;
  
  &:after {
    content: '→';
    margin-left: 0.5rem;
    transition: transform 0.3s ease;
  }
  
  ${ExperienceCard}:hover & {
    color: #000;
    &:after {
      transform: translateX(4px);
    }
  }
`;

const experiences = [
  {
    period: '2023 – Present',
    role: 'Cloud Technologist',
    company: 'CloudZA',
    description: 'Architecting and implementing cloud-native solutions using AWS services. Leading the development of scalable web applications and microservices architecture. Optimizing infrastructure costs and improving deployment pipelines.',
    skills: ['AWS', 'React', 'Node.js', 'Docker', 'Terraform'],
    link: '#'
  },
];

const Experience = () => (
  <Section id="experience">
    <Container>
      <Heading>Experience</Heading>
      <Timeline>
        {experiences.map((exp, i) => {
          const alignment = i % 2 === 0 ? 'left' : 'right';
          return (
            <Entry
              key={i}
              align={alignment}
              initial={{ opacity: 0, x: alignment === 'left' ? -100 : 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              viewport={{ once: true }}
            >
              <Circle align={alignment} />
              <ExperienceCard
                onClick={() => window.open(exp.link, '_blank')}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Period>{exp.period}</Period>
                <Role>{exp.role}</Role>
                <Company>{exp.company}</Company>
                <Description>{exp.description}</Description>
                <Skills align={alignment}>
                  {exp.skills.map((skill, idx) => (
                    <SkillTag key={idx}>{skill}</SkillTag>
                  ))}
                </Skills>
                <ViewMore>View Details</ViewMore>
              </ExperienceCard>
            </Entry>
          );
        })}
      </Timeline>
    </Container>
  </Section>
);

export default Experience;