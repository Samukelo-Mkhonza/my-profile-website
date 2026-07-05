import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
  FaTerminal,
  FaCalendarCheck,
  FaToolbox,
  FaSeedling,
  FaBookOpen,
  FaCodeBranch,
  FaFlask,
} from 'react-icons/fa';
import { now } from '../content/now';
import { uses } from '../content/uses';
import { tilNotes } from '../content/til';
import { caseStudies } from '../content/caseStudies';

// Main-page section that surfaces the interactive pages and terminal, so they
// are part of the site itself rather than hidden behind footer links. Each
// card is a plain anchor to a #/route hash, which SitePages resolves.

const Section = styled.section`
  padding: clamp(3rem, 8vw, 6rem) clamp(1rem, 5vw, 2rem);
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
`;

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const Heading = styled.h2`
  font-size: clamp(1.75rem, 6vw, 2.5rem);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  text-align: center;
  margin-bottom: 1rem;
  color: var(--text-primary, #000);
`;

const Subtitle = styled.p`
  text-align: center;
  font-size: clamp(0.875rem, 2vw, 1rem);
  color: var(--text-secondary, #666);
  max-width: 560px;
  margin: 0 auto clamp(2rem, 4vw, 3rem);
  line-height: 1.7;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: clamp(1.25rem, 3vw, 2rem);
`;

const Card = styled(motion.a)`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  background: var(--bg-card, #ffffff);
  border: 1px solid var(--border-card, #e0e0e0);
  border-radius: 8px;
  padding: clamp(1.5rem, 3vw, 2rem);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, var(--text-primary, #000), var(--text-secondary, #333));
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s ease;
  }

  &:hover,
  &:focus-visible {
    transform: translateY(-6px);
    box-shadow: 0 16px 32px var(--shadow-color, rgba(0, 0, 0, 0.15));
    border-color: var(--text-primary, #000);

    &:before {
      transform: scaleX(1);
    }
  }
`;

const CardIcon = styled.div`
  font-size: clamp(1.5rem, 3vw, 1.75rem);
  color: var(--text-primary, #000);
`;

const CardTitle = styled.h3`
  font-size: clamp(1rem, 2.5vw, 1.125rem);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-primary, #000);
`;

const CardDescription = styled.p`
  font-size: clamp(0.8125rem, 2vw, 0.875rem);
  line-height: 1.6;
  color: var(--text-secondary, #666);
  flex: 1;
`;

const CardLive = styled.span`
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted, #999);
  border-top: 1px solid var(--border-color, rgba(0, 0, 0, 0.1));
  padding-top: 0.75rem;
`;

// Live snippets come straight from the content files, so the section stays
// current without any extra editing.
const realUses = uses.sections
  .flatMap((s) => s.items)
  .filter((i) => !i.todo)
  .slice(0, 3)
  .map((i) => i.name);

const cards = [
  {
    href: '#/terminal',
    icon: FaTerminal,
    title: 'Terminal',
    description:
      'A working command line for this site — whoami, ls projects (live from GitHub), and one or two undocumented commands.',
    live: 'Ctrl + ` opens it anywhere',
  },
  {
    href: '#/playground',
    icon: FaFlask,
    title: 'Playground',
    description:
      'Write and run JavaScript right here in the browser, inside a locked-down sandbox. No server involved.',
    live: 'Sandboxed · no network',
  },
  {
    href: '#/now',
    icon: FaCalendarCheck,
    title: 'Now',
    description: 'What has my attention this month — work, this site, and what I am learning.',
    live: `Updated ${now.updated}`,
  },
  {
    href: '#/uses',
    icon: FaToolbox,
    title: 'Uses',
    description: 'The cloud stack, languages, and tools I actually reach for.',
    live: `${realUses.join(' · ')} …`,
  },
  {
    href: '#/til',
    icon: FaSeedling,
    title: 'Today I Learned',
    description: 'A digital garden of short, dated notes — small lessons written the day I learn them.',
    live: `Latest: ${tilNotes[0].title}`,
  },
  {
    href: '#/case-studies',
    icon: FaBookOpen,
    title: 'Case Studies',
    description:
      'Problem → architecture decision → outcome → what I would change. The honest version.',
    live: `${caseStudies.length} writeups`,
  },
  {
    href: '#/changelog',
    icon: FaCodeBranch,
    title: 'Changelog',
    description:
      'This site is built in public. Its real commit history, pulled live from GitHub.',
    live: 'Live from the GitHub API',
  },
];

const Explore = () => (
  <Section id="explore">
    <Container>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <Heading>Explore</Heading>
        <Subtitle>
          The interactive side of this site — living pages and tools, not just a portfolio to scroll past.
        </Subtitle>
      </motion.div>
      <Grid>
        {cards.map((card, index) => (
          <Card
            key={card.href}
            href={card.href}
            aria-label={`Open ${card.title}`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
            viewport={{ once: true }}
          >
            <CardIcon aria-hidden="true">
              <card.icon />
            </CardIcon>
            <CardTitle>{card.title}</CardTitle>
            <CardDescription>{card.description}</CardDescription>
            <CardLive>{card.live}</CardLive>
          </Card>
        ))}
      </Grid>
    </Container>
  </Section>
);

export default Explore;
