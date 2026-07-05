// Case-study writeups — problem → architecture decision → outcome → what I'd
// change. Add a study by appending an object here (see CONTENT.md).
//
// Facts must stay grounded: everything below comes from this repo itself or
// from the experience highlights already published on the site. Items marked
// TODO need real detail before they carry weight with a reader.

export const caseStudies = [
  {
    slug: 'dual-target-portfolio-delivery',
    title: 'This Website: One Build Pipeline, Two Hosting Targets',
    context: 'Personal project — the site you are reading',
    stack: ['Create React App', 'GitHub Actions', 'S3 + CloudFront', 'GitHub Pages', 'IAM OIDC'],
    problem:
      'Ship a single React codebase to two static hosts at once — GitHub Pages (served from a /my-profile-website/ subpath) and S3 + CloudFront (served from the root) — without stored AWS keys and without one target breaking the other’s asset paths.',
    decision:
      'Keep package.json free of a "homepage" field and let each deploy workflow set its own PUBLIC_URL at build time, so each target gets a build with correct asset roots. Gate CI into lint → test → build, then fan out to two independent deploy workflows that re-build the exact commit CI validated. Authenticate to AWS with a GitHub OIDC-assumed IAM role scoped to this one repo’s production environment — least privilege: sync one bucket, invalidate one distribution.',
    outcome:
      'Every merge to main ships to both targets automatically. Hashed assets are cached as immutable for a year while index.html revalidates on every request, so deploys are visible immediately. There are no long-lived cloud credentials anywhere in the repo or its secrets.',
    whatIdChange:
      'The S3 bucket and CloudFront distribution still come from a hand-written CloudFormation stack that predates the Actions pipeline; I would move them to Terraform alongside the IAM role so the whole delivery path is reviewable in one place.',
  },
  {
    slug: 'cloudza-cicd-automation',
    title: 'CI/CD Automation at CloudZA',
    context: 'CloudZA — Cloud Technologist',
    stack: ['AWS', 'Docker', 'Terraform', 'CI/CD'],
    problem:
      'Client deployments were slow and manual — a release took around 45 minutes of hands-on work, which made shipping risky and infrequent.',
    decision:
      'Automate the pipeline end to end: containerised builds, infrastructure provisioned as code with Terraform modules, and multi-AZ deployments fronted by health checks so a bad release rolls over instead of falling over.',
    outcome:
      'Deployment time dropped from 45 minutes to under 8, application uptime improved to 99.9%, and rightsizing plus Reserved Instance planning cut infrastructure costs by 35%.',
    whatIdChange:
      'TODO — add the honest retrospective: what broke along the way, and what you would design differently now (src/content/caseStudies.js).',
    todo: true,
  },
];

export default caseStudies;
