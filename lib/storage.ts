import { Redis } from "@upstash/redis";
import type { WatchlistItem, TasteProfile } from "@/types";

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

// ── Watchlist ──────────────────────────────────────────────

export async function getWatchlist(userId: string): Promise<WatchlistItem[]> {
  try {
    const data = await redis.get<WatchlistItem[]>(`watchlist:${userId}`);
    return data || [];
  } catch {
    return [];
  }
}

export async function addToWatchlist(userId: string, item: WatchlistItem): Promise<void> {
  const list = await getWatchlist(userId);
  const exists = list.find((i) => i.movieId === item.movieId);
  if (!exists) {
    list.unshift(item);
    await redis.set(`watchlist:${userId}`, list);
  }
}

export async function removeFromWatchlist(userId: string, movieId: number): Promise<void> {
  const list = await getWatchlist(userId);
  const updated = list.filter((i) => i.movieId !== movieId);
  await redis.set(`watchlist:${userId}`, updated);
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
  await redis.set(`watchlist:${userId}`, updated);
}

export async function isInWatchlist(userId: string, movieId: number): Promise<boolean> {
  const list = await getWatchlist(userId);
  return list.some((i) => i.movieId === movieId);
}

// ── Taste Profile ──────────────────────────────────────────

export async function getTasteProfile(userId: string): Promise<TasteProfile | null> {
  try {
    return await redis.get<TasteProfile>(`taste:${userId}`);
  } catch {
    return null;
  }
}

export async function saveTasteProfile(userId: string, profile: TasteProfile): Promise<void> {
  await redis.set(`taste:${userId}`, { ...profile, lastUpdated: new Date().toISOString() });
}

export async function updateTasteProfile(userId: string, updates: Partial<TasteProfile>): Promise<void> {
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
  await redis.set(`taste:${userId}`, updated);
}

export async function rateMovie(
  userId: string,
  movieId: number,
  title: string,
  rating: number,
  posterPath: string | null
): Promise<void> {
  const profile = await getTasteProfile(userId) || {
    favoriteGenres: [], favoriteDecades: [], favoriteDirectors: [],
    moodPreferences: [], ratedMovies: [], lastUpdated: new Date().toISOString(),
  };
  const existing = profile.ratedMovies.findIndex((r) => r.movieId === movieId);
  if (existing >= 0) {
    profile.ratedMovies[existing].rating = rating;
  } else {
    profile.ratedMovies.unshift({ movieId, title, rating, posterPath });
  }
  profile.ratedMovies = profile.ratedMovies.slice(0, 50);
  profile.lastUpdated = new Date().toISOString();
  await redis.set(`taste:${userId}`, profile);
}
