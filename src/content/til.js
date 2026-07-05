// TIL / digital garden — short, dated, tagged notes. Adding one is a single
// object at the TOP of this array (newest first). Keep them small; a couple of
// sentences is plenty. See CONTENT.md.
//
// Shape: { date: 'YYYY-MM-DD', title, body, tags: [] }

export const tilNotes = [
  {
    date: '2026-07-05',
    title: 'GitHub OIDC deploys need zero stored AWS keys',
    body:
      "GitHub Actions can exchange a short-lived OIDC token for AWS credentials by assuming an IAM role whose trust policy is scoped to one repo and environment. No long-lived access keys in secrets at all — this site's deploy workflow works that way.",
    tags: ['aws', 'github-actions', 'security'],
  },
  {
    date: '2026-07-04',
    title: 'One CRA build cannot serve two URL roots',
    body:
      'GitHub Pages serves this site from /my-profile-website/ while CloudFront serves it from /. The fix: no "homepage" field in package.json, and each deploy workflow sets its own PUBLIC_URL at build time. Two builds, one codebase.',
    tags: ['react', 'deploy', 'github-pages'],
  },
  {
    date: '2026-07-04',
    title: 'CRA inlines REACT_APP_* variables at build time',
    body:
      'Create React App bakes REACT_APP_* environment variables into the JS bundle during the build — they are not runtime configuration. Anything put there ships to every visitor, so only publishable values belong in them.',
    tags: ['react', 'ci'],
  },
];

export default tilNotes;
