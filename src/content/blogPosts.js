// Blog post previews shown in the Blog section. Every post is presented as
// "Coming Soon" until it is actually published — no fake links or read times.
// When a post goes live, add a real `link` URL here and update Blog.js to
// render published posts as anchors instead of the coming-soon modal.

import { FaCloud, FaCubes } from 'react-icons/fa';
import { SiTerraform } from 'react-icons/si';

export const blogPosts = [
  {
    id: 1,
    title: 'Building Scalable Microservices with AWS',
    excerpt: 'Exploring best practices for designing and deploying microservices architecture on AWS, including service mesh implementation and container orchestration strategies.',
    icon: FaCloud,
    tags: ['AWS', 'Microservices', 'Docker'],
  },
  {
    id: 2,
    title: 'Optimizing React Performance',
    excerpt: 'Deep dive into React performance optimization techniques, from memo and useMemo to code splitting and lazy loading strategies for modern web applications.',
    icon: FaCubes,
    tags: ['React', 'Performance', 'JavaScript'],
  },
  {
    id: 3,
    title: 'Infrastructure as Code with Terraform',
    excerpt: 'How to manage cloud infrastructure efficiently using Terraform, including modules, state management, and CI/CD integration for automated deployments.',
    icon: SiTerraform,
    tags: ['Terraform', 'IaC', 'DevOps'],
  },
];

export default blogPosts;
