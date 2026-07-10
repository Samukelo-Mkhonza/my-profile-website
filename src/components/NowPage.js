import styled from 'styled-components';
import PageShell from './PageShell';
import { now } from '../content/now';

const Updated = styled.p`
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-muted, #999);
  margin-bottom: 2rem;
`;

const ItemCard = styled.article`
  background: var(--bg-card, #fff);
  border: 2px solid var(--border-card, #e0e0e0);
  border-radius: var(--radius-card, 14px);
  box-shadow: var(--shadow-hard, 4px 4px 0 #111);
  padding: clamp(1.25rem, 3vw, 1.75rem);
  margin-bottom: 1rem;
  position: relative;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: var(--accent-orange, #ee5a24);
  }
`;

const ItemTitle = styled.h2`
  font-size: clamp(1rem, 2.5vw, 1.125rem);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-primary, #000);
  margin-bottom: 0.5rem;
`;

const ItemDetail = styled.p`
  font-size: clamp(0.875rem, 2vw, 0.9375rem);
  line-height: 1.7;
  color: var(--text-secondary, #555);
`;

const TodoBadge = styled.span`
  display: inline-block;
  margin-left: 0.5rem;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  padding: 0.15rem 0.5rem;
  border: 2px solid var(--border-card, #111);
  border-radius: var(--radius-pill, 999px);
  background: var(--tag-bg, #f0f0f0);
  color: var(--text-muted, #999);
  vertical-align: middle;
`;

const NowPage = ({ onClose }) => (
  <PageShell title="Now" subtitle={now.intro} onClose={onClose}>
    <Updated>Last updated {now.updated}</Updated>
    {now.items.map((item) => (
      <ItemCard key={item.title}>
        <ItemTitle>
          {item.title}
          {item.todo && <TodoBadge>To be filled in</TodoBadge>}
        </ItemTitle>
        <ItemDetail>{item.detail}</ItemDetail>
      </ItemCard>
    ))}
  </PageShell>
);

export default NowPage;
