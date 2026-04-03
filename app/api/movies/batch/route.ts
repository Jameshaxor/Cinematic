import { NextRequest, NextResponse } from "next/server";
import { getMoviesByIds } from "@/lib/tmdb";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const ids = searchParams.get("ids")?.split(",").map(Number).filter(Boolean) || [];

  if (!ids.length) return NextResponse.json({ movies: [] });

  try {
    const movies = await getMoviesByIds(ids);
    return NextResponse.json({ movies });
  } catch {
    return NextResponse.json({ error: "Failed to fetch movies" }, { status: 500 });
  }
}
