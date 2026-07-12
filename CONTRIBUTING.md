# Contributing

This is Samukelo Mkhonza's personal portfolio site, so scope and design
decisions stay with the owner. That said, bug reports, typo fixes, and small
improvements are genuinely welcome.

## Before opening a PR

- For anything bigger than a typo/bug fix, open an issue first to check the
  change fits — saves you writing code that won't get merged.
- Keep PRs focused on one change.

## Local setup

```bash
git clone https://github.com/Samukelo-Mkhonza/my-profile-website.git
cd my-profile-website
npm ci
npm start
```

## Before submitting

```bash
npx eslint src --ext .js --max-warnings=0   # same lint check CI runs
npm test -- --watchAll=false                # jest + React Testing Library
npm run build                               # production build
```

CI runs the same three checks on every PR — a green run is required to merge.

## Content-only changes

If you're only editing site copy (bio, `/now`, `/uses`, TIL notes, case
studies), you don't need to touch components — see [CONTENT.md](CONTENT.md)
for where each piece of content lives.

## Commit messages

This repo uses [Conventional Commits](https://www.conventionalcommits.org/)
(`feat:`, `fix:`, `chore:`, `docs:`, `perf:`, …) — `release-please` uses them
to generate the changelog and version bumps, so please follow the format.
