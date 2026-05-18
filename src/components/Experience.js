import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaTimes, FaCheckCircle, FaTrophy, FaMapMarkerAlt, FaBriefcase
} from 'react-icons/fa';

/* ─── Layout ──────────────────────────────────────────────────────────────── */

const Section = styled.section`
  padding: clamp(3rem, 8vw, 6rem) clamp(1rem, 5vw, 2rem);
  background: var(--bg-primary, #ffffff);
  position: relative;
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
`;

/* ─── Timeline ────────────────────────────────────────────────────────────── */

const Timeline = styled.div`
  position: relative;
  &:before {
    content: '';
    position: absolute;
    left: 50%;
    top: 0;
    width: 3px;
    height: 100%;
    background: var(--border-card, #ddd);
    transform: translateX(-50%);
  }
  @media (max-width: 768px) {
    &:before { left: 1.5rem; transform: none; }
  }
`;

const Entry = styled(motion.div)`
  position: relative;
  width: 50%;
  margin-bottom: clamp(2rem, 4vw, 3rem);
  ${({ align }) =>
    align === 'left'
      ? 'left: 0; text-align: right; padding-right: 3rem;'
      : 'left: 50%; text-align: left; padding-left: 3rem;'}
  @media (max-width: 768px) {
    width: 100%;
    left: 0 !important;
    text-align: left !important;
    padding: 0 0 0 3rem !important;
  }
`;

const ExperienceCard = styled(motion.div)`
  background: var(--bg-card, #ffffff);
  border: 1px solid var(--border-card, #e0e0e0);
  border-radius: 8px;
  padding: clamp(1.5rem, 3vw, 2rem);
  position: relative;
  transition: all 0.3s ease;
  cursor: pointer;
  overflow: hidden;
  &:before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--text-primary, #000), var(--text-secondary, #666));
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s ease;
  }
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px var(--shadow-color, rgba(0,0,0,0.15));
    border-color: var(--text-primary, #000);
    &:before { transform: scaleX(1); }
  }
`;

const Circle = styled.div`
  position: absolute;
  top: 2rem;
  width: 16px;
  height: 16px;
  background: var(--text-primary, #000);
  border-radius: 50%;
  border: 3px solid var(--bg-primary, #fff);
  box-shadow: 0 0 0 3px var(--border-card, #ddd);
  z-index: 10;
  ${({ align }) => (align === 'left' ? 'right: -8px;' : 'left: -8px;')}
  @media (max-width: 768px) { left: -8px !important; right: auto !important; }
`;

const Period = styled.time`
  font-size: clamp(0.75rem, 2vw, 0.875rem);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-secondary, #666);
  display: block;
  margin-bottom: 0.75rem;
  font-weight: 500;
`;

const Role = styled.h3`
  font-size: clamp(1.25rem, 3vw, 1.5rem);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 0.25rem;
  line-height: 1.3;
  color: var(--text-primary, #000);
`;

const Company = styled.h4`
  font-size: clamp(1rem, 2.5vw, 1.125rem);
  font-weight: 500;
  color: var(--text-secondary, #333);
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const Description = styled.p`
  font-size: clamp(0.875rem, 2.5vw, 1rem);
  line-height: 1.6;
  color: var(--text-secondary, #333);
  margin-bottom: 1.5rem;
`;

const SkillTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  @media (max-width: 768px) { justify-content: flex-start; }
  ${({ align }) => align === 'left' && `@media (min-width: 769px) { justify-content: flex-end; }`}
`;

const SkillTag = styled.span`
  background: var(--tag-bg, #f0f0f0);
  color: var(--text-secondary, #333);
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: clamp(0.75rem, 2vw, 0.875rem);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: all 0.3s ease;
  ${ExperienceCard}:hover & { background: var(--text-primary, #000); color: var(--accent-inverse, #fff); }
`;

const ClickHint = styled.span`
  display: block;
  margin-top: 1rem;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-primary, #000);
  opacity: 0;
  transition: opacity 0.2s;
  ${ExperienceCard}:hover & { opacity: 1; }
`;

/* ─── Modal ───────────────────────────────────────────────────────────────── */

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const Modal = styled(motion.div)`
  background: var(--bg-card, #fff);
  border: 1px solid var(--border-card, #e0e0e0);
  border-radius: 16px;
  width: 100%;
  max-width: 640px;
  max-height: 90vh;
  overflow-y: auto;
  padding: clamp(1.5rem, 5vw, 2.5rem);
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const CloseButton = styled(motion.button)`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: var(--tag-bg, #f0f0f0);
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--text-secondary, #666);
  font-size: 0.875rem;
  transition: background 0.2s, color 0.2s;
  &:hover { background: var(--text-primary, #000); color: var(--accent-inverse, #fff); }
`;

const ModalHeaderBlock = styled.div`
  padding-right: 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ModalRole = styled.h2`
  font-size: clamp(1.25rem, 4vw, 1.75rem);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-primary, #000);
  line-height: 1.2;
  margin: 0;
`;

const ModalMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
`;

const MetaItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.85rem;
  color: var(--text-secondary, #555);
  font-weight: 500;
  svg { font-size: 0.75rem; color: var(--text-secondary, #888); }
`;

const TypeBadge = styled.span`
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  background: var(--text-primary, #000);
  color: var(--accent-inverse, #fff);
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid var(--border-card, #e0e0e0);
  margin: 0;
`;

const ModalSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const SectionLabel = styled.span`
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--text-secondary, #888);
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
  color: #b8860b;
`;

const ToolsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const ToolChip = styled.span`
  background: var(--tag-bg, #f0f0f0);
  color: var(--text-secondary, #444);
  padding: 0.3rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
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

/* ─── Component ───────────────────────────────────────────────────────────── */

const Experience = () => {
  const [selectedExp, setSelectedExp] = useState(null);

  const closeModal = useCallback(() => setSelectedExp(null), []);

  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') closeModal(); };
    if (selectedExp) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [selectedExp, closeModal]);

  return (
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
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  onClick={() => setSelectedExp(exp)}
                >
                  <Period>{exp.period}</Period>
                  <Role>{exp.role}</Role>
                  <Company>{exp.company}</Company>
                  <Description>{exp.description}</Description>
                  <SkillTags align={alignment}>
                    {exp.skills.map((skill, idx) => (
                      <SkillTag key={idx}>{skill}</SkillTag>
                    ))}
                  </SkillTags>
                  <ClickHint>Click to see more details →</ClickHint>
                </ExperienceCard>
              </Entry>
            );
          })}
        </Timeline>
      </Container>

      {/* ── Modal ── */}
      <AnimatePresence>
        {selectedExp && (
          <Overlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <Modal
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.96 }}
              transition={{ type: 'spring', damping: 26, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
            >
              <CloseButton
                onClick={closeModal}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Close"
              >
                <FaTimes />
              </CloseButton>

              <ModalHeaderBlock>
                <ModalRole>{selectedExp.role}</ModalRole>
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
              </ModalHeaderBlock>

              <p style={{ fontSize: '0.9375rem', lineHeight: 1.8, color: 'var(--text-secondary, #555)', margin: 0 }}>
                {selectedExp.description}
              </p>

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
                <ToolsRow>
                  {selectedExp.skills.map(s => (
                    <ToolChip key={s}>{s}</ToolChip>
                  ))}
                </ToolsRow>
              </ModalSection>
            </Modal>
          </Overlay>
        )}
      </AnimatePresence>
    </Section>
  );
};

export default Experience;
