import type { Movie, MovieListResult, Genre } from "@/types";

const BASE_URL = process.env.TMDB_BASE_URL || "https://api.themoviedb.org/3";
const API_KEY = process.env.TMDB_API_KEY!;
export const IMG_BASE = "https://image.tmdb.org/t/p";

// Image size helpers
export const posterUrl = (path: string | null, size: "w342" | "w500" | "w780" | "original" = "w500") =>
  path ? `${IMG_BASE}/${size}${path}` : "/placeholder-poster.jpg";

export const backdropUrl = (path: string | null, size: "w780" | "w1280" | "original" = "w1280") =>
  path ? `${IMG_BASE}/${size}${path}` : "/placeholder-backdrop.jpg";

export const profileUrl = (path: string | null, size: "w185" | "w342" = "w185") =>
  path ? `${IMG_BASE}/${size}${path}` : "/placeholder-profile.jpg";

// Core fetch with error handling
async function tmdbFetch<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set("api_key", API_KEY);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url.toString(), {
    next: { revalidate: 3600 }, // Cache for 1 hour
  });

  if (!res.ok) throw new Error(`TMDB API error: ${res.status} ${res.statusText}`);
  return res.json();
}

// ── Trending & Discovery ───────────────────────────────────

export async function getTrending(timeWindow: "day" | "week" = "week"): Promise<MovieListResult> {
  return tmdbFetch(`/trending/movie/${timeWindow}`);
}

export async function getNowPlaying(): Promise<MovieListResult> {
  return tmdbFetch("/movie/now_playing");
}

export async function getTopRated(page = 1): Promise<MovieListResult> {
  return tmdbFetch("/movie/top_rated", { page: String(page) });
}

export async function getUpcoming(): Promise<MovieListResult> {
  return tmdbFetch("/movie/upcoming");
}

export async function getPopular(page = 1): Promise<MovieListResult> {
  return tmdbFetch("/movie/popular", { page: String(page) });
}

// ── Movie Details ──────────────────────────────────────────

export async function getMovieDetails(id: number): Promise<Movie> {
  return tmdbFetch(`/movie/${id}`, {
    append_to_response: "credits,videos,similar,keywords",
  });
}

// ── Search ─────────────────────────────────────────────────

export async function searchMovies(query: string, page = 1): Promise<MovieListResult> {
  return tmdbFetch("/search/movie", { query, page: String(page), include_adult: "false" });
}

// ── Discovery with Filters ─────────────────────────────────

export interface DiscoverParams {
  genres?: number[];
  decade?: string;
  minRating?: number;
  sortBy?: string;
  page?: number;
  withKeywords?: string;
}

export async function discoverMovies(params: DiscoverParams = {}): Promise<MovieListResult> {
  const p: Record<string, string> = {
    sort_by: params.sortBy || "popularity.desc",
    page: String(params.page || 1),
    include_adult: "false",
    "vote_count.gte": "100",
  };

  if (params.genres?.length) p.with_genres = params.genres.join(",");
  if (params.minRating) p["vote_average.gte"] = String(params.minRating);
  if (params.withKeywords) p.with_keywords = params.withKeywords;

  if (params.decade) {
    const year = parseInt(params.decade);
    p["primary_release_date.gte"] = `${year}-01-01`;
    p["primary_release_date.lte"] = `${year + 9}-12-31`;
  }

  return tmdbFetch("/discover/movie", p);
}

// ── Genres ─────────────────────────────────────────────────

export async function getGenres(): Promise<{ genres: Genre[] }> {
  return tmdbFetch("/genre/movie/list");
}

// ── Recommendations ────────────────────────────────────────

export async function getMovieRecommendations(movieId: number): Promise<MovieListResult> {
  return tmdbFetch(`/movie/${movieId}/recommendations`);
}

// ── Fetch multiple movies by IDs (for watchlist) ───────────

export async function getMoviesByIds(ids: number[]): Promise<Movie[]> {
  const results = await Promise.allSettled(ids.map((id) => getMovieDetails(id)));
  return results
    .filter((r): r is PromiseFulfilledResult<Movie> => r.status === "fulfilled")
    .map((r) => r.value);
}

// ── Genre ID to name map ───────────────────────────────────

export const GENRE_MAP: Record<number, string> = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy",
  80: "Crime", 99: "Documentary", 18: "Drama", 10751: "Family",
  14: "Fantasy", 36: "History", 27: "Horror", 10402: "Music",
  9648: "Mystery", 10749: "Romance", 878: "Sci-Fi", 10770: "TV Movie",
  53: "Thriller", 10752: "War", 37: "Western",
};

export function formatRuntime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export function formatYear(dateStr: string): string {
  return dateStr ? new Date(dateStr).getFullYear().toString() : "N/A";
}

export function formatRating(rating: number): string {
  return rating.toFixed(1);
}
