import { NextRequest, NextResponse } from "next/server";
import { getMovieInsight } from "@/lib/ai";
import { getMovieDetails } from "@/lib/tmdb";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const movieId = parseInt(searchParams.get("movieId") || "");
    if (!movieId) return NextResponse.json({ error: "movieId required" }, { status: 400 });

    const cacheKey = `insight:${movieId}`;
    try {
      const cached = await redis.get(cacheKey);
      if (cached) return NextResponse.json(cached);
    } catch { /* no cache */ }

    const movie = await getMovieDetails(movieId);
    const insight = await getMovieInsight(movie);

    try {
      await redis.set(cacheKey, insight, { ex: 60 * 60 * 24 * 7 });
    } catch { /* cache failed */ }

    return NextResponse.json(insight);
  } catch (error) {
    console.error("Insight error:", error);
    return NextResponse.json({ error: "Failed to generate insight" }, { status: 500 });
  }
}
