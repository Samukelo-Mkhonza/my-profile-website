import { useMemo, useState } from 'react';
import styled from 'styled-components';
import PageShell from './PageShell';
import { tilNotes } from '../content/til';

const TagRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 2rem;
`;

const TagButton = styled.button`
  background: ${(p) => (p.$active ? 'var(--text-primary, #000)' : 'var(--tag-bg, #f0f0f0)')};
  color: ${(p) => (p.$active ? 'var(--accent-inverse, #fff)' : 'var(--text-secondary, #333)')};
  border: none;
  border-radius: 4px;
  padding: 0.35rem 0.75rem;
  font-family: inherit;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
  min-height: 32px;
  transition: background 0.2s, color 0.2s;

  &:hover,
  &:focus-visible {
    background: var(--text-primary, #000);
    color: var(--accent-inverse, #fff);
  }
`;

const NoteCard = styled.article`
  background: var(--bg-card, #fff);
  border: 1px solid var(--border-card, #e0e0e0);
  border-radius: 8px;
  padding: clamp(1.25rem, 3vw, 1.75rem);
  margin-bottom: 1rem;
`;

const NoteDate = styled.time`
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-muted, #999);
  display: block;
  margin-bottom: 0.5rem;
`;

const NoteTitle = styled.h2`
  font-size: clamp(1rem, 2.5vw, 1.125rem);
  font-weight: 600;
  color: var(--text-primary, #000);
  margin-bottom: 0.5rem;
  line-height: 1.4;
`;

const NoteBody = styled.p`
  font-size: clamp(0.875rem, 2vw, 0.9375rem);
  line-height: 1.7;
  color: var(--text-secondary, #555);
  margin-bottom: 0.75rem;
`;

const NoteTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
`;

const NoteTag = styled.span`
  background: var(--tag-bg, #f0f0f0);
  color: var(--text-secondary, #666);
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.05em;
`;

const GardenPage = ({ onClose }) => {
  const [activeTag, setActiveTag] = useState('all');

  const tags = useMemo(
    () => ['all', ...Array.from(new Set(tilNotes.flatMap((n) => n.tags)))],
    []
  );

  const visible =
    activeTag === 'all' ? tilNotes : tilNotes.filter((n) => n.tags.includes(activeTag));

  return (
    <PageShell
      title="Today I Learned"
      subtitle="Short, dated notes from the trenches — a digital garden more than a blog. Small enough to write on the day I learn them."
      onClose={onClose}
    >
      <TagRow role="group" aria-label="Filter notes by tag">
        {tags.map((tag) => (
          <TagButton
            key={tag}
            $active={activeTag === tag}
            onClick={() => setActiveTag(tag)}
            aria-pressed={activeTag === tag}
          >
            {tag}
          </TagButton>
        ))}
      </TagRow>
      {visible.map((note) => (
        <NoteCard key={`${note.date}-${note.title}`}>
          <NoteDate dateTime={note.date}>{note.date}</NoteDate>
          <NoteTitle>{note.title}</NoteTitle>
          <NoteBody>{note.body}</NoteBody>
          <NoteTags>
            {note.tags.map((tag) => (
              <NoteTag key={tag}>{tag}</NoteTag>
            ))}
          </NoteTags>
        </NoteCard>
      ))}
    </PageShell>
  );
};

export default GardenPage;
