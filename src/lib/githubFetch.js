const CACHE_PREFIX = 'gh-cache:';
const DEFAULT_TTL = 10 * 60 * 1000; // 10 minutes

/**
 * Fetches a GitHub REST API URL through a sessionStorage cache.
 *
 * GitHub allows only 60 unauthenticated requests/hour per IP, shared across
 * every tab/reload/tool hitting the API from this machine. Reusing a
 * recent response avoids burning that quota on repeat visits within a
 * session, and if a fresh fetch fails (e.g. a 403 from an exhausted quota)
 * a stale cache entry is served instead of surfacing an error.
 */
export async function fetchGithubJSON(url, ttlMs = DEFAULT_TTL) {
  const key = CACHE_PREFIX + url;
  let cached = null;
  try {
    const raw = sessionStorage.getItem(key);
    if (raw) cached = JSON.parse(raw);
  } catch {
    cached = null;
  }

  if (cached && Date.now() - cached.timestamp < ttlMs) {
    return cached.data;
  }

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`GitHub API error ${res.status}`);
    const data = await res.json();
    try {
      sessionStorage.setItem(key, JSON.stringify({ timestamp: Date.now(), data }));
    } catch {
      // sessionStorage full or unavailable (e.g. private browsing) - cache is best-effort
    }
    return data;
  } catch (err) {
    if (cached) return cached.data;
    throw err;
  }
}
