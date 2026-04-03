import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getTasteProfile } from "@/lib/storage";
import { getPersonalizedRecommendations } from "@/lib/ai";
import { getPopular, getTrending } from "@/lib/tmdb";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      // Return trending for logged-out users
      const trending = await getTrending();
      return NextResponse.json({
        movies: trending.results.slice(0, 8),
        isPersonalized: false,
        message: "Sign in to get personalized recommendations",
      });
    }

    const tasteProfile = await getTasteProfile(session.user.id);
    if (!tasteProfile || tasteProfile.ratedMovies.length < 3) {
      const popular = await getPopular();
      return NextResponse.json({
        movies: popular.results.slice(0, 8),
        isPersonalized: false,
        message: "Rate a few movies to unlock personalized recommendations",
      });
    }

    // Get candidate pool
    const [trending, popular] = await Promise.all([
      getTrending("week"),
      getPopular(2),
    ]);

    const candidates = [...trending.results, ...popular.results];
    const recommendations = await getPersonalizedRecommendations(
      tasteProfile,
      candidates
    );

    return NextResponse.json({
      recommendations,
      isPersonalized: true,
      tasteProfile,
    });
  } catch (error) {
    console.error("Recommendations error:", error);
    return NextResponse.json({ error: "Failed to get recommendations" }, { status: 500 });
  }
}
