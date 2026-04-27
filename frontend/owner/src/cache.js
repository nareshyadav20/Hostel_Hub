/**
 * HostelHub – localStorage cache utility
 * All keys are namespaced with "hh_" to avoid collisions.
 * Data expires after TTL_MS (default 60 minutes).
 */

const PREFIX = 'hh_';
const TTL_MS = 60 * 60 * 1000; // 1 hour

/** Save data to localStorage with a timestamp. */
export const cacheSet = (key, data) => {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify({ data, ts: Date.now() }));
  } catch {
    // Storage might be full or disabled – silently ignore
  }
};

/**
 * Retrieve data from localStorage.
 * Returns null if key missing, corrupted, or expired.
 */
export const cacheGet = (key) => {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed.ts !== 'number') return null;
    if (Date.now() - parsed.ts > TTL_MS) {
      localStorage.removeItem(PREFIX + key); // clean up expired entry
      return null;
    }
    return parsed.data;
  } catch {
    return null;
  }
};

/** Check whether a non-expired entry exists for a key. */
export const cacheHas = (key) => cacheGet(key) !== null;

/** Delete a cached entry. */
export const cacheClear = (key) => {
  try { localStorage.removeItem(PREFIX + key); } catch { /* ignore */ }
};

/**
 * withCache – wraps an async API call with cache fallback.
 *
 * @param {string}   key      – cache key (without prefix)
 * @param {Function} fetchFn  – async function that returns fresh data
 * @param {*}        fallback – value returned when both API and cache fail
 * @returns {{ data, fromCache: boolean }}
 */
export const withCache = async (key, fetchFn, fallback = []) => {
  try {
    const data = await fetchFn();
    cacheSet(key, data);
    return { data, fromCache: false };
  } catch (err) {
    const cached = cacheGet(key);
    if (cached !== null) {
      return { data: cached, fromCache: true };
    }
    if (fallback === null) throw err; // Allow caller to handle the missing data via .catch()
    cacheSet(key, fallback); // Cache the fallback data so offline mutations persist
    return { data: fallback, fromCache: true };
  }
};
