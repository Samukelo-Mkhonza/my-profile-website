# Security Policy

## Supported versions

This is a personal portfolio site deployed continuously from `main` — only
the latest deployed version is supported. There are no LTS or maintained
older releases.

## Reporting a vulnerability

If you find a security issue (e.g. exposed secrets, an XSS in the
interactive terminal/playground, a dependency with a known CVE that affects
this site), please **do not open a public issue**. Instead report it
privately:

- Email [Mkhonzasenzo525@gmail.com](mailto:Mkhonzasenzo525@gmail.com) with a
  description and reproduction steps, or
- Use [GitHub's private vulnerability reporting](https://github.com/Samukelo-Mkhonza/my-profile-website/security/advisories/new)
  for this repo.

Expect an initial response within a few days. Once a fix is confirmed, it
will ship via the normal CI/CD pipeline described in
[.github/DEPLOYMENT.md](.github/DEPLOYMENT.md), and you'll be credited in the
fix's changelog entry unless you'd prefer otherwise.

## Scope

In scope: the site's source code, build/deploy workflows, and dependencies.
Out of scope: third-party services the site links to or embeds (GitHub API,
EmailJS) — report those to the respective provider.
