import { NextRequest, NextResponse } from "next/server";
import { aiMovieSearch } from "@/lib/ai";
import { searchMovies, discoverMovies } from "@/lib/tmdb";

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();
    if (!query?.trim()) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    // Run AI interpretation and initial search in parallel
    const [aiResult, directSearch] = await Promise.all([
      aiMovieSearch(query),
      searchMovies(query),
    ]);

    // Also discover based on AI-extracted genres
    let discoveredMovies: typeof directSearch.results = [];
    if (aiResult.filters.genres?.length) {
      const genreMap: Record<string, number> = {
        Action: 28, Comedy: 35, Drama: 18, Horror: 27, "Sci-Fi": 878,
        Thriller: 53, Romance: 10749, Animation: 16, Crime: 80,
        Mystery: 9648, Adventure: 12, Fantasy: 14, History: 36,
      };

      const genreIds = aiResult.filters.genres
        .map((g) => genreMap[g])
        .filter(Boolean);

      if (genreIds.length) {
        const discovered = await discoverMovies({
          genres: genreIds,
          decade: aiResult.filters.decade
            ? aiResult.filters.decade.replace("s", "")
            : undefined,
          sortBy: "vote_average.desc",
        });
        discoveredMovies = discovered.results;
      }
    }

    // Merge and deduplicate results
    const seen = new Set<number>();
    const merged = [...directSearch.results, ...discoveredMovies].filter((m) => {
      if (seen.has(m.id)) return false;
      seen.add(m.id);
      return true;
    });

    return NextResponse.json({
      movies: merged,
      aiInterpretation: aiResult.interpretation,
      suggestedFilters: aiResult.filters,
      searchTerms: aiResult.searchTerms,
    });
  } catch (error) {
    console.error("AI search error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
