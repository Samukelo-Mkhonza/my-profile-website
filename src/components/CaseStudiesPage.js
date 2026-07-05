import styled from 'styled-components';
import PageShell from './PageShell';
import { caseStudies } from '../content/caseStudies';

const StudyCard = styled.article`
  background: var(--bg-card, #fff);
  border: 1px solid var(--border-card, #e0e0e0);
  border-radius: 8px;
  padding: clamp(1.5rem, 3vw, 2rem);
  margin-bottom: 1.5rem;
  position: relative;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--text-primary, #000), var(--text-secondary, #333));
  }
`;

const StudyTitle = styled.h2`
  font-size: clamp(1.125rem, 3vw, 1.375rem);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-primary, #000);
  margin-bottom: 0.25rem;
  line-height: 1.3;
`;

const StudyContext = styled.p`
  font-size: 0.8125rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted, #999);
  margin-bottom: 1rem;
`;

const StackRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-bottom: 1.25rem;
`;

const StackChip = styled.span`
  background: var(--tag-bg, #f0f0f0);
  color: var(--text-secondary, #444);
  padding: 0.25rem 0.7rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const Step = styled.div`
  margin-bottom: 1rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const StepLabel = styled.h3`
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--text-secondary, #888);
  margin-bottom: 0.35rem;
`;

const StepBody = styled.p`
  font-size: clamp(0.875rem, 2vw, 0.9375rem);
  line-height: 1.7;
  color: var(--text-secondary, #555);
`;

const steps = [
  ['The problem', 'problem'],
  ['The architecture decision', 'decision'],
  ['The outcome', 'outcome'],
  ["What I'd change", 'whatIdChange'],
];

const CaseStudiesPage = ({ onClose }) => (
  <PageShell
    title="Case Studies"
    subtitle="The projects that taught me the most, written up honestly: the problem, the call I made, how it played out, and what I'd do differently."
    onClose={onClose}
  >
    {caseStudies.map((study) => (
      <StudyCard key={study.slug}>
        <StudyTitle>{study.title}</StudyTitle>
        <StudyContext>{study.context}</StudyContext>
        <StackRow>
          {study.stack.map((item) => (
            <StackChip key={item}>{item}</StackChip>
          ))}
        </StackRow>
        {steps.map(([label, key]) => (
          <Step key={key}>
            <StepLabel>{label}</StepLabel>
            <StepBody>{study[key]}</StepBody>
          </Step>
        ))}
      </StudyCard>
    ))}
  </PageShell>
);

export default CaseStudiesPage;
