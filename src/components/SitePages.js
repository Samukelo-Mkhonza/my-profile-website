import { useCallback, useEffect, useState, lazy, Suspense } from 'react';
import styled from 'styled-components';
import { AnimatePresence } from 'framer-motion';

// These pages are only ever reached via a #/<route> hash, so they're code-split
// out of the main bundle instead of paying their parse/eval cost on every load.
const NowPage = lazy(() => import('./NowPage'));
const UsesPage = lazy(() => import('./UsesPage'));
const GardenPage = lazy(() => import('./GardenPage'));
const CaseStudiesPage = lazy(() => import('./CaseStudiesPage'));
const ChangelogPage = lazy(() => import('./ChangelogPage'));
const PlaygroundPage = lazy(() => import('./PlaygroundPage'));
const Terminal = lazy(() => import('./Terminal'));

// Tiny hash router for the "extra" pages. Regular section anchors (#about,
// #projects…) keep working untouched; only hashes shaped like #/<route> are
// treated as pages. Hash-based so it works identically on GitHub Pages
// (subpath) and CloudFront (root) with zero server config.

export const PAGES = {
  now: NowPage,
  uses: UsesPage,
  til: GardenPage,
  'case-studies': CaseStudiesPage,
  changelog: ChangelogPage,
  playground: PlaygroundPage,
};

export const getRouteFromHash = (hash) =>
  hash && hash.startsWith('#/') ? hash.slice(2).toLowerCase() : null;

// Drop the #/route from the URL without scrolling or adding history entries.
const clearHash = () => {
  window.history.replaceState(null, '', window.location.pathname + window.location.search);
};

const TerminalFab = styled.button`
  position: fixed;
  bottom: 2rem;
  left: 2rem;
  z-index: 1100;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  border: 2px solid var(--border-card, #e0e0e0);
  background: var(--glass-bg, rgba(255, 255, 255, 0.95));
  color: var(--text-primary, #000);
  font-family: inherit;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: var(--shadow-hard-sm, 3px 3px 0 #111);
  transition: transform 0.2s, background 0.2s, color 0.2s;

  &:hover,
  &:focus-visible {
    background: var(--text-primary, #000);
    color: var(--accent-inverse, #fff);
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    bottom: 1rem;
    left: 1rem;
    width: 2.75rem;
    height: 2.75rem;
  }
`;

const SitePages = () => {
  const [route, setRoute] = useState(null);
  const [terminalOpen, setTerminalOpen] = useState(false);

  // Resolve the hash (on load and on every change) into either a page route
  // or the terminal overlay.
  useEffect(() => {
    const resolve = () => {
      const r = getRouteFromHash(window.location.hash);
      if (r === 'terminal') {
        setTerminalOpen(true);
        clearHash();
        return;
      }
      // Unknown or absent route closes any open page, so the browser back
      // button behaves as expected.
      setRoute(r && PAGES[r] ? r : null);
    };
    resolve();
    window.addEventListener('hashchange', resolve);
    return () => window.removeEventListener('hashchange', resolve);
  }, []);

  // Ctrl+` (backtick) toggles the terminal, like most editors.
  useEffect(() => {
    const onKey = (e) => {
      if (e.ctrlKey && !e.shiftKey && !e.altKey && e.key === '`') {
        e.preventDefault();
        setTerminalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const closePage = useCallback(() => {
    clearHash();
    setRoute(null);
  }, []);

  const navigate = useCallback((r) => {
    setTerminalOpen(false);
    if (PAGES[r]) {
      window.history.replaceState(null, '', `#/${r}`);
      setRoute(r);
    }
  }, []);

  const ActivePage = route ? PAGES[route] : null;

  return (
    <>
      <Suspense fallback={null}>
        <AnimatePresence>
          {ActivePage && <ActivePage key={route} onClose={closePage} />}
        </AnimatePresence>

        <AnimatePresence>
          {terminalOpen && (
            <Terminal onClose={() => setTerminalOpen(false)} onNavigate={navigate} />
          )}
        </AnimatePresence>
      </Suspense>

      {!terminalOpen && (
        <TerminalFab
          onClick={() => setTerminalOpen(true)}
          aria-label="Open interactive terminal (Ctrl + backtick)"
          title="Open terminal (Ctrl+`)"
        >
          ❯_
        </TerminalFab>
      )}
    </>
  );
};

export default SitePages;
