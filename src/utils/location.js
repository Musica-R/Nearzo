// Shared helpers for the user's chosen location (city / GPS / radius).
//
// - Stored per user:  lokal_location_<userId>   (guests: lokal_location)
// - A saved location is valid for 7 days. After that it is "stale":
//   it is no longer used for filtering, but it is kept so the popup can
//   pre-fill it and ask "Still here?".
// - Saving again (from the popup or the LocationBar) resets the 7 days.

export const STORAGE_KEY = "lokal_location";
export const LOCATION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 1 week
export const DEFAULT_RADIUS = 25;
export const RADIUS_OPTIONS = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 100, 200];
export const QUICK_RADII = [5, 10, 25, 50, 100, 200];

const keyFor = (userId) => (userId ? `${STORAGE_KEY}_${userId}` : STORAGE_KEY);
const EMPTY = { current: null, stale: null };

/** Returns { current, stale }. Exactly one of them can be non-null. */
export const readLocation = (userId) => {
  try {
    const raw = localStorage.getItem(keyFor(userId));
    if (!raw) return { ...EMPTY };
    const saved = JSON.parse(raw);
    if (!saved || !saved.savedAt) {
      localStorage.removeItem(keyFor(userId));
      return { ...EMPTY };
    }
    if (Date.now() - saved.savedAt > LOCATION_TTL_MS) {
      return { current: null, stale: saved };
    }
    return { current: saved, stale: null };
  } catch {
    return { ...EMPTY };
  }
};

export const writeLocation = (userId, value) => {
  try {
    if (value) localStorage.setItem(keyFor(userId), JSON.stringify(value));
    else localStorage.removeItem(keyFor(userId));
  } catch {
    /* storage full / blocked: ignore, the in-memory store still works */
  }
};

export const hasCoords = (l) =>
  !!l && l.latitude != null && l.longitude != null;

export const hasPlace = (l) => !!l && (l.cityId != null || hasCoords(l));

/**
 * Query params to send with every list request.
 * Rename the keys here once and every page follows.
 */
export const toQueryParams = (l) => {
  if (!hasPlace(l)) return {};
  const params = { radius: l.radius || DEFAULT_RADIUS };
  if (l.cityId != null) params.city_id = l.cityId;
  if (hasCoords(l)) {
    params.latitude = l.latitude;
    params.longitude = l.longitude;
  }
  return params;
};