// /now page — what I'm focused on this month. Edit this one file to update
// the page (see CONTENT.md). Keep `updated` in YYYY-MM-DD so visitors can see
// how fresh it is.

export const now = {
  updated: '2026-07-05',
  intro:
    "A snapshot of what has my attention right now — inspired by nownow.com's /now page movement.",
  items: [
    {
      title: 'Cloud work at CloudZA',
      detail:
        'Architecting cloud-native solutions on AWS — scalable web applications, microservices, and cost-optimised infrastructure.',
    },
    {
      title: 'Building this site in public',
      detail:
        'Adding interactive features to this portfolio: a terminal, a code playground, and living pages like this one. Follow along on the changelog page.',
    },
    {
      // TODO: replace with what you're actually learning/reading this month.
      title: 'Currently learning',
      detail: 'TODO — add your current learning focus here (src/content/now.js).',
      todo: true,
    },
  ],
};

export default now;
