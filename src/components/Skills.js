import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SiJavascript, SiReact, SiPython, SiNodedotjs, SiTypescript,
  SiDocker, SiKubernetes, SiTerraform, SiPostgresql, SiMongodb, SiGit
} from 'react-icons/si';
import {
  FaAws, FaServer, FaCode, FaDatabase, FaTools,
  FaTimes, FaCheckCircle
} from 'react-icons/fa';
import TiltCard from './TiltCard';

/* ─── Layout ──────────────────────────────────────────────────────────────── */

const Section = styled.section`
  padding: clamp(3rem, 8vw, 6rem) clamp(1rem, 4vw, 2rem);
  background: var(--bg-primary, #ffffff);
  min-height: 100vh;
  min-height: 100dvh;
  position: relative;
  @media (max-width: 480px) { padding: clamp(2rem, 6vw, 3rem) clamp(0.75rem, 3vw, 1.5rem); min-height: auto; }
  @media (max-height: 600px) and (orientation: landscape) { min-height: auto; padding: 2rem; }
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
  @media (max-width: 480px) { font-size: clamp(1.5rem, 6vw, 2rem); letter-spacing: 0.05em; margin-bottom: clamp(1.5rem, 4vw, 2rem); }
  @media (max-width: 360px) { font-size: 1.375rem; &:after { width: 50px; height: 2px; bottom: -0.5rem; } }
`;

/* ─── Filter Tabs ─────────────────────────────────────────────────────────── */

const FilterTabs = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: clamp(0.5rem, 2vw, 1rem);
  margin-bottom: clamp(2rem, 4vw, 3rem);
  padding: 0 clamp(0.5rem, 2vw, 1rem);
  @media (max-width: 640px) {
    justify-content: flex-start;
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    -ms-overflow-style: none;
    padding-bottom: 0.5rem;
    margin-bottom: clamp(1.5rem, 4vw, 2rem);
    &::-webkit-scrollbar { display: none; }
  }
  @media (max-width: 360px) { gap: 0.375rem; }
`;

const FilterTab = styled(motion.button)`
  background: ${p => p.$active ? 'var(--accent, #000)' : 'transparent'};
  color: ${p => p.$active ? 'var(--accent-inverse, #fff)' : 'var(--text-secondary, #666)'};
  border: 2px solid var(--accent, #000);
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
  &:before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--accent, #000);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s ease;
    z-index: 0;
  }
  @media (hover: hover) {
    &:hover:not([disabled]) { color: var(--accent-inverse, #fff); &:before { transform: scaleX(1); } }
  }
  &:active { transform: scale(0.95); }
  svg, span { position: relative; z-index: 1; }
  svg { font-size: clamp(0.875rem, 2vw, 1.125rem); }
  @media (max-width: 480px) { padding: 0.625rem 1rem; font-size: 0.75rem; gap: 0.375rem; }
  @media (max-width: 360px) { padding: 0.5rem 0.75rem; font-size: 0.6875rem; letter-spacing: 0.03em; }
`;

/* ─── Grid & Cards ────────────────────────────────────────────────────────── */

const SkillsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr));
  gap: clamp(1.25rem, 3vw, 2rem);
  @media (max-width: 900px) { grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr)); }
  @media (max-width: 640px) { grid-template-columns: 1fr; gap: clamp(1rem, 3vw, 1.5rem); }
  @media (max-width: 360px) { gap: 0.875rem; }
`;

const SkillCard = styled(motion.div)`
  background: var(--skill-card-bg, #f8f9fa);
  border: 2px solid var(--border-card, #e9ecef);
  border-radius: 12px;
  padding: clamp(1.25rem, 3vw, 2rem);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  height: 100%;
  @media (hover: hover) {
    &:hover {
      box-shadow: 0 20px 40px rgba(0,0,0,0.15);
      border-color: var(--accent, #000);
      background: var(--bg-card, #fff);
    }
  }
  &:active { transform: scale(0.98); }
  &:before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 4px;
    background: linear-gradient(90deg, #000 0%, #666 100%);
    transform: translateY(-100%);
    transition: transform 0.3s ease;
  }
  @media (hover: hover) { &:hover:before { transform: translateY(0); } }
  @media (max-width: 480px) { padding: clamp(1rem, 4vw, 1.5rem); border-radius: 8px; }
  @media (max-width: 360px) { padding: 0.875rem; }
`;

const SkillHeader = styled.div`
  display: flex;
  align-items: center;
  gap: clamp(0.75rem, 2vw, 1rem);
  margin-bottom: clamp(0.75rem, 2vw, 1rem);
  @media (max-width: 360px) { gap: 0.625rem; margin-bottom: 0.625rem; }
`;

const IconWrapper = styled(motion.div)`
  font-size: clamp(2rem, 5vw, 2.5rem);
  color: var(--text-primary, #000);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: clamp(2rem, 5vw, 2.5rem);
  @media (hover: hover) { ${SkillCard}:hover & { transform: scale(1.15) rotate(5deg); color: #333; } }
  @media (max-width: 480px) { font-size: clamp(1.75rem, 6vw, 2.25rem); }
  @media (max-width: 360px) { font-size: 1.5rem; min-width: 1.5rem; }
`;

const SkillInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const SkillName = styled.h3`
  font-size: clamp(1rem, 2.5vw, 1.375rem);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 0.25rem 0;
  color: var(--text-primary, #000);
  line-height: 1.2;
  @media (max-width: 480px) { font-size: clamp(0.9375rem, 3vw, 1.125rem); }
  @media (max-width: 360px) { font-size: 0.875rem; letter-spacing: 0.02em; }
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
  @media (max-width: 360px) { font-size: 0.625rem; letter-spacing: 0.05em; padding: 0.125rem 0.375rem; }
`;

const SkillDescription = styled.p`
  font-size: clamp(0.8125rem, 2vw, 1rem);
  line-height: 1.7;
  color: #495057;
  margin-bottom: clamp(0.75rem, 2vw, 1rem);
  @media (max-width: 480px) { font-size: clamp(0.75rem, 2.5vw, 0.875rem); line-height: 1.6; }
  @media (max-width: 360px) { font-size: 0.75rem; margin-bottom: 0.625rem; line-height: 1.5; }
`;

const ProgressBarContainer = styled.div`
  margin-bottom: clamp(0.75rem, 2vw, 1rem);
  @media (max-width: 360px) { margin-bottom: 0.625rem; }
`;

const ProgressLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: clamp(0.6875rem, 1.5vw, 0.8125rem);
  color: #6c757d;
  font-weight: 600;
  @media (max-width: 360px) { font-size: 0.625rem; margin-bottom: 0.375rem; }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: clamp(6px, 1.5vw, 8px);
  background: var(--progress-bg, #e9ecef);
  border-radius: 4px;
  overflow: hidden;
  @media (max-width: 360px) { height: 5px; }
`;

const Progress = styled(motion.div)`
  height: 100%;
  background: linear-gradient(90deg, #000 0%, #495057 100%);
  border-radius: 4px;
  position: relative;
  &:after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    transform: translateX(-100%);
    animation: shimmer 2s infinite;
  }
  @keyframes shimmer { to { transform: translateX(100%); } }
`;

const ExperienceYears = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: clamp(0.5rem, 2vw, 0.75rem);
  margin-top: clamp(0.75rem, 2vw, 1rem);
  @media (max-width: 360px) { gap: 0.375rem; margin-top: 0.625rem; }
`;

const Years = styled.span`
  font-size: clamp(0.6875rem, 1.75vw, 0.875rem);
  color: #6c757d;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  @media (max-width: 360px) { font-size: 0.625rem; }
`;

const ProjectCount = styled.span`
  background: var(--accent, #000);
  color: var(--accent-inverse, #fff);
  padding: clamp(0.25rem, 1vw, 0.375rem) clamp(0.625rem, 1.5vw, 0.875rem);
  border-radius: 20px;
  font-size: clamp(0.625rem, 1.5vw, 0.8125rem);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: all 0.3s ease;
  @media (hover: hover) { ${SkillCard}:hover & { background: #333; transform: scale(1.05); } }
  @media (max-width: 360px) { font-size: 0.625rem; padding: 0.25rem 0.5rem; }
`;

const ClickHint = styled.span`
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-primary, #000);
  opacity: 0;
  transition: opacity 0.2s;
  ${SkillCard}:hover & { opacity: 1; }
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
  max-width: 580px;
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

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-right: 2.5rem;
`;

const ModalIcon = styled.div`
  font-size: 3rem;
  color: var(--text-primary, #000);
  display: flex;
  align-items: center;
  flex-shrink: 0;
`;

const ModalTitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

const ModalTitle = styled.h2`
  font-size: clamp(1.25rem, 4vw, 1.75rem);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-primary, #000);
  line-height: 1.1;
  margin: 0;
`;

const ModalMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const LevelBadge = styled.span`
  font-size: 0.75rem;
  color: #6c757d;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 600;
  background: #e9ecef;
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
`;

const YearsBadge = styled.span`
  font-size: 0.8rem;
  color: var(--text-secondary, #666);
  font-weight: 500;
`;

const ModalDescription = styled.p`
  font-size: clamp(0.875rem, 2vw, 1rem);
  line-height: 1.8;
  color: var(--text-secondary, #555);
  margin: 0;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid var(--border-card, #e0e0e0);
  margin: 0;
`;

const SectionLabel = styled.span`
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--text-secondary, #888);
`;

const ModalSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const UsageList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
`;

const UsageItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
  font-size: clamp(0.8125rem, 2vw, 0.9375rem);
  line-height: 1.6;
  color: var(--text-secondary, #444);
  svg {
    color: var(--text-primary, #000);
    font-size: 0.75rem;
    margin-top: 0.3rem;
    flex-shrink: 0;
  }
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

const ModalProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: var(--progress-bg, #e9ecef);
  border-radius: 4px;
  overflow: hidden;
`;

const ModalProgress = styled(motion.div)`
  height: 100%;
  background: linear-gradient(90deg, #000 0%, #495057 100%);
  border-radius: 4px;
`;

const ModalProgressLabel = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: var(--text-secondary, #666);
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

/* ─── Data ────────────────────────────────────────────────────────────────── */

const skillCategories = [
  { id: 'all',      label: 'All',      icon: FaCode },
  { id: 'frontend', label: 'Frontend', icon: SiReact },
  { id: 'backend',  label: 'Backend',  icon: FaServer },
  { id: 'cloud',    label: 'Cloud',    icon: FaAws },
  { id: 'database', label: 'Database', icon: FaDatabase },
  { id: 'tools',    label: 'Tools',    icon: FaTools },
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
    description: 'Modern ES6+ JavaScript, DOM manipulation, asynchronous programming, and functional programming concepts.',
    usageItems: [
      'Built single-page applications from scratch before adopting React',
      'Implemented complex async workflows using Promises, async/await, and event loops',
      'Created reusable utility libraries for data transformation and validation',
      'Wrote browser automation scripts and developer tooling',
      'Integrated third-party APIs and SDKs across multiple client projects',
    ],
    tools: ['Webpack', 'Babel', 'ESLint', 'Prettier', 'Jest', 'Vite'],
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
    description: 'React hooks, context API, component lifecycle, state management with Redux, and modern React patterns.',
    usageItems: [
      'Architected large-scale SPAs with component-driven design and custom hooks',
      'Used Context API and Redux Toolkit to manage global application state',
      'Built accessible, reusable component libraries with Storybook documentation',
      'Optimised render performance with React.memo, useMemo, and useCallback',
      'Integrated React Query for server-state management and data fetching',
    ],
    tools: ['Redux Toolkit', 'React Query', 'Framer Motion', 'React Router', 'Storybook'],
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
    description: 'Type-safe development, interfaces, generics, advanced types, and integration with React applications.',
    usageItems: [
      'Migrated existing JavaScript codebases to strict TypeScript for safer refactoring',
      'Designed shared type definitions consumed across frontend and backend services',
      'Used generics and conditional types to build flexible, reusable utility types',
      'Enforced API contract types with Zod schema validation at runtime boundaries',
      'Configured tsconfig paths and project references for monorepo setups',
    ],
    tools: ['Zod', 'ts-node', 'tRPC', 'TypeDoc'],
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
    description: 'RESTful APIs, Express.js, middleware development, authentication, and microservices architecture.',
    usageItems: [
      'Designed and deployed production REST APIs handling thousands of daily requests',
      'Built JWT and OAuth2 authentication middleware from first principles',
      'Created event-driven microservices communicating over message queues',
      'Implemented rate limiting, caching, and request logging middleware',
      'Developed CLI tools and background job processors using Node.js workers',
    ],
    tools: ['Express', 'Fastify', 'Passport.js', 'Bull', 'Winston', 'Nodemon'],
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
    description: 'Django, Flask, data analysis, automation scripts, and API development with modern Python practices.',
    usageItems: [
      'Built RESTful APIs with Django REST Framework and FastAPI',
      'Wrote automation and data-pipeline scripts for ETL processing',
      'Created serverless Lambda functions deployed on AWS',
      'Used Pandas and NumPy for data cleaning and exploratory analysis',
      'Scripted infrastructure tasks and deployment automation with Python',
    ],
    tools: ['Django', 'FastAPI', 'Flask', 'Pandas', 'Boto3', 'pytest'],
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
    description: 'EC2, S3, Lambda, CloudFormation, RDS, API Gateway, and serverless architecture implementation.',
    usageItems: [
      'Designed multi-region, high-availability architectures on AWS',
      'Built serverless backends using Lambda, API Gateway, and DynamoDB',
      'Configured CI/CD pipelines with CodePipeline and CodeBuild',
      'Managed IAM roles, policies, and cross-account access strategies',
      'Set up CloudWatch dashboards and alarms for production observability',
    ],
    tools: ['Lambda', 'S3', 'ECS', 'RDS', 'CloudFormation', 'CloudWatch', 'IAM'],
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
    description: 'Containerisation, multi-stage builds, Docker Compose, and container orchestration strategies.',
    usageItems: [
      'Containerised full-stack applications for consistent dev and prod environments',
      'Wrote multi-stage Dockerfiles to minimise production image sizes',
      'Managed local multi-service environments with Docker Compose',
      'Published versioned images to Docker Hub and AWS ECR',
      'Debugged container networking and volume mount issues in production',
    ],
    tools: ['Docker Compose', 'Docker Hub', 'AWS ECR', 'Buildx', 'Dive'],
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
    description: 'Pod management, services, deployments, ingress controllers, and cluster administration.',
    usageItems: [
      'Deployed and scaled containerised workloads on managed EKS clusters',
      'Configured Deployments, Services, and Ingress rules for production traffic',
      'Used Helm charts to manage application releases and rollbacks',
      'Set up Horizontal Pod Autoscaling based on CPU and custom metrics',
      'Investigated pod crashes and resource constraints using kubectl and logs',
    ],
    tools: ['kubectl', 'Helm', 'EKS', 'Lens', 'kube-proxy'],
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
    description: 'Infrastructure as Code, modules, state management, and cloud resource provisioning.',
    usageItems: [
      'Provisioned complete AWS environments from scratch using Terraform modules',
      'Managed remote state in S3 with DynamoDB locking for team collaboration',
      'Wrote reusable modules for VPC, ECS, and RDS patterns across projects',
      'Integrated Terraform with CI/CD pipelines for automated infrastructure updates',
      'Refactored legacy click-ops infrastructure into reproducible IaC codebases',
    ],
    tools: ['Terraform Cloud', 'Terragrunt', 'tfsec', 'Infracost', 'AWS provider'],
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
    description: 'Complex queries, indexing, performance optimisation, and database design principles.',
    usageItems: [
      'Designed normalised schemas and defined foreign key constraints for data integrity',
      'Wrote complex queries using CTEs, window functions, and lateral joins',
      'Analysed and optimised slow queries using EXPLAIN ANALYZE and pg_stat_statements',
      'Created partial and composite indexes to speed up high-traffic query paths',
      'Managed database migrations using Flyway and Alembic in production deployments',
    ],
    tools: ['pgAdmin', 'Flyway', 'Alembic', 'PostGIS', 'pg_stat_statements'],
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
    description: 'Document modelling, aggregation pipelines, indexing strategies, and NoSQL design patterns.',
    usageItems: [
      'Modelled document schemas to match read-heavy access patterns',
      'Built multi-stage aggregation pipelines for reporting and analytics features',
      'Created compound and text indexes to support full-text search queries',
      'Used MongoDB Atlas with VPC peering for secure cloud database hosting',
      'Implemented change streams to trigger real-time notifications on data updates',
    ],
    tools: ['Mongoose', 'MongoDB Atlas', 'Compass', 'mongosh', 'Atlas Search'],
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
    description: 'Version control, branching strategies, collaborative workflows, and advanced Git operations.',
    usageItems: [
      'Led teams using Git Flow and trunk-based development branching strategies',
      'Resolved complex merge conflicts during large feature integrations',
      'Used interactive rebase to clean up commit history before pull requests',
      'Configured Git hooks for pre-commit linting and commit message validation',
      'Set up protected branch rules and required code review workflows in GitHub',
    ],
    tools: ['GitHub', 'GitLab', 'Husky', 'Commitlint', 'GitHub Actions'],
  },
];

/* ─── Component ───────────────────────────────────────────────────────────── */

const Skills = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedSkill, setSelectedSkill] = useState(null);

  const closeModal = useCallback(() => setSelectedSkill(null), []);

  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') closeModal(); };
    if (selectedSkill) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [selectedSkill, closeModal]);

  const filteredSkills = activeFilter === 'all'
    ? skillsData
    : skillsData.filter(s => s.category === activeFilter);

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
          {skillCategories.map(cat => (
            <FilterTab
              key={cat.id}
              $active={activeFilter === cat.id}
              onClick={() => setActiveFilter(cat.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <cat.icon />
              <span>{cat.label}</span>
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
              <TiltCard key={skill.id}>
              <SkillCard
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: [0.4, 0, 0.2, 1] }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedSkill(skill)}
              >
                <SkillHeader>
                  <IconWrapper
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.2, type: 'spring', damping: 15 }}
                  >
                    <skill.icon />
                  </IconWrapper>
                  <SkillInfo>
                    <SkillName>{skill.name}</SkillName>
                    <SkillLevel>{skill.level}</SkillLevel>
                  </SkillInfo>
                </SkillHeader>

                <SkillDescription>{skill.description}</SkillDescription>

                <ProgressBarContainer>
                  <ProgressLabel>
                    <span>Proficiency</span>
                    <span>{skill.proficiency}%</span>
                  </ProgressLabel>
                  <ProgressBar>
                    <Progress
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.proficiency}%` }}
                      transition={{ duration: 1, delay: index * 0.1, ease: 'easeOut' }}
                      viewport={{ once: true, margin: '-50px' }}
                    />
                  </ProgressBar>
                </ProgressBarContainer>

                <ExperienceYears>
                  <Years>{skill.years} experience</Years>
                  <ProjectCount>{skill.projects}+ projects</ProjectCount>
                </ExperienceYears>

                <ClickHint>Click to see how I use it →</ClickHint>
              </SkillCard>
              </TiltCard>
            ))}
          </SkillsGrid>
        </AnimatePresence>
      </Container>

      {/* ── Modal ── */}
      <AnimatePresence>
        {selectedSkill && (
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

              <ModalHeader>
                <ModalIcon><selectedSkill.icon /></ModalIcon>
                <ModalTitleGroup>
                  <ModalTitle>{selectedSkill.name}</ModalTitle>
                  <ModalMeta>
                    <LevelBadge>{selectedSkill.level}</LevelBadge>
                    <YearsBadge>{selectedSkill.years}</YearsBadge>
                  </ModalMeta>
                </ModalTitleGroup>
              </ModalHeader>

              <ModalDescription>{selectedSkill.description}</ModalDescription>

              <ModalSection>
                <ModalProgressLabel>
                  <span>Proficiency</span>
                  <span>{selectedSkill.proficiency}%</span>
                </ModalProgressLabel>
                <ModalProgressBar>
                  <ModalProgress
                    initial={{ width: 0 }}
                    animate={{ width: `${selectedSkill.proficiency}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                  />
                </ModalProgressBar>
              </ModalSection>

              <Divider />

              <ModalSection>
                <SectionLabel>How I've used it</SectionLabel>
                <UsageList>
                  {selectedSkill.usageItems.map((item, i) => (
                    <UsageItem key={i}>
                      <FaCheckCircle />
                      {item}
                    </UsageItem>
                  ))}
                </UsageList>
              </ModalSection>

              {selectedSkill.tools?.length > 0 && (
                <>
                  <Divider />
                  <ModalSection>
                    <SectionLabel>Tools & Libraries</SectionLabel>
                    <ToolsRow>
                      {selectedSkill.tools.map(t => (
                        <ToolChip key={t}>{t}</ToolChip>
                      ))}
                    </ToolsRow>
                  </ModalSection>
                </>
              )}
            </Modal>
          </Overlay>
        )}
      </AnimatePresence>
    </Section>
  );
};

export default Skills;
