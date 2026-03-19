import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaGithub
} from 'react-icons/fa';
import {
  SiReact,
  SiNodedotjs,
  SiPython,
  SiDocker,
  SiTerraform,
  SiPostgresql,
  SiMongodb,
  SiTypescript
} from 'react-icons/si';

const Section = styled.section`
  padding: clamp(3rem, 8vw, 6rem) clamp(1rem, 4vw, 2rem);
  background: var(--bg-secondary, #f7f7f7);
  position: relative;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: clamp(60px, 10vw, 100px);
    height: 3px;
    background: var(--text-primary, #000);
  }
`;

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 clamp(0.5rem, 2vw, 1rem);
`;

const Heading = styled(motion.h2)`
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 700;
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

  @media (max-width: 480px) {
    font-size: clamp(1.5rem, 6vw, 2rem);
  }
`;

const Subtitle = styled(motion.p)`
  text-align: center;
  color: var(--text-secondary, #666);
  font-size: clamp(0.875rem, 2vw, 1.0625rem);
  line-height: 1.6;
  max-width: 600px;
  margin: clamp(1.5rem, 3vw, 2rem) auto clamp(2.5rem, 5vw, 3.5rem);

  @media (max-width: 480px) {
    font-size: clamp(0.8125rem, 2.5vw, 0.9375rem);
  }
`;

const FilterTabs = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: clamp(0.5rem, 2vw, 0.75rem);
  margin-bottom: clamp(2rem, 4vw, 3rem);

  @media (max-width: 640px) {
    gap: 0.375rem;
  }
`;

const FilterTab = styled(motion.button)`
  background: ${props => props.$active ? 'var(--accent, #000)' : 'transparent'};
  color: ${props => props.$active ? 'var(--accent-inverse, #fff)' : 'var(--text-secondary, #666)'};
  border: 2px solid var(--accent, #000);
  padding: clamp(0.5rem, 1.5vw, 0.75rem) clamp(0.875rem, 2vw, 1.25rem);
  border-radius: 8px;
  font-size: clamp(0.75rem, 1.5vw, 0.875rem);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 44px;

  @media (hover: hover) {
    &:hover {
      background: var(--accent, #000);
      color: var(--accent-inverse, #fff);
    }
  }

  &:active {
    transform: scale(0.95);
  }
`;

const ProjectsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 350px), 1fr));
  gap: clamp(1.5rem, 3vw, 2rem);

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const ProjectCard = styled(motion.div)`
  background: var(--bg-card, #ffffff);
  border: 1px solid var(--border-card, #e0e0e0);
  border-radius: 12px;
  padding: clamp(1.5rem, 3vw, 2rem);
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, var(--text-primary, #000) 0%, var(--text-secondary, #666) 100%);
    transform: translateY(-100%);
    transition: transform 0.3s ease;
  }

  @media (hover: hover) {
    &:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 40px var(--shadow-color, rgba(0, 0, 0, 0.15));
      border-color: var(--text-primary, #000);

      &:before {
        transform: translateY(0);
      }
    }
  }

  &:active {
    transform: scale(0.98);
  }

  @media (max-width: 480px) {
    padding: clamp(1.25rem, 4vw, 1.5rem);
    border-radius: 8px;
  }
`;

const ProjectCategory = styled.span`
  display: inline-block;
  font-size: clamp(0.6875rem, 1.5vw, 0.8125rem);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--accent-inverse, #fff);
  background: var(--accent, #000);
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  margin-bottom: clamp(0.75rem, 2vw, 1rem);
`;

const ProjectTitle = styled.h3`
  font-size: clamp(1.125rem, 2.5vw, 1.5rem);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-primary, #000);
  margin-bottom: clamp(0.5rem, 1.5vw, 0.75rem);
  line-height: 1.2;
`;

const ProjectDescription = styled.p`
  font-size: clamp(0.8125rem, 2vw, 0.9375rem);
  line-height: 1.7;
  color: var(--text-secondary, #666);
  margin-bottom: clamp(1rem, 2vw, 1.5rem);
`;

const TechStack = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: clamp(1rem, 2vw, 1.5rem);
`;

const TechTag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  background: var(--tag-bg, #f0f0f0);
  color: var(--text-secondary, #333);
  padding: 0.25rem 0.625rem;
  border-radius: 4px;
  font-size: clamp(0.6875rem, 1.5vw, 0.8125rem);
  font-weight: 500;
  transition: all 0.3s ease;

  svg {
    font-size: 0.75rem;
  }

  ${ProjectCard}:hover & {
    background: var(--text-primary, #000);
    color: var(--accent-inverse, #fff);
  }
`;

const ProjectLinks = styled.div`
  display: flex;
  gap: 1rem;
  padding-top: clamp(0.75rem, 2vw, 1rem);
  border-top: 1px solid var(--border-card, #e0e0e0);
`;

const ProjectLink = styled(motion.a)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: clamp(0.75rem, 1.75vw, 0.875rem);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-secondary, #666);
  text-decoration: none;
  transition: color 0.3s ease;
  padding: 0.25rem 0;

  @media (hover: hover) {
    &:hover {
      color: var(--text-primary, #000);
    }
  }

  svg {
    font-size: clamp(0.875rem, 2vw, 1rem);
  }
`;

const projectCategories = [
  { id: 'all', label: 'All' },
  { id: 'cloud', label: 'Cloud' },
  { id: 'web', label: 'Web App' },
  { id: 'api', label: 'API' },
];

const projectsData = [
  {
    id: 1,
    title: 'Cloud Infrastructure Platform',
    category: 'cloud',
    description: 'Automated AWS infrastructure provisioning platform using Terraform modules. Supports multi-region deployments with built-in monitoring and cost optimization.',
    tech: [
      { name: 'Terraform', icon: SiTerraform },
      { name: 'Python', icon: SiPython },
      { name: 'Docker', icon: SiDocker },
    ],
    github: 'https://github.com/Samukelo-Mkhonza',
    featured: true,
  },
  {
    id: 2,
    title: 'Portfolio Website',
    category: 'web',
    description: 'Modern, responsive portfolio website built with React and Framer Motion. Features dark/light theme, smooth animations, and interactive elements.',
    tech: [
      { name: 'React', icon: SiReact },
      { name: 'TypeScript', icon: SiTypescript },
      { name: 'Node.js', icon: SiNodedotjs },
    ],
    github: 'https://github.com/Samukelo-Mkhonza',
    featured: true,
  },
  {
    id: 3,
    title: 'Serverless REST API',
    category: 'api',
    description: 'Scalable serverless API built on AWS Lambda and API Gateway. Handles authentication, CRUD operations, and real-time data processing with DynamoDB.',
    tech: [
      { name: 'Node.js', icon: SiNodedotjs },
      { name: 'Python', icon: SiPython },
      { name: 'PostgreSQL', icon: SiPostgresql },
    ],
    github: 'https://github.com/Samukelo-Mkhonza',
    featured: false,
  },
  {
    id: 4,
    title: 'Container Orchestration System',
    category: 'cloud',
    description: 'Docker-based microservices deployment system with automated scaling, health checks, and rolling updates for production environments.',
    tech: [
      { name: 'Docker', icon: SiDocker },
      { name: 'Node.js', icon: SiNodedotjs },
      { name: 'MongoDB', icon: SiMongodb },
    ],
    github: 'https://github.com/Samukelo-Mkhonza',
    featured: false,
  },
  {
    id: 5,
    title: 'Real-time Dashboard',
    category: 'web',
    description: 'Interactive monitoring dashboard with real-time data visualization, WebSocket connections, and responsive charts for cloud resource tracking.',
    tech: [
      { name: 'React', icon: SiReact },
      { name: 'Node.js', icon: SiNodedotjs },
      { name: 'PostgreSQL', icon: SiPostgresql },
    ],
    github: 'https://github.com/Samukelo-Mkhonza',
    featured: false,
  },
  {
    id: 6,
    title: 'Authentication Microservice',
    category: 'api',
    description: 'Secure JWT-based authentication service with OAuth2 integration, role-based access control, and session management for distributed systems.',
    tech: [
      { name: 'Python', icon: SiPython },
      { name: 'Docker', icon: SiDocker },
      { name: 'PostgreSQL', icon: SiPostgresql },
    ],
    github: 'https://github.com/Samukelo-Mkhonza',
    featured: false,
  },
];

const Projects = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredProjects = activeFilter === 'all'
    ? projectsData
    : projectsData.filter(p => p.category === activeFilter);

  return (
    <Section id="projects">
      <Container>
        <Heading
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Projects
        </Heading>

        <Subtitle
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
        >
          A selection of projects showcasing cloud architecture, full-stack development, and modern web technologies.
        </Subtitle>

        <FilterTabs>
          {projectCategories.map(cat => (
            <FilterTab
              key={cat.id}
              $active={activeFilter === cat.id}
              onClick={() => setActiveFilter(cat.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {cat.label}
            </FilterTab>
          ))}
        </FilterTabs>

        <AnimatePresence mode="wait">
          <ProjectsGrid
            key={activeFilter}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {filteredProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: [0.4, 0, 0.2, 1]
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ProjectCategory>
                  {project.category === 'cloud' ? 'Cloud' : project.category === 'web' ? 'Web App' : 'API'}
                </ProjectCategory>
                <ProjectTitle>{project.title}</ProjectTitle>
                <ProjectDescription>{project.description}</ProjectDescription>

                <TechStack>
                  {project.tech.map((t, idx) => (
                    <TechTag key={idx}>
                      <t.icon />
                      {t.name}
                    </TechTag>
                  ))}
                </TechStack>

                <ProjectLinks>
                  <ProjectLink
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ x: 4 }}
                  >
                    <FaGithub />
                    Source
                  </ProjectLink>
                </ProjectLinks>
              </ProjectCard>
            ))}
          </ProjectsGrid>
        </AnimatePresence>
      </Container>
    </Section>
  );
};

export default Projects;
