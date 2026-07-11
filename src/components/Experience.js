import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { motion, useReducedMotion } from 'framer-motion';
import {
  FaCheckCircle, FaTrophy, FaMapMarkerAlt, FaBriefcase, FaArrowRight
} from 'react-icons/fa';
import Modal, {
  ModalHeader, ModalTitle, ModalMeta, ModalDescription,
  Divider, ModalSection, SectionLabel, ChipRow, Chip
} from './ui/Modal';

/* ─── Layout ──────────────────────────────────────────────────────────────── */

const Section = styled.section`
  padding: clamp(3rem, 8vw, 6rem) clamp(1rem, 5vw, 2rem);
  background: var(--bg-primary-glass, rgba(255, 255, 255, 0.86));
  position: relative;
`;

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 clamp(0.5rem, 2vw, 1rem);
`;

const Heading = styled(motion.h2)`
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  text-align: center;
  margin-bottom: clamp(1rem, 2vw, 1.5rem);
  color: var(--text-primary, #000);
  position: relative;
  &:after {
    content: '';
    position: absolute;
    bottom: -0.75rem;
    left: 50%;
    transform: translateX(-50%);
    width: clamp(60px, 10vw, 100px);
    height: 3px;
    background: var(--text-primary, #000);
  }
  @media (max-width: 480px) { font-size: clamp(1.5rem, 6vw, 2rem); }
`;

const Subtitle = styled(motion.p)`
  text-align: center;
  color: var(--text-secondary, #666);
  font-size: clamp(0.875rem, 2vw, 1.0625rem);
  line-height: 1.6;
  max-width: 600px;
  margin: clamp(1.5rem, 3vw, 2rem) auto clamp(2.5rem, 5vw, 3.5rem);
`;

/* ─── Timeline ────────────────────────────────────────────────────────────── */

const Timeline = styled.div`
  --exp-node: 38px;
  --exp-gap: clamp(1.75rem, 4vw, 2.75rem);
  max-width: 860px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--exp-gap);
  @media (min-width: 640px) { --exp-node: 46px; }
`;

const Entry = styled(motion.article)`
  position: relative;
  display: grid;
  grid-template-columns: var(--exp-node) 1fr;
  column-gap: clamp(0.875rem, 3vw, 1.5rem);
  align-items: start;

  /* Rail segment linking this marker to the next entry's marker. */
  &:before {
    content: '';
    position: absolute;
    left: calc(var(--exp-node) / 2 - 1.5px);
    top: calc(var(--exp-node) + 8px);
    bottom: calc(-1 * var(--exp-gap) - 8px);
    width: 3px;
    background: var(--border-card, #111);
  }
  &:last-child:before { display: none; }
`;

const Node = styled.div`
  width: var(--exp-node);
  height: var(--exp-node);
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${p => (p.$current ? 'var(--accent-orange, #ee5a24)' : 'var(--bg-card, #fff)')};
  color: ${p => (p.$current ? 'var(--on-orange, #fff)' : 'var(--text-primary, #111)')};
  border: 2px solid var(--border-card, #111);
  border-radius: var(--radius-sm, 10px);
  box-shadow: var(--shadow-hard-sm, 3px 3px 0 #111);
  font-size: clamp(0.8125rem, 2vw, 1rem);
  font-weight: 800;
  z-index: 1;
`;

const ExperienceCard = styled.div`
  background: var(--bg-card, #ffffff);
  border: 2px solid var(--border-card, #111);
  border-radius: var(--radius-card, 14px);
  box-shadow: var(--shadow-hard, 4px 4px 0 #111);
  padding: clamp(1.25rem, 4vw, 2rem);
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.25s ease, box-shadow 0.25s ease;

  &:before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 4px;
    background: var(--accent-orange, #ee5a24);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s ease;
  }

  @media (hover: hover) {
    &:hover {
      transform: translate(-2px, -2px);
      box-shadow: var(--shadow-hard-lg, 6px 6px 0 #111);
      &:before { transform: scaleX(1); }
    }
  }
`;

const MetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const PeriodChip = styled.time`
  background: var(--tag-bg, #f0f0f0);
  color: var(--text-primary, #111);
  border: 2px solid var(--border-card, #111);
  border-radius: var(--radius-pill, 999px);
  padding: 0.2rem 0.7rem;
  font-size: clamp(0.7rem, 2vw, 0.8rem);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;

const TypeBadge = styled.span`
  font-size: clamp(0.65rem, 2vw, 0.72rem);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  background: var(--accent, #000);
  color: var(--accent-inverse, #fff);
  border: 2px solid var(--border-card, #111);
  padding: 0.2rem 0.7rem;
  border-radius: var(--radius-pill, 999px);
`;

const CurrentBadge = styled.span`
  font-size: clamp(0.65rem, 2vw, 0.72rem);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  background: var(--accent-orange, #ee5a24);
  color: var(--on-orange, #fff);
  border: 2px solid var(--border-card, #111);
  padding: 0.2rem 0.7rem;
  border-radius: var(--radius-pill, 999px);
`;

const Role = styled.h3`
  font-size: clamp(1.125rem, 4vw, 1.5rem);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  line-height: 1.3;
  color: var(--text-primary, #000);
  margin-bottom: 0.5rem;
`;

const CompanyRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem 1rem;
  margin-bottom: 1rem;
`;

const CompanyItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: clamp(0.8125rem, 2.5vw, 0.9375rem);
  font-weight: 600;
  color: var(--text-secondary, #333);
  svg { font-size: 0.8em; color: var(--text-muted, #888); }
`;

const Description = styled.p`
  font-size: clamp(0.875rem, 2.5vw, 1rem);
  line-height: 1.65;
  color: var(--text-secondary, #333);
  margin-bottom: 1.25rem;
`;

const SkillTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
`;

const SkillTag = styled.span`
  background: var(--tag-bg, #f0f0f0);
  color: var(--text-primary, #333);
  border: 2px solid var(--border-card, #111);
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-pill, 999px);
  font-size: clamp(0.7rem, 2vw, 0.8125rem);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const DetailsButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--accent, #000);
  color: var(--accent-inverse, #fff);
  border: 2px solid var(--border-card, #111);
  border-radius: var(--radius-pill, 999px);
  box-shadow: var(--shadow-hard-sm, 3px 3px 0 #111);
  padding: 0.5rem 1.125rem;
  min-height: 44px;
  font-family: inherit;
  font-size: clamp(0.75rem, 2vw, 0.8125rem);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  svg { font-size: 0.8em; transition: transform 0.2s ease; }

  @media (hover: hover) {
    &:hover {
      transform: translate(-2px, -2px);
      box-shadow: 5px 5px 0 var(--shadow-color, #111);
      svg { transform: translateX(3px); }
    }
  }
  &:active {
    transform: translate(1px, 1px);
    box-shadow: 2px 2px 0 var(--shadow-color, #111);
  }
  &:focus-visible {
    outline: 3px solid var(--accent-orange, #ee5a24);
    outline-offset: 2px;
  }
`;

/* ─── Modal content ───────────────────────────────────────────────────────── */

const MetaItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.85rem;
  color: var(--text-secondary, #555);
  font-weight: 500;
  svg { font-size: 0.75rem; color: var(--text-secondary, #888); }
`;

const BulletList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
`;

const BulletItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
  font-size: clamp(0.8125rem, 2vw, 0.9375rem);
  line-height: 1.65;
  color: var(--text-secondary, #444);
  svg {
    font-size: 0.75rem;
    margin-top: 0.3rem;
    flex-shrink: 0;
  }
`;

const ResponsibilityIcon = styled(FaCheckCircle)`
  color: var(--text-primary, #000);
`;

const AchievementIcon = styled(FaTrophy)`
  color: var(--green, #43a047);
`;

/* ─── Data ────────────────────────────────────────────────────────────────── */

const experiences = [
  {
    period: '2024 - Present',
    role: 'Cloud Technologist',
    company: 'CloudZA',
    location: 'South Africa',
    type: 'Full-time',
    description: 'Architecting and implementing cloud-native solutions using AWS services. Leading the development of scalable web applications and microservices architecture. Optimizing infrastructure costs and improving deployment pipelines.',
    skills: ['AWS', 'React', 'Node.js', 'Docker', 'Terraform'],
    responsibilities: [
      'Design and implement cloud-native architectures on AWS for enterprise clients',
      'Lead the development of scalable web applications using React and Node.js',
      'Build and maintain CI/CD pipelines to automate testing and deployments',
      'Provision and manage infrastructure as code using Terraform modules',
      'Conduct code reviews and mentor junior team members on best practices',
      'Collaborate with clients to translate business requirements into technical solutions',
    ],
    achievements: [
      'Reduced infrastructure costs by 35% through rightsizing and Reserved Instance planning',
      'Cut deployment time from 45 minutes to under 8 minutes by automating CI/CD pipelines',
      'Improved application uptime to 99.9% with multi-AZ deployments and health checks',
      'Delivered 3 production-grade cloud migrations ahead of schedule',
    ],
  },
  {
    period: 'Dec 2023 - Dec 2024',
    role: 'Junior Cloud Technologist (Intern)',
    company: 'CloudZA',
    location: 'South Africa',
    type: 'Internship',
    description: 'Assisted in implementing and maintaining cloud infrastructure, contributed to AWS architecture documentation, and collaborated with senior technologists to optimize AWS solutions.',
    skills: ['AWS', 'Python', 'CloudFormation', 'S3', 'EC2'],
    responsibilities: [
      'Assisted senior engineers in deploying and configuring AWS services (EC2, S3, RDS)',
      'Wrote Python automation scripts to streamline routine infrastructure tasks',
      'Maintained and updated CloudFormation templates for consistent environment provisioning',
      'Contributed to internal documentation and architecture diagrams for client projects',
      'Participated in daily standups, sprint planning, and retrospectives',
    ],
    achievements: [
      'Automated a manual S3 data archiving process, saving ~4 hours of manual work per week',
      'Received a full-time offer at the end of the internship based on performance',
      'Built a CloudWatch dashboard that reduced incident detection time by 50%',
    ],
  },
];

const isCurrent = exp => /present/i.test(exp.period);

/* ─── Component ───────────────────────────────────────────────────────────── */

const Experience = () => {
  const [selectedExp, setSelectedExp] = useState(null);
  const reducedMotion = useReducedMotion();

  const closeModal = useCallback(() => setSelectedExp(null), []);

  return (
    <Section id="experience">
      <Container>
        <Heading
          initial={{ opacity: 0, y: reducedMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Experience
        </Heading>
        <Subtitle
          initial={{ opacity: 0, y: reducedMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Where I've worked and what I shipped along the way.
        </Subtitle>

        <Timeline>
          {experiences.map((exp, i) => (
            <Entry
              key={`${exp.role}-${exp.period}`}
              initial={{ opacity: 0, y: reducedMotion ? 0 : 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              viewport={{ once: true, margin: '-40px' }}
            >
              <Node $current={isCurrent(exp)} aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </Node>
              <ExperienceCard onClick={() => setSelectedExp(exp)}>
                <MetaRow>
                  <PeriodChip>{exp.period}</PeriodChip>
                  <TypeBadge>{exp.type}</TypeBadge>
                  {isCurrent(exp) && <CurrentBadge>Current</CurrentBadge>}
                </MetaRow>
                <Role>{exp.role}</Role>
                <CompanyRow>
                  <CompanyItem><FaBriefcase />{exp.company}</CompanyItem>
                  {exp.location && (
                    <CompanyItem><FaMapMarkerAlt />{exp.location}</CompanyItem>
                  )}
                </CompanyRow>
                <Description>{exp.description}</Description>
                <SkillTags>
                  {exp.skills.map(skill => (
                    <SkillTag key={skill}>{skill}</SkillTag>
                  ))}
                </SkillTags>
                <DetailsButton
                  type="button"
                  aria-label={`View details for ${exp.role} at ${exp.company}`}
                  onClick={e => { e.stopPropagation(); setSelectedExp(exp); }}
                >
                  View details <FaArrowRight />
                </DetailsButton>
              </ExperienceCard>
            </Entry>
          ))}
        </Timeline>
      </Container>

      {/* ── Modal ── */}
      <Modal
        isOpen={!!selectedExp}
        onClose={closeModal}
        labelledBy="experience-modal-title"
      >
        {selectedExp && (
          <>
            <ModalHeader>
              <ModalTitle id="experience-modal-title">{selectedExp.role}</ModalTitle>
              <ModalMeta>
                <TypeBadge>{selectedExp.type}</TypeBadge>
                <MetaItem>
                  <FaBriefcase />
                  {selectedExp.company}
                </MetaItem>
                {selectedExp.location && (
                  <MetaItem>
                    <FaMapMarkerAlt />
                    {selectedExp.location}
                  </MetaItem>
                )}
                <MetaItem>{selectedExp.period}</MetaItem>
              </ModalMeta>
            </ModalHeader>

            <ModalDescription>{selectedExp.description}</ModalDescription>

            <Divider />

            <ModalSection>
              <SectionLabel>Responsibilities</SectionLabel>
              <BulletList>
                {selectedExp.responsibilities.map((item, i) => (
                  <BulletItem key={i}>
                    <ResponsibilityIcon />
                    {item}
                  </BulletItem>
                ))}
              </BulletList>
            </ModalSection>

            {selectedExp.achievements?.length > 0 && (
              <>
                <Divider />
                <ModalSection>
                  <SectionLabel>Key Achievements</SectionLabel>
                  <BulletList>
                    {selectedExp.achievements.map((item, i) => (
                      <BulletItem key={i}>
                        <AchievementIcon />
                        {item}
                      </BulletItem>
                    ))}
                  </BulletList>
                </ModalSection>
              </>
            )}

            <Divider />

            <ModalSection>
              <SectionLabel>Technologies Used</SectionLabel>
              <ChipRow>
                {selectedExp.skills.map(s => (
                  <Chip key={s}>{s}</Chip>
                ))}
              </ChipRow>
            </ModalSection>
          </>
        )}
      </Modal>
    </Section>
  );
};

export default Experience;
