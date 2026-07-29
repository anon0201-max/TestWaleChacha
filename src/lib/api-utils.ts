/** Number of free tests a new student gets before needing a subscription. */
export const FREE_TEST_LIMIT = 2;

/**
 * Strips MongoDB internal fields (_id, __v) from response data.
 * Handles plain objects, arrays, and nested structures from .lean() queries.
 */
export function stripMongoFields<T>(data: T): T {
  if (data === null || data === undefined) return data;
  if (Array.isArray(data)) return data.map(stripMongoFields) as T;
  if (typeof data === 'object') {
    const clean = { ...data } as Record<string, unknown>;
    delete clean._id;
    delete clean.__v;
    // Recurse into nested objects (but not Dates, which are also typeof 'object')
    for (const key of Object.keys(clean)) {
      const val = clean[key];
      if (val && typeof val === 'object' && !(val instanceof Date)) {
        clean[key] = stripMongoFields(val);
      }
    }
    return clean as T;
  }
  return data;
}

/**
 * Standard cache control headers for read-only GET endpoints.
 * 120s edge cache, 600s stale-while-revalidate.
 */
export const CACHE_HEADERS: Record<string, string> = {
  'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=600',
};

/**
 * Cache headers for rarely-changing data (categories, static lists).
 * 300s edge cache (5 min), 1hr stale-while-revalidate.
 */
export const LONG_CACHE_HEADERS: Record<string, string> = {
  'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600',
};

// ─── In-Memory Response Cache ────────────────────────────────────────
// Reduces repeated MongoDB Atlas calls within the same server process.

interface CacheEntry<T = unknown> {
  data: T;
  expiresAt: number;
}

const memoryCache = new Map<string, CacheEntry>();

/**
 * Get cached data if still fresh.
 */
export function getFromCache<T>(key: string): T | null {
  const entry = memoryCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    memoryCache.delete(key);
    return null;
  }
  return entry.data as T;
}

/**
 * Store data in memory cache with a TTL (in seconds).
 */
export function setCache<T>(key: string, data: T, ttlSeconds: number): void {
  memoryCache.set(key, {
    data,
    expiresAt: Date.now() + ttlSeconds * 1000,
  });
  // Prevent unbounded growth — evict oldest entries when cache is too large
  if (memoryCache.size > 200) {
    const oldest = memoryCache.keys().next().value;
    if (oldest) memoryCache.delete(oldest);
  }
}

/**
 * Clear cache entries matching a prefix. Useful after admin mutations.
 */
export function clearCacheByPrefix(prefix: string): void {
  for (const key of memoryCache.keys()) {
    if (key.startsWith(prefix)) memoryCache.delete(key);
  }
}

/**
 * Build a cache key from a path + sorted query params.
 */
export function buildCacheKey(path: string, params?: Record<string, string>): string {
  if (!params || Object.keys(params).length === 0) return path;
  const sorted = Object.entries(params)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join('&');
  return `${path}?${sorted}`;
}
