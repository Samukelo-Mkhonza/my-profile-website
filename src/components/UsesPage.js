import styled from 'styled-components';
import PageShell from './PageShell';
import { uses } from '../content/uses';

const SectionBlock = styled.section`
  margin-bottom: clamp(2rem, 4vw, 2.5rem);
`;

const SectionTitle = styled.h2`
  font-size: clamp(1rem, 2.5vw, 1.25rem);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-primary, #000);
  margin-bottom: 1rem;
`;

const ItemList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 0.75rem;

  /* Phones: single column, items stacked */
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const Item = styled.li`
  background: var(--bg-card, #fff);
  border: 2px solid var(--border-card, #e0e0e0);
  border-radius: var(--radius-sm, 10px);
  box-shadow: var(--shadow-hard-sm, 3px 3px 0 #111);
  padding: 1rem 1.25rem;
  opacity: ${(p) => (p.$todo ? 0.6 : 1)};
`;

const ItemName = styled.span`
  display: block;
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--text-primary, #000);
  margin-bottom: 0.25rem;
`;

const ItemNote = styled.span`
  display: block;
  font-size: 0.8125rem;
  line-height: 1.6;
  color: var(--text-secondary, #666);
`;

const UsesPage = ({ onClose }) => (
  <PageShell title="Uses" subtitle={uses.intro} onClose={onClose}>
    {uses.sections.map((section) => (
      <SectionBlock key={section.title}>
        <SectionTitle>{section.title}</SectionTitle>
        <ItemList>
          {section.items.map((item, i) => (
            <Item key={`${item.name}-${i}`} $todo={item.todo}>
              <ItemName>{item.name}</ItemName>
              <ItemNote>{item.note}</ItemNote>
            </Item>
          ))}
        </ItemList>
      </SectionBlock>
    ))}
  </PageShell>
);

export default UsesPage;
