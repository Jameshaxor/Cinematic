import { NextRequest, NextResponse } from "next/server";
import { getTrending, getNowPlaying, getTopRated, getUpcoming, discoverMovies } from "@/lib/tmdb";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") || "trending";
  const page = parseInt(searchParams.get("page") || "1");

  try {
    switch (type) {
      case "trending": {
        const data = await getTrending();
        return NextResponse.json(data);
      }
      case "now_playing": {
        const data = await getNowPlaying();
        return NextResponse.json(data);
      }
      case "top_rated": {
        const data = await getTopRated(page);
        return NextResponse.json(data);
      }
      case "upcoming": {
        const data = await getUpcoming();
        return NextResponse.json(data);
      }
      case "discover": {
        const genres = searchParams.get("genres")?.split(",").map(Number) || [];
        const decade = searchParams.get("decade") || undefined;
        const minRating = parseFloat(searchParams.get("minRating") || "0");
        const sortBy = searchParams.get("sortBy") as "popularity" | "rating" | "release_date" | undefined;

        const data = await discoverMovies({ genres, decade, minRating, sortBy, page });
        return NextResponse.json(data);
      }
      default:
        return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch movies" }, { status: 500 });
  }
}
