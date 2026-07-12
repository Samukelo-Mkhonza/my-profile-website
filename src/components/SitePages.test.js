import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '../context/ThemeContext';
import SitePages, { getRouteFromHash, PAGES } from './SitePages';

const renderSitePages = () =>
  render(
    <ThemeProvider>
      <SitePages />
    </ThemeProvider>
  );

afterEach(() => {
  window.history.replaceState(null, '', window.location.pathname);
});

describe('getRouteFromHash', () => {
  test('extracts page routes from #/ hashes', () => {
    expect(getRouteFromHash('#/now')).toBe('now');
    expect(getRouteFromHash('#/Case-Studies')).toBe('case-studies');
  });

  test('ignores plain section anchors and empty hashes', () => {
    expect(getRouteFromHash('#about')).toBeNull();
    expect(getRouteFromHash('')).toBeNull();
    expect(getRouteFromHash(undefined)).toBeNull();
  });
});

describe('SitePages', () => {
  test('renders only the terminal button by default', () => {
    renderSitePages();
    expect(
      screen.getByRole('button', { name: /open interactive terminal/i })
    ).toBeInTheDocument();
    expect(screen.queryByRole('region')).not.toBeInTheDocument();
  });

  test('opens the terminal from the floating button', async () => {
    renderSitePages();
    fireEvent.click(screen.getByRole('button', { name: /open interactive terminal/i }));
    // Terminal is React.lazy-loaded, so it appears asynchronously.
    expect(await screen.findByRole('region', { name: /interactive terminal/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/terminal command input/i)).toBeInTheDocument();
  });

  test('Ctrl+` toggles the terminal', async () => {
    renderSitePages();
    fireEvent.keyDown(window, { key: '`', ctrlKey: true });
    expect(await screen.findByRole('region', { name: /interactive terminal/i })).toBeInTheDocument();
  });

  test('renders the Now page when the hash points at it', async () => {
    window.location.hash = '#/now';
    renderSitePages();
    // NowPage is React.lazy-loaded, so it appears asynchronously.
    expect(await screen.findByRole('heading', { name: /^now$/i })).toBeInTheDocument();
  });

  test('every registered page renders inside the shell', async () => {
    // Sanity-check the route table: each page component mounts without crashing.
    for (const route of Object.keys(PAGES)) {
      window.location.hash = `#/${route}`;
      const { unmount } = renderSitePages();
      // Each page is React.lazy-loaded, so it appears asynchronously.
      expect(await screen.findByRole('button', { name: /back to site/i })).toBeInTheDocument();
      unmount();
      window.history.replaceState(null, '', window.location.pathname);
    }
  });
});
