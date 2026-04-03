// ── Movie Types ────────────────────────────────────────────

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids?: number[];
  genres?: Genre[];
  runtime?: number;
  tagline?: string;
  status?: string;
  budget?: number;
  revenue?: number;
  production_companies?: ProductionCompany[];
  credits?: Credits;
  videos?: VideoResults;
  similar?: MovieListResult;
  popularity: number;
  adult: boolean;
  original_language: string;
  original_title: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  name: string;
  logo_path: string | null;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface Credits {
  cast: CastMember[];
  crew: CrewMember[];
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

export interface VideoResults {
  results: Video[];
}

export interface MovieListResult {
  results: Movie[];
  total_pages: number;
  total_results: number;
  page: number;
}

// ── User / Auth Types ──────────────────────────────────────

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  image?: string;
  tasteProfile?: TasteProfile;
  watchlist?: WatchlistItem[];
  createdAt: string;
}

export interface TasteProfile {
  favoriteGenres: string[];
  favoriteDecades: string[];
  favoriteDirectors: string[];
  moodPreferences: string[];
  ratedMovies: RatedMovie[];
  aiSummary?: string;
  lastUpdated: string;
}

export interface RatedMovie {
  movieId: number;
  title: string;
  rating: number; // 1-5
  posterPath: string | null;
}

export interface WatchlistItem {
  movieId: number;
  title: string;
  posterPath: string | null;
  backdropPath: string | null;
  addedAt: string;
  watched: boolean;
  watchedAt?: string;
  personalRating?: number;
  note?: string;
}

// ── AI Types ───────────────────────────────────────────────

export interface MoodSearchQuery {
  query: string;
  mood?: string;
  decade?: string;
  genre?: string;
}

export interface AIRecommendation {
  movieId: number;
  title: string;
  reason: string;
  matchScore: number; // 0-100
  posterPath: string | null;
}

export interface AIMovieInsight {
  movieId: number;
  summary: string;
  themes: string[];
  watchMood: string;
  cinephileNote: string;
  similarVibes: string[];
}

export interface AISearchResult {
  movies: Movie[];
  aiInterpretation: string;
  suggestedFilters: string[];
}

// ── API Response Types ─────────────────────────────────────

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

// ── UI Types ───────────────────────────────────────────────

export type ViewMode = "grid" | "list";

export interface FilterState {
  genres: number[];
  decade: string;
  minRating: number;
  sortBy: "popularity" | "rating" | "release_date" | "title";
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: "success" | "error" | "info";
}
