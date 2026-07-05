import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FaCodeBranch } from 'react-icons/fa';
import PageShell from './PageShell';
import { profile } from '../content/profile';

// Build-in-public feed: the real commit history of this site, straight from
// the GitHub API (same unauthenticated pattern Projects.js already uses).
// No data is faked — if the API is unreachable we say so.

const CommitList = styled.ol`
  list-style: none;
  padding: 0;
  margin: 0;
  position: relative;

  &:before {
    content: '';
    position: absolute;
    left: 7px;
    top: 8px;
    bottom: 8px;
    width: 2px;
    background: var(--border-card, #e0e0e0);
  }
`;

const CommitItem = styled.li`
  position: relative;
  padding: 0 0 1.5rem 2rem;

  &:before {
    content: '';
    position: absolute;
    left: 2px;
    top: 6px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--text-primary, #000);
    border: 2px solid var(--bg-primary, #fff);
  }
`;

const CommitDate = styled.time`
  display: block;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-muted, #999);
  margin-bottom: 0.25rem;
`;

const CommitMessage = styled.a`
  display: inline-block;
  font-size: clamp(0.875rem, 2vw, 0.9375rem);
  line-height: 1.6;
  color: var(--text-primary, #000);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-color 0.2s;

  &:hover,
  &:focus-visible {
    border-bottom-color: var(--text-primary, #000);
  }
`;

const CommitSha = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  margin-left: 0.6rem;
  font-size: 0.7rem;
  color: var(--text-muted, #999);

  svg {
    font-size: 0.65rem;
  }
`;

const StatusText = styled.p`
  font-size: 0.9375rem;
  color: var(--text-secondary, #666);
  padding: 2rem 0;
`;

const RepoLink = styled.a`
  display: inline-block;
  margin-top: 1.5rem;
  font-size: 0.8125rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-primary, #000);
  border-bottom: 1px solid var(--text-primary, #000);
`;

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

const ChangelogPage = ({ onClose }) => {
  const [commits, setCommits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`https://api.github.com/repos/${profile.siteRepo}/commits?per_page=30`)
      .then((res) => {
        if (!res.ok) throw new Error(`GitHub API error ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setCommits(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <PageShell
      title="Changelog"
      subtitle="This site is built in public. Below is its real commit history, pulled live from GitHub — every feature, fix, and mistake."
      onClose={onClose}
    >
      {loading && <StatusText>Loading commit history…</StatusText>}
      {error && (
        <StatusText>
          Couldn't reach the GitHub API right now ({error}). The full history is on GitHub.
        </StatusText>
      )}
      {!loading && !error && (
        <CommitList>
          {commits.map((c) => (
            <CommitItem key={c.sha}>
              <CommitDate dateTime={c.commit.author.date}>
                {formatDate(c.commit.author.date)}
              </CommitDate>
              <CommitMessage href={c.html_url} target="_blank" rel="noopener noreferrer">
                {c.commit.message.split('\n')[0]}
                <CommitSha>
                  <FaCodeBranch aria-hidden="true" />
                  {c.sha.slice(0, 7)}
                </CommitSha>
              </CommitMessage>
            </CommitItem>
          ))}
        </CommitList>
      )}
      <RepoLink
        href={`https://github.com/${profile.siteRepo}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        View the repository →
      </RepoLink>
    </PageShell>
  );
};

export default ChangelogPage;
