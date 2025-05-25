import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  SiJavascript, 
  SiReact, 
  SiPython, 
  SiNodedotjs,
  SiTypescript,
  SiDocker,
  SiKubernetes,
  SiTerraform,
  SiPostgresql,
  SiMongodb,
  SiRedis,
  SiGit
} from 'react-icons/si';
import { 
  FaAws, 
  FaServer,
  FaCode,
  FaDatabase,
  FaTools,
  FaTimes
} from 'react-icons/fa';

const Section = styled.section`
  padding: clamp(3rem, 8vw, 6rem) clamp(1rem, 4vw, 2rem);
  background: #ffffff;
  min-height: 100vh;
  min-height: 100dvh;
  position: relative;

  /* Small mobile */
  @media (max-width: 480px) {
    padding: clamp(2rem, 6vw, 3rem) clamp(0.75rem, 3vw, 1.5rem);
    min-height: auto;
  }

  /* Landscape mobile */
  @media (max-height: 600px) and (orientation: landscape) {
    min-height: auto;
    padding: 2rem;
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
  margin-bottom: clamp(2rem, 4vw, 3rem);
  color: #000;
  position: relative;
  
  /* Add underline decoration */
  &:after {
    content: '';
    position: absolute;
    bottom: -0.75rem;
    left: 50%;
    transform: translateX(-50%);
    width: clamp(60px, 10vw, 100px);
    height: 3px;
    background: #000;
  }

  /* Small mobile */
  @media (max-width: 480px) {
    font-size: clamp(1.5rem, 6vw, 2rem);
    letter-spacing: 0.05em;
    margin-bottom: clamp(1.5rem, 4vw, 2rem);
  }

  /* Very small screens */
  @media (max-width: 360px) {
    font-size: 1.375rem;
    
    &:after {
      width: 50px;
      height: 2px;
      bottom: -0.5rem;
    }
  }
`;

const FilterTabs = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: clamp(0.5rem, 2vw, 1rem);
  margin-bottom: clamp(2rem, 4vw, 3rem);
  padding: 0 clamp(0.5rem, 2vw, 1rem);

  /* Small mobile - horizontal scroll */
  @media (max-width: 640px) {
    justify-content: flex-start;
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    -ms-overflow-style: none;
    padding-bottom: 0.5rem;
    margin-bottom: clamp(1.5rem, 4vw, 2rem);
    
    &::-webkit-scrollbar {
      display: none;
    }
    
    /* Add scroll indicator shadow */
    &:after {
      content: '';
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      width: 2rem;
      background: linear-gradient(to right, transparent, white);
      pointer-events: none;
    }
  }

  /* Very small screens */
  @media (max-width: 360px) {
    gap: 0.375rem;
  }
`;

const FilterTab = styled(motion.button)`
  background: ${props => props.$active ? '#000' : 'transparent'};
  color: ${props => props.$active ? '#fff' : '#666'};
  border: 2px solid #000;
  padding: clamp(0.625rem, 2vw, 0.875rem) clamp(1rem, 3vw, 1.5rem);
  border-radius: 8px;
  font-size: clamp(0.75rem, 1.75vw, 0.9375rem);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
  flex-shrink: 0;
  min-height: 44px;
  position: relative;
  overflow: hidden;

  /* Add hover effect overlay */
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #000;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s ease;
    z-index: 0;
  }

  @media (hover: hover) {
    &:hover:not([disabled]) {
      color: #fff;
      
      &:before {
        transform: scaleX(1);
      }
    }
  }

  &:active {
    transform: scale(0.95);
  }

  /* Icon and text positioning */
  svg, span {
    position: relative;
    z-index: 1;
  }

  svg {
    font-size: clamp(0.875rem, 2vw, 1.125rem);
  }

  /* Small mobile */
  @media (max-width: 480px) {
    padding: 0.625rem 1rem;
    font-size: 0.75rem;
    gap: 0.375rem;
  }

  /* Very small screens */
  @media (max-width: 360px) {
    padding: 0.5rem 0.75rem;
    font-size: 0.6875rem;
    letter-spacing: 0.03em;
  }
`;

const SkillsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr));
  gap: clamp(1.25rem, 3vw, 2rem);
  
  /* Tablets */
  @media (max-width: 900px) {
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
  }
  
  /* Small mobile */
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: clamp(1rem, 3vw, 1.5rem);
  }

  /* Very small screens */
  @media (max-width: 360px) {
    gap: 0.875rem;
  }
`;

const SkillCard = styled(motion.div)`
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: clamp(1.25rem, 3vw, 2rem);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  
  @media (hover: hover) {
    &:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
      border-color: #000;
      background: #fff;
    }
  }

  &:active {
    transform: scale(0.98);
  }

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #000 0%, #666 100%);
    transform: translateY(-100%);
    transition: transform 0.3s ease;
  }

  @media (hover: hover) {
    &:hover:before {
      transform: translateY(0);
    }
  }

  /* Small mobile */
  @media (max-width: 480px) {
    padding: clamp(1rem, 4vw, 1.5rem);
    border-radius: 8px;
  }

  /* Very small screens */
  @media (max-width: 360px) {
    padding: 0.875rem;
  }
`;

const SkillHeader = styled.div`
  display: flex;
  align-items: center;
  gap: clamp(0.75rem, 2vw, 1rem);
  margin-bottom: clamp(0.75rem, 2vw, 1rem);

  @media (max-width: 360px) {
    gap: 0.625rem;
    margin-bottom: 0.625rem;
  }
`;

const IconWrapper = styled(motion.div)`
  font-size: clamp(2rem, 5vw, 2.5rem);
  color: #000;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: clamp(2rem, 5vw, 2.5rem);
  
  @media (hover: hover) {
    ${SkillCard}:hover & {
      transform: scale(1.15) rotate(5deg);
      color: #333;
    }
  }

  /* Small mobile */
  @media (max-width: 480px) {
    font-size: clamp(1.75rem, 6vw, 2.25rem);
  }

  /* Very small screens */
  @media (max-width: 360px) {
    font-size: 1.5rem;
    min-width: 1.5rem;
  }
`;

const SkillInfo = styled.div`
  flex: 1;
  min-width: 0; /* Prevent text overflow */
`;

const SkillName = styled.h3`
  font-size: clamp(1rem, 2.5vw, 1.375rem);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 0.25rem 0;
  color: #000;
  line-height: 1.2;

  /* Small mobile */
  @media (max-width: 480px) {
    font-size: clamp(0.9375rem, 3vw, 1.125rem);
  }

  /* Very small screens */
  @media (max-width: 360px) {
    font-size: 0.875rem;
    letter-spacing: 0.02em;
  }
`;

const SkillLevel = styled.span`
  font-size: clamp(0.6875rem, 1.75vw, 0.875rem);
  color: #6c757d;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 600;
  display: inline-block;
  background: #e9ecef;
  padding: 0.125rem 0.5rem;
  border-radius: 4px;

  @media (max-width: 360px) {
    font-size: 0.625rem;
    letter-spacing: 0.05em;
    padding: 0.125rem 0.375rem;
  }
`;

const SkillDescription = styled.p`
  font-size: clamp(0.8125rem, 2vw, 1rem);
  line-height: 1.7;
  color: #495057;
  margin-bottom: clamp(0.75rem, 2vw, 1rem);

  /* Small mobile */
  @media (max-width: 480px) {
    font-size: clamp(0.75rem, 2.5vw, 0.875rem);
    line-height: 1.6;
  }

  /* Very small screens */
  @media (max-width: 360px) {
    font-size: 0.75rem;
    margin-bottom: 0.625rem;
    line-height: 1.5;
  }
`;

const ProgressBarContainer = styled.div`
  margin-bottom: clamp(0.75rem, 2vw, 1rem);

  @media (max-width: 360px) {
    margin-bottom: 0.625rem;
  }
`;

const ProgressLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: clamp(0.6875rem, 1.5vw, 0.8125rem);
  color: #6c757d;
  font-weight: 600;

  @media (max-width: 360px) {
    font-size: 0.625rem;
    margin-bottom: 0.375rem;
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: clamp(6px, 1.5vw, 8px);
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
  position: relative;

  @media (max-width: 360px) {
    height: 5px;
  }
`;

const Progress = styled(motion.div)`
  height: 100%;
  background: linear-gradient(90deg, #000 0%, #495057 100%);
  border-radius: 4px;
  position: relative;
  
  /* Add shimmer effect */
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.3),
      transparent
    );
    transform: translateX(-100%);
    animation: shimmer 2s infinite;
  }
  
  @keyframes shimmer {
    to {
      transform: translateX(100%);
    }
  }
`;

const ExperienceYears = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: clamp(0.5rem, 2vw, 0.75rem);
  margin-top: clamp(0.75rem, 2vw, 1rem);

  @media (max-width: 360px) {
    gap: 0.375rem;
    margin-top: 0.625rem;
  }
`;

const Years = styled.span`
  font-size: clamp(0.6875rem, 1.75vw, 0.875rem);
  color: #6c757d;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.25rem;

  @media (max-width: 360px) {
    font-size: 0.625rem;
  }
`;

const ProjectCount = styled.span`
  background: #000;
  color: #fff;
  padding: clamp(0.25rem, 1vw, 0.375rem) clamp(0.625rem, 1.5vw, 0.875rem);
  border-radius: 20px;
  font-size: clamp(0.625rem, 1.5vw, 0.8125rem);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: all 0.3s ease;
  
  @media (hover: hover) {
    ${SkillCard}:hover & {
      background: #333;
      transform: scale(1.05);
    }
  }

  @media (max-width: 360px) {
    font-size: 0.625rem;
    padding: 0.25rem 0.5rem;
  }
`;

// Skill categories with updated structure
const skillCategories = [
  { 
    id: 'frontend', 
    label: 'Frontend', 
    icon: SiReact 
  },
  { 
    id: 'backend', 
    label: 'Backend', 
    icon: FaServer 
  },
  { 
    id: 'cloud', 
    label: 'Cloud', 
    icon: FaAws 
  },
  { 
    id: 'database', 
    label: 'Database', 
    icon: FaDatabase 
  },
  { 
    id: 'tools', 
    label: 'Tools', 
    icon: FaTools 
  }
];

// Skills data
const skillsData = [
  {
    id: 1,
    name: 'JavaScript',
    icon: SiJavascript,
    category: 'frontend',
    level: 'Expert',
    proficiency: 95,
    years: '5+ years',
    projects: 25,
    description: 'Modern ES6+ JavaScript, DOM manipulation, asynchronous programming, and functional programming concepts.'
  },
  {
    id: 2,
    name: 'React',
    icon: SiReact,
    category: 'frontend',
    level: 'Expert',
    proficiency: 90,
    years: '4+ years',
    projects: 20,
    description: 'React hooks, context API, component lifecycle, state management with Redux, and modern React patterns.'
  },
  {
    id: 3,
    name: 'TypeScript',
    icon: SiTypescript,
    category: 'frontend',
    level: 'Advanced',
    proficiency: 85,
    years: '3+ years',
    projects: 15,
    description: 'Type-safe development, interfaces, generics, advanced types, and integration with React applications.'
  },
  {
    id: 4,
    name: 'Node.js',
    icon: SiNodedotjs,
    category: 'backend',
    level: 'Expert',
    proficiency: 88,
    years: '4+ years',
    projects: 18,
    description: 'RESTful APIs, Express.js, middleware development, authentication, and microservices architecture.'
  },
  {
    id: 5,
    name: 'Python',
    icon: SiPython,
    category: 'backend',
    level: 'Advanced',
    proficiency: 82,
    years: '3+ years',
    projects: 12,
    description: 'Django, Flask, data analysis, automation scripts, and API development with modern Python practices.'
  },
  {
    id: 6,
    name: 'AWS',
    icon: FaAws,
    category: 'cloud',
    level: 'Expert',
    proficiency: 92,
    years: '3+ years',
    projects: 16,
    description: 'EC2, S3, Lambda, CloudFormation, RDS, API Gateway, and serverless architecture implementation.'
  },
  {
    id: 7,
    name: 'Docker',
    icon: SiDocker,
    category: 'cloud',
    level: 'Advanced',
    proficiency: 85,
    years: '3+ years',
    projects: 14,
    description: 'Containerization, multi-stage builds, Docker Compose, and container orchestration strategies.'
  },
  {
    id: 8,
    name: 'Kubernetes',
    icon: SiKubernetes,
    category: 'cloud',
    level: 'Intermediate',
    proficiency: 75,
    years: '2+ years',
    projects: 8,
    description: 'Pod management, services, deployments, ingress controllers, and cluster administration.'
  },
  {
    id: 9,
    name: 'Terraform',
    icon: SiTerraform,
    category: 'cloud',
    level: 'Advanced',
    proficiency: 80,
    years: '2+ years',
    projects: 10,
    description: 'Infrastructure as Code, modules, state management, and cloud resource provisioning.'
  },
  {
    id: 10,
    name: 'PostgreSQL',
    icon: SiPostgresql,
    category: 'database',
    level: 'Advanced',
    proficiency: 83,
    years: '4+ years',
    projects: 15,
    description: 'Complex queries, indexing, performance optimization, and database design principles.'
  },
  {
    id: 11,
    name: 'MongoDB',
    icon: SiMongodb,
    category: 'database',
    level: 'Advanced',
    proficiency: 78,
    years: '3+ years',
    projects: 12,
    description: 'Document modeling, aggregation pipelines, indexing strategies, and NoSQL design patterns.'
  },
  {
    id: 12,
    name: 'Git',
    icon: SiGit,
    category: 'tools',
    level: 'Expert',
    proficiency: 95,
    years: '5+ years',
    projects: 30,
    description: 'Version control, branching strategies, collaborative workflows, and advanced Git operations.'
  }
];

const Skills = () => {
  const [activeFilter, setActiveFilter] = useState('frontend');

  const filteredSkills = skillsData.filter(skill => 
    skill.category === activeFilter
  );

  return (
    <Section id="skills">
      <Container>
        <Heading
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Skills & Technologies
        </Heading>
        
        <FilterTabs>
          {skillCategories.map(category => (
            <FilterTab
              key={category.id}
              $active={activeFilter === category.id}
              onClick={() => setActiveFilter(category.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <category.icon />
              <span>{category.label}</span>
            </FilterTab>
          ))}
        </FilterTabs>

        <AnimatePresence mode="wait">
          <SkillsGrid
            key={activeFilter}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {filteredSkills.map((skill, index) => (
              <SkillCard
                key={skill.id}
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
                <SkillHeader>
                  <IconWrapper
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                      delay: index * 0.1 + 0.2,
                      type: "spring",
                      damping: 15
                    }}
                  >
                    <skill.icon />
                  </IconWrapper>
                  <SkillInfo>
                    <SkillName>{skill.name}</SkillName>
                    <SkillLevel>{skill.level}</SkillLevel>
                  </SkillInfo>
                </SkillHeader>
                
                <SkillDescription>
                  {skill.description}
                </SkillDescription>
                
                <ProgressBarContainer>
                  <ProgressLabel>
                    <span>Proficiency</span>
                    <span>{skill.proficiency}%</span>
                  </ProgressLabel>
                  <ProgressBar>
                    <Progress
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.proficiency}%` }}
                      transition={{ 
                        duration: 1, 
                        delay: index * 0.1,
                        ease: "easeOut"
                      }}
                      viewport={{ once: true, margin: "-50px" }}
                    />
                  </ProgressBar>
                </ProgressBarContainer>
                
                <ExperienceYears>
                  <Years>{skill.years} experience</Years>
                  <ProjectCount>{skill.projects}+ projects</ProjectCount>
                </ExperienceYears>
              </SkillCard>
            ))}
          </SkillsGrid>
        </AnimatePresence>
      </Container>
    </Section>
  );
};

export default Skills;