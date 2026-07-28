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
 * 60s edge cache, 300s stale-while-revalidate.
 */
export const CACHE_HEADERS: Record<string, string> = {
  'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
};
