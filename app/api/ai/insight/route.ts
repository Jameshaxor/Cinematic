import { NextRequest, NextResponse } from "next/server";
import { getMovieInsight } from "@/lib/ai";
import { getMovieDetails } from "@/lib/tmdb";
import { kv } from "@vercel/kv";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const movieId = parseInt(searchParams.get("movieId") || "");

    if (!movieId) {
      return NextResponse.json({ error: "movieId required" }, { status: 400 });
    }

    // Check cache first (insights cached for 7 days)
    const cacheKey = `insight:${movieId}`;
    try {
      const cached = await kv.get(cacheKey);
      if (cached) return NextResponse.json(cached);
    } catch { /* no cache available */ }

    const movie = await getMovieDetails(movieId);
    const insight = await getMovieInsight(movie);

    // Cache the insight
    try {
      await kv.set(cacheKey, insight, { ex: 60 * 60 * 24 * 7 });
    } catch { /* cache failed, continue */ }

    return NextResponse.json(insight);
  } catch (error) {
    console.error("Insight error:", error);
    return NextResponse.json({ error: "Failed to generate insight" }, { status: 500 });
  }
}
