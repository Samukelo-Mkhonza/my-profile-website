# Profile Website

[![CI](https://github.com/Samukelo-Mkhonza/my-profile-website/actions/workflows/ci.yml/badge.svg)](https://github.com/Samukelo-Mkhonza/my-profile-website/actions/workflows/ci.yml)
[![Deploy](https://github.com/Samukelo-Mkhonza/my-profile-website/actions/workflows/deploy.yml/badge.svg)](https://github.com/Samukelo-Mkhonza/my-profile-website/actions/workflows/deploy.yml)
[![Pages](https://github.com/Samukelo-Mkhonza/my-profile-website/actions/workflows/pages.yml/badge.svg)](https://github.com/Samukelo-Mkhonza/my-profile-website/actions/workflows/pages.yml)

A sleek, production-ready React portfolio site for **Samukelo Mkhonza**, Software Developer, showcasing skills, experience, and contact links. Styled with JetBrains Mono font, animated with Framer Motion, and scoped via Styled Components.

## Features

- **Modern Design**: Monospace typography and minimalist palette inspired by Oklama
- **Responsive Layout**: Mobile-first and fluid across devices
- **Smooth Animations**: Entrance and scroll-triggered effects via Framer Motion
- **Component-based**: Reusable React components with Styled Components
- **Easy Deployment**: Build with Create React App and host on Netlify, Vercel, GitHub Pages, etc.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Samukelo-Mkhonza/my-profile-website.git
   cd my-profile-website
   ```

2. Install dependencies:
   ```bash
   npm ci
   ```

3. Start the dev server:
   ```bash
   npm start
   ```

## Testing & linting

```bash
npm test                              # jest + React Testing Library
npx eslint src --ext .js              # same lint check CI runs
npm run build                         # production build
```

## CI/CD

Every push and pull request to `main` runs the **CI** workflow (lint → tests →
production build). When CI succeeds on `main`, two deploy workflows run in
parallel: **Deploy** ships the build to S3 and invalidates CloudFront
(authenticating to AWS via OIDC — no stored access keys), and **Pages**
publishes to [GitHub Pages](https://samukelo-mkhonza.github.io/my-profile-website/).
Each target skips itself until its switch is flipped (`AWS_DEPLOY_ROLE_ARN` /
`PAGES_ENABLED` repository variables).

Setup instructions (GitHub secrets/variables, the IAM role, and how to retire
the old CodePipeline stack) are in [.github/DEPLOYMENT.md](.github/DEPLOYMENT.md).