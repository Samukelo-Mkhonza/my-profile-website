import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  FaGithub, FaStar, FaCodeBranch, FaEye,
  FaExternalLinkAlt, FaCalendarAlt, FaCircle, FaSpinner
} from 'react-icons/fa';
import TiltCard from './TiltCard';
import projectPlaceholder from '../assets/project-card-placeholder.svg';
import useIsNarrowViewport from '../lib/useIsNarrowViewport';
import { fetchGithubJSON } from '../lib/githubFetch';
import Modal, {
  ModalHeader, ModalTitle, ModalDescription,
  Divider, ModalSection, SectionLabel, ChipRow, Chip
} from './ui/Modal';

const GITHUB_USERNAME = 'Samukelo-Mkhonza';

// Repos shown per filter before "Show all" expands the grid, so the section
// stays compact no matter how many repos the GitHub fetch returns. The
// featured card occupies the first slot; phones stack compact rows in one
// column, so they get a smaller preview.
const PREVIEW_COUNT = 6;
const PREVIEW_COUNT_NARROW = 3;

const LANGUAGE_COLORS = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Java: '#b07219',
  'C#': '#178600',
  'C++': '#f34b7d',
  C: '#555555',
  Go: '#00ADD8',
  Rust: '#dea584',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  HTML: '#e34c26',
  CSS: '#563d7c',
  SCSS: '#c6538c',
  Shell: '#89e051',
  Dockerfile: '#384d54',
  HCL: '#844FBA',
  Vue: '#41b883',
  Svelte: '#ff3e00',
};

/* ─── Layout ──────────────────────────────────────────────────────────────── */

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
`;

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 clamp(0.5rem, 2vw, 1rem);
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

/* ─── Filter Tabs ─────────────────────────────────────────────────────────── */

const FilterTabs = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: clamp(0.5rem, 2vw, 0.75rem);
  margin-bottom: clamp(2rem, 4vw, 3rem);

  /* Phones: one thumb-scrollable row instead of a wall of wrapped pills.
     Bottom padding keeps the hard offset shadows from being clipped by
     the scroll container. */
  @media (max-width: 640px) {
    flex-wrap: nowrap;
    justify-content: flex-start;
    overflow-x: auto;
    gap: 0.5rem;
    padding: 2px 4px 8px 2px;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    &::-webkit-scrollbar { display: none; }
  }
`;

const FilterTab = styled(motion.button)`
  background: ${p => p.$active ? 'var(--accent, #000)' : 'var(--bg-card, transparent)'};
  color: ${p => p.$active ? 'var(--accent-inverse, #fff)' : 'var(--text-primary, #666)'};
  border: 2px solid var(--border-card, #000);
  padding: clamp(0.5rem, 1.5vw, 0.75rem) clamp(0.875rem, 2vw, 1.25rem);
  border-radius: var(--radius-pill, 999px);
  box-shadow: var(--shadow-hard-sm, 3px 3px 0 #111);
  font-size: clamp(0.75rem, 1.5vw, 0.875rem);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  white-space: nowrap;
  flex-shrink: 0;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 44px;
  @media (hover: hover) {
    &:hover { background: var(--accent, #000); color: var(--accent-inverse, #fff); }
  }
  &:active { transform: scale(0.95); }
`;

/* ─── States ──────────────────────────────────────────────────────────────── */

const StateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 1rem;
  color: var(--text-secondary, #666);
  gap: 1rem;
`;

const SpinnerIcon = styled(FaSpinner)`
  font-size: 2rem;
  animation: spin 1s linear infinite;
  color: var(--text-primary, #000);
  @keyframes spin { to { transform: rotate(360deg); } }
`;

/* ─── Featured Card ───────────────────────────────────────────────────────── */

const FilterView = styled(motion.div)``;

/* motion.div, not motion.article: it carries role="button" for its
   click/keyboard handler, and ARIA forbids role="button" on <article>. */
const FeaturedCard = styled(motion.div)`
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
  background: var(--bg-card, #ffffff);
  border: 2px solid var(--border-card, #111);
  border-radius: var(--radius-card, 14px);
  box-shadow: var(--shadow-hard-lg, 6px 6px 0 #111);
  overflow: hidden;
  cursor: pointer;
  position: relative;
  margin-bottom: clamp(1.25rem, 3vw, 2rem);
  transition: box-shadow 0.3s ease;

  @media (hover: hover) {
    &:hover { box-shadow: 8px 8px 0 var(--shadow-color, #111); }
  }

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

const FeaturedMedia = styled.div`
  position: relative;
  background: var(--skill-card-bg, #f0f2f5);
  border-right: 2px solid var(--border-card, #111);
  min-height: 280px;
  overflow: hidden;

  @media (max-width: 860px) {
    border-right: none;
    border-bottom: 2px solid var(--border-card, #111);
    min-height: 0;
    aspect-ratio: 2 / 1;
  }
`;

const FeaturedImage = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);

  @media (hover: hover) {
    ${FeaturedCard}:hover & { transform: scale(1.05); }
  }
`;

const FeaturedBadge = styled.span`
  position: absolute;
  top: 0.875rem;
  left: 0.875rem;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  background: var(--accent-orange, #ee5a24);
  color: var(--on-orange, #fff);
  border: 2px solid var(--border-card, #111);
  border-radius: var(--radius-pill, 999px);
  box-shadow: var(--shadow-hard-sm, 3px 3px 0 #111);
  padding: 0.3rem 0.75rem;
  font-size: 0.6875rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  transform: rotate(-2deg);
  svg { font-size: 0.625rem; }
`;

const FeaturedBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  padding: clamp(1.25rem, 3vw, 2rem);
`;

const FeaturedName = styled.h3`
  font-size: clamp(1.25rem, 3vw, 1.75rem);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-primary, #000);
  line-height: 1.2;
  flex: 1;
`;

const FeaturedDescription = styled.p`
  font-size: clamp(0.875rem, 2vw, 1rem);
  line-height: 1.7;
  color: var(--text-secondary, #666);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const FeaturedFooter = styled.div`
  margin-top: auto;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem 1.25rem;
  padding-top: 0.875rem;
  border-top: 2px solid var(--border-card, #111);
`;

// Grid cards drop their tags on phones for density, but the featured card
// stays full-size there, so it keeps them.
const FeaturedTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
`;

const FeaturedCta = styled.span`
  margin-left: auto;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-primary, #000);
  white-space: nowrap;
`;

/* ─── Grid & Cards ────────────────────────────────────────────────────────── */

const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr));
  gap: clamp(1.25rem, 2.5vw, 1.75rem);
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 0.875rem;
  }
`;

const ProjectCard = styled(motion.div)`
  background: var(--bg-card, #ffffff);
  border: 2px solid var(--border-card, #e0e0e0);
  border-radius: var(--radius-card, 14px);
  box-shadow: var(--shadow-hard, 4px 4px 0 #111);
  position: relative;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;

  &:before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 4px;
    background: var(--accent-orange, #ee5a24);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s ease;
    z-index: 2;
  }

  @media (hover: hover) {
    &:hover {
      box-shadow: var(--shadow-hard-lg, 6px 6px 0 #111);
      &:before { transform: scaleX(1); }
    }
  }

  /* Phones: compact horizontal row — thumbnail left, text right — so several
     projects fit on screen instead of one tall card each. */
  @media (max-width: 640px) {
    flex-direction: row;
    align-items: stretch;
    box-shadow: var(--shadow-hard-sm, 3px 3px 0 #111);
  }
`;

const CardImageWrap = styled.div`
  width: 100%;
  aspect-ratio: 2 / 1;
  overflow: hidden;
  background: var(--skill-card-bg, #f0f2f5);
  border-bottom: 2px solid var(--border-card, #e0e0e0);
  position: relative;

  &:after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, transparent 60%, var(--bg-card, #fff) 130%);
    pointer-events: none;
  }

  @media (max-width: 640px) {
    width: 104px;
    min-width: 104px;
    aspect-ratio: auto;
    border-bottom: none;
    border-right: 2px solid var(--border-card, #e0e0e0);
    &:after { display: none; }
  }
`;

const CardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);

  @media (hover: hover) {
    ${ProjectCard}:hover & { transform: scale(1.07); }
  }
`;

const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex: 1;
  min-width: 0;
  padding: clamp(1.25rem, 3vw, 1.5rem);

  @media (max-width: 640px) {
    gap: 0.375rem;
    padding: 0.75rem 0.875rem;
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
`;

const RepoName = styled.h3`
  font-size: clamp(1rem, 2.5vw, 1.1875rem);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-primary, #000);
  line-height: 1.2;
  flex: 1;
  overflow-wrap: anywhere;

  @media (max-width: 640px) { font-size: 0.9375rem; }
`;

const GithubIconLink = styled.a`
  color: var(--text-secondary, #666);
  font-size: 1.25rem;
  flex-shrink: 0;
  /* Padding + matching negative margin: grows the hit area to the
     24x24px CSS target-size minimum without shifting surrounding layout. */
  padding: 6px;
  margin: -6px;
  transition: color 0.2s;
  &:hover { color: var(--text-primary, #000); }

  /* The whole card opens the modal, which carries the GitHub button; drop
     the tiny icon target on phones to keep compact rows clean. */
  @media (max-width: 640px) { display: none; }
`;

const RepoDescription = styled.p`
  font-size: clamp(0.8125rem, 2vw, 0.9375rem);
  line-height: 1.7;
  color: var(--text-secondary, #666);
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;

  @media (max-width: 640px) {
    -webkit-line-clamp: 2;
    font-size: 0.75rem;
    line-height: 1.5;
  }
`;

const TagsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;

  @media (max-width: 640px) { display: none; }
`;

const TopicTag = styled.span`
  background: var(--tag-bg, #f0f0f0);
  color: var(--text-primary, #444);
  border: 2px solid var(--border-card, #111);
  padding: 0.2rem 0.6rem;
  border-radius: var(--radius-pill, 999px);
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.03em;
`;

const CardFooter = styled.div`
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding-top: 0.75rem;
  border-top: 2px solid var(--border-card, #e0e0e0);
  flex-wrap: wrap;

  @media (max-width: 640px) {
    border-top: none;
    padding-top: 0;
    gap: 0.875rem;
  }
`;

const Stat = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.8125rem;
  color: var(--text-secondary, #666);
  svg { font-size: 0.75rem; }
`;

const LangDot = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.8125rem;
  color: var(--text-secondary, #666);
  margin-left: auto;
`;

const LangCircle = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${p => p.$color || '#ccc'};
  flex-shrink: 0;
`;

const ViewDetailsHint = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-primary, #000);
  opacity: 0;
  transition: opacity 0.2s;
  ${ProjectCard}:hover & { opacity: 1; }

  @media (max-width: 640px) { display: none; }
`;

/* ─── Modal content ───────────────────────────────────────────────────────── */

const StatsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
`;

const StatBig = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--text-primary, #000);
  svg { color: var(--text-secondary, #888); font-size: 1rem; }
  span { font-weight: 400; color: var(--text-secondary, #666); font-size: 0.875rem; }
`;

const DateRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const DateItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8125rem;
  color: var(--text-secondary, #666);
  svg { font-size: 0.75rem; }
`;

const GitHubButton = styled(motion.a)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  background: var(--accent, #000);
  color: var(--accent-inverse, #fff);
  border: 2px solid var(--border-card, #111);
  padding: 0.875rem 1.75rem;
  border-radius: var(--radius-pill, 999px);
  box-shadow: var(--shadow-hard-sm, 3px 3px 0 #111);
  font-size: 0.9375rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  text-decoration: none;
  transition: opacity 0.2s;
  margin-top: 0.5rem;
  &:hover { opacity: 0.85; }
  svg { font-size: 1.1rem; }
`;

const ShowMoreWrap = styled.div`
  display: flex;
  justify-content: center;
  margin-top: clamp(1.5rem, 3vw, 2.5rem);
`;

const ShowMoreButton = styled(motion.button)`
  background: var(--bg-card, transparent);
  color: var(--text-primary, #000);
  border: 2px solid var(--border-card, #000);
  padding: clamp(0.625rem, 2vw, 0.875rem) clamp(1.5rem, 4vw, 2.5rem);
  border-radius: var(--radius-pill, 999px);
  box-shadow: var(--shadow-hard-sm, 3px 3px 0 #111);
  font-size: clamp(0.75rem, 1.75vw, 0.9375rem);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 44px;
  @media (hover: hover) {
    &:hover { background: var(--accent, #000); color: var(--accent-inverse, #fff); }
  }
  &:active { transform: scale(0.95); }
`;

/* ─── Helpers ─────────────────────────────────────────────────────────────── */

const formatName = name =>
  name.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

const formatDate = str =>
  new Date(str).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

/* ─── Component ───────────────────────────────────────────────────────────── */

const Projects = () => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const previewCount = useIsNarrowViewport() ? PREVIEW_COUNT_NARROW : PREVIEW_COUNT;
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    fetchGithubJSON(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=50`)
      .then(data => {
        setRepos(data.filter(r => !r.fork));
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const closeModal = useCallback(() => setSelectedRepo(null), []);

  const openRepo = useCallback(repo => setSelectedRepo(repo), []);

  const cardKeyDown = repo => e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setSelectedRepo(repo);
    }
  };

  const languages = ['all', ...Array.from(new Set(repos.map(r => r.language).filter(Boolean)))];

  const filtered = activeFilter === 'all'
    ? repos
    : repos.filter(r => r.language === activeFilter);

  // The most-starred repo of the active filter leads the section; the fetch
  // is sorted by last update, so ties fall to the most recently touched.
  const featured = filtered.length > 0
    ? filtered.reduce((best, r) => (r.stargazers_count > best.stargazers_count ? r : best), filtered[0])
    : null;
  const rest = featured ? filtered.filter(r => r.id !== featured.id) : [];
  const visibleRest = showAll ? rest : rest.slice(0, Math.max(previewCount - 1, 0));

  const headingEntry = delay => reducedMotion ? {} : {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay },
    viewport: { once: true },
  };

  const filterViewEntry = reducedMotion ? {} : {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3 },
  };

  const cardEntry = i => reducedMotion ? {} : {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.45, delay: Math.min(i * 0.06, 0.4), ease: [0.4, 0, 0.2, 1] },
  };

  return (
    <Section id="projects">
      <Container>
        <Heading {...headingEntry(0)}>
          Projects
        </Heading>

        <Subtitle {...headingEntry(0.1)}>
          Real projects from my GitHub — click any card to learn more.
        </Subtitle>

        {!loading && !error && (
          <FilterTabs>
            {languages.map(lang => (
              <FilterTab
                key={lang}
                $active={activeFilter === lang}
                onClick={() => { setActiveFilter(lang); setShowAll(false); }}
                whileHover={reducedMotion ? undefined : { scale: 1.05 }}
                whileTap={reducedMotion ? undefined : { scale: 0.95 }}
              >
                {lang === 'all' ? 'All' : lang}
              </FilterTab>
            ))}
          </FilterTabs>
        )}

        {loading && (
          <StateContainer>
            <SpinnerIcon />
            <span>Loading repositories…</span>
          </StateContainer>
        )}

        {error && (
          <StateContainer>
            <span>Could not load repositories: {error}</span>
          </StateContainer>
        )}

        {!loading && !error && filtered.length === 0 && (
          <StateContainer>
            <span>No repositories to show yet — check back soon.</span>
          </StateContainer>
        )}

        {!loading && !error && featured && (
          <AnimatePresence mode="wait">
            <FilterView key={activeFilter} {...filterViewEntry}>
              <FeaturedCard
                {...cardEntry(0)}
                onClick={() => openRepo(featured)}
                role="button"
                tabIndex={0}
                onKeyDown={cardKeyDown(featured)}
              >
                <FeaturedMedia>
                  <FeaturedBadge><FaStar /> Featured</FeaturedBadge>
                  <FeaturedImage
                    src={`https://opengraph.githubassets.com/1/${featured.full_name}`}
                    alt={`${formatName(featured.name)} preview`}
                    loading="lazy"
                    onError={e => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = projectPlaceholder;
                    }}
                  />
                </FeaturedMedia>

                <FeaturedBody>
                  <CardHeader>
                    <FeaturedName>{formatName(featured.name)}</FeaturedName>
                    <GithubIconLink
                      href={featured.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      title="Open on GitHub"
                    >
                      <FaGithub />
                    </GithubIconLink>
                  </CardHeader>

                  <FeaturedDescription>
                    {featured.description || 'No description provided.'}
                  </FeaturedDescription>

                  {featured.topics?.length > 0 && (
                    <FeaturedTags>
                      {featured.topics.slice(0, 5).map(t => (
                        <TopicTag key={t}>{t}</TopicTag>
                      ))}
                    </FeaturedTags>
                  )}

                  <FeaturedFooter>
                    {featured.language && (
                      <Stat>
                        <LangCircle $color={LANGUAGE_COLORS[featured.language]} />
                        {featured.language}
                      </Stat>
                    )}
                    {featured.stargazers_count > 0 && (
                      <Stat><FaStar />{featured.stargazers_count}</Stat>
                    )}
                    {featured.forks_count > 0 && (
                      <Stat><FaCodeBranch />{featured.forks_count}</Stat>
                    )}
                    <Stat><FaCalendarAlt />{formatDate(featured.updated_at)}</Stat>
                    <FeaturedCta>View details →</FeaturedCta>
                  </FeaturedFooter>
                </FeaturedBody>
              </FeaturedCard>

              {visibleRest.length > 0 && (
                <ProjectsGrid>
                  {visibleRest.map((repo, i) => (
                    <TiltCard key={repo.id}>
                      <ProjectCard
                        {...cardEntry(i + 1)}
                        onClick={() => openRepo(repo)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={cardKeyDown(repo)}
                      >
                        <CardImageWrap>
                          <CardImage
                            src={`https://opengraph.githubassets.com/1/${repo.full_name}`}
                            alt={`${formatName(repo.name)} preview`}
                            loading="lazy"
                            onError={e => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = projectPlaceholder;
                            }}
                          />
                        </CardImageWrap>

                        <CardBody>
                          <CardHeader>
                            <RepoName>{formatName(repo.name)}</RepoName>
                            <GithubIconLink
                              href={repo.html_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={e => e.stopPropagation()}
                              title="Open on GitHub"
                            >
                              <FaGithub />
                            </GithubIconLink>
                          </CardHeader>

                          <RepoDescription>
                            {repo.description || 'No description provided.'}
                          </RepoDescription>

                          {repo.topics?.length > 0 && (
                            <TagsRow>
                              {repo.topics.slice(0, 4).map(t => (
                                <TopicTag key={t}>{t}</TopicTag>
                              ))}
                            </TagsRow>
                          )}

                          <CardFooter>
                            {repo.stargazers_count > 0 && (
                              <Stat><FaStar />{repo.stargazers_count}</Stat>
                            )}
                            {repo.forks_count > 0 && (
                              <Stat><FaCodeBranch />{repo.forks_count}</Stat>
                            )}
                            <ViewDetailsHint>View details →</ViewDetailsHint>
                            {repo.language && (
                              <LangDot>
                                <LangCircle $color={LANGUAGE_COLORS[repo.language]} />
                                {repo.language}
                              </LangDot>
                            )}
                          </CardFooter>
                        </CardBody>
                      </ProjectCard>
                    </TiltCard>
                  ))}
                </ProjectsGrid>
              )}
            </FilterView>
          </AnimatePresence>
        )}

        {!loading && !error && filtered.length > previewCount && (
          <ShowMoreWrap>
            <ShowMoreButton
              onClick={() => setShowAll(prev => !prev)}
              whileHover={reducedMotion ? undefined : { scale: 1.05 }}
              whileTap={reducedMotion ? undefined : { scale: 0.95 }}
            >
              {showAll
                ? 'Show fewer repositories'
                : `Show all ${filtered.length} repositories`}
            </ShowMoreButton>
          </ShowMoreWrap>
        )}
      </Container>

      {/* ── Modal ── */}
      <Modal
        isOpen={!!selectedRepo}
        onClose={closeModal}
        labelledBy="project-modal-title"
      >
        {selectedRepo && (
          <>
            <ModalHeader>
              <ModalTitle id="project-modal-title">{formatName(selectedRepo.name)}</ModalTitle>
            </ModalHeader>

            <ModalDescription>
              {selectedRepo.description || 'No description provided for this repository.'}
            </ModalDescription>

            {selectedRepo.topics?.length > 0 && (
              <ModalSection>
                <SectionLabel>Topics</SectionLabel>
                <ChipRow>
                  {selectedRepo.topics.map(t => (
                    <Chip key={t}>{t}</Chip>
                  ))}
                </ChipRow>
              </ModalSection>
            )}

            <Divider />

            <ModalSection>
              <SectionLabel>Stats</SectionLabel>
              <StatsRow>
                <StatBig>
                  <FaStar />
                  {selectedRepo.stargazers_count}
                  <span>Stars</span>
                </StatBig>
                <StatBig>
                  <FaCodeBranch />
                  {selectedRepo.forks_count}
                  <span>Forks</span>
                </StatBig>
                <StatBig>
                  <FaEye />
                  {selectedRepo.watchers_count}
                  <span>Watchers</span>
                </StatBig>
                {selectedRepo.language && (
                  <StatBig>
                    <FaCircle style={{ color: LANGUAGE_COLORS[selectedRepo.language] || '#ccc', fontSize: '0.75rem' }} />
                    {selectedRepo.language}
                    <span>Language</span>
                  </StatBig>
                )}
              </StatsRow>
            </ModalSection>

            <Divider />

            <ModalSection>
              <SectionLabel>Dates</SectionLabel>
              <DateRow>
                <DateItem>
                  <FaCalendarAlt />
                  Created: {formatDate(selectedRepo.created_at)}
                </DateItem>
                <DateItem>
                  <FaCalendarAlt />
                  Last updated: {formatDate(selectedRepo.updated_at)}
                </DateItem>
              </DateRow>
            </ModalSection>

            <GitHubButton
              href={selectedRepo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={reducedMotion ? undefined : { scale: 1.02 }}
              whileTap={reducedMotion ? undefined : { scale: 0.97 }}
            >
              <FaGithub />
              View on GitHub
              <FaExternalLinkAlt style={{ fontSize: '0.8rem' }} />
            </GitHubButton>
          </>
        )}
      </Modal>
    </Section>
  );
};

export default Projects;
