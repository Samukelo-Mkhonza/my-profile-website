import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaGithub, FaStar, FaCodeBranch, FaEye,
  FaTimes, FaExternalLinkAlt, FaCalendarAlt, FaCircle, FaSpinner
} from 'react-icons/fa';
import TiltCard from './TiltCard';
import projectPlaceholder from '../assets/project-card-placeholder.svg';

const GITHUB_USERNAME = 'Samukelo-Mkhonza';

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
  font-weight: 700;
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
  @media (max-width: 640px) { gap: 0.375rem; }
`;

const FilterTab = styled(motion.button)`
  background: ${p => p.$active ? 'var(--accent, #000)' : 'transparent'};
  color: ${p => p.$active ? 'var(--accent-inverse, #fff)' : 'var(--text-secondary, #666)'};
  border: 2px solid var(--accent, #000);
  padding: clamp(0.5rem, 1.5vw, 0.75rem) clamp(0.875rem, 2vw, 1.25rem);
  border-radius: 8px;
  font-size: clamp(0.75rem, 1.5vw, 0.875rem);
  font-weight: 600;
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

/* ─── Grid & Cards ────────────────────────────────────────────────────────── */

const ProjectsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 340px), 1fr));
  gap: clamp(1.5rem, 3vw, 2rem);
  @media (max-width: 640px) { grid-template-columns: 1fr; }
`;

const ProjectCard = styled(motion.div)`
  background: var(--bg-card, #ffffff);
  border: 1px solid var(--border-card, #e0e0e0);
  border-radius: 12px;
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
    background: linear-gradient(90deg, var(--text-primary, #000), var(--text-secondary, #666));
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s ease;
    z-index: 2;
  }

  @media (hover: hover) {
    &:hover {
      box-shadow: 0 20px 40px var(--shadow-color, rgba(0,0,0,0.12));
      border-color: var(--text-primary, #000);
      &:before { transform: scaleX(1); }
    }
  }

  @media (max-width: 480px) { border-radius: 8px; }
`;

const CardImageWrap = styled.div`
  width: 100%;
  aspect-ratio: 2 / 1;
  overflow: hidden;
  background: var(--skill-card-bg, #f0f2f5);
  border-bottom: 1px solid var(--border-card, #e0e0e0);
  position: relative;

  &:after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, transparent 60%, var(--bg-card, #fff) 130%);
    pointer-events: none;
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
  padding: clamp(1.25rem, 3vw, 1.75rem);

  @media (max-width: 480px) { padding: clamp(1rem, 4vw, 1.5rem); }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
`;

const RepoName = styled.h3`
  font-size: clamp(1rem, 2.5vw, 1.25rem);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-primary, #000);
  line-height: 1.2;
  flex: 1;
`;

const GithubIconLink = styled.a`
  color: var(--text-secondary, #666);
  font-size: 1.25rem;
  flex-shrink: 0;
  transition: color 0.2s;
  &:hover { color: var(--text-primary, #000); }
`;

const RepoDescription = styled.p`
  font-size: clamp(0.8125rem, 2vw, 0.9375rem);
  line-height: 1.7;
  color: var(--text-secondary, #666);
  flex: 1;
`;

const TagsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
`;

const TopicTag = styled.span`
  background: var(--tag-bg, #f0f0f0);
  color: var(--text-secondary, #444);
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.03em;
`;

const CardFooter = styled.div`
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--border-card, #e0e0e0);
  flex-wrap: wrap;
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
`;

/* ─── Modal ───────────────────────────────────────────────────────────────── */

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const Modal = styled(motion.div)`
  background: var(--bg-card, #fff);
  border: 1px solid var(--border-card, #e0e0e0);
  border-radius: 16px;
  width: 100%;
  max-width: 620px;
  max-height: 90vh;
  overflow-y: auto;
  padding: clamp(1.5rem, 5vw, 2.5rem);
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const CloseButton = styled(motion.button)`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: var(--tag-bg, #f0f0f0);
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--text-secondary, #666);
  font-size: 0.875rem;
  transition: background 0.2s, color 0.2s;
  &:hover { background: var(--text-primary, #000); color: var(--accent-inverse, #fff); }
`;

const ModalTitle = styled.h2`
  font-size: clamp(1.25rem, 4vw, 1.75rem);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-primary, #000);
  padding-right: 2.5rem;
  line-height: 1.2;
`;

const ModalDescription = styled.p`
  font-size: clamp(0.875rem, 2vw, 1rem);
  line-height: 1.8;
  color: var(--text-secondary, #555);
`;

const ModalSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ModalSectionLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-secondary, #888);
`;

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

const Divider = styled.hr`
  border: none;
  border-top: 1px solid var(--border-card, #e0e0e0);
  margin: 0;
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
  background: var(--text-primary, #000);
  color: var(--accent-inverse, #fff);
  padding: 0.875rem 1.75rem;
  border-radius: 8px;
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

  useEffect(() => {
    fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=50`)
      .then(res => {
        if (!res.ok) throw new Error(`GitHub API error ${res.status}`);
        return res.json();
      })
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

  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') closeModal(); };
    if (selectedRepo) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [selectedRepo, closeModal]);

  const languages = ['all', ...Array.from(new Set(repos.map(r => r.language).filter(Boolean)))];

  const filtered = activeFilter === 'all'
    ? repos
    : repos.filter(r => r.language === activeFilter);

  return (
    <Section id="projects">
      <Container>
        <Heading
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Projects
        </Heading>

        <Subtitle
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
        >
          Real projects from my GitHub — click any card to learn more.
        </Subtitle>

        {!loading && !error && (
          <FilterTabs>
            {languages.map(lang => (
              <FilterTab
                key={lang}
                $active={activeFilter === lang}
                onClick={() => setActiveFilter(lang)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
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

        {!loading && !error && (
          <AnimatePresence mode="wait">
            <ProjectsGrid
              key={activeFilter}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {filtered.map((repo, i) => (
                <TiltCard key={repo.id}>
                  <ProjectCard
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: i * 0.06, ease: [0.4, 0, 0.2, 1] }}
                    onClick={() => setSelectedRepo(repo)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedRepo(repo); } }}
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
          </AnimatePresence>
        )}
      </Container>

      {/* ── Modal ── */}
      <AnimatePresence>
        {selectedRepo && (
          <Overlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <Modal
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.96 }}
              transition={{ type: 'spring', damping: 26, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
            >
              <CloseButton
                onClick={closeModal}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Close"
              >
                <FaTimes />
              </CloseButton>

              <ModalTitle>{formatName(selectedRepo.name)}</ModalTitle>

              <ModalDescription>
                {selectedRepo.description || 'No description provided for this repository.'}
              </ModalDescription>

              {selectedRepo.topics?.length > 0 && (
                <ModalSection>
                  <ModalSectionLabel>Topics</ModalSectionLabel>
                  <TagsRow>
                    {selectedRepo.topics.map(t => (
                      <TopicTag key={t}>{t}</TopicTag>
                    ))}
                  </TagsRow>
                </ModalSection>
              )}

              <Divider />

              <ModalSection>
                <ModalSectionLabel>Stats</ModalSectionLabel>
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
                <ModalSectionLabel>Dates</ModalSectionLabel>
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
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                <FaGithub />
                View on GitHub
                <FaExternalLinkAlt style={{ fontSize: '0.8rem' }} />
              </GitHubButton>
            </Modal>
          </Overlay>
        )}
      </AnimatePresence>
    </Section>
  );
};

export default Projects;
