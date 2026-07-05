# Editing Site Content

Everything the interactive pages and the terminal display lives in
[`src/content/`](src/content/) — one plain JavaScript file per concern, no CMS,
no build step beyond the normal one. Edit the file, commit, push; CI ships it.

| What | File | Shape |
|---|---|---|
| Identity, bio, contact | [`src/content/profile.js`](src/content/profile.js) | one object |
| `/now` page (monthly focus) | [`src/content/now.js`](src/content/now.js) | `updated` + `items[]` |
| `/uses` page (tools & stack) | [`src/content/uses.js`](src/content/uses.js) | `sections[]` of `items[]` |
| TIL / digital garden | [`src/content/til.js`](src/content/til.js) | `notes[]`, newest first |
| Case studies | [`src/content/caseStudies.js`](src/content/caseStudies.js) | `studies[]` |

The main sections (About, Experience, Skills, Blog) still keep their content
inside their components, as before. `profile.js` mirrors the facts they state —
if you change your role, location, or email, update both places.

## Adding a TIL note

Open `src/content/til.js` and add one object **at the top** of the array:

```js
{
  date: '2026-07-12',
  title: 'Something I learned today',
  body: 'Two or three sentences. That is the whole point — keep it small.',
  tags: ['aws'],
},
```

## Updating /now

Edit `src/content/now.js`: bump `updated`, rewrite `items`. Anything with
`todo: true` renders with a "to be filled in" badge — remove the flag once the
entry is real.

## Adding a case study

Append an object to `src/content/caseStudies.js` with `slug`, `title`,
`context`, `stack`, and the four narrative fields: `problem`, `decision`,
`outcome`, `whatIdChange`. Keep claims factual — these pages exist to be read
by people who will ask follow-up questions.

## Items marked TODO

Some entries shipped as clearly-marked placeholders rather than invented
facts (hardware in `uses.js`, the "currently learning" item in `now.js`, the
retrospective in the CloudZA case study). Search `src/content/` for `TODO` and
replace them with the real thing.

## Where content is reused

- The **terminal** (`Ctrl+`` ` `` or the ❯_ button) reads `profile`, `now`,
  `uses`, and `til` — its answers update automatically.
- The **changelog page** and the terminal's `ls projects` pull live from the
  GitHub API; there is nothing to edit.
