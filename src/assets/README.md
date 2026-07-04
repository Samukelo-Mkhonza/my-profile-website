# Image assets

Placeholder images live here until real photos are added. To swap in a real
image, drop the file in this folder using the name below and update the import
in the listed component (or keep the same filename + extension and no code
change is needed).

| File | Used in | Replace with |
| --- | --- | --- |
| `profile-photo-placeholder.svg` | `src/components/About.js` | A square headshot (≥ 400×400), e.g. `profile-photo.jpg` |
| `project-card-placeholder.svg` | `src/components/Projects.js` | Only shown if a repo's GitHub social-preview image fails to load |

Project cards automatically use each repository's GitHub OpenGraph preview
image (`https://opengraph.githubassets.com/...`), so they need no manual
screenshots. To customise a repo's card image, set a social preview image on
the repo itself (GitHub → repo Settings → Social preview).
