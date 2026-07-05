// Skills shown in the Skills section. Data lives here (like profile.js and
// caseStudies.js) so editing content never means editing a component.
//
// Deliberately no "proficiency %" or "N+ projects" numbers: they are
// unverifiable claims that invite skepticism. Each skill instead carries
// concrete "how I've used it" bullets, and — where something on this site or
// GitHub can back it up — a `proof` link. Only add a proof link when the
// target actually demonstrates the skill.

import {
  SiJavascript, SiReact, SiPython, SiNodedotjs, SiTypescript,
  SiDocker, SiKubernetes, SiTerraform, SiPostgresql, SiMongodb, SiGit,
} from 'react-icons/si';
import { FaAws, FaServer, FaCode, FaDatabase, FaTools } from 'react-icons/fa';
import profile from './profile';

const siteRepoUrl = `https://github.com/${profile.siteRepo}`;

export const skillCategories = [
  { id: 'all',      label: 'All',      icon: FaCode },
  { id: 'frontend', label: 'Frontend', icon: SiReact },
  { id: 'backend',  label: 'Backend',  icon: FaServer },
  { id: 'cloud',    label: 'Cloud',    icon: FaAws },
  { id: 'database', label: 'Database', icon: FaDatabase },
  { id: 'tools',    label: 'Tools',    icon: FaTools },
];

export const skillsData = [
  {
    id: 1,
    name: 'JavaScript',
    icon: SiJavascript,
    category: 'frontend',
    level: 'Expert',
    years: '5+ years',
    description: 'Modern ES6+ JavaScript, DOM manipulation, asynchronous programming, and functional programming concepts.',
    usageItems: [
      'Built single-page applications from scratch before adopting React',
      'Implemented complex async workflows using Promises, async/await, and event loops',
      'Created reusable utility libraries for data transformation and validation',
      'Wrote browser automation scripts and developer tooling',
      'Integrated third-party APIs and SDKs across multiple client projects',
    ],
    tools: ['Webpack', 'Babel', 'ESLint', 'Prettier', 'Jest', 'Vite'],
    proof: { label: 'This site is hand-built JavaScript — view the source', href: siteRepoUrl },
  },
  {
    id: 2,
    name: 'React',
    icon: SiReact,
    category: 'frontend',
    level: 'Expert',
    years: '4+ years',
    description: 'React hooks, context API, component lifecycle, state management with Redux, and modern React patterns.',
    usageItems: [
      'Architected large-scale SPAs with component-driven design and custom hooks',
      'Used Context API and Redux Toolkit to manage global application state',
      'Built accessible, reusable component libraries with Storybook documentation',
      'Optimised render performance with React.memo, useMemo, and useCallback',
      'Integrated React Query for server-state management and data fetching',
    ],
    tools: ['Redux Toolkit', 'React Query', 'Framer Motion', 'React Router', 'Storybook'],
    proof: { label: 'You are looking at a React app right now — view the source', href: siteRepoUrl },
  },
  {
    id: 3,
    name: 'TypeScript',
    icon: SiTypescript,
    category: 'frontend',
    level: 'Advanced',
    years: '3+ years',
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
    years: '4+ years',
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
    years: '3+ years',
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
    years: '3+ years',
    description: 'EC2, S3, Lambda, CloudFormation, RDS, API Gateway, and serverless architecture implementation.',
    usageItems: [
      'Designed multi-region, high-availability architectures on AWS',
      'Built serverless backends using Lambda, API Gateway, and DynamoDB',
      'Configured CI/CD pipelines with CodePipeline and CodeBuild',
      'Managed IAM roles, policies, and cross-account access strategies',
      'Set up CloudWatch dashboards and alarms for production observability',
    ],
    tools: ['Lambda', 'S3', 'ECS', 'RDS', 'CloudFormation', 'CloudWatch', 'IAM'],
    proof: { label: 'Case study: this site ships to S3 + CloudFront via OIDC', href: '#/case-studies' },
  },
  {
    id: 7,
    name: 'Docker',
    icon: SiDocker,
    category: 'cloud',
    level: 'Advanced',
    years: '3+ years',
    description: 'Containerisation, multi-stage builds, Docker Compose, and container orchestration strategies.',
    usageItems: [
      'Containerised full-stack applications for consistent dev and prod environments',
      'Wrote multi-stage Dockerfiles to minimise production image sizes',
      'Managed local multi-service environments with Docker Compose',
      'Published versioned images to Docker Hub and AWS ECR',
      'Debugged container networking and volume mount issues in production',
    ],
    tools: ['Docker Compose', 'Docker Hub', 'AWS ECR', 'Buildx', 'Dive'],
    proof: { label: 'Case study: CI/CD automation at CloudZA', href: '#/case-studies' },
  },
  {
    id: 8,
    name: 'Kubernetes',
    icon: SiKubernetes,
    category: 'cloud',
    level: 'Intermediate',
    years: '2+ years',
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
    years: '2+ years',
    description: 'Infrastructure as Code, modules, state management, and cloud resource provisioning.',
    usageItems: [
      'Provisioned complete AWS environments from scratch using Terraform modules',
      'Managed remote state in S3 with DynamoDB locking for team collaboration',
      'Wrote reusable modules for VPC, ECS, and RDS patterns across projects',
      'Integrated Terraform with CI/CD pipelines for automated infrastructure updates',
      'Refactored legacy click-ops infrastructure into reproducible IaC codebases',
    ],
    tools: ['Terraform Cloud', 'Terragrunt', 'tfsec', 'Infracost', 'AWS provider'],
    proof: { label: 'Case study: CI/CD automation at CloudZA', href: '#/case-studies' },
  },
  {
    id: 10,
    name: 'PostgreSQL',
    icon: SiPostgresql,
    category: 'database',
    level: 'Advanced',
    years: '4+ years',
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
    years: '3+ years',
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
    years: '5+ years',
    description: 'Version control, branching strategies, collaborative workflows, and advanced Git operations.',
    usageItems: [
      'Led teams using Git Flow and trunk-based development branching strategies',
      'Resolved complex merge conflicts during large feature integrations',
      'Used interactive rebase to clean up commit history before pull requests',
      'Configured Git hooks for pre-commit linting and commit message validation',
      'Set up protected branch rules and required code review workflows in GitHub',
    ],
    tools: ['GitHub', 'GitLab', 'Husky', 'Commitlint', 'GitHub Actions'],
    proof: { label: 'This site’s commit history and release automation', href: siteRepoUrl },
  },
];

const skills = { skillCategories, skillsData };
export default skills;
