// /uses page — tools and stack. Grouped into sections; each item is
// { name, note }. Items flagged `todo: true` render as placeholders until
// filled in (see CONTENT.md). Only list things you actually use.

export const uses = {
  updated: '2026-07-05',
  intro: 'The tools, services, and stack I reach for. Inspired by uses.tech.',
  sections: [
    {
      title: 'Cloud & Infrastructure',
      items: [
        { name: 'AWS', note: 'EC2, S3, RDS, CloudFront, CloudWatch — my daily platform at CloudZA' },
        { name: 'Terraform', note: 'Infrastructure as code for client projects' },
        { name: 'CloudFormation', note: 'Template-driven environment provisioning' },
        { name: 'Docker', note: 'Containerised builds and local parity' },
        { name: 'GitHub Actions', note: 'CI/CD — this site ships through it (OIDC, no stored keys)' },
      ],
    },
    {
      title: 'Languages & Frameworks',
      items: [
        { name: 'JavaScript / React', note: 'Front-end work, including this site (React 19)' },
        { name: 'Node.js', note: 'APIs and services' },
        { name: 'Python', note: 'Automation and infrastructure scripting' },
      ],
    },
    {
      title: 'This Website',
      items: [
        { name: 'Create React App', note: 'Build tooling' },
        { name: 'styled-components', note: 'Scoped styling with theme variables' },
        { name: 'Framer Motion', note: 'Entrance and scroll animations' },
        { name: 'three.js', note: 'The 3D scene behind every section' },
        { name: 'JetBrains Mono', note: 'The typeface everywhere you look' },
        { name: 'GitHub Pages + S3/CloudFront', note: 'Dual static hosting targets' },
      ],
    },
    {
      title: 'Hardware & Desk',
      items: [
        // TODO: fill in your actual machine, monitor, keyboard, etc.
        { name: 'TODO', note: 'Add your hardware in src/content/uses.js', todo: true },
      ],
    },
    {
      title: 'Editor & Terminal',
      items: [
        // TODO: fill in your actual editor, theme, terminal, shell.
        { name: 'TODO', note: 'Add your editor/terminal setup in src/content/uses.js', todo: true },
      ],
    },
  ],
};

export default uses;
