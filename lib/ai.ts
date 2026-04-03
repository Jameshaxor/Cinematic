import { GoogleGenerativeAI } from "@google/generative-ai";
import type {
  AIMovieInsight,
  AIRecommendation,
  TasteProfile,
  Movie,
} from "@/types";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const MODEL = "gemini-1.5-flash";

// Helper: send system + user prompt, get text back
async function generate(systemPrompt: string, userPrompt: string): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: MODEL,
    systemInstruction: systemPrompt,
  });
  const result = await model.generateContent(userPrompt);
  return result.response.text();
}

// Strip markdown code fences Gemini sometimes adds
function cleanJson(text: string): string {
  return text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
}

// ── 1. Natural Language Movie Search ──────────────────────

export async function aiMovieSearch(query: string): Promise<{
  interpretation: string;
  searchTerms: string[];
  filters: { genres?: string[]; decade?: string; mood?: string };
  suggestedKeywords: string[];
}> {
  try {
    const text = await generate(
      `You are a cinephile AI assistant for a premium movie platform called Cinematic.
Interpret natural language movie search queries and extract structured search parameters.
Always respond with valid JSON only. No markdown, no code fences, no explanation.`,
      `Interpret this movie search query and return structured search params as JSON:
Query: "${query}"

Return ONLY this JSON structure, nothing else:
{
  "interpretation": "one sentence explaining what the user wants",
  "searchTerms": ["keyword1", "keyword2"],
  "filters": {
    "genres": ["genre names that match"],
    "decade": "1990s or null",
    "mood": "emotional tone"
  },
  "suggestedKeywords": ["tmdb keyword 1", "tmdb keyword 2"]
}`
    );
    return JSON.parse(cleanJson(text));
  } catch {
    return {
      interpretation: query,
      searchTerms: [query],
      filters: {},
      suggestedKeywords: [],
    };
  }
}

// ── 2. AI Movie Insight (per film) ────────────────────────

export async function getMovieInsight(movie: Movie): Promise<AIMovieInsight> {
  const genres = movie.genres?.map((g) => g.name).join(", ") || "Unknown";
  const director = movie.credits?.crew.find((c) => c.job === "Director")?.name || "Unknown";
  const cast = movie.credits?.cast.slice(0, 5).map((c) => c.name).join(", ");

  try {
    const text = await generate(
      `You are a brilliant film critic and cinephile with encyclopedic knowledge of cinema.
You write sharp, intelligent, non-pretentious insights for a premium movie platform.
Respond with valid JSON only. No markdown, no code fences.`,
      `Generate a cinephile-grade insight for this film. Be specific, smart, avoid clichés.

Film: ${movie.title} (${movie.release_date?.slice(0, 4)})
Director: ${director}
Cast: ${cast}
Genres: ${genres}
Overview: ${movie.overview}
Rating: ${movie.vote_average}/10

Return ONLY this JSON, nothing else:
{
  "movieId": ${movie.id},
  "summary": "2-3 sentence sharp critical summary that goes beyond the plot",
  "themes": ["theme1", "theme2", "theme3"],
  "watchMood": "When you're in the mood for [specific emotional state]",
  "cinephileNote": "One insider observation about craft, cinematography, or cultural significance",
  "similarVibes": ["Film or director that shares DNA with this"]
}`
    );
    return JSON.parse(cleanJson(text));
  } catch {
    return {
      movieId: movie.id,
      summary: movie.overview,
      themes: [],
      watchMood: "Any mood",
      cinephileNote: "",
      similarVibes: [],
    };
  }
}

// ── 3. Personalized Recommendations ──────────────────────

export async function getPersonalizedRecommendations(
  tasteProfile: TasteProfile,
  candidateMovies: Movie[]
): Promise<AIRecommendation[]> {
  const profileSummary = `
Favorite genres: ${tasteProfile.favoriteGenres.join(", ")}
Favorite decades: ${tasteProfile.favoriteDecades.join(", ")}
Mood preferences: ${tasteProfile.moodPreferences.join(", ")}
Recently rated highly: ${tasteProfile.ratedMovies
    .filter((r) => r.rating >= 4)
    .map((r) => r.title)
    .join(", ")}`;

  const movieList = candidateMovies
    .slice(0, 20)
    .map((m) => `ID:${m.id} "${m.title}" (${m.release_date?.slice(0, 4)}) genres:${m.genre_ids?.join(",")}`)
    .join("\n");

  try {
    const text = await generate(
      `You are a personal film sommelier. Match movies to user taste profiles with precision.
Respond with valid JSON only. No markdown, no code fences.`,
      `Based on this taste profile, rank the best movie matches and explain why.

USER TASTE PROFILE:
${profileSummary}

CANDIDATE MOVIES:
${movieList}

Return ONLY a JSON array (max 8 items), nothing else:
[{
  "movieId": number,
  "title": "string",
  "reason": "Personalized 1-sentence reason why THIS user will love this",
  "matchScore": 0-100,
  "posterPath": null
}]

Order by matchScore descending.`
    );
    return JSON.parse(cleanJson(text));
  } catch {
    return [];
  }
}

// ── 4. Taste Profile Summary ──────────────────────────────

export async function generateTasteProfileSummary(
  tasteProfile: TasteProfile
): Promise<string> {
  try {
    return await generate(
      `You write personalized, witty taste profiles for cinephiles. Be specific and flattering. 2-3 sentences max. Plain text only.`,
      `Generate a personalized cinema taste profile summary for this user:
Favorite genres: ${tasteProfile.favoriteGenres.join(", ")}
Favorite decades: ${tasteProfile.favoriteDecades.join(", ")}
Favorite directors: ${tasteProfile.favoriteDirectors.join(", ")}
Mood preferences: ${tasteProfile.moodPreferences.join(", ")}
Top rated films: ${tasteProfile.ratedMovies.filter((r) => r.rating === 5).map((r) => r.title).join(", ")}

Write a short, specific, flattering description of their cinematic taste. No bullet points.`
    );
  } catch {
    return "A discerning cinephile with eclectic taste.";
  }
}

// ── 5. Mood-based Quick Recommendations ──────────────────

export async function getMoodRecommendations(mood: string): Promise<{
  title: string;
  description: string;
  searchQuery: string;
  genres: number[];
}[]> {
  try {
    const text = await generate(
      `You are a film curator. Map moods to specific film recommendations. Respond with JSON only. No markdown.`,
      `For the mood "${mood}", suggest 4 film categories/collections with TMDB genre IDs.

Return ONLY a JSON array, nothing else:
[{
  "title": "Collection name",
  "description": "One line description",
  "searchQuery": "TMDB-friendly search term",
  "genres": [genre_id_numbers]
}]

TMDB Genre IDs: Action:28, Comedy:35, Drama:18, Horror:27, SciFi:878, Thriller:53, Romance:10749, Animation:16, Crime:80, Mystery:9648`
    );
    return JSON.parse(cleanJson(text));
  } catch {
    return [];
  }
}
