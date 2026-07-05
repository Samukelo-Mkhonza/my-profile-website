import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaCheckCircle, FaExternalLinkAlt } from 'react-icons/fa';
import TiltCard from './TiltCard';
import useIsNarrowViewport from '../lib/useIsNarrowViewport';
import { skillCategories, skillsData } from '../content/skills';

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
  font-weight: 700;
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

const FilterTabs = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: clamp(0.5rem, 2vw, 1rem);
  margin-bottom: clamp(2rem, 4vw, 3rem);
  padding: 0 clamp(0.5rem, 2vw, 1rem);
  @media (max-width: 640px) {
    justify-content: flex-start;
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    -ms-overflow-style: none;
    padding-bottom: 0.5rem;
    margin-bottom: clamp(1.5rem, 4vw, 2rem);
    &::-webkit-scrollbar { display: none; }
  }
  @media (max-width: 360px) { gap: 0.375rem; }
`;

const FilterTab = styled(motion.button)`
  background: ${p => p.$active ? 'var(--accent, #000)' : 'transparent'};
  color: ${p => p.$active ? 'var(--accent-inverse, #fff)' : 'var(--text-secondary, #666)'};
  border: 2px solid var(--accent, #000);
  padding: clamp(0.625rem, 2vw, 0.875rem) clamp(1rem, 3vw, 1.5rem);
  border-radius: 8px;
  font-size: clamp(0.75rem, 1.75vw, 0.9375rem);
  font-weight: 600;
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
  background: transparent;
  color: var(--text-primary, #000);
  border: 2px solid var(--accent, #000);
  padding: clamp(0.625rem, 2vw, 0.875rem) clamp(1.5rem, 4vw, 2.5rem);
  border-radius: 8px;
  font-size: clamp(0.75rem, 1.75vw, 0.9375rem);
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

/* ─── Grid & Cards ────────────────────────────────────────────────────────── */

const SkillsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr));
  gap: clamp(1.25rem, 3vw, 2rem);
  @media (max-width: 900px) { grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr)); }
  @media (max-width: 640px) { grid-template-columns: 1fr; gap: clamp(1rem, 3vw, 1.5rem); }
  @media (max-width: 360px) { gap: 0.875rem; }
`;

const SkillCard = styled(motion.div)`
  background: var(--skill-card-bg, #f8f9fa);
  border: 2px solid var(--border-card, #e9ecef);
  border-radius: 12px;
  padding: clamp(1.25rem, 3vw, 2rem);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  height: 100%;
  @media (hover: hover) {
    &:hover {
      box-shadow: 0 20px 40px rgba(0,0,0,0.15);
      border-color: var(--accent, #000);
      background: var(--bg-card, #fff);
    }
  }
  &:active { transform: scale(0.98); }
  &:before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 4px;
    background: linear-gradient(90deg, var(--accent, #000) 0%, var(--text-secondary, #666) 100%);
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

const IconWrapper = styled(motion.div)`
  font-size: clamp(2rem, 5vw, 2.5rem);
  color: var(--text-primary, #000);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: clamp(2rem, 5vw, 2.5rem);
  @media (hover: hover) { ${SkillCard}:hover & { transform: scale(1.15) rotate(5deg); color: var(--text-secondary, #333); } }
  @media (max-width: 480px) { font-size: clamp(1.75rem, 6vw, 2.25rem); }
  @media (max-width: 360px) { font-size: 1.5rem; min-width: 1.5rem; }
`;

const SkillInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const SkillName = styled.h3`
  font-size: clamp(1rem, 2.5vw, 1.375rem);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 0.25rem 0;
  color: var(--text-primary, #000);
  line-height: 1.2;
  @media (max-width: 480px) { font-size: clamp(0.9375rem, 3vw, 1.125rem); }
  @media (max-width: 360px) { font-size: 0.875rem; letter-spacing: 0.02em; }
`;

const SkillLevel = styled.span`
  font-size: clamp(0.6875rem, 1.75vw, 0.875rem);
  color: var(--text-secondary, #6c757d);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 600;
  display: inline-block;
  background: var(--tag-bg, #e9ecef);
  padding: 0.125rem 0.5rem;
  border-radius: 4px;
  @media (max-width: 360px) { font-size: 0.625rem; letter-spacing: 0.05em; padding: 0.125rem 0.375rem; }
`;

const SkillDescription = styled.p`
  font-size: clamp(0.8125rem, 2vw, 1rem);
  line-height: 1.7;
  color: var(--text-secondary, #495057);
  margin-bottom: clamp(0.75rem, 2vw, 1rem);
  @media (max-width: 480px) { font-size: clamp(0.75rem, 2.5vw, 0.875rem); line-height: 1.6; }
  @media (max-width: 360px) { font-size: 0.75rem; margin-bottom: 0.625rem; line-height: 1.5; }
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: clamp(0.5rem, 2vw, 0.75rem);
  margin-top: clamp(0.75rem, 2vw, 1rem);
  @media (max-width: 360px) { gap: 0.375rem; margin-top: 0.625rem; }
`;

const Years = styled.span`
  font-size: clamp(0.6875rem, 1.75vw, 0.875rem);
  color: var(--text-secondary, #6c757d);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  @media (max-width: 360px) { font-size: 0.625rem; }
`;

const ClickHint = styled.span`
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-primary, #000);
  opacity: 0;
  transition: opacity 0.2s;
  ${SkillCard}:hover &,
  ${SkillCard}:focus-visible & { opacity: 1; }
`;

/* ─── Modal ───────────────────────────────────────────────────────────────── */

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
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
  max-width: 580px;
  max-height: 90vh;
  overflow-y: auto;
  padding: clamp(1.5rem, 5vw, 2.5rem);
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  &:focus { outline: none; }
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

const ModalHeader = styled.div`
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

const ModalTitle = styled.h2`
  font-size: clamp(1.25rem, 4vw, 1.75rem);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-primary, #000);
  line-height: 1.1;
  margin: 0;
`;

const ModalMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const LevelBadge = styled.span`
  font-size: 0.75rem;
  color: var(--text-secondary, #6c757d);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 600;
  background: var(--tag-bg, #e9ecef);
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
`;

const YearsBadge = styled.span`
  font-size: 0.8rem;
  color: var(--text-secondary, #666);
  font-weight: 500;
`;

const ModalDescription = styled.p`
  font-size: clamp(0.875rem, 2vw, 1rem);
  line-height: 1.8;
  color: var(--text-secondary, #555);
  margin: 0;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid var(--border-card, #e0e0e0);
  margin: 0;
`;

const SectionLabel = styled.span`
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--text-secondary, #888);
`;

const ModalSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
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

const ToolsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const ToolChip = styled.span`
  background: var(--tag-bg, #f0f0f0);
  color: var(--text-secondary, #444);
  padding: 0.3rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
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

const Skills = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const previewCount = useIsNarrowViewport() ? PREVIEW_COUNT_NARROW : PREVIEW_COUNT;
  const modalRef = useRef(null);

  const closeModal = useCallback(() => setSelectedSkill(null), []);

  // Dialog behaviour while the modal is open: lock body scroll, move focus
  // into the dialog, trap Tab inside it, close on Escape, and hand focus back
  // to the card that opened it.
  useEffect(() => {
    if (!selectedSkill) return;
    const openerElement = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    modalRef.current?.focus();

    const onKey = (e) => {
      if (e.key === 'Escape') { closeModal(); return; }
      if (e.key !== 'Tab' || !modalRef.current) return;
      const focusables = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || active === modalRef.current)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
      if (openerElement instanceof HTMLElement) openerElement.focus();
    };
  }, [selectedSkill, closeModal]);

  const filteredSkills = activeFilter === 'all'
    ? skillsData
    : skillsData.filter(s => s.category === activeFilter);

  const visibleSkills = showAll ? filteredSkills : filteredSkills.slice(0, previewCount);

  return (
    <Section id="skills">
      <Container>
        <Heading
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Skills & Technologies
        </Heading>

        <FilterTabs>
          {skillCategories.map(cat => (
            <FilterTab
              key={cat.id}
              $active={activeFilter === cat.id}
              onClick={() => { setActiveFilter(cat.id); setShowAll(false); }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <cat.icon />
              <span>{cat.label}</span>
            </FilterTab>
          ))}
        </FilterTabs>

        <AnimatePresence mode="wait">
          <SkillsGrid
            key={activeFilter}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {visibleSkills.map((skill, index) => (
              <TiltCard key={skill.id}>
              <SkillCard
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: Math.min(index * 0.1, 0.5), ease: [0.4, 0, 0.2, 1] }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedSkill(skill)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedSkill(skill); } }}
              >
                <SkillHeader>
                  <IconWrapper
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: Math.min(index * 0.1, 0.5) + 0.2, type: 'spring', damping: 15 }}
                  >
                    <skill.icon />
                  </IconWrapper>
                  <SkillInfo>
                    <SkillName>{skill.name}</SkillName>
                    <SkillLevel>{skill.level}</SkillLevel>
                  </SkillInfo>
                </SkillHeader>

                <SkillDescription>{skill.description}</SkillDescription>

                <CardFooter>
                  <Years>{skill.years} experience</Years>
                  <ClickHint>See how I use it →</ClickHint>
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
      <AnimatePresence>
        {selectedSkill && (
          <Overlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <Modal
              ref={modalRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="skill-modal-title"
              tabIndex={-1}
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

              <ModalHeader>
                <ModalIcon><selectedSkill.icon /></ModalIcon>
                <ModalTitleGroup>
                  <ModalTitle id="skill-modal-title">{selectedSkill.name}</ModalTitle>
                  <ModalMeta>
                    <LevelBadge>{selectedSkill.level}</LevelBadge>
                    <YearsBadge>{selectedSkill.years}</YearsBadge>
                  </ModalMeta>
                </ModalTitleGroup>
              </ModalHeader>

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
                    <ToolsRow>
                      {selectedSkill.tools.map(t => (
                        <ToolChip key={t}>{t}</ToolChip>
                      ))}
                    </ToolsRow>
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
            </Modal>
          </Overlay>
        )}
      </AnimatePresence>
    </Section>
  );
};

export default Skills;
