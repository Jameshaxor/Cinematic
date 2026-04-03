import { kv } from "@vercel/kv";
import type { WatchlistItem, TasteProfile } from "@/types";

// ── Watchlist ──────────────────────────────────────────────

export async function getWatchlist(userId: string): Promise<WatchlistItem[]> {
  try {
    const data = await kv.get<WatchlistItem[]>(`watchlist:${userId}`);
    return data || [];
  } catch {
    return [];
  }
}

export async function addToWatchlist(
  userId: string,
  item: WatchlistItem
): Promise<void> {
  const list = await getWatchlist(userId);
  const exists = list.find((i) => i.movieId === item.movieId);
  if (!exists) {
    list.unshift(item);
    await kv.set(`watchlist:${userId}`, list);
  }
}

export async function removeFromWatchlist(
  userId: string,
  movieId: number
): Promise<void> {
  const list = await getWatchlist(userId);
  const updated = list.filter((i) => i.movieId !== movieId);
  await kv.set(`watchlist:${userId}`, updated);
}

export async function updateWatchlistItem(
  userId: string,
  movieId: number,
  updates: Partial<WatchlistItem>
): Promise<void> {
  const list = await getWatchlist(userId);
  const updated = list.map((item) =>
    item.movieId === movieId ? { ...item, ...updates } : item
  );
  await kv.set(`watchlist:${userId}`, updated);
}

export async function isInWatchlist(
  userId: string,
  movieId: number
): Promise<boolean> {
  const list = await getWatchlist(userId);
  return list.some((i) => i.movieId === movieId);
}

// ── Taste Profile ──────────────────────────────────────────

export async function getTasteProfile(userId: string): Promise<TasteProfile | null> {
  try {
    return await kv.get<TasteProfile>(`taste:${userId}`);
  } catch {
    return null;
  }
}

export async function saveTasteProfile(
  userId: string,
  profile: TasteProfile
): Promise<void> {
  await kv.set(`taste:${userId}`, {
    ...profile,
    lastUpdated: new Date().toISOString(),
  });
}

export async function updateTasteProfile(
  userId: string,
  updates: Partial<TasteProfile>
): Promise<void> {
  const existing = await getTasteProfile(userId);
  const updated: TasteProfile = {
    favoriteGenres: [],
    favoriteDecades: [],
    favoriteDirectors: [],
    moodPreferences: [],
    ratedMovies: [],
    lastUpdated: new Date().toISOString(),
    ...existing,
    ...updates,
  };
  await kv.set(`taste:${userId}`, updated);
}

// ── Rate a Movie (updates taste profile) ──────────────────

export async function rateMovie(
  userId: string,
  movieId: number,
  title: string,
  rating: number,
  posterPath: string | null
): Promise<void> {
  const profile = await getTasteProfile(userId) || {
    favoriteGenres: [],
    favoriteDecades: [],
    favoriteDirectors: [],
    moodPreferences: [],
    ratedMovies: [],
    lastUpdated: new Date().toISOString(),
  };

  const existing = profile.ratedMovies.findIndex((r) => r.movieId === movieId);
  if (existing >= 0) {
    profile.ratedMovies[existing].rating = rating;
  } else {
    profile.ratedMovies.unshift({ movieId, title, rating, posterPath });
  }

  // Keep only last 50 ratings
  profile.ratedMovies = profile.ratedMovies.slice(0, 50);
  profile.lastUpdated = new Date().toISOString();

  await kv.set(`taste:${userId}`, profile);
}
