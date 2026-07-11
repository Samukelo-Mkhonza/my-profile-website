import React, { useState, useCallback, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { FaCheckCircle, FaExternalLinkAlt } from 'react-icons/fa';
import TiltCard from './TiltCard';
import useIsNarrowViewport from '../lib/useIsNarrowViewport';
import { skillCategories, skillsData } from '../content/skills';
import Modal, {
  ModalTitle, ModalMeta, ModalDescription,
  Divider, ModalSection, SectionLabel, ChipRow, Chip
} from './ui/Modal';

/* ─── Layout ──────────────────────────────────────────────────────────────── */

const Section = styled.section`
  padding: clamp(3rem, 8vw, 6rem) clamp(1rem, 4vw, 2rem);
  background: var(--bg-primary-glass, rgba(255, 255, 255, 0.86));
  position: relative;
  @media (max-width: 480px) { padding: clamp(2rem, 6vw, 3rem) clamp(0.75rem, 3vw, 1.5rem); }
  @media (max-height: 600px) and (orientation: landscape) { padding: 2rem; }
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
  margin-bottom: clamp(2rem, 4vw, 3rem);
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
  @media (max-width: 480px) { font-size: clamp(1.5rem, 6vw, 2rem); letter-spacing: 0.05em; margin-bottom: clamp(1.5rem, 4vw, 2rem); }
  @media (max-width: 360px) { font-size: 1.375rem; &:after { width: 50px; height: 2px; bottom: -0.5rem; } }
`;

/* ─── Filter Tabs ─────────────────────────────────────────────────────────── */

/* On phones the tabs become a single scroll-snap row. The wrapper paints
   edge fades (driven by data attributes from a scroll handler) so it is
   obvious there are more tabs off-screen — the row itself hides its
   scrollbar. */
const FilterTabsWrap = styled.div`
  position: relative;
  margin-bottom: clamp(2rem, 4vw, 3rem);
  @media (max-width: 640px) {
    margin-bottom: clamp(1.5rem, 4vw, 2rem);
    &:before, &:after {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      width: 2.75rem;
      pointer-events: none;
      z-index: 2;
      opacity: 0;
      transition: opacity 0.2s ease;
    }
    &:before { left: 0; background: linear-gradient(to right, var(--bg-primary, #faf3e8), transparent); }
    &:after { right: 0; background: linear-gradient(to left, var(--bg-primary, #faf3e8), transparent); }
    &[data-fade-left='true']:before { opacity: 1; }
    &[data-fade-right='true']:after { opacity: 1; }
  }
`;

const FilterTabs = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: clamp(0.5rem, 2vw, 1rem);
  padding: 0 clamp(0.5rem, 2vw, 1rem);
  @media (max-width: 640px) {
    justify-content: flex-start;
    flex-wrap: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
    scroll-snap-type: x proximity;
    scrollbar-width: none;
    -ms-overflow-style: none;
    padding: 0.25rem 1.25rem 0.5rem 0.25rem;
    &::-webkit-scrollbar { display: none; }
    & > * { scroll-snap-align: start; }
  }
  @media (max-width: 360px) { gap: 0.375rem; }
`;

const FilterTab = styled(motion.button)`
  background: ${p => p.$active ? 'var(--accent, #000)' : 'var(--bg-card, transparent)'};
  color: ${p => p.$active ? 'var(--accent-inverse, #fff)' : 'var(--text-primary, #666)'};
  border: 2px solid var(--border-card, #000);
  padding: clamp(0.625rem, 2vw, 0.875rem) clamp(1rem, 3vw, 1.5rem);
  border-radius: var(--radius-pill, 999px);
  box-shadow: var(--shadow-hard-sm, 3px 3px 0 #111);
  font-size: clamp(0.75rem, 1.75vw, 0.9375rem);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
  flex-shrink: 0;
  min-height: 44px;
  position: relative;
  overflow: hidden;
  &:before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--accent, #000);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s ease;
    z-index: 0;
  }
  @media (hover: hover) {
    &:hover:not([disabled]) { color: var(--accent-inverse, #fff); &:before { transform: scaleX(1); } }
  }
  &:active { transform: scale(0.95); }
  svg, span { position: relative; z-index: 1; }
  svg { font-size: clamp(0.875rem, 2vw, 1.125rem); }
  @media (max-width: 480px) { padding: 0.625rem 1rem; font-size: 0.75rem; gap: 0.375rem; }
  @media (max-width: 360px) { padding: 0.5rem 0.75rem; font-size: 0.6875rem; letter-spacing: 0.03em; }
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

/* ─── Grid & Cards ────────────────────────────────────────────────────────── */

const SkillsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr));
  gap: clamp(1.25rem, 3vw, 2rem);
  @media (max-width: 900px) { grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr)); }
  @media (max-width: 640px) { grid-template-columns: 1fr; gap: clamp(1rem, 3vw, 1.5rem); }
  @media (max-width: 360px) { gap: 0.875rem; }
`;

/* Flex column so the tool chips + footer anchor to the card bottom and equal
   grid heights never leave a dead zone under short descriptions. */
const SkillCard = styled(motion.div)`
  background: var(--skill-card-bg, #f8f9fa);
  border: 2px solid var(--border-card, #e9ecef);
  border-radius: var(--radius-card, 14px);
  box-shadow: var(--shadow-hard, 4px 4px 0 #111);
  padding: clamp(1.25rem, 3vw, 1.75rem);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  @media (hover: hover) {
    &:hover {
      box-shadow: var(--shadow-hard-lg, 6px 6px 0 #111);
      background: var(--bg-card, #fff);
    }
  }
  &:active { transform: scale(0.98); }
  &:before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 4px;
    background: var(--accent-orange, #ee5a24);
    transform: translateY(-100%);
    transition: transform 0.3s ease;
  }
  @media (hover: hover) { &:hover:before { transform: translateY(0); } }
  &:focus-visible {
    outline: 2px solid var(--accent, #000);
    outline-offset: 2px;
  }
`;

const SkillHeader = styled.div`
  display: flex;
  align-items: center;
  gap: clamp(0.75rem, 2vw, 1rem);
  margin-bottom: clamp(0.75rem, 2vw, 1rem);
  @media (max-width: 360px) { gap: 0.625rem; margin-bottom: 0.625rem; }
`;

const IconTile = styled(motion.div)`
  width: clamp(2.75rem, 6vw, 3.25rem);
  height: clamp(2.75rem, 6vw, 3.25rem);
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--tag-bg, #f2e9d8);
  border: 2px solid var(--border-card, #111);
  border-radius: var(--radius-sm, 10px);
  box-shadow: var(--shadow-hard-sm, 3px 3px 0 #111);
  font-size: clamp(1.5rem, 4vw, 1.75rem);
  color: var(--text-primary, #000);
  flex-shrink: 0;
  transition: transform 0.3s ease;
  @media (hover: hover) { ${SkillCard}:hover & { transform: rotate(-5deg) scale(1.08); } }
  @media (max-width: 360px) { width: 2.5rem; height: 2.5rem; font-size: 1.375rem; }
`;

const SkillInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const SkillName = styled.h3`
  font-size: clamp(1rem, 2.5vw, 1.25rem);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 0.375rem 0;
  color: var(--text-primary, #000);
  line-height: 1.2;
  @media (max-width: 480px) { font-size: clamp(0.9375rem, 3vw, 1.125rem); }
  @media (max-width: 360px) { font-size: 0.875rem; letter-spacing: 0.02em; }
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

/* Expert gets the accent-orange fill so the strongest skills pop out of the
   grid; other levels stay on the neutral tag tone. */
const SkillLevel = styled.span`
  font-size: clamp(0.625rem, 1.5vw, 0.75rem);
  color: ${p => p.$level === 'Expert' ? 'var(--on-orange, #fff)' : 'var(--text-secondary, #6c757d)'};
  background: ${p => p.$level === 'Expert' ? 'var(--accent-orange, #ee5a24)' : 'var(--tag-bg, #e9ecef)'};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 700;
  display: inline-block;
  border: 2px solid var(--border-card, #111);
  padding: 0.125rem 0.5rem;
  border-radius: var(--radius-pill, 999px);
  @media (max-width: 360px) { letter-spacing: 0.05em; padding: 0.125rem 0.375rem; }
`;

const Years = styled.span`
  font-size: clamp(0.6875rem, 1.75vw, 0.8125rem);
  color: var(--text-muted, #6c757d);
  font-weight: 600;
  white-space: nowrap;
  @media (max-width: 360px) { font-size: 0.625rem; }
`;

const SkillDescription = styled.p`
  font-size: clamp(0.8125rem, 2vw, 0.9375rem);
  line-height: 1.7;
  color: var(--text-secondary, #495057);
  margin: 0;
  @media (max-width: 480px) { font-size: clamp(0.75rem, 2.5vw, 0.875rem); line-height: 1.6; }
  @media (max-width: 360px) { font-size: 0.75rem; line-height: 1.5; }
`;

/* margin-top: auto pins chips + footer to the bottom of equal-height cards. */
const ToolChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin-top: auto;
  padding-top: clamp(0.875rem, 2vw, 1.125rem);
`;

const ToolChip = styled.span`
  font-size: 0.6875rem;
  font-weight: 600;
  color: var(--text-secondary, #444);
  background: var(--tag-bg, #f0f0f0);
  border: 1px solid var(--border-color, rgba(17, 17, 17, 0.15));
  padding: 0.2rem 0.55rem;
  border-radius: var(--radius-pill, 999px);
  white-space: nowrap;
  @media (max-width: 360px) { font-size: 0.625rem; padding: 0.15rem 0.45rem; }
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  margin-top: clamp(0.75rem, 2vw, 1rem);
  padding-top: clamp(0.625rem, 2vw, 0.875rem);
  border-top: 1px solid var(--border-color, rgba(17, 17, 17, 0.15));
`;

const ProofTag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--green, #43a047);
  svg { font-size: 0.75rem; flex-shrink: 0; }
  @media (max-width: 360px) { font-size: 0.625rem; }
`;

/* Always visible (the old hover-only hint was undiscoverable on touch);
   inverts on card hover as the pointer affordance. */
const ClickHint = styled.span`
  display: inline-flex;
  align-items: center;
  margin-left: auto;
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  white-space: nowrap;
  color: var(--text-primary, #000);
  background: var(--bg-card, #fff);
  border: 2px solid var(--border-card, #111);
  border-radius: var(--radius-pill, 999px);
  padding: 0.25rem 0.625rem;
  transition: background 0.2s, color 0.2s;
  ${SkillCard}:hover &,
  ${SkillCard}:focus-visible & {
    background: var(--accent, #000);
    color: var(--accent-inverse, #fff);
  }
  @media (max-width: 360px) { font-size: 0.625rem; padding: 0.2rem 0.5rem; }
`;

/* ─── Modal content ───────────────────────────────────────────────────────── */

const SkillModalHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-right: 2.5rem;
`;

const ModalIcon = styled.div`
  font-size: 3rem;
  color: var(--text-primary, #000);
  display: flex;
  align-items: center;
  flex-shrink: 0;
`;

const ModalTitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

const LevelBadge = styled.span`
  font-size: 0.75rem;
  color: ${p => p.$level === 'Expert' ? 'var(--on-orange, #fff)' : 'var(--text-secondary, #6c757d)'};
  background: ${p => p.$level === 'Expert' ? 'var(--accent-orange, #ee5a24)' : 'var(--tag-bg, #e9ecef)'};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 600;
  border: 2px solid var(--border-card, #111);
  padding: 0.2rem 0.6rem;
  border-radius: var(--radius-pill, 999px);
`;

const YearsBadge = styled.span`
  font-size: 0.8rem;
  color: var(--text-secondary, #666);
  font-weight: 500;
`;

const UsageList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
`;

const UsageItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
  font-size: clamp(0.8125rem, 2vw, 0.9375rem);
  line-height: 1.6;
  color: var(--text-secondary, #444);
  svg {
    color: var(--text-primary, #000);
    font-size: 0.75rem;
    margin-top: 0.3rem;
    flex-shrink: 0;
  }
`;

const ProofLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: clamp(0.8125rem, 2vw, 0.9375rem);
  font-weight: 600;
  color: var(--text-primary, #000);
  text-decoration: underline;
  text-underline-offset: 3px;
  transition: opacity 0.2s;
  svg { font-size: 0.7rem; flex-shrink: 0; }
  &:hover { opacity: 0.7; }
`;

/* ─── Component ───────────────────────────────────────────────────────────── */

// Cards shown per filter before "Show all" expands the grid, so the section
// stays about one viewport tall on the main page. Phones stack cards in one
// column, so they get a smaller preview.
const PREVIEW_COUNT = 6;
const PREVIEW_COUNT_NARROW = 3;

// Tool chips shown on the card face; the full list lives in the modal.
const CARD_TOOL_COUNT = 4;

const Skills = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const previewCount = useIsNarrowViewport() ? PREVIEW_COUNT_NARROW : PREVIEW_COUNT;
  const reducedMotion = useReducedMotion();

  const closeModal = useCallback(() => setSelectedSkill(null), []);

  /* Edge-fade state for the mobile tab scroller. */
  const tabsRef = useRef(null);
  const [tabFades, setTabFades] = useState({ left: false, right: false });
  const updateTabFades = useCallback(() => {
    const el = tabsRef.current;
    if (!el) return;
    const left = el.scrollLeft > 4;
    const right = el.scrollLeft + el.clientWidth < el.scrollWidth - 4;
    setTabFades(prev => (prev.left === left && prev.right === right) ? prev : { left, right });
  }, []);

  useEffect(() => {
    updateTabFades();
    window.addEventListener('resize', updateTabFades);
    return () => window.removeEventListener('resize', updateTabFades);
  }, [updateTabFades]);

  const filteredSkills = activeFilter === 'all'
    ? skillsData
    : skillsData.filter(s => s.category === activeFilter);

  const visibleSkills = showAll ? filteredSkills : filteredSkills.slice(0, previewCount);

  return (
    <Section id="skills">
      <Container>
        <Heading
          initial={reducedMotion ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Skills & Technologies
        </Heading>

        <FilterTabsWrap data-fade-left={tabFades.left} data-fade-right={tabFades.right}>
          <FilterTabs ref={tabsRef} onScroll={updateTabFades}>
            {skillCategories.map(cat => (
              <FilterTab
                key={cat.id}
                $active={activeFilter === cat.id}
                aria-pressed={activeFilter === cat.id}
                onClick={() => { setActiveFilter(cat.id); setShowAll(false); }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <cat.icon />
                <span>{cat.label}</span>
              </FilterTab>
            ))}
          </FilterTabs>
        </FilterTabsWrap>

        <AnimatePresence mode="wait">
          <SkillsGrid
            key={activeFilter}
            initial={reducedMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? undefined : { opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {visibleSkills.map((skill, index) => (
              <TiltCard key={skill.id}>
              <SkillCard
                initial={reducedMotion ? false : { opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: Math.min(index * 0.1, 0.5), ease: [0.4, 0, 0.2, 1] }}
                whileHover={reducedMotion ? undefined : { scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedSkill(skill)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedSkill(skill); } }}
              >
                <SkillHeader>
                  <IconTile
                    initial={reducedMotion ? false : { scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: Math.min(index * 0.1, 0.5) + 0.2, type: 'spring', damping: 15 }}
                  >
                    <skill.icon />
                  </IconTile>
                  <SkillInfo>
                    <SkillName>{skill.name}</SkillName>
                    <MetaRow>
                      <SkillLevel $level={skill.level}>{skill.level}</SkillLevel>
                      <Years>{skill.years}</Years>
                    </MetaRow>
                  </SkillInfo>
                </SkillHeader>

                <SkillDescription>{skill.description}</SkillDescription>

                <ToolChips>
                  {(skill.tools || []).slice(0, CARD_TOOL_COUNT).map(t => (
                    <ToolChip key={t}>{t}</ToolChip>
                  ))}
                  {(skill.tools || []).length > CARD_TOOL_COUNT && (
                    <ToolChip>+{skill.tools.length - CARD_TOOL_COUNT} more</ToolChip>
                  )}
                </ToolChips>

                <CardFooter>
                  {skill.proof && (
                    <ProofTag>
                      <FaCheckCircle /> Proof inside
                    </ProofTag>
                  )}
                  <ClickHint>How I use it →</ClickHint>
                </CardFooter>
              </SkillCard>
              </TiltCard>
            ))}
          </SkillsGrid>
        </AnimatePresence>

        {filteredSkills.length > previewCount && (
          <ShowMoreWrap>
            <ShowMoreButton
              onClick={() => setShowAll(prev => !prev)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {showAll
                ? 'Show fewer skills'
                : `Show all ${filteredSkills.length} skills`}
            </ShowMoreButton>
          </ShowMoreWrap>
        )}
      </Container>

      {/* ── Modal ── */}
      <Modal
        isOpen={!!selectedSkill}
        onClose={closeModal}
        labelledBy="skill-modal-title"
      >
        {selectedSkill && (
          <>
            <SkillModalHeader>
              <ModalIcon><selectedSkill.icon /></ModalIcon>
              <ModalTitleGroup>
                <ModalTitle id="skill-modal-title">{selectedSkill.name}</ModalTitle>
                <ModalMeta>
                  <LevelBadge $level={selectedSkill.level}>{selectedSkill.level}</LevelBadge>
                  <YearsBadge>{selectedSkill.years}</YearsBadge>
                </ModalMeta>
              </ModalTitleGroup>
            </SkillModalHeader>

            <ModalDescription>{selectedSkill.description}</ModalDescription>

            <Divider />

            <ModalSection>
              <SectionLabel>How I've used it</SectionLabel>
              <UsageList>
                {selectedSkill.usageItems.map((item, i) => (
                  <UsageItem key={i}>
                    <FaCheckCircle />
                    {item}
                  </UsageItem>
                ))}
              </UsageList>
            </ModalSection>

            {selectedSkill.tools?.length > 0 && (
              <>
                <Divider />
                <ModalSection>
                  <SectionLabel>Tools & Libraries</SectionLabel>
                  <ChipRow>
                    {selectedSkill.tools.map(t => (
                      <Chip key={t}>{t}</Chip>
                    ))}
                  </ChipRow>
                </ModalSection>
              </>
            )}

            {selectedSkill.proof && (
              <>
                <Divider />
                <ModalSection>
                  <SectionLabel>See it in action</SectionLabel>
                  {selectedSkill.proof.href.startsWith('http') ? (
                    <ProofLink
                      href={selectedSkill.proof.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {selectedSkill.proof.label} <FaExternalLinkAlt />
                    </ProofLink>
                  ) : (
                    <ProofLink
                      href={selectedSkill.proof.href}
                      onClick={closeModal}
                    >
                      {selectedSkill.proof.label} →
                    </ProofLink>
                  )}
                </ModalSection>
              </>
            )}
          </>
        )}
      </Modal>
    </Section>
  );
};

export default Skills;
