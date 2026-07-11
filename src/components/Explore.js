import styled from 'styled-components';
import { motion, useReducedMotion } from 'framer-motion';
import {
  FaTerminal,
  FaCalendarCheck,
  FaToolbox,
  FaSeedling,
  FaBookOpen,
  FaCodeBranch,
  FaFlask,
  FaArrowRight,
} from 'react-icons/fa';
import { now } from '../content/now';
import { uses } from '../content/uses';
import { tilNotes } from '../content/til';
import { caseStudies } from '../content/caseStudies';

// Main-page section that surfaces the interactive pages and terminal, so they
// are part of the site itself rather than hidden behind footer links. Each
// card is a plain anchor to a #/route hash, which SitePages resolves.

const Section = styled.section`
  padding: clamp(3rem, 8vw, 6rem) clamp(1rem, 4vw, 2rem);
  background: var(--bg-secondary-glass, rgba(247, 247, 247, 0.86));
  position: relative;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: clamp(60px, 10vw, 100px);
    height: 3px;
    background: var(--text-primary, #000);
  }

  @media (max-width: 480px) {
    padding: clamp(2rem, 6vw, 3rem) clamp(0.75rem, 3vw, 1.5rem);
  }

  @media (max-height: 600px) and (orientation: landscape) {
    padding: 2rem;
  }
`;

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;

  @media (max-width: 480px) {
    padding: 0 0.25rem;
  }
`;

const Heading = styled(motion.h2)`
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  text-align: center;
  margin-bottom: clamp(1rem, 2vw, 1.5rem);
  color: var(--text-primary, #000);
  position: relative;
  &:after {
    content: '';
    position: absolute;
    bottom: -0.75rem;
    left: 50%;
    transform: translateX(-50%);
    width: clamp(60px, 10vw, 100px);
    height: 3px;
    background: var(--text-primary, #000);
  }
  @media (max-width: 480px) { font-size: clamp(1.5rem, 6vw, 2rem); }
`;

const Subtitle = styled(motion.p)`
  text-align: center;
  color: var(--text-secondary, #666);
  font-size: clamp(0.875rem, 2vw, 1.0625rem);
  line-height: 1.6;
  max-width: 600px;
  margin: clamp(1.5rem, 3vw, 2rem) auto clamp(2.5rem, 5vw, 3.5rem);
  @media (max-width: 480px) { font-size: clamp(0.8125rem, 2.5vw, 0.9375rem); }
`;

/* Bento layout: a 6-track grid where card spans produce 2 / 3 / 2 rows on
   desktop (no orphan row with 7 cards), pairs on tablet with the Terminal
   card leading full-width, and a single column of compact horizontal rows
   on phones so the section stays short. */
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: clamp(1rem, 2.5vw, 1.5rem);

  @media (max-width: 1023px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 0.875rem;
  }
`;

const Card = styled(motion.a)`
  grid-column: span ${(p) => p.$span};
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  background: var(--bg-card, #fffcf5);
  border: var(--border-w, 2px) solid var(--border-card, #111);
  border-radius: var(--radius-card, 14px);
  box-shadow: var(--shadow-hard, 4px 4px 0 #111);
  padding: clamp(1.25rem, 2.5vw, 1.75rem);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: transform 0.25s ease, box-shadow 0.25s ease;

  /* Accent bar: always on for featured cards, revealed on hover elsewhere */
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 5px;
    background: var(--accent-orange, #ee5a24);
    transform: scaleX(${(p) => (p.$featured ? 1 : 0)});
    transform-origin: left;
    transition: transform 0.3s ease;
  }

  @media (hover: hover) {
    &:hover {
      transform: translate(-3px, -3px);
      box-shadow: var(--shadow-hard-lg, 6px 6px 0 #111);
      background: var(--bg-card-hover, #fff);
      &:before { transform: scaleX(1); }
      [data-arrow] { transform: translateX(4px); }
    }
  }

  &:focus-visible {
    outline: 3px solid var(--accent-orange, #ee5a24);
    outline-offset: 3px;
    &:before { transform: scaleX(1); }
  }

  &:active {
    transform: translate(2px, 2px);
    box-shadow: var(--shadow-hard-sm, 3px 3px 0 #111);
  }

  @media (max-width: 1023px) {
    grid-column: span ${(p) => p.$tabletSpan || 1};
  }

  @media (max-width: 640px) {
    grid-column: span 1;
    flex-direction: row;
    align-items: flex-start;
    gap: 0.875rem;
    padding: 1rem;
  }
`;

const CardIndex = styled.span`
  position: absolute;
  top: 1rem;
  right: 1.125rem;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--text-muted, #999);

  @media (max-width: 640px) {
    display: none;
  }
`;

const IconChip = styled.div`
  width: ${(p) => (p.$featured ? 'clamp(3rem, 5vw, 3.5rem)' : 'clamp(2.625rem, 4vw, 3rem)')};
  height: ${(p) => (p.$featured ? 'clamp(3rem, 5vw, 3.5rem)' : 'clamp(2.625rem, 4vw, 3rem)')};
  display: grid;
  place-items: center;
  flex-shrink: 0;
  background: ${(p) => (p.$featured ? 'var(--accent-orange, #ee5a24)' : 'var(--tag-bg, #f2e9d8)')};
  color: ${(p) => (p.$featured ? '#fffcf5' : 'var(--text-primary, #111)')};
  border: var(--border-w, 2px) solid var(--border-card, #111);
  border-radius: var(--radius-sm, 10px);
  box-shadow: var(--shadow-hard-sm, 3px 3px 0 #111);
  font-size: ${(p) => (p.$featured ? '1.375rem' : '1.125rem')};

  @media (max-width: 640px) {
    width: 2.5rem;
    height: 2.5rem;
    font-size: 1rem;
  }
`;

const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
  min-width: 0;
`;

const CardTitle = styled.h3`
  font-size: ${(p) => (p.$featured ? 'clamp(1.125rem, 2.5vw, 1.3125rem)' : 'clamp(1rem, 2vw, 1.0625rem)')};
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-primary, #000);
`;

const CardDescription = styled.p`
  font-size: clamp(0.8125rem, 1.8vw, 0.875rem);
  line-height: 1.6;
  color: var(--text-secondary, #666);
  flex: 1;

  /* Phones: clamp to two lines so every row stays compact */
  @media (max-width: 640px) {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    flex: initial;
  }
`;

const CardFooter = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  border-top: 1px solid var(--border-color, rgba(0, 0, 0, 0.1));
  padding-top: 0.75rem;
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted, #999);

  svg {
    flex-shrink: 0;
    color: var(--accent-orange, #ee5a24);
    transition: transform 0.25s ease;
  }

  @media (max-width: 640px) {
    padding-top: 0.5rem;
  }
`;

const LiveText = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

// Live snippets come straight from the content files, so the section stays
// current without any extra editing.
const realUses = uses.sections
  .flatMap((s) => s.items)
  .filter((i) => !i.todo)
  .slice(0, 3)
  .map((i) => i.name);

// span: desktop tracks out of 6 (rows of 2 / 3 / 2 cards); tabletSpan: out
// of 2, so only the Terminal card leads full-width and the remaining six
// cards pair up cleanly. featured: flagship interactive pages.
const cards = [
  {
    href: '#/terminal',
    icon: FaTerminal,
    title: 'Terminal',
    description:
      'A working command line for this site — whoami, ls projects (live from GitHub), and one or two undocumented commands.',
    live: 'Ctrl + ` opens it anywhere',
    span: 3,
    tabletSpan: 2,
    featured: true,
  },
  {
    href: '#/playground',
    icon: FaFlask,
    title: 'Playground',
    description:
      'Write and run JavaScript right here in the browser, inside a locked-down sandbox. No server involved.',
    live: 'Sandboxed · no network',
    span: 3,
    featured: true,
  },
  {
    href: '#/now',
    icon: FaCalendarCheck,
    title: 'Now',
    description: 'What has my attention this month — work, this site, and what I am learning.',
    live: `Updated ${now.updated}`,
    span: 2,
  },
  {
    href: '#/uses',
    icon: FaToolbox,
    title: 'Uses',
    description: 'The cloud stack, languages, and tools I actually reach for.',
    live: `${realUses.join(' · ')} …`,
    span: 2,
  },
  {
    href: '#/til',
    icon: FaSeedling,
    title: 'Today I Learned',
    description: 'A digital garden of short, dated notes — small lessons written the day I learn them.',
    live: `Latest: ${tilNotes[0].title}`,
    span: 2,
  },
  {
    href: '#/case-studies',
    icon: FaBookOpen,
    title: 'Case Studies',
    description:
      'Problem → architecture decision → outcome → what I would change. The honest version.',
    live: `${caseStudies.length} writeups`,
    span: 3,
  },
  {
    href: '#/changelog',
    icon: FaCodeBranch,
    title: 'Changelog',
    description:
      'This site is built in public. Its real commit history, pulled live from GitHub.',
    live: 'Live from the GitHub API',
    span: 3,
  },
];

const Explore = () => {
  const reducedMotion = useReducedMotion();

  // Reduced-motion users get content in place with no scroll-in offsets.
  const reveal = (delay) =>
    reducedMotion
      ? { initial: { opacity: 1 } }
      : {
          initial: { opacity: 0, y: 24 },
          whileInView: { opacity: 1, y: 0 },
          transition: { duration: 0.5, delay },
          viewport: { once: true },
        };

  return (
    <Section id="explore">
      <Container>
        <Heading {...reveal(0)}>Explore</Heading>
        <Subtitle {...reveal(0.1)}>
          The interactive side of this site — living pages and tools, not just a portfolio to
          scroll past.
        </Subtitle>
        <Grid>
          {cards.map((card, index) => (
            <Card
              key={card.href}
              href={card.href}
              aria-label={`Open ${card.title}`}
              $span={card.span}
              $tabletSpan={card.tabletSpan}
              $featured={card.featured}
              {...reveal(index * 0.06)}
            >
              <CardIndex aria-hidden="true">{String(index + 1).padStart(2, '0')}</CardIndex>
              <IconChip aria-hidden="true" $featured={card.featured}>
                <card.icon />
              </IconChip>
              <CardBody>
                <CardTitle $featured={card.featured}>{card.title}</CardTitle>
                <CardDescription>{card.description}</CardDescription>
                <CardFooter>
                  <LiveText>{card.live}</LiveText>
                  <FaArrowRight data-arrow aria-hidden="true" />
                </CardFooter>
              </CardBody>
            </Card>
          ))}
        </Grid>
      </Container>
    </Section>
  );
};

export default Explore;
