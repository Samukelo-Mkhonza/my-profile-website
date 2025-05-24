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
  FaTools
} from 'react-icons/fa';

const Section = styled.section`
  padding: clamp(2rem, 5vw, 5rem) clamp(1rem, 5vw, 2rem);
  background: #ffffff;
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
  margin-bottom: clamp(1rem, 3vw, 2rem);
`;

const FilterTabs = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: clamp(2rem, 4vw, 3rem);
`;

const FilterTab = styled(motion.button)`
  background: ${props => props.$active ? '#000' : 'transparent'};
  color: ${props => props.$active ? '#fff' : '#666'};
  border: 2px solid #000;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: clamp(0.75rem, 2vw, 0.875rem);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: #000;
    color: #fff;
  }

  @media (max-width: 480px) {
    padding: 0.5rem 1rem;
    font-size: 0.75rem;
  }
`;

const SkillsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: clamp(1.5rem, 3vw, 2rem);
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const SkillCard = styled(motion.div)`
  background: #f7f7f7;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: clamp(1.5rem, 3vw, 2rem);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 16px 32px rgba(0, 0, 0, 0.15);
    border-color: #000;
  }

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #000, #333);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s ease;
  }

  &:hover:before {
    transform: scaleX(1);
  }
`;

const SkillHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const IconWrapper = styled(motion.div)`
  font-size: clamp(2rem, 4vw, 2.5rem);
  color: #000;
  transition: all 0.3s ease;
  
  ${SkillCard}:hover & {
    transform: scale(1.1);
    color: #333;
  }
`;

const SkillInfo = styled.div`
  flex: 1;
`;

const SkillName = styled.h3`
  font-size: clamp(1.125rem, 2.5vw, 1.25rem);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin: 0 0 0.25rem 0;
  color: #000;
`;

const SkillLevel = styled.span`
  font-size: clamp(0.75rem, 2vw, 0.875rem);
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 500;
`;

const SkillDescription = styled.p`
  font-size: clamp(0.875rem, 2vw, 0.95rem);
  line-height: 1.6;
  color: #333;
  margin-bottom: 1rem;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: #e0e0e0;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 1rem;
`;

const Progress = styled(motion.div)`
  height: 100%;
  background: linear-gradient(90deg, #000, #333);
  border-radius: 3px;
`;

const ExperienceYears = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
`;

const Years = styled.span`
  font-size: clamp(0.75rem, 2vw, 0.875rem);
  color: #666;
  font-weight: 500;
`;

const ProjectCount = styled.span`
  background: #000;
  color: #fff;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: clamp(0.7rem, 2vw, 0.8rem);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const skillCategories = [
  // { 
  //   id: 'all', 
  //   label: 'All Skills', 
  //   icon: FaCode 
  // },
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
    label: 'Cloud & DevOps', 
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
    activeFilter === 'all' || skill.category === activeFilter
  );

  return (
    <Section id="skills">
      <Container>
        <Heading>Skills & Technologies</Heading>
        
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
              {category.label}
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
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <SkillHeader>
                  <IconWrapper>
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
                
                <ProgressBar>
                  <Progress
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.proficiency}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  />
                </ProgressBar>
                
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